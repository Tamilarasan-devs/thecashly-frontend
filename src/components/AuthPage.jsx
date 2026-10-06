import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Lock,
  User,
  Phone,
  Ticket,
  ArrowRight,
  Gamepad2,
  Coins,
  Trophy,
  Zap,
} from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    referralCode: ""
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post('/auth/login', loginData);
      localStorage.setItem("user", JSON.stringify(response.data));
      // Save token immediately so axios intercepts it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      navigate("/home");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post('/auth/register', signupData);
      localStorage.setItem("user", JSON.stringify(response.data));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      navigate("/home");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBF5] font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      <style>{`
        @keyframes drift {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-620px) translateX(30px) rotate(160deg); opacity: 0; }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1) translate(0,0); }
          50% { transform: scale(1.15) translate(20px,-10px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shine {
          0% { transform: translateX(-120%) skewX(-15deg); }
          100% { transform: translateX(220%) skewX(-15deg); }
        }
        .coin { animation: drift linear infinite; }
        .orb-a { animation: orb-pulse 9s ease-in-out infinite; }
        .orb-b { animation: orb-pulse 11s ease-in-out infinite reverse; }
        .cta-gradient {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .shine::after {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          animation: shine 3.2s ease-in-out infinite;
        }
      `}</style>

      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-14 bg-gradient-to-br from-[#1447E6] via-[#1E40AF] to-[#0F2C8F]">
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-a absolute -top-24 -left-20 w-[420px] h-[420px] rounded-full bg-red-500/30 blur-[110px]" />
          <div className="orb-b absolute top-1/3 -right-28 w-[380px] h-[380px] rounded-full bg-amber-400/30 blur-[110px]" />
          <div className="absolute bottom-0 left-1/4 w-[320px] h-[320px] rounded-full bg-blue-400/25 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          {/* drifting coins */}
          {[
            { left: "8%", size: 16, delay: "0s", dur: "9s" },
            { left: "22%", size: 10, delay: "2.5s", dur: "12s" },
            { left: "38%", size: 14, delay: "5s", dur: "10s" },
            { left: "63%", size: 12, delay: "1.2s", dur: "11s" },
            { left: "80%", size: 18, delay: "4s", dur: "13s" },
            { left: "92%", size: 10, delay: "7s", dur: "9.5s" },
          ].map((c, i) => (
            <span
              key={i}
              className="coin absolute bottom-0 rounded-full"
              style={{
                left: c.left,
                width: c.size,
                height: c.size,
                animationDelay: c.delay,
                animationDuration: c.dur,
                background:
                  "radial-gradient(circle at 35% 30%, #FEF3C7, #F59E0B 70%)",
                boxShadow: "0 0 10px rgba(245,158,11,0.7)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-md opacity-70 rounded-xl" />
              <div className="relative bg-gradient-to-br from-amber-400 to-red-500 p-2.5 rounded-xl shadow-lg">
                <Coins className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              THE<span className="text-amber-300">CASHLY</span>
            </span>
          </div>

          <div className="space-y-5 max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
              </span>
              <span className="text-xs font-semibold text-white tracking-wide">
                ₹18.2L paid out this week
              </span>
            </div>

            <h1 className="text-[2.75rem] font-bold leading-[1.08] text-white">
              Play sharp.
              <br />
              Cash out{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-red-300 bg-clip-text text-transparent">
                real money.
              </span>
            </h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Skill-based games, live leaderboards, and instant withdrawals —
              built for players who play to win.
            </p>
          </div>

          <div className="mt-14 space-y-3">
            {[
              {
                icon: Gamepad2,
                title: "50+ live game rooms",
                desc: "Casual to competitive, always a table open.",
                grad: "from-red-500 to-rose-600",
              },
              {
                icon: Trophy,
                title: "Ranked leaderboards",
                desc: "Climb weekly ranks and win prize pools.",
                grad: "from-amber-400 to-yellow-500",
              },
              {
                icon: Zap,
                title: "Instant withdrawals",
                desc: "Winnings hit your account in minutes.",
                grad: "from-blue-400 to-sky-500",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 bg-white/10 hover:bg-white/[0.18] backdrop-blur-md p-3.5 rounded-2xl border border-white/20 hover:border-white/35 transition-all duration-300"
              >
                <div
                  className={`bg-gradient-to-br ${f.grad} p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0`}
                >
                  <f.icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-white leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-blue-100/90 text-[13px] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-200/80 text-xs">
          18+ only. Play responsibly.
        </p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-[54%] flex flex-col items-center justify-center p-4 sm:p-12 relative lg:bg-[#FDFBF5] min-h-screen lg:min-h-0 pt-8 sm:pt-12">
        {/* Desktop-only radial gradient */}
        <div
          className="absolute inset-0 opacity-70 pointer-events-none hidden lg:block"
          style={{
            background:
              "radial-gradient(600px circle at 85% 8%, rgba(245,158,11,0.10), transparent 60%), radial-gradient(500px circle at 5% 95%, rgba(37,99,235,0.08), transparent 60%)",
          }}
        />

        {/* Mobile-only Premium Background Header */}
        <div className="absolute top-0 left-0 w-full h-[340px] bg-gradient-to-br from-[#1447E6] via-[#1E40AF] to-[#0F2C8F] lg:hidden rounded-b-[2.5rem] shadow-xl overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/30 rounded-full blur-2xl"></div>
          <div className="absolute top-20 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        
        <div className="w-full max-w-[420px] relative z-10 flex flex-col">
          
          {/* Mobile Premium Logo & Title */}
          <div className="lg:hidden flex flex-col items-center mb-6 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 blur-sm opacity-60 rounded-xl" />
                <div className="relative bg-gradient-to-br from-amber-400 to-red-500 p-2 rounded-xl shadow-md">
                  <Coins className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                THE<span className="text-amber-300">CASHLY</span>
              </span>
            </div>
            <h1 className="text-white text-xl font-bold leading-tight text-center drop-shadow-sm px-4">
              Play sharp. Win <span className="text-amber-300">real cash.</span>
            </h1>
          </div>

          <div className="mb-6 lg:mb-8 text-center lg:text-left bg-white/90 lg:bg-transparent p-5 lg:p-0 rounded-3xl lg:rounded-none shadow-sm lg:shadow-none backdrop-blur-md lg:backdrop-blur-none border border-white/50 lg:border-none">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
              {activeTab === "login" ? "Welcome back, player" : "Join the table"}
            </h2>
            <p className="text-slate-500 text-sm">
              {activeTab === "login"
                ? "Sign in to jump back into your games"
                : "Create an account and claim your first bonus"}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold text-center shadow-sm">
              {errorMsg}
            </div>
          )}
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="relative grid w-full grid-cols-2 mb-7 h-14 bg-slate-100 border border-slate-200/60 rounded-[1.25rem] p-1.5 shadow-inner">
              <TabsTrigger
                value="login"
                className="rounded-xl text-[15px] font-semibold text-slate-500 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/30 transition-all duration-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-xl text-[15px] font-semibold text-slate-500 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/30 transition-all duration-300"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="login"
              className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="bg-white rounded-3xl border border-slate-100 p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[500px] flex flex-col">
                <form onSubmit={handleLoginSubmit} className="h-full flex flex-col">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="identifier"
                        className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                      >
                        Username or mobile
                      </Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <Input
                          id="identifier"
                          placeholder="john_doe or 9876543210"
                          className="pl-12 h-[54px] bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[4px] focus-visible:ring-blue-500/15 focus-visible:border-blue-500 focus-visible:bg-white rounded-2xl transition-all duration-300 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                          required
                          value={loginData.identifier}
                          onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <Label
                          htmlFor="password"
                          className="text-[11px] font-bold text-slate-400 uppercase tracking-wider"
                        >
                          Password
                        </Label>
                        <a
                          href="#"
                          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                        >
                          Forgot?
                        </a>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-12 h-[54px] bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[4px] focus-visible:ring-blue-500/15 focus-visible:border-blue-500 focus-visible:bg-white rounded-2xl transition-all duration-300 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="shine relative overflow-hidden cta-gradient w-full bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 hover:opacity-95 text-white shadow-xl shadow-blue-600/20 mt-auto rounded-2xl h-[54px] text-base font-semibold transition-all duration-300 group border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In & Play"}
                    {!isLoading && (
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent
              value="signup"
              className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="bg-white rounded-3xl border border-slate-100 p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[500px]">
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="username"
                      className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >
                      Username
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 group-hover:text-red-400 transition-colors" />
                      </div>
                      <Input
                        id="username"
                        placeholder="Pick a username"
                        className="pl-12 h-[52px] bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[4px] focus-visible:ring-red-500/15 focus-visible:border-red-500 focus-visible:bg-white rounded-2xl transition-all duration-300 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                        required
                        value={signupData.username}
                        onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="mobile"
                      className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >
                      Mobile number
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 group-hover:text-red-400 transition-colors" />
                      </div>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="pl-12 h-[52px] bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[4px] focus-visible:ring-red-500/15 focus-visible:border-red-500 focus-visible:bg-white rounded-2xl transition-all duration-300 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                        required
                        pattern="[0-9]{10}"
                        value={signupData.mobileNumber}
                        onChange={(e) => setSignupData({...signupData, mobileNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="reg-password"
                        className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                      >
                        Password
                      </Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-red-500 group-hover:text-red-400 transition-colors" />
                        </div>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-[52px] bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[4px] focus-visible:ring-red-500/15 focus-visible:border-red-500 focus-visible:bg-white rounded-2xl transition-all duration-300 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                          required
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="confirm-password"
                        className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                      >
                        Confirm
                      </Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-red-500 group-hover:text-red-400 transition-colors" />
                        </div>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-[52px] bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[4px] focus-visible:ring-red-500/15 focus-visible:border-red-500 focus-visible:bg-white rounded-2xl transition-all duration-300 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                          required
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="referral"
                      className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >
                      Referral code <span className="lowercase normal-case font-medium text-slate-300">(optional)</span>
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Ticket className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 group-hover:text-red-400 transition-colors" />
                      </div>
                      <Input
                        id="referral"
                        placeholder="Enter referral code"
                        className="pl-12 h-[52px] bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[4px] focus-visible:ring-red-500/15 focus-visible:border-red-500 focus-visible:bg-white rounded-2xl transition-all duration-300 font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                        value={signupData.referralCode}
                        onChange={(e) => setSignupData({...signupData, referralCode: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="shine relative overflow-hidden cta-gradient w-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:opacity-95 text-white shadow-xl shadow-red-500/20 mt-3 rounded-2xl h-[52px] text-[15px] font-semibold transition-all duration-300 group border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                    {!isLoading && (
                      <ArrowRight className="ml-2 h-4.5 w-4.5 group-hover:translate-x-1.5 transition-transform" />
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center text-slate-400 text-xs mt-7 font-medium">
            256-bit encrypted &middot; RNG-audited games &middot; 18+ only
          </p>
        </div>
      </div>
    </div>
  );
}