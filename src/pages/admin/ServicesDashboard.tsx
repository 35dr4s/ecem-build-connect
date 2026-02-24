import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ServiceRequest = Tables<"service_requests">;

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "Pendente", variant: "default" },
  in_progress: { label: "Em Andamento", variant: "secondary" },
  completed: { label: "Concluído", variant: "default" },
  cancelled: { label: "Cancelado", variant: "destructive" },
};

const ServicesDashboard = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [estimatedValue, setEstimatedValue] = useState("");
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string, value?: number) => {
    const update: Record<string, unknown> = { status };
    if (value !== undefined) update.estimated_value = value;
    const { error } = await supabase.from("service_requests").update(update).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Atualizado!" });
      setSelected(null);
      fetchData();
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-2xl font-bold">{pendingCount}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-blue-500/10"><ClipboardList className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-sm text-muted-foreground">Em Andamento</p><p className="text-2xl font-bold">{inProgressCount}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-500" /></div>
            <div><p className="text-sm text-muted-foreground">Concluídos</p><p className="text-2xl font-bold">{completedCount}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Solicitações de Serviço</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma solicitação.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor Est.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => {
                    const s = statusMap[r.status] || statusMap.pending;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.service_type}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell>{new Date(r.created_at).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{r.estimated_value ? `R$ ${Number(r.estimated_value).toFixed(2)}` : "—"}</TableCell>
                        <TableCell>
                          <Badge variant={s.variant} className={r.status === "pending" ? "bg-amber-500 text-white" : r.status === "completed" ? "bg-green-600 text-white" : ""}>
                            {s.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => { setSelected(r); setEstimatedValue(r.estimated_value?.toString() || ""); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhes da Solicitação</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Nome:</span> <strong>{selected.name}</strong></div>
                <div><span className="text-muted-foreground">Telefone:</span> <strong>{selected.phone}</strong></div>
                <div><span className="text-muted-foreground">E-mail:</span> <strong>{selected.email || "—"}</strong></div>
                <div><span className="text-muted-foreground">Serviço:</span> <strong>{selected.service_type}</strong></div>
              </div>
              {selected.description && (
                <div><Label>Descrição</Label><p className="text-sm bg-muted p-3 rounded-md">{selected.description}</p></div>
              )}
              <div>
                <Label>Valor Estimado (R$)</Label>
                <Input type="number" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} placeholder="0.00" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => updateStatus(selected.id, "in_progress", estimatedValue ? Number(estimatedValue) : undefined)}>Em Andamento</Button>
                <Button size="sm" variant="secondary" onClick={() => updateStatus(selected.id, "completed", estimatedValue ? Number(estimatedValue) : undefined)}>Concluir</Button>
                <Button size="sm" variant="destructive" onClick={() => updateStatus(selected.id, "cancelled")}>Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesDashboard;
