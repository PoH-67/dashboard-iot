"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type NavKey = "guide" | "dashboard" | "device" | "settings";

const navItems: { key: NavKey; label: string; href: string }[] = [
  { key: "guide", label: "Guide", href: "/guide" },
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "device", label: "Device", href: "/device" },
  { key: "settings", label: "Settings", href: "/settings" },
];

function activeKey(pathname: string): NavKey {
  if (pathname.startsWith("/guide")) return "guide";
  if (pathname.startsWith("/device")) return "device";
  if (pathname.startsWith("/settings")) return "settings";
  return "dashboard";
}

export default function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("ksmiot-theme");
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
      if (!currentUser) router.replace("/");
    });
    return unsubscribe;
  }, [router]);


  if (checking || !user) return <main className="center-screen">Loading...</main>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="/dashboard" className="brand" aria-label="KSM Internet of Things">
          <img src="/Logo_IoT.png" alt="KSM IoT" />
          <span>KSM Internet Of Things</span>
          <small>UPN &quot;Veteran&quot; Jakarta</small>
        </a>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(item => (
            <a key={item.key} href={item.href} className={activeKey(pathname) === item.key ? "nav-link active" : "nav-link"}>{item.label}</a>
          ))}
        </nav>
      </aside>
      <div className="app-main">
        <main className="app-content">{children}</main>
        <footer className="app-footer">Copyright © 2026 - Divisi Yuai Yueks</footer>
      </div>

    </div>
  );
}
