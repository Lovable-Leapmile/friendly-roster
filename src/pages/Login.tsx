import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api, User } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, ArrowLeft, Shield } from "lucide-react";
import qikpodLogo from "@/assets/qikpod-logo.avif";

const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(10, { message: "Please enter a valid 10-digit phone number" })
    .max(10, { message: "Phone number must be 10 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
});

type LoginStep = "phone" | "otp";

interface UserWithOtp extends User {
  user_phone?: string;
  user_otp?: string;
  user_name?: string;
}

const Login: React.FC = () => {
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [foundUser, setFoundUser] = useState<UserWithOtp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
    staleTime: 5 * 60 * 1000,
  });

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = phoneSchema.safeParse({ phone });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = users.find((u: UserWithOtp) => u.user_phone === phone);

    if (user) {
      setFoundUser(user);
      setStep("otp");
      toast({
        title: "OTP Sent!",
        description: `An OTP has been sent to ${phone.slice(0, 4)}****${phone.slice(-2)}`,
      });
    } else {
      setError("Phone number not registered. Please contact support.");
    }

    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (foundUser && otp === foundUser.user_otp) {
      login({
        id: foundUser.id,
        name: foundUser.user_name || foundUser.name || "User",
        email: (foundUser as any).user_email || foundUser.email || "",
        phone: foundUser.user_phone,
      });
      toast({
        title: "Welcome!",
        description: `Logged in as ${foundUser.user_name || foundUser.name}`,
      });
      navigate("/");
    } else {
      setError("Invalid OTP. Please try again.");
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    setStep("phone");
    setOtp("");
    setError("");
    setFoundUser(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/50 p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card shadow-elevated mb-4 overflow-hidden">
            <img src={qikpodLogo} alt="Qikpod" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">QikPod</h1>
          <p className="text-muted-foreground mt-2">Pod Reservation System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-elevated border-border/50">
          {step === "phone" ? (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Welcome</CardTitle>
                <CardDescription>Enter your phone number to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className={`pl-12 ${error ? "border-destructive" : ""}`}
                        maxLength={10}
                      />
                    </div>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground"
                    disabled={isLoading || usersLoading || phone.length !== 10}
                  >
                    {isLoading || usersLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {usersLoading ? "Loading..." : "Sending OTP..."}
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-4">
                <button
                  onClick={handleBack}
                  className="absolute left-4 top-4 p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <div className="flex justify-center mb-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">Verify OTP</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to
                  <br />
                  <span className="font-medium text-foreground">
                    +91 {phone.slice(0, 4)}****{phone.slice(-2)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  {/* OTP Field */}
                  <div className="flex flex-col items-center space-y-4">
                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>

                  {/* Resend OTP */}
                  <p className="text-center text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        toast({
                          title: "OTP Resent!",
                          description: "A new OTP has been sent to your phone.",
                        });
                      }}
                      className="text-primary font-medium hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">Smart Pod Management System</p>
      </div>
    </div>
  );
};

export default Login;
