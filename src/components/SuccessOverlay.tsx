import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SuccessOverlayProps {
  show: boolean;
  onDone: () => void;
  message?: string;
}

const SuccessOverlay = ({ show, onDone, message = "Sua solicitação foi enviada, entraremos em contato brevemente." }: SuccessOverlayProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!show) { setCountdown(5); return; }
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); onDone(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-card border border-border rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="font-display text-lg font-bold text-foreground mb-2">{message}</p>
            <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center mx-auto mt-4">
              <span className="font-display text-xl font-bold text-primary">{countdown}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessOverlay;
