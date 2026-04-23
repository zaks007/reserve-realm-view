import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Building2, MapPin, DoorOpen, LayoutGrid, CalendarDays, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings, statusBadgeClass, statusLabel } from "@/contexts/BookingsContext";
import { institutions, getInstitutionById } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const InstitutionAdminDashboard = () => {
  const { user } = useAuth();
  const { bookings, updateStatus } = useBookings();
  const [tab, setTab] = useState<"overview" | "campuses" | "buildings" | "rooms" | "bookings">("overview");

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role === "institution_pending") {
    return (
      <div className="container py-16 max-w-xl text-center">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-8">
          <div className="h-14 w-14 mx-auto rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center mb-4">
            <CalendarDays className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Awaiting Super Admin Approval</h1>
          <p className="text-muted-foreground mb-4">
            Your institution registration is being reviewed. You'll be able to manage campuses, buildings, rooms, and bookings once approved.
          </p>
          <Button asChild variant="outline"><Link to="/">Browse spaces in the meantime</Link></Button>
        </div>
      </div>
    );
  }
  if (user.role !== "institution_admin") return <Navigate to="/" replace />;

  const institution = getInstitutionById(user.institutionId || "") || institutions[0];
  const myBookings = bookings.filter(b => b.institutionId === institution.id);
  const pending = myBookings.filter(b => b.status === "pending");

  const campusCount = institution.campuses?.length || 0;
  const buildingCount = (institution.campuses?.flatMap(c => c.buildings) || institution.buildings).length;
  const roomCount = (institution.campuses?.flatMap(c => c.buildings.flatMap(b => b.spaces)) || institution.buildings.flatMap(b => b.spaces)).length;

  return (
    <div className="container py-8">
      <p className="text-sm text-muted-foreground mb-1">Institution Admin</p>
      <h1 className="text-3xl font-bold mb-8">{institution.name}</h1>

      <div className="flex gap-1 border-b mb-8 overflow-x-auto">
        {[
          { k: "overview", label: "Overview" },
          { k: "campuses", label: `Campuses (${campusCount})` },
          { k: "buildings", label: `Buildings (${buildingCount})` },
          { k: "rooms", label: `Rooms (${roomCount})` },
          { k: "bookings", label: `Bookings (${myBookings.length})` },
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
          {[
            { icon: MapPin, label: "Campuses", value: campusCount },
            { icon: Building2, label: "Buildings", value: buildingCount },
            { icon: DoorOpen, label: "Rooms", value: roomCount },
            { icon: CalendarDays, label: "Pending bookings", value: pending.length, accent: "bg-amber-500/15 text-amber-700" },
          ].map(s => (
            <div key={s.label} className="bg-card border rounded-xl p-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${s.accent || "bg-primary/10 text-primary"}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {(tab === "campuses" || tab === "buildings" || tab === "rooms") && (
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder={`Search ${tab}...`} className="max-w-sm" />
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add new</Button>
          </div>
          <div className="space-y-2">
            {tab === "campuses" && (institution.campuses || [{ id: "main", name: "Main Site", buildings: institution.buildings }]).map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.buildings.length} buildings</p></div>
                <div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></div>
              </div>
            ))}
            {tab === "buildings" && (institution.campuses?.flatMap(c => c.buildings.map(b => ({ ...b, campus: c.name }))) || institution.buildings.map(b => ({ ...b, campus: undefined }))).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div><p className="font-medium">{b.name}</p><p className="text-xs text-muted-foreground">{b.spaces.length} rooms{(b as any).campus ? ` · ${(b as any).campus}` : ""}</p></div>
                <div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></div>
              </div>
            ))}
            {tab === "rooms" && (institution.campuses?.flatMap(c => c.buildings.flatMap(b => b.spaces.map(s => ({ ...s, building: b.name })))) || institution.buildings.flatMap(b => b.spaces.map(s => ({ ...s, building: b.name })))).map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={s.image} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                  <div className="min-w-0"><p className="font-medium truncate">{s.name}</p><p className="text-xs text-muted-foreground">{s.building} · cap. {s.capacity}</p></div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.available ? "status-confirmed" : "status-cancelled"}`}>{s.available ? "Available" : "Unavailable"}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-secondary/50">
              <th className="text-left p-4 font-semibold">Space</th>
              <th className="text-left p-4 font-semibold">When</th>
              <th className="text-left p-4 font-semibold">User</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Actions</th>
            </tr></thead>
            <tbody>
              {myBookings.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No bookings yet.</td></tr>}
              {myBookings.map(b => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{b.spaceName}</td>
                  <td className="p-4 text-muted-foreground">{b.date} · {b.startTime}-{b.endTime}</td>
                  <td className="p-4 text-muted-foreground">{b.userEmail}</td>
                  <td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadgeClass[b.status]}`}>{statusLabel[b.status]}</span></td>
                  <td className="p-4 text-right space-x-1">
                    {b.status === "pending" && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => { updateStatus(b.id, "approved"); toast({ title: "Approved" }); }}><Check className="h-4 w-4 text-emerald-600" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => { updateStatus(b.id, "rejected"); toast({ title: "Rejected" }); }}><X className="h-4 w-4 text-destructive" /></Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstitutionAdminDashboard;
