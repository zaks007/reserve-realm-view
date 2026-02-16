export type InstitutionType = "hotel" | "university" | "coworking" | "event";

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  city: string;
  description: string;
  image: string;
  rating: number;
  campuses?: Campus[];
  buildings: Building[];
}

export interface Campus {
  id: string;
  name: string;
  buildings: Building[];
}

export interface Building {
  id: string;
  name: string;
  spaces: Space[];
}

export interface Space {
  id: string;
  name: string;
  capacity: number;
  image: string;
  features: string[];
  pricePerHour: number;
  available: boolean;
}

export interface Booking {
  id: string;
  spaceName: string;
  institutionName: string;
  buildingName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
  capacity: number;
}

const spaces: Space[] = [
  { id: "s1", name: "Conference Room A", capacity: 20, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600", features: ["Projector", "WiFi", "Whiteboard", "AC", "Video Conferencing"], pricePerHour: 45, available: true },
  { id: "s2", name: "Meeting Room B", capacity: 8, image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600", features: ["WiFi", "Whiteboard", "AC"], pricePerHour: 25, available: true },
  { id: "s3", name: "Lecture Hall 101", capacity: 120, image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600", features: ["Projector", "WiFi", "Microphone", "AC", "Recording"], pricePerHour: 80, available: false },
  { id: "s4", name: "Hot Desk Area", capacity: 30, image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=600", features: ["WiFi", "Power Outlets", "Standing Desks"], pricePerHour: 10, available: true },
  { id: "s5", name: "Private Office Suite", capacity: 6, image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600", features: ["WiFi", "AC", "Printer", "Phone"], pricePerHour: 35, available: true },
  { id: "s6", name: "Ballroom", capacity: 300, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600", features: ["Stage", "Sound System", "Lighting", "AC", "Catering Area"], pricePerHour: 200, available: true },
  { id: "s7", name: "Workshop Studio", capacity: 25, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600", features: ["WiFi", "Projector", "Whiteboard", "Art Supplies"], pricePerHour: 40, available: true },
  { id: "s8", name: "Executive Boardroom", capacity: 14, image: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600", features: ["Video Conferencing", "WiFi", "AC", "Catering"], pricePerHour: 60, available: true },
];

export const institutions: Institution[] = [
  {
    id: "inst-1",
    name: "Grand Azure Hotel",
    type: "hotel",
    city: "New York",
    description: "Luxury hotel with state-of-the-art conference facilities in the heart of Manhattan.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    rating: 4.8,
    buildings: [
      { id: "b1", name: "Main Tower", spaces: [spaces[0], spaces[7]] },
      { id: "b2", name: "Convention Wing", spaces: [spaces[5], spaces[1]] },
    ],
  },
  {
    id: "inst-2",
    name: "Metropolitan University",
    type: "university",
    city: "Boston",
    description: "Leading research university offering flexible campus spaces for events and meetings.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600",
    rating: 4.5,
    campuses: [
      {
        id: "c1",
        name: "Main Campus",
        buildings: [
          { id: "b3", name: "Science Building", spaces: [spaces[2], spaces[1]] },
          { id: "b4", name: "Arts Center", spaces: [spaces[6]] },
        ],
      },
      {
        id: "c2",
        name: "Downtown Campus",
        buildings: [
          { id: "b5", name: "Business School", spaces: [spaces[0], spaces[4]] },
        ],
      },
    ],
    buildings: [],
  },
  {
    id: "inst-3",
    name: "The Hub Coworking",
    type: "coworking",
    city: "San Francisco",
    description: "Modern coworking space with flexible desk options and private offices.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600",
    rating: 4.6,
    buildings: [
      { id: "b6", name: "Innovation Center", spaces: [spaces[3], spaces[4], spaces[1]] },
    ],
  },
  {
    id: "inst-4",
    name: "Skyline Event Center",
    type: "event",
    city: "Chicago",
    description: "Premier event venue with panoramic city views and versatile event spaces.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    rating: 4.9,
    buildings: [
      { id: "b7", name: "Main Venue", spaces: [spaces[5], spaces[6], spaces[0]] },
    ],
  },
  {
    id: "inst-5",
    name: "Pacific Cowork",
    type: "coworking",
    city: "Los Angeles",
    description: "Beach-side coworking with creative spaces and community events.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600",
    rating: 4.4,
    buildings: [
      { id: "b8", name: "Beach House", spaces: [spaces[3], spaces[1], spaces[4]] },
    ],
  },
  {
    id: "inst-6",
    name: "Riverside Conference Hotel",
    type: "hotel",
    city: "Austin",
    description: "Boutique hotel specializing in corporate retreats and team-building events.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    rating: 4.7,
    buildings: [
      { id: "b9", name: "Riverside Lodge", spaces: [spaces[7], spaces[0], spaces[5]] },
    ],
  },
];

export const bookings: Booking[] = [
  { id: "bk1", spaceName: "Conference Room A", institutionName: "Grand Azure Hotel", buildingName: "Main Tower", date: "2026-02-20", startTime: "09:00", endTime: "12:00", status: "confirmed", capacity: 20 },
  { id: "bk2", spaceName: "Hot Desk Area", institutionName: "The Hub Coworking", buildingName: "Innovation Center", date: "2026-02-22", startTime: "08:00", endTime: "18:00", status: "pending", capacity: 1 },
  { id: "bk3", spaceName: "Ballroom", institutionName: "Skyline Event Center", buildingName: "Main Venue", date: "2026-02-18", startTime: "14:00", endTime: "22:00", status: "cancelled", capacity: 200 },
  { id: "bk4", spaceName: "Lecture Hall 101", institutionName: "Metropolitan University", buildingName: "Science Building", date: "2026-03-01", startTime: "10:00", endTime: "13:00", status: "confirmed", capacity: 80 },
  { id: "bk5", spaceName: "Private Office Suite", institutionName: "Pacific Cowork", buildingName: "Beach House", date: "2026-02-25", startTime: "09:00", endTime: "17:00", status: "confirmed", capacity: 4 },
];

export const getInstitutionById = (id: string) => institutions.find((i) => i.id === id);

export const getSpaceById = (spaceId: string): { space: Space; building: Building; institution: Institution; campus?: Campus } | undefined => {
  for (const inst of institutions) {
    if (inst.campuses) {
      for (const campus of inst.campuses) {
        for (const building of campus.buildings) {
          const space = building.spaces.find((s) => s.id === spaceId);
          if (space) return { space, building, institution: inst, campus };
        }
      }
    }
    for (const building of inst.buildings) {
      const space = building.spaces.find((s) => s.id === spaceId);
      if (space) return { space, building, institution: inst };
    }
  }
  return undefined;
};

export const typeLabelMap: Record<InstitutionType, string> = {
  hotel: "Hotel",
  university: "University",
  coworking: "Coworking Space",
  event: "Event Venue",
};

export const typeBadgeClass: Record<InstitutionType, string> = {
  hotel: "badge-hotel",
  university: "badge-university",
  coworking: "badge-coworking",
  event: "badge-event",
};
