import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBookings } from "@/contexts/BookingsContext";
import { Button } from "@/components/ui/button";

interface Props {
  spaceId: string;
}

const RoomAvailabilityCalendar = ({ spaceId }: Props) => {
  const { getBookingsForSpace } = useBookings();
  const [cursor, setCursor] = useState(new Date());

  const bookings = getBookingsForSpace(spaceId).filter(b => b.status === "approved" || b.status === "pending");

  const { year, month, daysInMonth, firstDayOffset } = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7; // Mon=0
    return { year: y, month: m, daysInMonth: dim, firstDayOffset: offset };
  }, [cursor]);

  const monthName = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
  const today = new Date();
  const isToday = (d: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const dayBookings = (d: number) => {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return bookings.filter(b => b.date === date);
  };

  const cells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-card border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{monthName}</h3>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground mb-1">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const items = dayBookings(d);
          const hasApproved = items.some(b => b.status === "approved");
          const hasPending = items.some(b => b.status === "pending");
          return (
            <div key={i} className={`aspect-square rounded p-1 text-xs flex flex-col gap-0.5 border ${
              isToday(d) ? "border-primary" : "border-transparent"
            } ${hasApproved ? "bg-rose-500/15" : hasPending ? "bg-amber-500/15" : "bg-secondary/40"}`}>
              <span className={`font-semibold ${isToday(d) ? "text-primary" : ""}`}>{d}</span>
              {items.length > 0 && <span className="text-[10px] text-muted-foreground truncate">{items.length} booking{items.length>1?"s":""}</span>}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-rose-500/40" /> Booked</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500/40" /> Pending</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-secondary border" /> Free</span>
      </div>
    </div>
  );
};

export default RoomAvailabilityCalendar;
