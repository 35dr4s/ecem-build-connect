import { motion } from "framer-motion";
import { ArrowRight, HardHat } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollToContact = () => {
    document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/90" />

      {/* Diagonal stripe accent */}
      <div className="absolute top-0 right-0 w-2 h-full bg-primary hidden md:block" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-sm px-4 py-2 mb-8">
            <HardHat className="w-5 h-5 text-primary" />
            <span className="font-display text-sm tracking-wider text-primary-foreground/90 uppercase">
              Construções & Terceirização
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Erguemos mais do que prédios,{" "}
            <span className="text-primary">construímos confiança</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            Soluções completas em construção civil, pré-moldados, locação de equipamentos e terceirização de mão de obra em Guamaré-RN e região.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display text-lg tracking-wider px-8 py-4 rounded-sm transition-all hover:gap-4"
            >
              Solicitar Orçamento
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#servicos"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#servicos")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 border-2 border-primary-foreground/30 text-primary-foreground/90 font-display text-lg tracking-wider px-8 py-4 rounded-sm hover:border-primary hover:text-primary transition-colors"
            >
              Nossos Serviços
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom hazard stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-ecem-gradient" />
    </section>
  );
};

export default HeroSection;
