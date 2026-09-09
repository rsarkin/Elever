import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Radar, LayoutDashboard, Compass, FileText, Plus, Database, ChevronRight, User, MapPin } from 'lucide-react';

export const AppShell: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Surveys', path: '/surveys', icon: Compass },
    { label: 'Location', path: '/location', icon: MapPin },
    { label: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-sand-900 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-900">
      {/* Top Bar Header */}
      <header className="h-16 bg-white/95 border-b border-sand-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md shadow-xs">
        {/* Brand Lockup & Hydrographic Log Breadcrumb */}
        <div className="flex items-center gap-3 md:gap-4">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Radar className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sand-900 tracking-wider font-mono text-sm">ELVER</span>
              <span className="text-[10px] text-sand-500 font-mono tracking-tight uppercase">Marine Intelligence</span>
            </div>
          </NavLink>

          <div className="h-5 w-px bg-sand-200 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-sand-600 font-mono">
            <span className="text-sand-500">Hydrographic Log</span>
            <ChevronRight className="w-3.5 h-3.5 text-sand-400" />
            <span className="font-semibold text-sand-900">Bothnian Trench Swath 04-B</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200 shadow-xs'
                    : 'text-sand-600 hover:text-sand-900 hover:bg-sand-100/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* System Calibration Pill & User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold uppercase">System Calibrated · 455 kHz</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs text-sky-800">
            <Database className="w-3.5 h-3.5 text-sky-600" />
            <span className="font-mono text-[11px] font-medium">Demo Mode</span>
          </div>

          <NavLink
            to="/surveys/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Survey</span>
          </NavLink>

          <div className="h-5 w-px bg-sand-200 hidden md:block" />

          {/* User Profile */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sand-200 text-sand-700 flex items-center justify-center text-xs font-bold border border-sand-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col leading-tight text-[11px] font-mono">
              <span className="font-semibold text-sand-900">Capt. M. Lindqvist</span>
              <span className="text-[10px] text-sand-500">RV Nereus · SSS-455</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Workspace Container */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Footer Minimal Attribution */}
      <footer className="py-4 border-t border-sand-200 text-center text-xs text-sand-500 font-mono">
        ELVER Sonar Intelligence Platform — Hydrographic Anomaly Screening (SIH26057)
      </footer>
    </div>
  );
};
