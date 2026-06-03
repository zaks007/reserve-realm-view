import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { institutions as baseInstitutions, Institution } from "@/data/mockData";

/**
 * Editable subset of an Institution that the Super Admin can override
 * at runtime. Stored in localStorage so the demo survives page reloads.
 * Designed to be swapped for an API-backed mutation when the Spring Boot
 * backend is wired in — the component layer only depends on
 * `useInstitutions()` / `updateInstitution()` / `resetInstitution()`.
 */
export type InstitutionPatch = Partial<
  Pick<Institution, "name" | "description" | "city" | "rating" | "image" | "address">
>;

interface InstitutionsContextValue {
  institutions: Institution[];
  getById: (id: string) => Institution | undefined;
  updateInstitution: (id: string, patch: InstitutionPatch) => void;
  resetInstitution: (id: string) => void;
  overrides: Record<string, InstitutionPatch>;
}

const Ctx = createContext<InstitutionsContextValue | null>(null);
const KEY = "reservehub_institution_overrides_v1";

const loadOverrides = (): Record<string, InstitutionPatch> => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const InstitutionsProvider = ({ children }: { children: ReactNode }) => {
  const [overrides, setOverrides] = useState<Record<string, InstitutionPatch>>(loadOverrides);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(overrides));
  }, [overrides]);

  const institutions = useMemo<Institution[]>(
    () => baseInstitutions.map((i) => (overrides[i.id] ? { ...i, ...overrides[i.id] } : i)),
    [overrides]
  );

  const value: InstitutionsContextValue = {
    institutions,
    overrides,
    getById: (id) => institutions.find((i) => i.id === id),
    updateInstitution: (id, patch) =>
      setOverrides((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } })),
    resetInstitution: (id) =>
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useInstitutions = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useInstitutions must be used within InstitutionsProvider");
  return ctx;
};
