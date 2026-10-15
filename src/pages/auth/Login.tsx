import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast({ title: "Enter your email and password", variant: "destructive" }); return; }
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) {
      toast({ title: "Welcome back!" });
      navigate("/");
    } else {
      toast({ title: "Wrong email or password", variant: "destructive" });
    }
  };

  return (
    <div className="container max-w-md py-12">
      <div className="bg-card border rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in with your email and password.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label>Password</Label>
              <Link to="/auth/forgot-password" className="text-xs text-primary font-medium">Forgot password?</Link>
            </div>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          No account? <Link to="/auth/signup" className="text-primary font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
