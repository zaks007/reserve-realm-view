import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type UserRole = "guest" | "user" | "teacher" | "institution_pending" | "institution_admin" | "campus_admin" | "super_admin";

/** Email domains treated as internal university affiliates */
export const UNIVERSITY_DOMAINS = ["unideb.hu", "mailbox.unideb.hu"];
export const isUniversityEmail = (email: string) =>
  UNIVERSITY_DOMAINS.some(d => email.toLowerCase().endsWith("@" + d));
/** Roles considered internal university users (free + instant booking on uni spaces) */
export const isUniversityUserRole = (r: UserRole) => r === "teacher";

export interface SimUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: string;
  campusId?: string;
}

export interface InstitutionRequest {
  id: string;
  name: string;
  type: string;
  city: string;
  contactEmail: string;
  description: string;
  website?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  submittedAt: string;
  submittedBy: string;
}

type PendingFlow = "user" | "institution" | "super_admin";
interface PendingCode {
  email: string;
  code: string; // sentinel "EMAIL" – real code lives in Supabase
  flow: PendingFlow;
  payload?: any;
}

interface AuthContextValue {
  user: SimUser | null;
  loading: boolean;
  superAdminEmails: string[];
  pendingCode: PendingCode | null;
  signupUser: (email: string, name: string, password: string) => Promise<string>;
  signupInstitution: (req: Omit<InstitutionRequest, "id" | "status" | "submittedAt" | "submittedBy">, password: string, name: string) => Promise<string>;
  signupSuperAdmin: (email: string, name: string, password: string) => Promise<string | { error: string }>;
  verifyCode: (code: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  addSuperAdminEmail: (email: string) => void;
  removeSuperAdminEmail: (email: string) => void;
  requests: InstitutionRequest[];
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason?: string) => void;
  updateProfile: (patch: Partial<Pick<SimUser, "name" | "email">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Password chosen at signup, kept in memory only (never persisted) until the email code is verified
let pendingPassword: string | null = null;

const SUPER_ADMIN_KEY = "reservehub_super_admins_v1";
const REQUESTS_KEY = "reservehub_requests_v1";
const PENDING_KEY = "reservehub_pending_v1";

const DEFAULT_SUPER_ADMINS = ["zakariumar2005@gmail.com"];

const seedRequests: InstitutionRequest[] = [
  {
    id: "req-1",
    name: "Debrecen Arena Sports Club",
    type: "sports",
    city: "Debrecen",
    contactEmail: "info@debrecenarena.hu",
    description: "A new sports complex offering football pitches and indoor courts for clubs and casual players.",
    website: "https://debrecenarena.example.com",
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    submittedBy: "founder@debrecentech.hu",
  },
  {
    id: "req-2",
    name: "Boutique Hotel Aranyszarvas",
    type: "hotel",
    city: "Debrecen",
    contactEmail: "contact@aranyszarvas.hu",
    description: "Family-run boutique hotel near Nagytemplom with 12 rooms and event facilities.",
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    submittedBy: "owner@aranyszarvas.hu",
  },
];

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

const SUPER_ADMIN_DEMO_EMAIL = "zakariumar2005@gmail.com";

async function loadUserFromSession(session: Session, superAdminEmails: string[]): Promise<SimUser> {
  const email = session.user.email ?? "";
  const meta = (session.user.user_metadata ?? {}) as { name?: string };
  // Try to read role from DB
  let role: UserRole = "user";
  try {
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);
    const roles = (roleRows ?? []).map(r => r.role);
    if (roles.includes("super_admin")) role = "super_admin";
    else if (roles.includes("institution_admin")) role = "institution_admin";
  } catch { /* ignore */ }
  // Hard override by email allowlist
  if (superAdminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
    role = "super_admin";
  } else if (isUniversityEmail(email) && role === "user") {
    role = "teacher";
  }
  let name = meta.name || email.split("@")[0];
  try {
    const { data: prof } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", session.user.id)
      .maybeSingle();
    if (prof?.name) name = prof.name;
  } catch { /* ignore */ }
  return { id: session.user.id, email, name, role };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [superAdminEmails, setSuperAdminEmails] = useState<string[]>(() =>
    loadJSON<string[]>(SUPER_ADMIN_KEY, DEFAULT_SUPER_ADMINS)
  );
  const [requests, setRequests] = useState<InstitutionRequest[]>(() =>
    loadJSON<InstitutionRequest[]>(REQUESTS_KEY, seedRequests)
  );
  const [pendingCode, setPendingCode] = useState<PendingCode | null>(() =>
    loadJSON<PendingCode | null>(PENDING_KEY, null)
  );

  useEffect(() => { localStorage.setItem(SUPER_ADMIN_KEY, JSON.stringify(superAdminEmails)); }, [superAdminEmails]);
  useEffect(() => { localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem(PENDING_KEY, JSON.stringify(pendingCode)); }, [pendingCode]);

  // Subscribe to real Supabase auth changes
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) {
        // defer DB reads to avoid deadlock
        setTimeout(async () => {
          const u = await loadUserFromSession(session, superAdminEmails);
          setUser(u);
        }, 0);
      } else {
        setUser(null);
      }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const u = await loadUserFromSession(data.session, superAdminEmails);
        setUser(u);
      }
      setLoading(false);
    });
    return () => { sub.subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOtp = async (email: string, name?: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: name ? { name } : undefined,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signupUser: AuthContextValue["signupUser"] = async (email, name, password) => {
    pendingPassword = password || null;
    await sendOtp(email, name);
    setPendingCode({ email, code: "EMAIL", flow: "user", payload: { name } });
    return "EMAIL";
  };

  const signupInstitution: AuthContextValue["signupInstitution"] = async (req, password, name) => {
    pendingPassword = password || null;
    await sendOtp(req.contactEmail, name);
    setPendingCode({ email: req.contactEmail, code: "EMAIL", flow: "institution", payload: { req, name } });
    return "EMAIL";
  };

  const signupSuperAdmin: AuthContextValue["signupSuperAdmin"] = async (email, name, password) => {
    pendingPassword = password || null;
    if (!superAdminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
      return { error: "This email is not authorized for Super Admin access." };
    }
    await sendOtp(email, name);
    setPendingCode({ email, code: "EMAIL", flow: "super_admin", payload: { name } });
    return "EMAIL";
  };

  const verifyCode: AuthContextValue["verifyCode"] = async (code) => {
    if (!pendingCode) return false;
    const { email, flow, payload } = pendingCode;
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    if (error || !data.session) return false;

    if (pendingPassword) {
      try { await supabase.auth.updateUser({ password: pendingPassword }); } catch { /* ignore */ }
      pendingPassword = null;
    }

    // Ensure profile is up to date with name from payload
    if (payload?.name) {
      try {
        await supabase.from("profiles").update({ name: payload.name }).eq("id", data.session.user.id);
      } catch { /* ignore */ }
    }

    if (flow === "institution") {
      const newReq: InstitutionRequest = {
        id: `req-${Date.now()}`,
        ...payload.req,
        status: "pending",
        submittedAt: new Date().toISOString(),
        submittedBy: email,
      };
      setRequests(prev => [newReq, ...prev]);
    } else if (flow === "super_admin") {
      try {
        await supabase.from("user_roles").insert({ user_id: data.session.user.id, role: "super_admin" as any });
      } catch { /* ignore */ }
    }

    const u = await loadUserFromSession(data.session, superAdminEmails);
    setUser(u);
    setPendingCode(null);
    return true;
  };

  // Email + password login
  const login: AuthContextValue["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const logout: AuthContextValue["logout"] = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const switchRole: AuthContextValue["switchRole"] = (role) => {
    if (role === "guest") { setUser(null); return; }
    const presets: Record<Exclude<UserRole, "guest">, SimUser> = {
      user: { id: "demo-user", email: "user@demo.hu", name: "Demo User", role: "user" },
      teacher: { id: "demo-teacher", email: "dr.kovacs@unideb.hu", name: "Dr. Kovács (Teacher)", role: "teacher", institutionId: "inst-2" },
      institution_pending: { id: "demo-inst-p", email: "pending@demo.hu", name: "Pending Institution", role: "institution_pending", institutionId: "req-1" },
      institution_admin: { id: "demo-inst-a", email: "admin@unideb.hu", name: "University Admin", role: "institution_admin", institutionId: "inst-2" },
      campus_admin: { id: "demo-campus", email: "kassai@unideb.hu", name: "Kassai Receptionist", role: "campus_admin", institutionId: "inst-2", campusId: "c1" },
      super_admin: { id: "demo-sa", email: SUPER_ADMIN_DEMO_EMAIL, name: "Zakaria (Super Admin)", role: "super_admin" },
    };
    setUser(presets[role]);
  };

  const addSuperAdminEmail = (email: string) => {
    const e = email.trim().toLowerCase();
    if (!e || superAdminEmails.map(x => x.toLowerCase()).includes(e)) return;
    setSuperAdminEmails(prev => [...prev, email.trim()]);
  };

  const removeSuperAdminEmail = (email: string) => {
    setSuperAdminEmails(prev => prev.filter(e => e.toLowerCase() !== email.toLowerCase()));
  };

  const approveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    if (user?.role === "institution_pending" && user.institutionId === id) {
      setUser({ ...user, role: "institution_admin" });
    }
  };

  const rejectRequest = (id: string, reason?: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected", rejectionReason: reason } : r));
  };

  const updateProfile: AuthContextValue["updateProfile"] = async (patch) => {
    setUser(prev => prev ? { ...prev, ...patch } : prev);
    if (!user) return;
    try {
      if (patch.name) await supabase.from("profiles").update({ name: patch.name }).eq("id", user.id);
    } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, superAdminEmails, pendingCode,
      signupUser, signupInstitution, signupSuperAdmin, verifyCode, login, logout, switchRole,
      addSuperAdminEmail, removeSuperAdminEmail,
      requests, approveRequest, rejectRequest,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const roleLabel: Record<UserRole, string> = {
  guest: "Guest",
  user: "User",
  teacher: "University Teacher",
  institution_pending: "Institution (Pending)",
  institution_admin: "Institution Admin",
  campus_admin: "Campus Admin",
  super_admin: "Super Admin",
};

export const roleBadgeClass: Record<UserRole, string> = {
  guest: "bg-muted text-muted-foreground",
  user: "bg-secondary text-secondary-foreground",
  teacher: "bg-indigo-500/15 text-indigo-700",
  institution_pending: "bg-amber-500/15 text-amber-700",
  institution_admin: "bg-emerald-500/15 text-emerald-700",
  campus_admin: "bg-teal-500/15 text-teal-700",
  super_admin: "bg-primary/15 text-primary",
};
