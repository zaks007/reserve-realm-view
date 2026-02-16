import { useParams, Link } from "react-router-dom";
import { MapPin, Star, Users, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getInstitutionById, typeLabelMap, typeBadgeClass } from "@/data/mockData";

const InstitutionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const institution = getInstitutionById(id || "");

  if (!institution) {
    return (
      <div className="container py-20 text-center">
        <p className="text-lg text-muted-foreground">Institution not found.</p>
      </div>
    );
  }

  const hasCampuses = institution.campuses && institution.campuses.length > 0;

  return (
    <div className="container py-4">
      <Breadcrumbs items={[
        { label: "Explore", to: "/institutions" },
        { label: institution.name },
      ]} />

      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden aspect-[16/9]">
            <img src={institution.image} alt={institution.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full mb-3 ${typeBadgeClass[institution.type]}`}>
            {typeLabelMap[institution.type]}
          </span>
          <h1 className="text-3xl font-bold mb-2">{institution.name}</h1>
          <p className="flex items-center gap-1.5 text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" /> {institution.city}
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <Star className="h-4 w-4 fill-accent text-accent" /> {institution.rating} rating
          </p>
          <p className="text-foreground/80">{institution.description}</p>
        </div>
      </div>

      {/* Campuses (University) */}
      {hasCampuses && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Campuses</h2>
          <div className="space-y-8">
            {institution.campuses!.map((campus) => (
              <div key={campus.id}>
                <h3 className="text-xl font-semibold mb-4 text-primary">{campus.name}</h3>
                {campus.buildings.map((building) => (
                  <div key={building.id} className="mb-6">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <DoorOpen className="h-5 w-5 text-muted-foreground" />
                      {building.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {building.spaces.map((space) => (
                        <SpaceCard
                          key={space.id}
                          space={space}
                          institutionId={institution.id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buildings (non-university) */}
      {!hasCampuses && institution.buildings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Spaces</h2>
          {institution.buildings.map((building) => (
            <div key={building.id} className="mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-muted-foreground" />
                {building.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {building.spaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    institutionId={institution.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline SpaceCard for this page
import type { Space } from "@/data/mockData";

const SpaceCard = ({ space, institutionId }: { space: Space; institutionId: string }) => (
  <div className="bg-card rounded-lg border overflow-hidden card-hover">
    <div className="aspect-[16/10] overflow-hidden">
      <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <h4 className="font-semibold mb-1">{space.name}</h4>
      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
        <Users className="h-3.5 w-3.5" /> Capacity: {space.capacity}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {space.features.slice(0, 3).map((f) => (
          <span key={f} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {f}
          </span>
        ))}
        {space.features.length > 3 && (
          <span className="text-xs text-muted-foreground">+{space.features.length - 3}</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-primary">${space.pricePerHour}/hr</span>
        <Button size="sm" asChild disabled={!space.available}>
          <Link to={`/spaces/${space.id}`}>
            {space.available ? "Book Now" : "Unavailable"}
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

export default InstitutionDetail;
