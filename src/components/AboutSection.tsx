import { motion } from "framer-motion";
import { Shield, Users, Clock, Award } from "lucide-react";

const stats = [
  { icon: Shield, value: "10+", label: "Anos de Experiência" },
  { icon: Users, value: "200+", label: "Projetos Realizados" },
  { icon: Clock, value: "24/7", label: "Suporte Técnico" },
  { icon: Award, value: "100%", label: "Compromisso" },
];

const AboutSection = () => (
  <section id="sobre" className="section-padding bg-muted">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-display text-sm tracking-widest text-primary uppercase">Sobre Nós</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
            Quem é a <span className="text-primary">ECEM</span>
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            A ECEM Construções e Terceirização de Mão de Obra atua no mercado da construção civil oferecendo soluções completas: desde a produção de pré-moldados até a terceirização de equipes especializadas.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            Com sede em Guamaré-RN, a empresa já realizou projetos em diversas cidades, sempre com foco em qualidade, segurança e prazo.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            Nossa missão é entregar obras com excelência, respeitando normas técnicas e valorizando nossos colaboradores e parceiros.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="bg-card border border-border rounded-sm p-6 text-center"
            >
              <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <span className="block font-display text-3xl font-bold text-foreground">{s.value}</span>
              <span className="font-body text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
