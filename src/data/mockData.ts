export type InstitutionType = "hotel" | "university" | "sports" | "garden" | "airbnb";

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

const gardenPlots: Space[] = [
  { id: "g1", name: "Plot A1 — Raised Bed", capacity: 1, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600", features: ["Raised Bed", "Water Access", "Tool Shed", "Composting"], pricePerHour: 500, available: true },
  { id: "g2", name: "Plot A2 — Herb Garden", capacity: 1, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600", features: ["Herb Section", "Water Access", "Sunlit"], pricePerHour: 400, available: true },
  { id: "g3", name: "Plot B1 — Large Family Plot", capacity: 4, image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600", features: ["Large Area", "Water Access", "Tool Shed", "Greenhouse Access", "Composting"], pricePerHour: 800, available: true },
  { id: "g4", name: "Plot B2 — Starter Plot", capacity: 1, image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600", features: ["Small Area", "Water Access", "Beginner Friendly"], pricePerHour: 300, available: true },
  { id: "g5", name: "Plot C1 — Flower Garden", capacity: 2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600", features: ["Flower Beds", "Water Access", "Decorative Area"], pricePerHour: 450, available: false },
  { id: "g6", name: "Community Greenhouse", capacity: 6, image: "https://images.unsplash.com/photo-1585255318859-f5c15f4cffe9?w=600", features: ["Heated", "Water System", "Seedling Trays", "Year-Round"], pricePerHour: 1200, available: true },
];

const airbnbListings: Space[] = [
  { id: "ab1", name: "Cozy Loft near Nagytemplom", capacity: 2, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600", features: ["WiFi", "Kitchen", "Self Check-in", "City View"], pricePerHour: 18000, available: true },
  { id: "ab2", name: "Modern Apartment in Downtown", capacity: 4, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600", features: ["WiFi", "Full Kitchen", "Washer", "Workspace", "Netflix"], pricePerHour: 28000, available: true },
  { id: "ab3", name: "Charming Studio by the Park", capacity: 2, image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600", features: ["WiFi", "Kitchenette", "Garden Access", "Parking"], pricePerHour: 16000, available: true },
  { id: "ab4", name: "Family House with Garden", capacity: 6, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600", features: ["WiFi", "Full Kitchen", "Garden", "BBQ", "Parking", "Pet Friendly"], pricePerHour: 45000, available: true },
  { id: "ab5", name: "Stylish Flat near University", capacity: 3, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600", features: ["WiFi", "Kitchen", "Workspace", "Washer"], pricePerHour: 22000, available: false },
  { id: "ab6", name: "Luxury Penthouse Downtown", capacity: 4, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600", features: ["Rooftop Terrace", "Full Kitchen", "WiFi", "Premium View"], pricePerHour: 65000, available: true },
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
  {
    id: "inst-7",
    name: "Debreceni Közösségi Kert",
    type: "garden",
    city: "Debrecen",
    description: "Community garden in Debrecen where residents can rent garden plots for growing vegetables, herbs, and flowers. Includes shared tools and a greenhouse.",
    image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600",
    rating: 4.8,
    buildings: [
      { id: "b14", name: "Section A — Vegetable Plots", spaces: [gardenPlots[0], gardenPlots[2], gardenPlots[3]] },
      { id: "b15", name: "Section B — Herb & Flower Gardens", spaces: [gardenPlots[1], gardenPlots[4]] },
      { id: "b16", name: "Greenhouse & Facilities", spaces: [gardenPlots[5]] },
    ],
  },
  {
    id: "inst-8",
    name: "Debrecen Stays — Airbnb Collection",
    type: "airbnb",
    city: "Debrecen",
    description: "Curated collection of Airbnb listings across Debrecen — from cozy lofts in the city center to family homes near the Great Forest.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
    rating: 4.7,
    buildings: [
      { id: "b17", name: "Downtown Listings", spaces: [airbnbListings[0], airbnbListings[1], airbnbListings[5]] },
      { id: "b18", name: "Near University", spaces: [airbnbListings[2], airbnbListings[4]] },
      { id: "b19", name: "Family Homes", spaces: [airbnbListings[3]] },
    ],
  },
];

export const bookings: Booking[] = [
  { id: "bk1", spaceName: "Conference Room A", institutionName: "Hotel Lycium Debrecen", buildingName: "Main Building", date: "2026-02-20", startTime: "09:00", endTime: "12:00", status: "confirmed", capacity: 20 },
  { id: "bk2", spaceName: "Agrár Football Pitch", institutionName: "University Sports Facilities", buildingName: "Football Pitches", date: "2026-02-22", startTime: "18:00", endTime: "20:00", status: "pending", capacity: 22 },
  { id: "bk3", spaceName: "Plot B1 — Large Family Plot", institutionName: "Debreceni Közösségi Kert", buildingName: "Section A — Vegetable Plots", date: "2026-02-18", startTime: "08:00", endTime: "11:00", status: "cancelled", capacity: 4 },
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
  sports: "Sports Facility",
  garden: "Community Garden",
  airbnb: "Airbnb",
};

export const typeBadgeClass: Record<InstitutionType, string> = {
  hotel: "badge-hotel",
  university: "badge-university",
  sports: "badge-sports",
  garden: "badge-garden",
  airbnb: "badge-airbnb",
};
