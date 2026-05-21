import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "guest" | "user" | "student" | "teacher" | "institution_pending" | "institution_admin" | "campus_admin" | "super_admin";

/** Email domains treated as internal university affiliates */
export const UNIVERSITY_DOMAINS = ["unideb.hu", "mailbox.unideb.hu"];
export const isUniversityEmail = (email: string) =>
  UNIVERSITY_DOMAINS.some(d => email.toLowerCase().endsWith("@" + d));
/** Roles considered internal university users (free + instant booking on uni spaces) */
export const isUniversityUserRole = (r: UserRole) => r === "teacher" || r === "student";

export interface SimUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** institution-id the user is admin of (institution_admin / institution_pending) */
  institutionId?: string;
  /** campus-id the user manages (campus_admin) */
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

interface AuthContextValue {
  user: SimUser | null;
  superAdminEmails: string[];
  pendingCode: { email: string; code: string; flow: "user" | "institution" | "super_admin"; payload?: any } | null;
  signupUser: (email: string, name: string, password: string) => string; // returns code
  signupInstitution: (req: Omit<InstitutionRequest, "id" | "status" | "submittedAt" | "submittedBy">, password: string, name: string) => string;
  signupSuperAdmin: (email: string, name: string, password: string) => string | { error: string };
  verifyCode: (code: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  addSuperAdminEmail: (email: string) => void;
  removeSuperAdminEmail: (email: string) => void;
  requests: InstitutionRequest[];
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason?: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "reservehub_auth_v1";
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimUser | null>(() => loadJSON<SimUser | null>(STORAGE_KEY, null));
  const [superAdminEmails, setSuperAdminEmails] = useState<string[]>(() =>
    loadJSON<string[]>(SUPER_ADMIN_KEY, DEFAULT_SUPER_ADMINS)
  );
  const [requests, setRequests] = useState<InstitutionRequest[]>(() =>
    loadJSON<InstitutionRequest[]>(REQUESTS_KEY, seedRequests)
  );
  const [pendingCode, setPendingCode] = useState<AuthContextValue["pendingCode"]>(() =>
    loadJSON<AuthContextValue["pendingCode"]>(PENDING_KEY, null)
  );

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem(SUPER_ADMIN_KEY, JSON.stringify(superAdminEmails)); }, [superAdminEmails]);
  useEffect(() => { localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem(PENDING_KEY, JSON.stringify(pendingCode)); }, [pendingCode]);

  const genCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const signupUser = (email: string, name: string, _password: string) => {
    const code = genCode();
    setPendingCode({ email, code, flow: "user", payload: { name } });
    return code;
  };

  const signupInstitution: AuthContextValue["signupInstitution"] = (req, _password, name) => {
    const code = genCode();
    setPendingCode({ email: req.contactEmail, code, flow: "institution", payload: { req, name } });
    return code;
  };

  const signupSuperAdmin: AuthContextValue["signupSuperAdmin"] = (email, name, _password) => {
    if (!superAdminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
      return { error: "This email is not authorized for Super Admin access." };
    }
    const code = genCode();
    setPendingCode({ email, code, flow: "super_admin", payload: { name } });
    return code;
  };

  const verifyCode = (code: string): boolean => {
    if (!pendingCode || code !== pendingCode.code) return false;
    const { email, flow, payload } = pendingCode;
    if (flow === "user") {
      setUser({ id: `usr-${Date.now()}`, email, name: payload.name, role: "user" });
    } else if (flow === "institution") {
      const newReq: InstitutionRequest = {
        id: `req-${Date.now()}`,
        ...payload.req,
        status: "pending",
        submittedAt: new Date().toISOString(),
        submittedBy: email,
      };
      setRequests(prev => [newReq, ...prev]);
      setUser({
        id: `inst-usr-${Date.now()}`,
        email,
        name: payload.name,
        role: "institution_pending",
        institutionId: newReq.id,
      });
    } else if (flow === "super_admin") {
      setUser({ id: `sa-${Date.now()}`, email, name: payload.name, role: "super_admin" });
    }
    setPendingCode(null);
    return true;
  };

  const login = (email: string, _password: string): boolean => {
    if (superAdminEmails.map(e => e.toLowerCase()).includes(email.toLowerCase())) {
      setUser({ id: `sa-${Date.now()}`, email, name: email.split("@")[0], role: "super_admin" });
    } else if (isUniversityEmail(email)) {
      // simulate: faculty/staff addresses → teacher, otherwise student
      const isStaff = /^(dr|prof|admin|teacher|staff|faculty|[a-z]+\.[a-z]+)/i.test(email.split("@")[0]);
      setUser({
        id: `uni-${Date.now()}`, email, name: email.split("@")[0].replace(/[._]/g, " "),
        role: isStaff ? "teacher" : "student", institutionId: "inst-2",
      });
    } else {
      setUser({ id: `usr-${Date.now()}`, email, name: email.split("@")[0], role: "user" });
    }
    return true;
  };

  const logout = () => setUser(null);

  const switchRole: AuthContextValue["switchRole"] = (role) => {
    if (role === "guest") { setUser(null); return; }
    const presets: Record<Exclude<UserRole, "guest">, SimUser> = {
      user: { id: "demo-user", email: "user@demo.hu", name: "Demo User", role: "user" },
      student: { id: "demo-student", email: "student@unideb.hu", name: "Demo Student", role: "student", institutionId: "inst-2" },
      teacher: { id: "demo-teacher", email: "dr.kovacs@unideb.hu", name: "Dr. Kovács (Teacher)", role: "teacher", institutionId: "inst-2" },
      institution_pending: { id: "demo-inst-p", email: "pending@demo.hu", name: "Pending Institution", role: "institution_pending", institutionId: "req-1" },
      institution_admin: { id: "demo-inst-a", email: "admin@unideb.hu", name: "University Admin", role: "institution_admin", institutionId: "inst-2" },
      campus_admin: { id: "demo-campus", email: "kassai@unideb.hu", name: "Kassai Receptionist", role: "campus_admin", institutionId: "inst-2", campusId: "c1" },
      super_admin: { id: "demo-sa", email: "zakariumar2005@gmail.com", name: "Zakaria (Super Admin)", role: "super_admin" },
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

  return (
    <AuthContext.Provider value={{
      user, superAdminEmails, pendingCode,
      signupUser, signupInstitution, signupSuperAdmin, verifyCode, login, logout, switchRole,
      addSuperAdminEmail, removeSuperAdminEmail,
      requests, approveRequest, rejectRequest,
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
  student: "University Student",
  teacher: "University Teacher",
  institution_pending: "Institution (Pending)",
  institution_admin: "Institution Admin",
  campus_admin: "Campus Admin",
  super_admin: "Super Admin",
};

export const roleBadgeClass: Record<UserRole, string> = {
  guest: "bg-muted text-muted-foreground",
  user: "bg-secondary text-secondary-foreground",
  student: "bg-blue-500/15 text-blue-700",
  teacher: "bg-indigo-500/15 text-indigo-700",
  institution_pending: "bg-amber-500/15 text-amber-700",
  institution_admin: "bg-emerald-500/15 text-emerald-700",
  campus_admin: "bg-teal-500/15 text-teal-700",
  super_admin: "bg-primary/15 text-primary",
};
