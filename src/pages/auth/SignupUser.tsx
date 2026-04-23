import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const SignupUser = () => {
  const { signupUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast({ title: "Fill in all fields", variant: "destructive" }); return; }
    const code = signupUser(email, name, password);
    toast({ title: "Verification code sent", description: `Demo code: ${code}` });
    navigate("/auth/verify");
  };

  return (
    <div className="container max-w-md py-12">
      <div className="bg-card border rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-1">Sign up as a User</h1>
        <p className="text-sm text-muted-foreground mb-6">Browse and book spaces — instant access.</p>
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Full name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1" /></div>
          <Button type="submit" className="w-full">Send verification code</Button>
        </form>
      </div>
    </div>
  );
};

export default SignupUser;
