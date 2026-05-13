import { Link, useNavigate } from "react-router-dom";
import { Search, Building2, GraduationCap, MapPin, Calendar, Users, Trophy, Flower2, Home } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InstitutionCard from "@/components/InstitutionCard";
import { institutions, InstitutionType } from "@/data/mockData";
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

  const featured = institutions.slice(0, 3);

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

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Spaces" },
            { value: "15+", label: "Institutions" },
            { value: "2K+", label: "Bookings" },
            { value: "1", label: "City — Debrecen" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold mb-1">{s.value}</div>
              <div className="text-primary-foreground/70 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 ReserveHub. All rights reserved. — Thesis UI Prototype
        </div>
      </footer>
    </div>
  );
};

export default Index;
