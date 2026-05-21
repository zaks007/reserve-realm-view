import { useParams, useNavigate } from "react-router-dom";
import { Users, Check, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Breadcrumbs from "@/components/Breadcrumbs";
import RoomAvailabilityCalendar from "@/components/RoomAvailabilityCalendar";
import { getSpaceById } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useAuth, isUniversityUserRole } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingsContext";

const SpaceDetail = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const result = getSpaceById(spaceId || "");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!result) {
    return <div className="container py-20 text-center"><p className="text-lg text-muted-foreground">Space not found.</p></div>;
  }

  const { space, building, institution, campus } = result;

  const breadcrumbs = [
    { label: "Explore", to: "/institutions" },
    { label: institution.name, to: `/institutions/${institution.id}` },
    ...(campus ? [{ label: campus.name }] : []),
    { label: building.name },
    { label: space.name },
  ];

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role === "guest") {
      toast({ title: "Please log in to book", variant: "destructive" });
      navigate("/auth/login"); return;
    }
    if (!date || !startTime || !endTime) {
      toast({ title: "Please fill in date, start and end time", variant: "destructive" }); return;
    }
    if (startTime >= endTime) {
      toast({ title: "End time must be after start time", variant: "destructive" }); return;
    }
    const res = createBooking({
      spaceId: space.id, spaceName: space.name,
      institutionId: institution.id, institutionName: institution.name,
      buildingName: building.name, campusId: campus?.id,
      date, startTime, endTime,
      capacity: space.capacity, userEmail: user.email,
    });
    if (!res.ok) {
      toast({ title: "Booking conflict", description: res.error, variant: "destructive" }); return;
    }
    toast({ title: "Booking submitted!", description: "Your request is now pending approval." });
    navigate("/my-bookings");
  };

  return (
    <div className="container py-4">
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden aspect-[16/9] mb-6">
            <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold mb-4">{space.name}</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border rounded-lg p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-bold text-lg">{space.capacity}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Price/Hour</p>
              <p className="font-bold text-lg">{space.pricePerHour.toLocaleString()} HUF</p>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`font-bold text-lg ${space.available ? "text-success" : "text-destructive"}`}>
                {space.available ? "Available" : "Occupied"}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">Features & Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {space.features.map((f) => (
              <div key={f} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-3">Availability Calendar</h2>
          <RoomAvailabilityCalendar spaceId={space.id} />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-1">Reserve This Space</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {space.pricePerHour.toLocaleString()} HUF/hour · {institution.name}
            </p>
            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Start</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>End</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1" />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={!space.available}>
                {space.available ? "Submit Booking Request" : "Currently Unavailable"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Bookings require approval from the institution.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
