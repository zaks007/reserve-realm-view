import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Trash2, Star, Plus, User as UserIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { usePaymentMethods, detectBrand, CardBrand } from "@/contexts/PaymentMethodsContext";
import { toast } from "@/hooks/use-toast";

const brandLabel: Record<CardBrand, string> = {
  visa: "Visa", mastercard: "Mastercard", amex: "American Express", unknown: "Card",
};

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

const AccountSettings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { methods, addMethod, removeMethod, setDefault } = usePaymentMethods();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // Card dialog state
  const [open, setOpen] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [holder, setHolder] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [makeDefault, setMakeDefault] = useState(true);

  if (!user) {
    return (
      <div className="container max-w-md py-16 text-center">
        <p className="text-muted-foreground mb-4">You need to be logged in to view account settings.</p>
        <Button onClick={() => navigate("/auth/login")}>Log in</Button>
      </div>
    );
  }

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { toast({ title: "Name and email are required", variant: "destructive" }); return; }
    updateProfile({ name: name.trim(), email: email.trim() });
    toast({ title: "Profile updated" });
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" }); return; }
    if (pw !== pw2) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    setPw(""); setPw2("");
    toast({ title: "Password updated", description: "Demo only — not stored in this prototype." });
  };

  const submitCard = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cardNum.replace(/\s/g, "");
    if (digits.length < 13 || digits.length > 19) { toast({ title: "Card number looks invalid", variant: "destructive" }); return; }
    if (!holder.trim()) { toast({ title: "Cardholder name required", variant: "destructive" }); return; }
    if (!/^\d{2}$/.test(expMonth) || +expMonth < 1 || +expMonth > 12) { toast({ title: "Expiry month must be 01–12", variant: "destructive" }); return; }
    if (!/^\d{2}$/.test(expYear)) { toast({ title: "Expiry year must be YY (e.g. 28)", variant: "destructive" }); return; }
    if (!/^\d{3,4}$/.test(cvc)) { toast({ title: "CVC must be 3–4 digits", variant: "destructive" }); return; }

    addMethod({
      cardholder: holder.trim(),
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      expMonth, expYear, cvc,
      isDefault: makeDefault,
    });
    toast({ title: "Card saved", description: "This is a fake payment method for the demo." });
    setCardNum(""); setHolder(""); setExpMonth(""); setExpYear(""); setCvc(""); setMakeDefault(true);
    setOpen(false);
  };

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-1">Account settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your profile and saved payment methods.</p>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile"><UserIcon className="h-4 w-4 mr-1.5" />Profile</TabsTrigger>
          <TabsTrigger value="payment"><CreditCard className="h-4 w-4 mr-1.5" />Payment methods</TabsTrigger>
          <TabsTrigger value="security"><Lock className="h-4 w-4 mr-1.5" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={saveProfile} className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Your details</h2>
            <div><Label>Full name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" /></div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="outline" onClick={() => { logout(); navigate("/"); }}>Log out</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Saved cards</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add card</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a payment method</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitCard} className="space-y-3">
                  <div>
                    <Label>Card number</Label>
                    <Input value={cardNum} onChange={e => setCardNum(formatCardNumber(e.target.value))} placeholder="4242 4242 4242 4242" className="mt-1 font-mono" />
                  </div>
                  <div>
                    <Label>Cardholder name</Label>
                    <Input value={holder} onChange={e => setHolder(e.target.value)} placeholder="As shown on card" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><Label>MM</Label><Input value={expMonth} maxLength={2} onChange={e => setExpMonth(e.target.value.replace(/\D/g, ""))} placeholder="12" className="mt-1 font-mono" /></div>
                    <div><Label>YY</Label><Input value={expYear} maxLength={2} onChange={e => setExpYear(e.target.value.replace(/\D/g, ""))} placeholder="28" className="mt-1 font-mono" /></div>
                    <div><Label>CVC</Label><Input value={cvc} maxLength={4} onChange={e => setCvc(e.target.value.replace(/\D/g, ""))} placeholder="123" className="mt-1 font-mono" /></div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={makeDefault} onChange={e => setMakeDefault(e.target.checked)} />
                    Set as default payment method
                  </label>
                  <p className="text-xs text-muted-foreground">
                    This is a prototype — cards are stored only in your browser and no real charge is made.
                  </p>
                  <DialogFooter>
                    <Button type="submit">Save card</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {methods.length === 0 ? (
            <div className="bg-card border border-dashed rounded-xl p-10 text-center">
              <CreditCard className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No saved payment methods yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {methods.map(m => (
                <div key={m.id} className="bg-card border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 rounded-md bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-[10px] font-bold flex items-center justify-center uppercase tracking-wider">
                      {brandLabel[m.brand].slice(0, 4)}
                    </div>
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        {brandLabel[m.brand]} •••• {m.last4}
                        {m.isDefault && <Badge variant="secondary" className="text-[10px]">Default</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.cardholder} · exp {m.expMonth}/{m.expYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!m.isDefault && (
                      <Button size="sm" variant="ghost" onClick={() => setDefault(m.id)}>
                        <Star className="h-4 w-4 mr-1" />Make default
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeMethod(m.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="security">
          <form onSubmit={savePassword} className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Change password</h2>
            <div><Label>New password</Label><Input type="password" value={pw} onChange={e => setPw(e.target.value)} className="mt-1" /></div>
            <div><Label>Confirm new password</Label><Input type="password" value={pw2} onChange={e => setPw2(e.target.value)} className="mt-1" /></div>
            <Button type="submit">Update password</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
