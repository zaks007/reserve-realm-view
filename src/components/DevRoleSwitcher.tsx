import { useState } from "react";
import { Beaker, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth, UserRole, roleLabel } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const ROLES: UserRole[] = ["guest", "user", "student", "teacher", "institution_pending", "institution_admin", "campus_admin", "super_admin"];

const DevRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[60] font-sans">
      <div className="bg-card border rounded-xl shadow-2xl overflow-hidden w-64">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-primary text-primary-foreground"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Beaker className="h-4 w-4" /> Dev Role Switcher
          </span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
        {open && (
          <div className="p-3 space-y-1.5">
            <p className="text-[11px] text-muted-foreground px-1 mb-1">
              Current: <span className="font-semibold text-foreground">{roleLabel[user?.role || "guest"]}</span>
            </p>
            {ROLES.map(r => (
              <Button
                key={r}
                variant={(user?.role || "guest") === r ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs h-8"
                onClick={() => switchRole(r)}
              >
                {roleLabel[r]}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevRoleSwitcher;
