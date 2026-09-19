"use client";

import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, type User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

function formatSignupError(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Email sudah terdaftar.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/weak-password":
      return "Password terlalu lemah. Gunakan password yang lebih kuat.";
    default:
      return "Registrasi gagal. Cek konfigurasi Firebase dan coba lagi.";
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
      if (currentUser) router.replace("/dashboard");
    });
    return unsubscribe;
  }, [router]);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/dashboard");
    } catch (signupError) {
      setError(formatSignupError(signupError));
    } finally {
      setLoading(false);
    }
  };

  if (checking || user) return <main className="center-screen">Loading...</main>;

  return (
    <main className="login-page">
      <section className="login-window signup-window">
        <div className="left-panel">
          <div className="decor-circle decor-circle-a" />
          <div className="decor-circle decor-circle-b" />
          <div className="decor-ring decor-ring-a" />
          <div className="decor-ring decor-ring-b" />
          <div className="decor-dot decor-dot-a" />
          <div className="decor-dot decor-dot-b" />

          <a className="back-link" href="/">← Back to login</a>

          <div className="login-card signup-card">
            <h1>Create Account</h1>
            <p className="signup-intro">Buat akun baru untuk masuk ke aplikasi.</p>

            <form onSubmit={handleSignup} className="login-form">
              <label className="sr-only" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label className="sr-only" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />

              <label className="sr-only" htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={6}
                required
              />

              {error && <p className="error-message">{error}</p>}

              <button className="login-button" type="submit" disabled={loading}>
                {loading ? "PLEASE WAIT..." : "SIGN UP"}
              </button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <div className="arc arc-1" />
          <div className="arc arc-2" />
          <div className="arc arc-3" />
          <div className="right-ring ring-1" />
          <div className="right-ring ring-2" />
          <div className="right-ring ring-3" />
          <div className="logo-placeholder" title="Ganti dengan logo/image kamu">
            <div className="logo-placeholder-cloud">LOGO</div>
            <div className="logo-placeholder-caption">YOUR LOGO</div>
          </div>
        </div>
      </section>
    </main>
  );
}
