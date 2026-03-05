import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Forklift, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import SuccessOverlay from "@/components/SuccessOverlay";
import ServiceConfirmDialog from "@/components/ServiceConfirmDialog";
import { useLeadSession } from "@/hooks/use-lead-session";
import { useToast } from "@/hooks/use-toast";

const RentalCatalogSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [equipment, setEquipment] = useState<{ id: string; name: string; description: string | null }[]>([]);
  const { lead, isLogged } = useLeadSession();
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("equipment").select("id, name, description").eq("available", true).order("name")
      .then(({ data }) => { if (data) setEquipment(data); });
  }, []);

  const handleClick = (name: string) => {
    const service = `Locação de ${name}`;
    setSelectedService(service);
    if (isLogged) {
      setConfirmOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!lead) return;
    const { error } = await supabase.from("leads" as any).insert({
      person_type: lead.personType,
      full_name: lead.fullName,
      cpf_cnpj: lead.cpfCnpj,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      phone: lead.phone,
      email: lead.email,
      service_reference: selectedService,
    });
    if (error) {
      toast({ title: "Erro ao solicitar", description: error.message, variant: "destructive" });
    } else {
      setShowSuccess(true);
    }
  };

  const handleLeadSuccess = useCallback(() => {
    setModalOpen(false);
    setShowSuccess(true);
  }, []);

  return (
    <section id="locacao" className="section-padding bg-foreground">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-sm tracking-widest text-primary uppercase">Equipamentos</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mt-2">
            Catálogo de <span className="text-primary">Locação</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4" />
          <p className="font-body text-primary-foreground/60 mt-4 max-w-xl mx-auto">
            Equipamentos para construção civil e movimentação de cargas disponíveis para locação.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((eq, i) => (
            <motion.div
              key={eq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleClick(eq.name)}
              className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-sm p-6 text-center hover:border-primary/50 transition-all group cursor-pointer"
            >
              <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/25 transition-colors">
                <Forklift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary-foreground mb-1">{eq.name}</h3>
              <p className="font-body text-sm text-primary-foreground/60">{eq.description || ""}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => handleClick("Equipamentos")}
            className="bg-primary-foreground/5 border-2 border-dashed border-primary-foreground/20 rounded-sm p-6 text-center hover:border-primary/50 transition-all group cursor-pointer flex flex-col items-center justify-center min-h-[160px]"
          >
            <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/25 transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-sm font-bold text-primary-foreground/60">Solicitar Outro</h3>
          </motion.div>
        </div>
      </div>

      <LeadCaptureModal open={modalOpen} onOpenChange={setModalOpen} serviceReference={selectedService} onSuccess={handleLeadSuccess} />
      <ServiceConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} serviceName={selectedService} onConfirm={handleConfirm} />
      <SuccessOverlay show={showSuccess} onDone={() => setShowSuccess(false)} message="Sua solicitação de locação foi enviada, entraremos em contato brevemente." />
    </section>
  );
};

export default RentalCatalogSection;
