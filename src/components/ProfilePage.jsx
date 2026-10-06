
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CreditCard,
  Users,
  History,
  KeyRound,
  ShieldCheck,
  Wallet,
  Headset,
  LogOut,
  ArrowUpRight,
  Crown,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import BottomBar from "./BottomBar";

/* -------------------------------------------------------
   STAT CARD
------------------------------------------------------- */

const StatCard = ({ title, value, icon: Icon, iconClass }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 lg:text-2xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h - 11 w - 11 items - center justify - center rounded - xl ${ iconClass } `}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-400">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
        <span>Account overview</span>
      </div>

      <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

/* -------------------------------------------------------
   ACTION ITEM
------------------------------------------------------- */

const ActionItem = ({
  icon: Icon,
  title,
  description,
  iconClass,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5"
    >
      <div
        className={`flex h - 12 w - 12 shrink - 0 items - center justify - center rounded - xl ${ iconClass } `}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-800 lg:text-[15px]">
          {title}
        </h3>

        <p className="mt-0.5 truncate text-xs text-slate-400">
          {description}
        </p>
      </div>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-all group-hover:bg-blue-50">
        <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
      </div>
    </button>
  );
};

/* -------------------------------------------------------
   PROFILE PAGE
------------------------------------------------------- */

export default function ProfilePage() {
  const navigate = useNavigate();

  const userData =
    JSON.parse(localStorage.getItem("user")) || {
      mobileNumber: "User",
    };

  const userName =
    userData.mobileNumber || userData.username || userData.name || "User";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans text-slate-800">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-[#0F2C8F]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1447E6] via-[#123AA9] to-[#0B1F67]" />

        {/* Decorative circles */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-32 pt-8 lg:px-8 lg:pb-36 lg:pt-12">
          {/* Top navigation */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                Account
              </p>

              <h1 className="mt-1 text-xl font-extrabold text-white lg:text-2xl">
                My Profile
              </h1>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* User + wallet */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* User information */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-[#1447E6] shadow-xl lg:h-20 lg:w-20 lg:text-2xl">
                {String(userName).charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-blue-200">
                  Welcome back
                </p>

                <h2 className="text-xl font-extrabold text-white lg:text-2xl">
                  {userName}
                </h2>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1.5">
                  <Crown className="h-3.5 w-3.5 text-amber-300" />

                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-100">
                    VIP 0
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet summary */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="min-w-[145px] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl lg:min-w-[180px] lg:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  Recharge
                </p>

                <p className="mt-2 text-xl font-extrabold text-white lg:text-2xl">
                  ₹0.00
                </p>

                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-blue-200">
                  <ArrowUpRight className="h-3 w-3" />
                  Add funds
                </div>
              </div>

              <div className="min-w-[145px] rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-400/20 to-yellow-400/10 p-4 backdrop-blur-xl lg:min-w-[180px] lg:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-100">
                  Balance
                </p>

                <p className="mt-2 text-xl font-extrabold text-white lg:text-2xl">
                  ₹150.00
                </p>

                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-amber-100">
                  <Wallet className="h-3 w-3" />
                  Available balance
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          {/* ==================================================
              LEFT — FINANCIAL OVERVIEW
          ================================================== */}

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">
                  Overview
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900 lg:text-2xl">
                  Financial Summary
                </h2>
              </div>

              <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-slate-400 shadow-sm sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live account
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 lg:gap-4">
              <StatCard
                title="Total Recharge"
                value="₹0.00"
                icon={CreditCard}
                iconClass="bg-blue-50 text-blue-600"
              />

              <StatCard
                title="Total Withdraw"
                value="₹0.00"
                icon={Wallet}
                iconClass="bg-rose-50 text-rose-500"
              />

              <StatCard
                title="Total Income"
                value="₹150.00"
                icon={TrendingUp}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                title="Total Assets"
                value="₹0.00"
                icon={Package}
                iconClass="bg-amber-50 text-amber-600"
              />

              <StatCard
                title="Today's Income"
                value="₹150.00"
                icon={ArrowUpRight}
                iconClass="bg-indigo-50 text-indigo-600"
              />

              <StatCard
                title="Team Income"
                value="₹0.00"
                icon={Users}
                iconClass="bg-cyan-50 text-cyan-600"
              />
            </div>
          </section>

          {/* ==================================================
              RIGHT — ACCOUNT ACTIONS
          ================================================== */}

          <section>
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">
                Manage
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-900 lg:text-2xl">
                Account Services
              </h2>
            </div>

            <div className="space-y-3">
              <ActionItem
                icon={Package}
                title="My Products"
                description="View your purchased products"
                iconClass="bg-blue-50 text-blue-600"
                onClick={() => {}}
              />

              <ActionItem
                icon={CreditCard}
                title="Funding Details"
                description="Manage your funding information"
                iconClass="bg-amber-50 text-amber-600"
                onClick={() => {}}
              />

              <ActionItem
                icon={Users}
                title="My Team"
                description="View and manage your team"
                iconClass="bg-indigo-50 text-indigo-600"
                onClick={() => {}}
              />

              <ActionItem
                icon={History}
                title="Withdrawal Record"
                description="Check your withdrawal history"
                iconClass="bg-rose-50 text-rose-500"
                onClick={() => {}}
              />

              <ActionItem
                icon={KeyRound}
                title="Login Password"
                description="Update your login password"
                iconClass="bg-emerald-50 text-emerald-600"
                onClick={() => {}}
              />

              <ActionItem
                icon={ShieldCheck}
                title="Withdrawal Password"
                description="Manage your withdrawal security"
                iconClass="bg-teal-50 text-teal-600"
                onClick={() => {}}
              />

              <ActionItem
                icon={Wallet}
                title="My Wallet Account"
                description="Manage your wallet account"
                iconClass="bg-cyan-50 text-cyan-600"
                onClick={() => {}}
              />

              <ActionItem
                icon={Headset}
                title="Online Service"
                description="Get help from customer support"
                iconClass="bg-pink-50 text-pink-600"
                onClick={() => {}}
              />
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white p-4 text-sm font-extrabold text-red-500 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:shadow-lg hover:shadow-red-900/5"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </section>
        </div>
      </main>
      <BottomBar />
    </div>
  );
}

