export type InstitutionType = "hotel" | "university" | "event" | "sports";

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

const hotelRooms: Space[] = [
  { id: "hr1", name: "Standard Double Room", capacity: 2, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600", features: ["Queen Bed", "WiFi", "AC", "Private Bathroom", "TV"], pricePerHour: 25000, available: true },
  { id: "hr2", name: "Deluxe King Room", capacity: 2, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600", features: ["King Bed", "WiFi", "AC", "Balcony", "Mini Bar", "TV"], pricePerHour: 38000, available: true },
  { id: "hr3", name: "Twin Room", capacity: 2, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600", features: ["Two Single Beds", "WiFi", "AC", "TV"], pricePerHour: 22000, available: true },
  { id: "hr4", name: "Family Room", capacity: 4, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600", features: ["2 Queen Beds", "WiFi", "AC", "TV", "Extra Space"], pricePerHour: 45000, available: true },
  { id: "hr5", name: "Junior Suite", capacity: 2, image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600", features: ["King Bed", "Lounge Area", "WiFi", "AC", "Mini Bar"], pricePerHour: 55000, available: false },
];

const hotelFlats: Space[] = [
  { id: "hf1", name: "Studio Apartment", capacity: 2, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600", features: ["Kitchenette", "WiFi", "AC", "Workspace", "Smart TV"], pricePerHour: 32000, available: true },
  { id: "hf2", name: "One-Bedroom Flat", capacity: 3, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600", features: ["Full Kitchen", "Living Room", "WiFi", "AC", "Washer"], pricePerHour: 48000, available: true },
  { id: "hf3", name: "Two-Bedroom Flat", capacity: 5, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600", features: ["Full Kitchen", "Living Room", "2 Bathrooms", "WiFi", "Washer"], pricePerHour: 72000, available: true },
  { id: "hf4", name: "Penthouse Suite", capacity: 4, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600", features: ["Terrace", "Full Kitchen", "Jacuzzi", "WiFi", "Panoramic View"], pricePerHour: 120000, available: true },
];

const spaces: Space[] = [
  { id: "s1", name: "Conference Room A", capacity: 20, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600", features: ["Projector", "WiFi", "Whiteboard", "AC", "Video Conferencing"], pricePerHour: 12000, available: true },
  { id: "s2", name: "Meeting Room B", capacity: 8, image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600", features: ["WiFi", "Whiteboard", "AC"], pricePerHour: 6000, available: true },
  { id: "s3", name: "Lecture Hall 101", capacity: 120, image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600", features: ["Projector", "WiFi", "Microphone", "AC", "Recording"], pricePerHour: 15000, available: false },
  { id: "s4", name: "Seminar Room 305", capacity: 30, image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600", features: ["WiFi", "Projector", "Whiteboard"], pricePerHour: 7000, available: true },
  { id: "s5", name: "Faculty Boardroom", capacity: 14, image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600", features: ["WiFi", "AC", "Video Conferencing"], pricePerHour: 9000, available: true },
  { id: "s6", name: "Grand Ballroom", capacity: 300, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600", features: ["Stage", "Sound System", "Lighting", "AC", "Catering Area"], pricePerHour: 50000, available: true },
  { id: "s7", name: "Seminar Room 202", capacity: 25, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600", features: ["WiFi", "Projector", "Whiteboard", "AC"], pricePerHour: 8000, available: true },
  { id: "s8", name: "Executive Boardroom", capacity: 14, image: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600", features: ["Video Conferencing", "WiFi", "AC", "Catering"], pricePerHour: 15000, available: true },
  { id: "s9", name: "Computer Lab A", capacity: 40, image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600", features: ["WiFi", "PCs", "Projector", "AC"], pricePerHour: 10000, available: true },
  { id: "s10", name: "Workshop Studio", capacity: 20, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600", features: ["WiFi", "Projector", "Art Supplies", "Whiteboard"], pricePerHour: 7000, available: true },
];

const sportsSpaces: Space[] = [
  { id: "sp1", name: "Agrár Football Pitch", capacity: 22, image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600", features: ["Full-size grass pitch", "Floodlights", "Changing rooms", "Showers", "Parking"], pricePerHour: 9000, available: true },
  { id: "sp2", name: "G4 Football Pitch", capacity: 14, image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600", features: ["Artificial turf", "5-a-side", "Floodlights", "Changing rooms"], pricePerHour: 7500, available: true },
  { id: "sp3", name: "West Hostel Football Pitch", capacity: 18, image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600", features: ["Artificial turf", "7-a-side", "Floodlights", "Outdoor"], pricePerHour: 8000, available: true },
  { id: "sp4", name: "Main Basketball Court", capacity: 20, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600", features: ["Full court", "Indoor", "Changing rooms", "Scoreboard", "Spectator seating"], pricePerHour: 6500, available: true },
  { id: "sp5", name: "Indoor Training Court", capacity: 12, image: "https://images.unsplash.com/photo-1518614368389-d4f02c2c84e8?w=600", features: ["Half court", "Indoor", "Air conditioned", "Equipment included"], pricePerHour: 4500, available: true },
];

export const institutions: Institution[] = [
  {
    id: "inst-1",
    name: "Hotel Lycium Debrecen",
    type: "hotel",
    city: "Debrecen",
    description: "Modern 4-star hotel near the Great Forest with conference and event facilities.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Hunyadi_J%C3%A1nos_Stra%C3%9Fe_1-3%2C_2022_Debrecen.jpg/960px-Hunyadi_J%C3%A1nos_Stra%C3%9Fe_1-3%2C_2022_Debrecen.jpg",
    rating: 4.6,
    buildings: [
      { id: "b1", name: "Rooms", spaces: [hotelRooms[0], hotelRooms[1], hotelRooms[2], hotelRooms[3], hotelRooms[4]] },
      { id: "b2", name: "Flats & Suites", spaces: [hotelFlats[0], hotelFlats[1], hotelFlats[3]] },
    ],
  },
  {
    id: "inst-2",
    name: "University of Debrecen",
    type: "university",
    city: "Debrecen",
    description: "One of Hungary's largest universities with multiple campuses across the city.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/73/DebrecenDSCN3583.JPG",
    rating: 4.5,
    campuses: [
      {
        id: "c1",
        name: "Kassai Campus",
        buildings: [
          { id: "b3", name: "Faculty of Informatics", spaces: [spaces[2], spaces[8], spaces[6]] },
          { id: "b4", name: "Faculty of Engineering", spaces: [spaces[1], spaces[9]] },
        ],
      },
      {
        id: "c2",
        name: "Egyetem tér Campus",
        buildings: [
          { id: "b5", name: "Main Building", spaces: [spaces[0], spaces[6]] },
          { id: "b6", name: "Library & Study Center", spaces: [spaces[4], spaces[1]] },
        ],
      },
      {
        id: "c3",
        name: "Medical Campus",
        buildings: [
          { id: "b7", name: "Medical Faculty", spaces: [spaces[2], spaces[7]] },
        ],
      },
    ],
    buildings: [],
  },
  {
    id: "inst-3",
    name: "University Sports Facilities",
    type: "sports",
    city: "Debrecen",
    description: "Outdoor and indoor sports pitches operated by the University of Debrecen — open to students, staff and the public.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Debreceni_Nagyerd%C5%91%2C_sportk%C3%B6zpont_a_magasb%C3%B3l.jpg",
    rating: 4.6,
    buildings: [
      { id: "b8", name: "Football Pitches", spaces: [sportsSpaces[0], sportsSpaces[1], sportsSpaces[2]] },
    ],
  },
  {
    id: "inst-4",
    name: "Kölcsey Convention Centre",
    type: "event",
    city: "Debrecen",
    description: "Debrecen's premier event and conference venue for large-scale gatherings.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/K%C3%B6lcsey_K%C3%B6zpont_Sz%C5%91demeteren_2024-ben.jpg/960px-K%C3%B6lcsey_K%C3%B6zpont_Sz%C5%91demeteren_2024-ben.jpg",
    rating: 4.9,
    buildings: [
      { id: "b9", name: "Main Hall", spaces: [spaces[5], spaces[0], spaces[6]] },
      { id: "b10", name: "Side Pavilion", spaces: [spaces[9], spaces[1]] },
    ],
  },
  {
    id: "inst-5",
    name: "Aquaticum Thermal Hotel",
    type: "hotel",
    city: "Debrecen",
    description: "Spa and wellness hotel in the Great Forest with meeting rooms and event spaces.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Debreceni_Nagyerd%C5%91%2C_sportk%C3%B6zpont_a_magasb%C3%B3l.jpg",
    rating: 4.4,
    buildings: [
      { id: "b11", name: "Rooms", spaces: [hotelRooms[1], hotelRooms[3], hotelRooms[2]] },
      { id: "b12", name: "Flats & Apartments", spaces: [hotelFlats[1], hotelFlats[2], hotelFlats[3]] },
    ],
  },
  {
    id: "inst-6",
    name: "Debreceni Sportcentrum",
    type: "sports",
    city: "Debrecen",
    description: "Indoor sports complex in the heart of Debrecen offering basketball courts, training halls and equipment rental.",
    image: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?w=900",
    rating: 4.7,
    buildings: [
      { id: "b13", name: "Main Arena", spaces: [sportsSpaces[3], sportsSpaces[4]] },
    ],
  },
];

export const bookings: Booking[] = [
  { id: "bk1", spaceName: "Conference Room A", institutionName: "Hotel Lycium Debrecen", buildingName: "Main Building", date: "2026-02-20", startTime: "09:00", endTime: "12:00", status: "confirmed", capacity: 20 },
  { id: "bk2", spaceName: "Agrár Football Pitch", institutionName: "University Sports Facilities", buildingName: "Football Pitches", date: "2026-02-22", startTime: "18:00", endTime: "20:00", status: "pending", capacity: 22 },
  { id: "bk3", spaceName: "Grand Ballroom", institutionName: "Kölcsey Convention Centre", buildingName: "Main Hall", date: "2026-02-18", startTime: "14:00", endTime: "22:00", status: "cancelled", capacity: 200 },
  { id: "bk4", spaceName: "Lecture Hall 101", institutionName: "University of Debrecen", buildingName: "Faculty of Informatics", date: "2026-03-01", startTime: "10:00", endTime: "13:00", status: "confirmed", capacity: 80 },
  { id: "bk5", spaceName: "Main Basketball Court", institutionName: "Debreceni Sportcentrum", buildingName: "Main Arena", date: "2026-02-25", startTime: "17:00", endTime: "19:00", status: "confirmed", capacity: 20 },
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
  event: "Event Venue",
  sports: "Sports Facility",
};

export const typeBadgeClass: Record<InstitutionType, string> = {
  hotel: "badge-hotel",
  university: "badge-university",
  event: "badge-event",
  sports: "badge-sports",
};
