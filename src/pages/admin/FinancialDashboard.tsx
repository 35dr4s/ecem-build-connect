import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Tables } from "@/integrations/supabase/types";

type Rental = Tables<"equipment_rentals">;
type ServiceReq = Tables<"service_requests">;

const COLORS = ["hsl(0,72%,45%)", "hsl(220,10%,45%)", "hsl(40,90%,50%)", "hsl(150,60%,40%)", "hsl(260,50%,55%)", "hsl(20,80%,50%)"];

const FinancialDashboard = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [services, setServices] = useState<ServiceReq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [r, s] = await Promise.all([
        supabase.from("equipment_rentals").select("*"),
        supabase.from("service_requests").select("*"),
      ]);
      if (r.data) setRentals(r.data);
      if (s.data) setServices(s.data);
      setLoading(false);
    };
    fetch();
  }, []);

  const rentalRevenue = useMemo(() => {
    return rentals.reduce((sum, r) => {
      if (r.status === "returned" && r.actual_return && r.start_date) {
        const days = Math.max(1, Math.ceil((new Date(r.actual_return).getTime() - new Date(r.start_date).getTime()) / 86400000));
        return sum + days * Number(r.daily_rate);
      }
      return sum;
    }, 0);
  }, [rentals]);

  const activeRentalProjection = useMemo(() => {
    return rentals
      .filter((r) => r.status === "active" && r.expected_return)
      .reduce((sum, r) => {
        const days = Math.max(1, Math.ceil((new Date(r.expected_return!).getTime() - new Date(r.start_date).getTime()) / 86400000));
        return sum + days * Number(r.daily_rate);
      }, 0);
  }, [rentals]);

  const serviceRevenue = useMemo(() => {
    return services
      .filter((s) => s.status === "completed" && s.estimated_value)
      .reduce((sum, s) => sum + Number(s.estimated_value), 0);
  }, [services]);

  const totalRevenue = rentalRevenue + serviceRevenue;

  // Monthly chart data
  const monthlyData = useMemo(() => {
    const months: Record<string, { locacao: number; servicos: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { locacao: 0, servicos: 0 };
    }

    rentals.forEach((r) => {
      const key = r.start_date?.substring(0, 7);
      if (key && months[key]) {
        const days = r.actual_return
          ? Math.max(1, Math.ceil((new Date(r.actual_return).getTime() - new Date(r.start_date).getTime()) / 86400000))
          : r.expected_return
          ? Math.max(1, Math.ceil((new Date(r.expected_return).getTime() - new Date(r.start_date).getTime()) / 86400000))
          : 1;
        months[key].locacao += days * Number(r.daily_rate);
      }
    });

    services.forEach((s) => {
      if (s.estimated_value) {
        const key = s.created_at.substring(0, 7);
        if (months[key]) months[key].servicos += Number(s.estimated_value);
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("pt-BR", { month: "short" }),
      Locação: Math.round(data.locacao),
      Serviços: Math.round(data.servicos),
    }));
  }, [rentals, services]);

  // Pie data by service type
  const serviceTypePie = useMemo(() => {
    const map: Record<string, number> = {};
    services.forEach((s) => {
      map[s.service_type] = (map[s.service_type] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [services]);

  if (loading) return <p className="text-center py-12 text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-sm text-muted-foreground">Receita Total</p><p className="text-xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Locações</p><p className="text-xl font-bold">R$ {rentalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-500/10"><ArrowUpRight className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-sm text-muted-foreground">Serviços</p><p className="text-xl font-bold">R$ {serviceRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-amber-500/10"><Calendar className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Previsão Ativa</p><p className="text-xl font-bold">R$ {activeRentalProjection.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Receita Mensal</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR")}`} />
                <Bar dataKey="Locação" fill="hsl(0,72%,45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Serviços" fill="hsl(220,10%,45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Serviços por Tipo</CardTitle></CardHeader>
          <CardContent>
            {serviceTypePie.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Sem dados</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={serviceTypePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {serviceTypePie.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
