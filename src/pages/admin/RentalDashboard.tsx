import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Truck, Package, CheckCircle, Clock, Plus, Trash2, Pencil } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Rental = Tables<"equipment_rentals"> & { equipment?: Tables<"equipment"> | null };

const RentalDashboard = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [equipment, setEquipment] = useState<Tables<"equipment">[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [equipDialogOpen, setEquipDialogOpen] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({ equipment_id: "", renter_name: "", renter_phone: "", daily_rate: "", expected_return: "", notes: "" });
  const [equipForm, setEquipForm] = useState({ name: "", description: "", category: "geral", daily_rate: "" });

  const fetchData = async () => {
    const [rentalsRes, equipRes] = await Promise.all([
      supabase.from("equipment_rentals").select("*, equipment(*)").order("created_at", { ascending: false }),
      supabase.from("equipment").select("*").order("name"),
    ]);
    if (rentalsRes.data) setRentals(rentalsRes.data);
    if (equipRes.data) setEquipment(equipRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("equipment_rentals").insert({
      equipment_id: form.equipment_id,
      renter_name: form.renter_name,
      renter_phone: form.renter_phone || null,
      daily_rate: Number(form.daily_rate),
      expected_return: form.expected_return || null,
      notes: form.notes || null,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Locação registrada!" });
      setDialogOpen(false);
      setForm({ equipment_id: "", renter_name: "", renter_phone: "", daily_rate: "", expected_return: "", notes: "" });
      fetchData();
    }
  };

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("equipment").insert({
      name: equipForm.name,
      description: equipForm.description || null,
      category: equipForm.category,
      daily_rate: equipForm.daily_rate ? Number(equipForm.daily_rate) : null,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Equipamento adicionado!" });
      setEquipDialogOpen(false);
      setEquipForm({ name: "", description: "", category: "geral", daily_rate: "" });
      fetchData();
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    const { error } = await supabase.from("equipment").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else fetchData();
  };

  const handleReturn = async (id: string) => {
    await supabase.from("equipment_rentals").update({ status: "returned", actual_return: new Date().toISOString().split("T")[0] }).eq("id", id);
    fetchData();
  };

  const activeCount = rentals.filter((r) => r.status === "active").length;
  const returnedCount = rentals.filter((r) => r.status === "returned").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-4 p-4">
          <div className="p-3 rounded-lg bg-primary/10"><Truck className="h-5 w-5 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{rentals.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4">
          <div className="p-3 rounded-lg bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
          <div><p className="text-sm text-muted-foreground">Ativos</p><p className="text-2xl font-bold">{activeCount}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4">
          <div className="p-3 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-500" /></div>
          <div><p className="text-sm text-muted-foreground">Devolvidos</p><p className="text-2xl font-bold">{returnedCount}</p></div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="rentals">
        <TabsList>
          <TabsTrigger value="rentals">Locações</TabsTrigger>
          <TabsTrigger value="equipment">Equipamentos ({equipment.length})</TabsTrigger>
        </TabsList>

        {/* Rentals tab */}
        <TabsContent value="rentals">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Locações</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Nova Locação</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Registrar Locação</DialogTitle></DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <Label>Equipamento</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.equipment_id} onChange={(e) => setForm({ ...form, equipment_id: e.target.value })} required>
                        <option value="">Selecione...</option>
                        {equipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Locatário</Label><Input value={form.renter_name} onChange={(e) => setForm({ ...form, renter_name: e.target.value })} required /></div>
                      <div><Label>Telefone</Label><Input value={form.renter_phone} onChange={(e) => setForm({ ...form, renter_phone: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Diária (R$)</Label><Input type="number" value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: e.target.value })} required /></div>
                      <div><Label>Retorno Previsto</Label><Input type="date" value={form.expected_return} onChange={(e) => setForm({ ...form, expected_return: e.target.value })} /></div>
                    </div>
                    <div><Label>Observações</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                    <Button type="submit" className="w-full">Registrar</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loading ? <p className="text-muted-foreground text-center py-8">Carregando...</p> : rentals.length === 0 ? <p className="text-muted-foreground text-center py-8">Nenhuma locação registrada.</p> : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Equipamento</TableHead><TableHead>Locatário</TableHead><TableHead>Início</TableHead><TableHead>Retorno</TableHead><TableHead>Diária</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {rentals.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.equipment?.name || "—"}</TableCell>
                          <TableCell>{r.renter_name}</TableCell>
                          <TableCell>{r.start_date}</TableCell>
                          <TableCell>{r.expected_return || "—"}</TableCell>
                          <TableCell>R$ {Number(r.daily_rate).toFixed(2)}</TableCell>
                          <TableCell>{r.status === "active" ? <Badge className="bg-amber-500 text-white">Ativo</Badge> : <Badge variant="secondary">Devolvido</Badge>}</TableCell>
                          <TableCell>{r.status === "active" && <Button size="sm" variant="outline" onClick={() => handleReturn(r.id)}>Devolver</Button>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment tab */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Equipamentos Cadastrados</CardTitle>
              <Dialog open={equipDialogOpen} onOpenChange={setEquipDialogOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Equipamento</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Adicionar Equipamento</DialogTitle></DialogHeader>
                  <form onSubmit={handleCreateEquipment} className="space-y-4">
                    <div><Label>Nome</Label><Input value={equipForm.name} onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })} placeholder="Retroescavadeira" required /></div>
                    <div><Label>Descrição</Label><Textarea value={equipForm.description} onChange={(e) => setEquipForm({ ...equipForm, description: e.target.value })} placeholder="Para escavações e terraplanagem" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Categoria</Label><Input value={equipForm.category} onChange={(e) => setEquipForm({ ...equipForm, category: e.target.value })} placeholder="geral" /></div>
                      <div><Label>Diária (R$)</Label><Input type="number" value={equipForm.daily_rate} onChange={(e) => setEquipForm({ ...equipForm, daily_rate: e.target.value })} placeholder="0.00" /></div>
                    </div>
                    <Button type="submit" className="w-full">Adicionar</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {equipment.length === 0 ? <p className="text-muted-foreground text-center py-8">Nenhum equipamento cadastrado.</p> : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Nome</TableHead><TableHead>Categoria</TableHead><TableHead>Diária</TableHead><TableHead>Disponível</TableHead><TableHead></TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {equipment.map((eq) => (
                        <TableRow key={eq.id}>
                          <TableCell className="font-medium">{eq.name}</TableCell>
                          <TableCell>{eq.category}</TableCell>
                          <TableCell>{eq.daily_rate ? `R$ ${Number(eq.daily_rate).toFixed(2)}` : "—"}</TableCell>
                          <TableCell>{eq.available ? <Badge className="bg-green-600 text-white">Sim</Badge> : <Badge variant="destructive">Não</Badge>}</TableCell>
                          <TableCell><Button size="sm" variant="ghost" onClick={() => handleDeleteEquipment(eq.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RentalDashboard;
