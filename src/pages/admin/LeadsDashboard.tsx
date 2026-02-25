import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Users, User, Building2 } from "lucide-react";

interface Lead {
  id: string;
  receipt_number: number;
  person_type: string;
  full_name: string;
  cpf_cnpj: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  service_reference: string;
  estimated_value: number | null;
  created_at: string;
}

const LeadsDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("leads" as any)
      .select("*")
      .order("receipt_number", { ascending: false })
      .then(({ data }) => {
        if (data) setLeads(data as unknown as Lead[]);
        setLoading(false);
      });
  }, []);

  const pfCount = leads.filter((l) => l.person_type === "pf").length;
  const pjCount = leads.filter((l) => l.person_type === "pj").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total de Leads</p><p className="text-2xl font-bold">{leads.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-500/10"><User className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-sm text-muted-foreground">Pessoa Física</p><p className="text-2xl font-bold">{pfCount}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-amber-500/10"><Building2 className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Empresas</p><p className="text-2xl font-bold">{pjCount}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Planilha de Recibo — Leads</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          ) : leads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum lead cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recibo Nº</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nome / Razão Social</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Serviço Solicitado</TableHead>
                    <TableHead>Valor Est.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-mono font-bold">{String(l.receipt_number).padStart(4, "0")}</TableCell>
                      <TableCell>{new Date(l.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge variant={l.person_type === "pj" ? "secondary" : "default"} className="text-xs">
                          {l.person_type === "pf" ? "PF" : "PJ"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{l.full_name}</TableCell>
                      <TableCell className="font-mono text-xs">{l.cpf_cnpj}</TableCell>
                      <TableCell>{l.city}/{l.state}</TableCell>
                      <TableCell>{l.phone}</TableCell>
                      <TableCell>{l.service_reference}</TableCell>
                      <TableCell>{l.estimated_value ? `R$ ${Number(l.estimated_value).toFixed(2)}` : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsDashboard;
