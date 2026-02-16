import { useParams } from "react-router-dom";
import { Users, Check, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSpaceById } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const SpaceDetail = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const result = getSpaceById(spaceId || "");
  const [startDt, setStartDt] = useState("");
  const [endDt, setEndDt] = useState("");

  if (!result) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg text-muted-foreground">Space not found.</p>
      </div>
    );
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
    if (!startDt || !endDt) {
      toast({ title: "Please fill in both date/time fields", variant: "destructive" });
      return;
    }
    toast({ title: "Reservation Submitted!", description: `${space.name} booked successfully. (UI Demo)` });
  };

  return (
    <div className="container py-4">
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
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
              <p className="font-bold text-lg">${space.pricePerHour}</p>
            </div>
            <div className="bg-card border rounded-lg p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Availability</p>
              <p className={`font-bold text-lg ${space.available ? "text-success" : "text-destructive"}`}>
                {space.available ? "Available" : "Occupied"}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">Features & Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {space.features.map((f) => (
              <div key={f} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-1">Reserve This Space</h3>
            <p className="text-sm text-muted-foreground mb-6">
              ${space.pricePerHour}/hour · {institution.name}
            </p>
            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <Label>Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={startDt}
                  onChange={(e) => setStartDt(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>End Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={endDt}
                  onChange={(e) => setEndDt(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={!space.available}>
                {space.available ? "Reserve Now" : "Currently Unavailable"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
