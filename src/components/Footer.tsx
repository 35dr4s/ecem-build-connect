import { MapPin, Phone, Mail } from "lucide-react";
import logoEcem from "@/assets/logo-ecem.png";

const Footer = () =>
<footer className="bg-foreground border-t-4 border-primary">
    <div className="container mx-auto section-padding py-12">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <img alt="ECEM Construções" className="h-12 w-auto mb-4" src="/lovable-uploads/6750172e-a812-400e-a1e0-3db4798ac6fa.png" />
          <p className="font-body text-sm text-primary-foreground/60">
            Construções, Terceirização de Mão de Obra e Locação de Equipamentos.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg font-bold text-primary-foreground mb-4">Contato</h4>
          <div className="space-y-3">
            <a href="tel:84996273986" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors font-body text-sm">
              <Phone className="w-4 h-4 text-primary" />
              (84) 99627-3986
            </a>
            <a href="tel:62996987653" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors font-body text-sm">
              <Phone className="w-4 h-4 text-primary" />
              (62) 99698-7653
            </a>
            <a href="mailto:ecemconstrucoes@gmail.com" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors font-body text-sm">
              <Mail className="w-4 h-4 text-primary" />
              ecemconstrucoes@gmail.com
            </a>
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="font-display text-lg font-bold text-primary-foreground mb-4">Localização</h4>
          <div className="flex items-start gap-3 text-primary-foreground/70 font-body text-sm">
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Guamaré - RN, Brasil</span>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center">
        <p className="font-body text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} ECEM Construções e Terceirização de Mão de Obra. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>;


export default Footer;