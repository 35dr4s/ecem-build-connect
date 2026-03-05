import { useState } from "react";
import { Menu, X, LogIn, LogOut, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logoEcem from "@/assets/logo-ecem.png";
import { useLeadSession } from "@/hooks/use-lead-session";

const navItems = [
{ label: "Início", href: "#inicio" },
{ label: "Serviços", href: "#servicos" },
{ label: "Locação", href: "#locacao" },
{ label: "Sobre", href: "#sobre" },
{ label: "Contato", href: "#contato" }];


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { lead, isLogged, clearLead } = useLeadSession();

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-sm border-b border-border/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#inicio" className="flex items-center gap-2">
          <img alt="ECEM Construções" className="h-10 w-auto" src="/lovable-uploads/14530c08-3f51-46d4-9398-2235761aa0c6.png" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
          <button
            key={item.href}
            onClick={() => scrollTo(item.href)}
            className="font-display text-sm tracking-wider text-primary-foreground/80 hover:text-primary transition-colors uppercase">

              {item.label}
            </button>
          )}
          <button
            onClick={() => navigate("/cadastro")}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm font-display text-sm tracking-wider hover:bg-primary/90 transition-colors">
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-primary-foreground">

          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-foreground border-t border-border/20 overflow-hidden">

            <nav className="flex flex-col p-4 gap-3">
              {navItems.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="font-display text-sm tracking-wider text-primary-foreground/80 hover:text-primary transition-colors uppercase text-left py-2">

                  {item.label}
                </button>
            )}
              <button
                onClick={() => { setMobileOpen(false); navigate("/cadastro"); }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-sm font-display text-sm tracking-wider justify-center mt-2">
                <LogIn className="w-4 h-4" />
                Login
              </button>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

};

export default Header;