import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Step = "email" | "code" | "password";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) { toast({ title: "Enter your email", variant: "destructive" }); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setBusy(false);
    if (error) { toast({ title: "Could not send code", description: "Check the email is registered and try again.", variant: "destructive" }); return; }
    toast({ title: "Code sent", description: `We sent a 6-digit code to ${email}.` });
    setStep("code");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code.trim(), type: "email" });
    setBusy(false);
    if (error || !data.session) { toast({ title: "Invalid or expired code", variant: "destructive" }); return; }
    setStep("password");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { toast({ title: "Password must be at least 6 characters", variant: "destructive" }); return; }
    if (pw !== pw2) { toast({ title: "Passwords do not match", variant: "destructive" }); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { setBusy(false); toast({ title: "Could not update password", description: error.message, variant: "destructive" }); return; }
    await supabase.auth.signOut();
    setBusy(false);
    toast({ title: "Password updated", description: "Sign in with your new password." });
    navigate("/");
  };

  return (
    <div className="container max-w-md py-12">
      <div className="bg-card border rounded-xl p-8">
        <div className="h-14 w-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          {step === "password" ? <KeyRound className="h-7 w-7" /> : <Mail className="h-7 w-7" />}
        </div>

        {step === "email" && (
          <>
            <h1 className="text-2xl font-bold mb-1 text-center">Forgot password</h1>
            <p className="text-sm text-muted-foreground mb-6 text-center">Enter your email and we'll send you a 6-digit code.</p>
            <form onSubmit={sendCode} className="space-y-4">
              <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" placeholder="you@example.com" /></div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Sending…" : "Send code"}</Button>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <h1 className="text-2xl font-bold mb-1 text-center">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-6 text-center">Enter the code sent to <span className="font-medium text-foreground">{email}</span></p>
            <form onSubmit={verify} className="space-y-4">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>{[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={code.length !== 6 || busy}>{busy ? "Verifying…" : "Verify"}</Button>
              <button type="button" onClick={() => sendCode()} className="w-full text-xs text-primary">Resend code</button>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="text-2xl font-bold mb-1 text-center">Set a new password</h1>
            <p className="text-sm text-muted-foreground mb-6 text-center">Choose a new password for {email}.</p>
            <form onSubmit={save} className="space-y-4">
              <div><Label>New password</Label><Input type="password" value={pw} onChange={e => setPw(e.target.value)} className="mt-1" /></div>
              <div><Label>Confirm password</Label><Input type="password" value={pw2} onChange={e => setPw2(e.target.value)} className="mt-1" /></div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving…" : "Update password"}</Button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/auth/login" className="text-primary font-medium">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
