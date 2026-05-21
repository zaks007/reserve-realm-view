import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { bookings as seedBookings, Booking } from "@/data/mockData";

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface SimBooking extends Omit<Booking, "status"> {
  status: BookingStatus;
  spaceId: string;
  institutionId: string;
  campusId?: string;
  userEmail: string;
  rejectionReason?: string;
}

interface BookingsContextValue {
  bookings: SimBooking[];
  createBooking: (b: Omit<SimBooking, "id" | "status">, opts?: { autoApprove?: boolean; free?: boolean }) => { ok: boolean; error?: string; booking?: SimBooking };
  updateStatus: (id: string, status: BookingStatus, reason?: string) => void;
  cancelBooking: (id: string) => void;
  hasConflict: (spaceId: string, date: string, start: string, end: string, ignoreId?: string) => boolean;
  getBookingsForSpace: (spaceId: string) => SimBooking[];
}

const Ctx = createContext<BookingsContextValue | null>(null);
const KEY = "reservehub_bookings_v1";

const seed: SimBooking[] = seedBookings.map((b, i) => ({
  ...b,
  status: (b.status === "confirmed" ? "approved" : b.status === "pending" ? "pending" : "cancelled") as BookingStatus,
  spaceId: ["s1", "s4", "s6", "s3", "s5"][i] || "s1",
  institutionId: ["inst-1", "inst-3", "inst-4", "inst-2", "inst-6"][i] || "inst-1",
  campusId: i === 3 ? "c1" : undefined,
  userEmail: "user@demo.hu",
}));

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<SimBooking[]>(() => {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : seed; } catch { return seed; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(bookings)); }, [bookings]);

  const overlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => aStart < bEnd && bStart < aEnd;

  const hasConflict: BookingsContextValue["hasConflict"] = (spaceId, date, start, end, ignoreId) => {
    return bookings.some(b =>
      b.id !== ignoreId &&
      b.spaceId === spaceId &&
      b.date === date &&
      (b.status === "approved" || b.status === "pending") &&
      overlap(start, end, b.startTime, b.endTime)
    );
  };

  const createBooking: BookingsContextValue["createBooking"] = (b, opts) => {
    if (hasConflict(b.spaceId, b.date, b.startTime, b.endTime)) {
      return { ok: false, error: "This time slot conflicts with an existing booking." };
    }
    const booking: SimBooking = {
      ...b,
      id: `bk-${Date.now()}`,
      status: opts?.autoApprove ? "approved" : "pending",
    };
    setBookings(prev => [booking, ...prev]);
    return { ok: true, booking };
  };

  const updateStatus: BookingsContextValue["updateStatus"] = (id, status, reason) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status, rejectionReason: reason } : b));
  };

  const cancelBooking = (id: string) => updateStatus(id, "cancelled");

  const getBookingsForSpace = (spaceId: string) => bookings.filter(b => b.spaceId === spaceId);

  return (
    <Ctx.Provider value={{ bookings, createBooking, updateStatus, cancelBooking, hasConflict, getBookingsForSpace }}>
      {children}
    </Ctx.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
};

export const statusBadgeClass: Record<BookingStatus, string> = {
  pending: "status-pending",
  approved: "status-confirmed",
  rejected: "status-cancelled",
  cancelled: "status-cancelled",
};

export const statusLabel: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};
