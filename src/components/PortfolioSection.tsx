import { motion } from "framer-motion";
import { Factory, Droplets, Truck, Building2 } from "lucide-react";

const portfolioItems = [
  {
    icon: Factory,
    title: "Produção de Pré-moldados",
    description: "Fabricação de estruturas pré-moldadas de alta qualidade para obras industriais e comerciais.",
    tags: ["Estrutural", "Industrial"],
  },
  {
    icon: Droplets,
    title: "Limpeza Industrial",
    description: "Serviços especializados de limpeza industrial para empresas como Brasil Gás e SP Combustíveis.",
    tags: ["Brasil Gás", "SP Combustíveis"],
  },
  {
    icon: Truck,
    title: "Infraestrutura",
    description: "Obras de infraestrutura para grandes projetos como Nordeste Logística e Bagam.",
    tags: ["Nordeste Logística", "Bagam"],
  },
  {
    icon: Building2,
    title: "Construções",
    description: "Construção de pousadas, templos e edificações. Pousadas Amazonas e Ebenezer, Assembleia de Deus em Guamaré.",
    tags: ["Pousada Amazonas", "Pousada Ebenezer", "Assembleia de Deus"],
  },
];

const PortfolioSection = () => (
  <section id="servicos" className="section-padding bg-background">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="font-display text-sm tracking-widest text-primary uppercase">Portfólio</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
          Nossos <span className="text-primary">Serviços</span>
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mt-4" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {portfolioItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card border border-border rounded-sm p-8 hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-display tracking-wider bg-secondary text-secondary-foreground px-3 py-1 rounded-sm uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PortfolioSection;
