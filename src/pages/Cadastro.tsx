import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Building2, Loader2, UserPlus } from "lucide-react";
import SuccessOverlay from "@/components/SuccessOverlay";
import { useLeadSession } from "@/hooks/use-lead-session";

const formatCPF = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const formatCNPJ = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const validateCPF = (cpf: string) => cpf.replace(/\D/g, "").length === 11;
const validateCNPJ = (cnpj: string) => cnpj.replace(/\D/g, "").length === 14;

const brStates = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const Cadastro = () => {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [personType, setPersonType] = useState<"pf" | "pj">("pf");
  const [form, setForm] = useState({
    fullName: "", cpfCnpj: "", address: "", city: "", state: "", phone: "", email: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", cpfCnpj: "" });
  const [loginPersonType, setLoginPersonType] = useState<"pf" | "pj">("pf");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveLead } = useLeadSession();

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleDocChange = (value: string) => {
    const formatted = personType === "pf" ? formatCPF(value) : formatCNPJ(value);
    set("cpfCnpj", formatted);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Obrigatório";
    if (!form.cpfCnpj.trim()) e.cpfCnpj = "Obrigatório";
    else if (personType === "pf" && !validateCPF(form.cpfCnpj)) e.cpfCnpj = "CPF inválido (11 dígitos)";
    else if (personType === "pj" && !validateCNPJ(form.cpfCnpj)) e.cpfCnpj = "CNPJ inválido (14 dígitos)";
    if (!form.address.trim()) e.address = "Obrigatório";
    if (!form.city.trim()) e.city = "Obrigatório";
    if (!form.state) e.state = "Obrigatório";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone inválido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { error } = await supabase.from("leads" as any).insert({
      person_type: personType,
      full_name: form.fullName.trim(),
      cpf_cnpj: form.cpfCnpj,
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state,
      phone: form.phone,
      email: form.email.trim(),
      service_reference: "Cadastro via site",
    });

    setLoading(false);
    if (error) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      return;
    }
    setForm({ fullName: "", cpfCnpj: "", address: "", city: "", state: "", phone: "", email: "" });
    saveLead({
      fullName: form.fullName.trim(),
      phone: form.phone,
      email: form.email.trim(),
      cpfCnpj: form.cpfCnpj,
      personType,
      city: form.city.trim(),
      state: form.state,
      address: form.address.trim(),
    });
    setShowSuccess(true);
  };

  const switchType = (type: "pf" | "pj") => {
    setPersonType(type);
    set("cpfCnpj", "");
  };

  const handleLoginDocChange = (value: string) => {
    const formatted = loginPersonType === "pf" ? formatCPF(value) : formatCNPJ(value);
    setLoginForm((p) => ({ ...p, cpfCnpj: formatted }));
    setErrors((p) => ({ ...p, cpfCnpj: "" }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) errs.email = "E-mail inválido";
    if (!loginForm.cpfCnpj.trim()) errs.cpfCnpj = "Obrigatório";
    else if (loginPersonType === "pf" && !validateCPF(loginForm.cpfCnpj)) errs.cpfCnpj = "CPF inválido";
    else if (loginPersonType === "pj" && !validateCNPJ(loginForm.cpfCnpj)) errs.cpfCnpj = "CNPJ inválido";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("leads" as any)
      .select("*")
      .eq("email", loginForm.email.trim())
      .eq("cpf_cnpj", loginForm.cpfCnpj)
      .maybeSingle();
    setLoading(false);

    if (error || !data) {
      toast({ title: "Cadastro não encontrado", description: "Verifique seu e-mail e CPF/CNPJ ou faça um novo cadastro.", variant: "destructive" });
      return;
    }

    const lead = data as any;
    saveLead({
      id: lead.id,
      fullName: lead.full_name,
      phone: lead.phone,
      email: lead.email,
      cpfCnpj: lead.cpf_cnpj,
      personType: lead.person_type,
      city: lead.city,
      state: lead.state,
      address: lead.address,
    });
    toast({ title: `Bem-vindo de volta, ${lead.full_name.split(" ")[0]}!` });
    navigate("/");
  };

  if (mode === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <img alt="ECEM" className="h-14 mx-auto" src="/lovable-uploads/576a8aed-2d82-4089-b1fa-cdfd0102fe38.png" />
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Entrar na sua conta
            </CardTitle>
            <p className="text-sm text-muted-foreground">Use seu e-mail e CPF/CNPJ para acessar</p>
          </CardHeader>
          <CardContent>
            <div className="flex rounded-md border border-border overflow-hidden mb-4">
              <button type="button" onClick={() => { setLoginPersonType("pf"); setLoginForm(p => ({ ...p, cpfCnpj: "" })); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium tracking-wider transition-colors ${
                  loginPersonType === "pf" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                <User className="w-4 h-4" /> PF
              </button>
              <button type="button" onClick={() => { setLoginPersonType("pj"); setLoginForm(p => ({ ...p, cpfCnpj: "" })); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium tracking-wider transition-colors ${
                  loginPersonType === "pj" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                <Building2 className="w-4 h-4" /> PJ
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <Label>E-mail</Label>
                <Input type="email" value={loginForm.email} onChange={(e) => { setLoginForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }} placeholder="email@exemplo.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label>{loginPersonType === "pf" ? "CPF" : "CNPJ"}</Label>
                <Input value={loginForm.cpfCnpj} onChange={(e) => handleLoginDocChange(e.target.value)} placeholder={loginPersonType === "pf" ? "000.000.000-00" : "00.000.000/0000-00"} />
                {errors.cpfCnpj && <p className="text-xs text-destructive mt-1">{errors.cpfCnpj}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Entrando...</> : "Entrar"}
              </Button>
            </form>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Não possui cadastro? <button onClick={() => { setMode("register"); setErrors({}); }} className="text-primary underline">Cadastrar aqui</button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <SuccessOverlay
        show={showSuccess}
        onDone={() => navigate("/")}
        message="Seu cadastro foi realizado com sucesso! Redirecionando..."
      />
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <img alt="ECEM" className="h-14 mx-auto" src="/lovable-uploads/576a8aed-2d82-4089-b1fa-cdfd0102fe38.png" />
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-primary" />
            Cadastro de Cliente
          </CardTitle>
          <p className="text-sm text-muted-foreground">Preencha seus dados para solicitar serviços e locações</p>
        </CardHeader>
        <CardContent>
          <div className="flex rounded-md border border-border overflow-hidden mb-4">
            <button type="button" onClick={() => switchType("pf")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium tracking-wider transition-colors ${
                personType === "pf" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}>
              <User className="w-4 h-4" /> Pessoa Física
            </button>
            <button type="button" onClick={() => switchType("pj")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium tracking-wider transition-colors ${
                personType === "pj" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}>
              <Building2 className="w-4 h-4" /> Empresa
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>{personType === "pf" ? "Nome Completo" : "Razão Social"}</Label>
              <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder={personType === "pf" ? "João da Silva" : "ECEM Construções LTDA"} />
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <Label>{personType === "pf" ? "CPF" : "CNPJ"}</Label>
              <Input value={form.cpfCnpj} onChange={(e) => handleDocChange(e.target.value)} placeholder={personType === "pf" ? "000.000.000-00" : "00.000.000/0000-00"} />
              {errors.cpfCnpj && <p className="text-xs text-destructive mt-1">{errors.cpfCnpj}</p>}
            </div>
            <div>
              <Label>Endereço</Label>
              <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Rua, Nº, Bairro" />
              {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cidade</Label>
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Guamaré" />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label>Estado</Label>
                <select value={form.state} onChange={(e) => set("state", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">UF</option>
                  {brStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Telefone</Label>
                <Input value={form.phone} onChange={(e) => set("phone", formatPhone(e.target.value))} placeholder="(84) 99627-3986" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label>E-mail</Label>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@exemplo.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Cadastrando...</> : "Cadastrar"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Já possui cadastro? <button onClick={() => { setMode("login"); setErrors({}); }} className="text-primary underline">Entrar aqui</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadastro;
