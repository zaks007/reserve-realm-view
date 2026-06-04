import { Link, useNavigate } from "react-router-dom";
import { Search, Building2, GraduationCap, MapPin, Calendar, Users, Trophy, Flower2, Home } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InstitutionCard from "@/components/InstitutionCard";
import { institutions as baseInstitutions, InstitutionType } from "@/data/mockData";
import { useInstitutions } from "@/contexts/InstitutionsContext";
import heroBg from "@/assets/hero-bg.jpg";

const typeFilters: { type: InstitutionType | "all"; label: string; icon: React.ElementType }[] = [
  { type: "all", label: "All", icon: Search },
  { type: "hotel", label: "Hotels", icon: Building2 },
  { type: "university", label: "Universities", icon: GraduationCap },
  { type: "sports", label: "Sports", icon: Trophy },
  { type: "garden", label: "Gardens", icon: Flower2 },
  { type: "airbnb", label: "Airbnbs", icon: Home },
];

const Index = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<InstitutionType | "all">("all");
  const { institutions } = useInstitutions();

  // Featured: curated mix so the homepage showcases every booking type.
  // Order: hotel, university, sport, sport, garden, airbnb.
  const featuredIds = ["inst-1", "inst-2", "inst-3", "inst-9", "inst-7", "inst-8"];
  const featured = featuredIds
    .map((id) => institutions.find((i) => i.id === id))
    .filter((i): i is typeof baseInstitutions[number] => Boolean(i));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/institutions?q=${encodeURIComponent(search)}&type=${activeType}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[520px] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4 animate-fade-in">
            Book Any Space in Debrecen
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Find and reserve hotel rooms, lecture halls, sports pitches, and event venues across institutions in Debrecen.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-card rounded-xl p-3 shadow-xl max-w-4xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-3">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Search institutions in Debrecen..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Any date</span>
              </div>
              <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Any capacity</span>
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Type Filters */}
      <section className="container -mt-6 relative z-20">
        <div className="flex gap-2 justify-center flex-wrap">
          {typeFilters.map((f) => (
            <button
              key={f.type}
              onClick={() => setActiveType(f.type)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeType === f.type
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-muted-foreground border hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Institutions</h2>
            <p className="text-muted-foreground mt-1">Top-rated spaces for your next booking</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/institutions">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60 mb-2">Built in Debrecen</p>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                One reservation system for every kind of space in the city.
              </h3>
              <p className="text-primary-foreground/75 text-sm leading-relaxed">
                From a seminar room at UD to a weekend at Hotel Divinus, a turf pitch for Tuesday night
                football or a raised bed in the community garden — bookings, approvals and pricing all
                in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:col-span-2 md:grid-cols-4">
              {[
                { value: "9", label: "Institutions live" },
                { value: "50+", label: "Bookable spaces" },
                { value: "4", label: "UD campuses" },
                { value: "HUF", label: "Local pricing" },
              ].map((s) => (
                <div key={s.label} className="border-l border-primary-foreground/20 pl-4">
                  <div className="text-3xl md:text-4xl font-bold leading-none mb-2">{s.value}</div>
                  <div className="text-primary-foreground/65 text-xs uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <span className="font-serif text-xl font-bold tracking-tight">ReserveHub</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground border px-1.5 py-0.5 rounded">
                Debrecen
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              A single booking platform for hotels, the University of Debrecen, sports facilities,
              community gardens and Airbnb stays across the city.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-3">Explore</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/institutions?type=hotel" className="hover:text-foreground">Hotels</Link></li>
              <li><Link to="/institutions?type=university" className="hover:text-foreground">University</Link></li>
              <li><Link to="/institutions?type=sports" className="hover:text-foreground">Sports</Link></li>
              <li><Link to="/institutions?type=garden" className="hover:text-foreground">Gardens</Link></li>
              <li><Link to="/institutions?type=airbnb" className="hover:text-foreground">Airbnb</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Account</p>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/auth/login" className="hover:text-foreground">Log in</Link></li>
              <li><Link to="/auth/signup" className="hover:text-foreground">Create account</Link></li>
              <li><Link to="/my-bookings" className="hover:text-foreground">My bookings</Link></li>
              <li><Link to="/auth/signup/institution" className="hover:text-foreground">List your venue</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© 2026 ReserveHub · A thesis project by Zakaria Umar · University of Debrecen</p>
            <p className="flex items-center gap-3">
              <span>Made in Debrecen 🇭🇺</span>
              <span className="hidden md:inline">·</span>
              <span>UI prototype — data is illustrative</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
