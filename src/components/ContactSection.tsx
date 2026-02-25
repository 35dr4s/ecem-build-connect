import { useState } from "react";
import { motion } from "framer-motion";
import { Send, TreePine, Truck, Paintbrush, Mountain, Flame, Snowflake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LeadCaptureModal from "@/components/LeadCaptureModal";

const serviceOptions = [
  { value: "podagem", label: "Podagem", icon: TreePine },
  { value: "reboque", label: "Reboque", icon: Truck },
  { value: "pintura", label: "Pintura", icon: Paintbrush },
  { value: "terraplanagem", label: "Terraplanagem", icon: Mountain },
  { value: "gas", label: "Gás", icon: Flame },
  { value: "refrigeracao", label: "Refrigeração", icon: Snowflake },
];

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleServiceClick = (value: string, label: string) => {
    setSelectedService(`Serviço de ${label}`);
    setModalOpen(true);
    setForm({ ...form, service: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service) {
      toast({ title: "Selecione um serviço", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("service_requests").insert({
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      service_type: form.service,
      description: form.message,
    });
    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Solicitação enviada!", description: "Entraremos em contato em breve." });
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <section id="contato" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-sm tracking-widest text-primary uppercase">Fale Conosco</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
            Solicite um <span className="text-primary">Orçamento</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4" />
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Service selector — triggers lead capture */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {serviceOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => handleServiceClick(s.value, s.label)}
                className={`flex flex-col items-center gap-1 p-3 rounded-sm border transition-all text-center ${
                  form.service === s.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                <s.icon className="w-5 h-5" />
                <span className="font-display text-[10px] tracking-wider uppercase">{s.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome completo"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="tel"
                placeholder="Telefone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <textarea
              placeholder="Descreva o serviço desejado..."
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display text-lg tracking-wider py-4 rounded-sm transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {loading ? "Enviando..." : "Enviar Solicitação"}
            </button>
          </form>
        </div>
      </div>

      <LeadCaptureModal open={modalOpen} onOpenChange={setModalOpen} serviceReference={selectedService} />
    </section>
  );
};

export default ContactSection;
