"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  if (loading) return <main className="center-screen">Loading...</main>;

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <div className="dashboard-badge">KSM IOT</div>
        <h1>Login Berhasil</h1>
        <p>{user?.email ?? "User"}</p>
        <button className="dashboard-button" onClick={handleLogout}>
          LOGOUT
        </button>
      </section>
    </main>
  );
}
