import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Building2, Users, ShieldCheck, Inbox, Check, X, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth, InstitutionRequest } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingsContext";
import { institutions, typeLabelMap } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const StatCard = ({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number | string; accent?: string }) => (
  <div className="bg-card border rounded-xl p-5">
    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${accent || "bg-primary/10 text-primary"}`}>
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const SuperAdminDashboard = () => {
  const { user, requests, approveRequest, rejectRequest, superAdminEmails, addSuperAdminEmail, removeSuperAdminEmail } = useAuth();
  const { bookings } = useBookings();
  const [tab, setTab] = useState<"requests" | "admins" | "overview">("overview");
  const [rejectTarget, setRejectTarget] = useState<InstitutionRequest | null>(null);
  const [reason, setReason] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  if (!user || user.role !== "super_admin") return <Navigate to="/" replace />;

  const pending = requests.filter(r => r.status === "pending");
  const approved = requests.filter(r => r.status === "approved");
  const rejected = requests.filter(r => r.status === "rejected");

  const doReject = () => {
    if (!rejectTarget) return;
    rejectRequest(rejectTarget.id, reason);
    toast({ title: "Request rejected", description: rejectTarget.name });
    setRejectTarget(null); setReason("");
  };

  const doAddAdmin = () => {
    if (!newAdminEmail.includes("@")) { toast({ title: "Invalid email", variant: "destructive" }); return; }
    addSuperAdminEmail(newAdminEmail);
    toast({ title: "Authorized email added", description: newAdminEmail });
    setNewAdminEmail("");
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Super Admin</h1>
      </div>
      <p className="text-muted-foreground mb-8">Master control over the ReserveHub platform.</p>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-8 overflow-x-auto">
        {[
          { k: "overview", label: "Overview" },
          { k: "requests", label: `Pending Requests (${pending.length})` },
          { k: "admins", label: "Authorized Admins" },
        ].map(t => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === t.k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Building2} label="Active Institutions" value={institutions.length} />
          <StatCard icon={Inbox} label="Pending Requests" value={pending.length} accent="bg-amber-500/15 text-amber-700" />
          <StatCard icon={Check} label="Approved" value={approved.length} accent="bg-emerald-500/15 text-emerald-700" />
          <StatCard icon={X} label="Rejected" value={rejected.length} accent="bg-rose-500/15 text-rose-700" />
          <StatCard icon={Users} label="Total Bookings" value={bookings.length} />
          <StatCard icon={ShieldCheck} label="Authorized Admins" value={superAdminEmails.length} />
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-4">
          {requests.length === 0 && <p className="text-muted-foreground text-center py-12">No requests yet.</p>}
          {requests.map(r => (
            <div key={r.id} className="bg-card border rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-lg">{r.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{typeLabelMap[r.type as keyof typeof typeLabelMap] || r.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                      r.status === "pending" ? "status-pending" : r.status === "approved" ? "status-confirmed" : "status-cancelled"
                    }`}>{r.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{r.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    <span><span className="text-muted-foreground">City:</span> {r.city}</span>
                    <span><span className="text-muted-foreground">Contact:</span> {r.contactEmail}</span>
                    <span><span className="text-muted-foreground">Submitted:</span> {new Date(r.submittedAt).toLocaleDateString()}</span>
                    {r.website && <a href={r.website} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1">Website <ExternalLink className="h-3 w-3" /></a>}
                  </div>
                  {r.rejectionReason && (
                    <div className="mt-3 p-2 bg-rose-500/10 text-rose-700 rounded text-sm">
                      <span className="font-semibold">Reason:</span> {r.rejectionReason}
                    </div>
                  )}
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => { approveRequest(r.id); toast({ title: "Approved", description: r.name }); }}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30" onClick={() => setRejectTarget(r)}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "admins" && (
        <div className="max-w-2xl">
          <div className="bg-card border rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-1">Add authorized email</h3>
            <p className="text-sm text-muted-foreground mb-4">Only emails on this list can sign up as Super Admin.</p>
            <div className="flex gap-2">
              <Input type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="email@example.com" />
              <Button onClick={doAddAdmin}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
          </div>
          <div className="bg-card border rounded-xl overflow-hidden">
            {superAdminEmails.map(e => (
              <div key={e} className="flex items-center justify-between p-4 border-b last:border-0">
                <span className="font-mono text-sm">{e}</span>
                <Button
                  variant="ghost" size="sm"
                  className="text-destructive"
                  onClick={() => { removeSuperAdminEmail(e); toast({ title: "Removed", description: e }); }}
                  disabled={e.toLowerCase() === user.email.toLowerCase()}
                  title={e.toLowerCase() === user.email.toLowerCase() ? "You can't remove yourself" : ""}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!rejectTarget} onOpenChange={o => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject {rejectTarget?.name}?</DialogTitle></DialogHeader>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Optionally provide a reason that will be visible to the applicant.</p>
            <Textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="e.g. Insufficient information provided" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={doReject}>Confirm Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminDashboard;
