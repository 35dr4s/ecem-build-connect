import { useState, useEffect, useCallback } from "react";

export interface LeadSession {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  cpfCnpj: string;
  personType: string;
  city: string;
  state: string;
  address: string;
}

const STORAGE_KEY = "ecem_lead_session";

export function useLeadSession() {
  const [lead, setLead] = useState<LeadSession | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const saveLead = useCallback((data: LeadSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLead(data);
  }, []);

  const clearLead = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLead(null);
  }, []);

  return { lead, isLogged: !!lead, saveLead, clearLead };
}
