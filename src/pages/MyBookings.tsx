import { Calendar, Building2, Clock, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import { bookings } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const statusClass: Record<string, string> = {
  confirmed: "status-confirmed",
  pending: "status-pending",
  cancelled: "status-cancelled",
};

const MyBookings = () => {
  const handleCancel = (id: string) => {
    toast({ title: "Booking Cancelled", description: `Booking ${id} has been cancelled. (UI Demo)` });
  };

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: "My Bookings" }]} />
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-card border rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-bold text-lg">{b.spaceName}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusClass[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> {b.institutionName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {b.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {b.startTime} - {b.endTime}
                </span>
              </div>
            </div>
            {b.status !== "cancelled" && (
              <Button variant="outline" size="sm" onClick={() => handleCancel(b.id)} className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
