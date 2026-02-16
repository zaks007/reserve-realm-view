import { useState } from "react";
import { Building2, MapPin, DoorOpen, LayoutGrid, CalendarDays, Plus, Pencil, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { institutions, bookings } from "@/data/mockData";

const sidebarItems = [
  { key: "institutions", label: "Institutions", icon: Building2, count: institutions.length },
  { key: "campuses", label: "Campuses", icon: MapPin, count: 2 },
  { key: "buildings", label: "Buildings", icon: DoorOpen, count: 9 },
  { key: "spaces", label: "Spaces", icon: LayoutGrid, count: 8 },
  { key: "bookings", label: "Bookings", icon: CalendarDays, count: bookings.length },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("institutions");

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r hidden md:flex flex-col shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <h2 className="font-bold text-lg text-sidebar-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              <span className="text-xs opacity-60">{item.count}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden border-b overflow-x-auto flex">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === item.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add New
          </Button>
        </div>

        <div className="mb-4">
          <Input placeholder={`Search ${activeTab}...`} className="max-w-sm" />
        </div>

        {/* Table */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">Type / Details</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "institutions" &&
                  institutions.map((inst) => (
                    <tr key={inst.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-medium">{inst.name}</td>
                      <td className="p-4 text-muted-foreground">{inst.type} · {inst.city}</td>
                      <td className="p-4"><span className="text-xs font-semibold px-2 py-1 rounded-full status-confirmed">Active</span></td>
                      <td className="p-4 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                {activeTab === "bookings" &&
                  bookings.map((b) => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-medium">{b.spaceName}</td>
                      <td className="p-4 text-muted-foreground">{b.institutionName} · {b.date}</td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          b.status === "confirmed" ? "status-confirmed" : b.status === "pending" ? "status-pending" : "status-cancelled"
                        }`}>{b.status}</span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                {activeTab !== "institutions" && activeTab !== "bookings" && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      Sample CRUD table for {activeTab}. Data would appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
