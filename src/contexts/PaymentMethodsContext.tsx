import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export interface PaymentMethod {
  id: string;
  userId: string;
  cardholder: string;
  brand: CardBrand;
  last4: string;
  expMonth: string; // "01"–"12"
  expYear: string;  // "YY"
  /** Fake CVC — stored only for the prototype demo. Never do this in real apps. */
  cvc: string;
  isDefault: boolean;
  createdAt: string;
}

interface Ctx {
  methods: PaymentMethod[];
  addMethod: (m: Omit<PaymentMethod, "id" | "userId" | "createdAt" | "isDefault"> & { isDefault?: boolean }) => void;
  removeMethod: (id: string) => void;
  setDefault: (id: string) => void;
}

const PaymentCtx = createContext<Ctx | null>(null);
const KEY = "reservehub_payment_methods_v1";

export const detectBrand = (num: string): CardBrand => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
};

export const PaymentMethodsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [all, setAll] = useState<PaymentMethod[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(all)); }, [all]);

  const methods = all.filter(m => m.userId === user?.id);

  const addMethod: Ctx["addMethod"] = (m) => {
    if (!user) return;
    const id = `pm-${Date.now()}`;
    const userHas = all.some(x => x.userId === user.id);
    setAll(prev => {
      const next = m.isDefault || !userHas
        ? prev.map(x => x.userId === user.id ? { ...x, isDefault: false } : x)
        : prev;
      return [...next, {
        ...m, id, userId: user.id, createdAt: new Date().toISOString(),
        isDefault: m.isDefault || !userHas,
      }];
    });
  };

  const removeMethod = (id: string) =>
    setAll(prev => {
      const target = prev.find(p => p.id === id);
      let next = prev.filter(p => p.id !== id);
      // If we removed the default, promote the first remaining for that user
      if (target?.isDefault) {
        const idx = next.findIndex(p => p.userId === target.userId);
        if (idx >= 0) next = next.map((p, i) => i === idx ? { ...p, isDefault: true } : p);
      }
      return next;
    });

  const setDefault = (id: string) =>
    setAll(prev => {
      const target = prev.find(p => p.id === id);
      if (!target) return prev;
      return prev.map(p => p.userId === target.userId ? { ...p, isDefault: p.id === id } : p);
    });

  return (
    <PaymentCtx.Provider value={{ methods, addMethod, removeMethod, setDefault }}>
      {children}
    </PaymentCtx.Provider>
  );
};

export const usePaymentMethods = () => {
  const ctx = useContext(PaymentCtx);
  if (!ctx) throw new Error("usePaymentMethods must be used within PaymentMethodsProvider");
  return ctx;
};
