import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Radar,
  Compass,
  FileText,
  User,
  MapPin,
  Settings,
  LogOut,
  HelpCircle,
  LayoutDashboard,
  Bell,
  CheckCheck,
} from 'lucide-react';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: 'Deck', path: '/', icon: LayoutDashboard },
    { label: 'Surveys', path: '/surveys', icon: Compass },
    { label: 'Voyage', path: '/location', icon: MapPin },
    { label: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-sand-900 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-900">
      {/* Top Bar Header */}
      <header className="h-16 bg-white/95 border-b border-sand-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md shadow-xs">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 md:gap-4">
          <NavLink to="/" className="flex items-center">
            <span className="font-chido font-extrabold text-2xl text-sky-900 tracking-tight hover:text-sky-800 transition-colors">
              Elever
            </span>
          </NavLink>
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

        {/* Right Section: Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-800 flex items-center justify-center border border-sand-300 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-xs active:scale-95 cursor-pointer relative"
              title="System Notifications"
              aria-expanded={isNotifOpen}
              aria-label="System Notifications Menu"
            >
              <Bell className="w-4 h-4 text-sand-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Box */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-sand-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 pb-2.5 border-b border-sand-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sand-900 text-sm font-sans">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold border border-rose-200">
                        {unreadCount} Unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-[11px] font-mono text-sky-700 hover:text-sky-900 font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-sky-600" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Mock Notifications List */}
                <div className="divide-y divide-sand-150 max-h-80 overflow-y-auto font-mono text-xs">
                  {/* Notification 1: Urgent High Priority Anomaly */}
                  <div className="p-3.5 hover:bg-red-50/50 transition-colors flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1 animate-ping" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900 text-[11px] uppercase tracking-wider">URGENT ANOMALY FLAG</span>
                        <span className="text-[10px] text-sand-500">2m ago</span>
                      </div>
                      <p className="font-sans text-xs text-sand-900 font-medium leading-snug">
                        High priority target <strong>TRG-882</strong> flagged with 91% AI certainty in Kattegat Shoal.
                      </p>
                      <div className="text-[10px] text-rose-700 font-semibold pt-0.5">
                        Requires hydrographer validation • Depth 38.4m
                      </div>
                    </div>
                  </div>

                  {/* Notification 2: AI Sonar Batch Complete */}
                  <div className="p-3.5 hover:bg-amber-50/50 transition-colors flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">BATCH SCAN COMPLETE</span>
                        <span className="text-[10px] text-sand-500">15m ago</span>
                      </div>
                      <p className="font-sans text-xs text-sand-900 font-medium leading-snug">
                        Processed 16 side-scan sonar tiles for <strong>Bothnian Trench Swath 04-B</strong>.
                      </p>
                      <div className="text-[10px] text-amber-800 font-semibold pt-0.5">
                        8 acoustic targets generated
                      </div>
                    </div>
                  </div>

                  {/* Notification 3: Sensor Calibration */}
                  <div className="p-3.5 hover:bg-sky-50/50 transition-colors flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0 mt-1" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-900 text-[11px] uppercase tracking-wider">TELEMETRY SYNC</span>
                        <span className="text-[10px] text-sand-500">1h ago</span>
                      </div>
                      <p className="font-sans text-xs text-sand-900 font-medium leading-snug">
                        Towfish <strong>SSS-455</strong> operating at 455 kHz dual-frequency channel.
                      </p>
                      <div className="text-[10px] text-sky-700 font-semibold pt-0.5">
                        Heading 042° • Speed 3.8 kn
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-2.5 border-t border-sand-200 text-center">
                  <NavLink
                    to="/location"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs font-mono text-sky-700 hover:text-sky-900 font-bold block"
                  >
                    View Hydrographic Spatial Map →
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Circle Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-sand-100 hover:bg-sand-200 text-sand-800 flex items-center justify-center border border-sand-300 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-xs active:scale-95 cursor-pointer"
              title="Capt. M. Lindqvist"
              aria-expanded={isProfileOpen}
              aria-label="User Profile Menu"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Expandable Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-sand-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-sand-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm border border-sky-200">
                      ML
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-sand-900 text-sm">Capt. M. Lindqvist</span>
                      <span className="text-xs text-sand-500 font-mono">RV Nereus · SSS-455</span>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-2 border-b border-sand-100">
                  <div className="flex items-center justify-between text-xs text-sand-600 px-2 py-1">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Calibrated (455 kHz)
                    </span>
                    <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded font-mono">
                      Demo Mode
                    </span>
                  </div>
                </div>

                <div className="py-1 text-xs text-sand-700 font-medium">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-2 hover:bg-sand-100/70 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-sand-500" />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-2 hover:bg-sand-100/70 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-sand-500" />
                    <span>System Preferences</span>
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-2 hover:bg-sand-100/70 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-sand-500" />
                    <span>Help & Documentation</span>
                  </button>
                </div>

                <div className="border-t border-sand-100 pt-1 mt-1">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2.5 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Workspace Container */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Large-Type Footer Container */}
      <footer className="mt-12 bg-white border-t border-sand-200 shadow-xs rounded-t-3xl pt-10 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full font-sans text-sand-800">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-sand-200">
          {/* Column 1: Brand Statement */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-sand-900 text-sm tracking-wide">Brand Statement</h4>
            <p className="text-xs text-sand-600 leading-relaxed font-sans max-w-sm">
              AI-assisted side-scan sonar anomaly detection & hydrographic intelligence platform. Shaped by acoustic clarity, preserved through modern marine systems.
            </p>
            <p className="text-[11px] text-sand-500 font-mono">
              From seabed acoustic anomalies to digital permanence.
            </p>
            <div className="flex items-center gap-3 pt-1 text-sand-600">
              <Radar className="w-4 h-4 text-sky-700 hover:text-sky-900 cursor-pointer" />
              <Compass className="w-4 h-4 text-sky-700 hover:text-sky-900 cursor-pointer" />
              <MapPin className="w-4 h-4 text-sky-700 hover:text-sky-900 cursor-pointer" />
              <FileText className="w-4 h-4 text-sky-700 hover:text-sky-900 cursor-pointer" />
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-sand-900 text-sm tracking-wide font-sans">Navigation</h4>
            <ul className="space-y-2 text-sand-600">
              <li><NavLink to="/" className="hover:text-sky-700 transition-colors">Deck</NavLink></li>
              <li><NavLink to="/surveys" className="hover:text-sky-700 transition-colors">Surveys Catalog</NavLink></li>
              <li><NavLink to="/location" className="hover:text-sky-700 transition-colors">Voyage Map</NavLink></li>
              <li><NavLink to="/reports" className="hover:text-sky-700 transition-colors">Reports & Audit</NavLink></li>
              <li><NavLink to="/surveys/new" className="hover:text-sky-700 transition-colors">New Survey</NavLink></li>
            </ul>
          </div>

          {/* Column 3: Systems & Protocols */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-sand-900 text-sm tracking-wide font-sans">Systems & Data</h4>
            <ul className="space-y-2 text-sand-600">
              <li className="hover:text-sky-700 cursor-pointer">Sonar Bathymetric GIS</li>
              <li className="hover:text-sky-700 cursor-pointer">Acoustic Orthomosaic</li>
              <li className="hover:text-sky-700 cursor-pointer">Towfish SSS-455 (455 kHz)</li>
              <li className="hover:text-sky-700 cursor-pointer">Geospatial Anomaly Dossiers</li>
              <li className="hover:text-sky-700 cursor-pointer">IHO Order 1a Certification</li>
            </ul>
          </div>

          {/* Column 4: Join Telemetry Alert Feed */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sand-900 text-sm tracking-wide">Join Telemetry Feed</h4>
            <div className="flex items-center bg-sand-50 border border-sand-200 rounded-xl p-1 shadow-xs">
              <input
                type="email"
                placeholder="type your email..."
                className="w-full bg-transparent px-3 py-1.5 text-xs text-sand-900 focus:outline-none font-mono"
              />
              <button
                onClick={() => alert('Subscribed to Elever Telemetry Feed!')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-mono text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Join
              </button>
            </div>
            <p className="text-[11px] text-sand-500 font-sans leading-snug">
              Every acoustic run carries a verified system log behind it. Built to preserve marine survey history.
            </p>
          </div>
        </div>

        {/* Bottom Large-Type Display Title Section */}
        <div className="pt-8 pb-4 flex flex-col md:flex-row items-baseline justify-between gap-4">
          <h1 className="font-chido font-extrabold text-6xl md:text-8xl lg:text-9xl text-sky-900 tracking-tighter leading-none select-none">
            Elever
          </h1>
        </div>

        {/* Bottom Copyright & Attribution Line */}
        <div className="pt-4 border-t border-sand-200/80 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-sand-500 gap-2">
          <span>© 2026 Elever Hydrographic Archive. Designed for precision marine survey operations.</span>
          <span>Documenting acoustic anomalies beyond depths.</span>
        </div>
      </footer>
    </div>
  );
};

