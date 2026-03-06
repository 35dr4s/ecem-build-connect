import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeadSession } from "@/hooks/use-lead-session";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList, Loader2, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Order {
  id: string;
  receipt_number: number;
  full_name: string;
  service_reference: string;
  estimated_value: number | null;
  created_at: string;
}

const MeusPedidos = () => {
  const navigate = useNavigate();
  const { lead, isLogged } = useLeadSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLogged) {
      navigate("/cadastro");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("get-my-orders", {
          body: { email: lead!.email, cpf_cnpj: lead!.cpfCnpj },
        });
        if (!error && data?.orders) {
          setOrders(data.orders);
        }
      } catch {
        // silently fail
      }
      setLoading(false);
    };

    fetchOrders();
  }, [isLogged, lead, navigate]);

  const isLocacao = (ref: string) => ref.toLowerCase().startsWith("locação");

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">Meus Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Olá, {lead?.fullName.split(" ")[0]}! Veja suas solicitações abaixo.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-display text-lg font-semibold mb-1">Nenhum pedido encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Você ainda não fez nenhuma solicitação de serviço ou locação.
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                Voltar ao início
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isLocacao(order.service_reference) 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {isLocacao(order.service_reference) ? (
                      <Package className="h-5 w-5" />
                    ) : (
                      <ClipboardList className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm truncate">
                      {order.service_reference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recibo #{order.receipt_number} · {format(new Date(order.created_at), "dd 'de' MMM 'de' yyyy, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  {order.estimated_value && (
                    <span className="text-sm font-semibold text-primary shrink-0">
                      R$ {order.estimated_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeusPedidos;
