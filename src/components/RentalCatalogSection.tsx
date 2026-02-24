import { motion } from "framer-motion";
import { Forklift, Hammer, Container, Wrench, Construction, Truck } from "lucide-react";

const equipment = [
  { icon: Forklift, name: "Retroescavadeira", desc: "Para escavações e terraplanagem" },
  { icon: Construction, name: "Guindaste", desc: "Movimentação de cargas pesadas" },
  { icon: Container, name: "Contêiner", desc: "Armazenamento em obra" },
  { icon: Hammer, name: "Martelete", desc: "Demolição e perfuração" },
  { icon: Wrench, name: "Compactador", desc: "Compactação de solo" },
  { icon: Truck, name: "Caminhão Munck", desc: "Transporte e içamento" },
];

const RentalCatalogSection = () => (
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
            key={eq.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-sm p-6 text-center hover:border-primary/50 transition-all group"
          >
            <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/25 transition-colors">
              <eq.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-primary-foreground mb-1">{eq.name}</h3>
            <p className="font-body text-sm text-primary-foreground/60">{eq.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="#contato"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wider px-8 py-3 rounded-sm transition-colors"
        >
          Solicitar Locação
        </a>
      </div>
    </div>
  </section>
);

export default RentalCatalogSection;
