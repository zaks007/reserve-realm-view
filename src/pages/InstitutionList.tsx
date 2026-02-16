import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InstitutionCard from "@/components/InstitutionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { institutions, InstitutionType, typeLabelMap } from "@/data/mockData";

const types: (InstitutionType | "all")[] = ["all", "hotel", "university", "coworking", "event"];

const InstitutionList = () => {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialType = (searchParams.get("type") as InstitutionType | "all") || "all";

  const [query, setQuery] = useState(initialQ);
  const [typeFilter, setTypeFilter] = useState<InstitutionType | "all">(initialType);

  const filtered = useMemo(() => {
    return institutions.filter((inst) => {
      const matchType = typeFilter === "all" || inst.type === typeFilter;
      const matchQuery =
        !query ||
        inst.name.toLowerCase().includes(query.toLowerCase()) ||
        inst.city.toLowerCase().includes(query.toLowerCase());
      return matchType && matchQuery;
    });
  }, [query, typeFilter]);

  return (
    <div className="container py-4">
      <Breadcrumbs items={[{ label: "Explore Institutions" }]} />

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex items-center gap-2 bg-card border rounded-lg px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search institutions or cities..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <Button
              key={t}
              variant={typeFilter === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(t)}
            >
              {t === "all" ? "All" : typeLabelMap[t]}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length} institution{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => (
          <InstitutionCard key={inst.id} institution={inst} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No institutions found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default InstitutionList;
