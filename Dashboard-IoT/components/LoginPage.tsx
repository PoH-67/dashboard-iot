"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function authError(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "Email atau password salah.";
    case "auth/invalid-email": return "Format email tidak valid.";
    case "auth/popup-blocked": return "Popup Google diblokir. Izinkan popup untuk localhost.";
    case "auth/popup-closed-by-user": return "Login Google dibatalkan.";
    case "auth/unauthorized-domain": return "Tambahkan localhost di Firebase Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed": return "Metode login belum diaktifkan di Firebase Authentication.";
    default: return "Login gagal. Periksa konfigurasi Firebase dan Console browser.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser: User | null) => {
      setChecking(false);
      if (currentUser) router.replace("/guide");
    });
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Email dan password wajib diisi.");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/guide");
    } catch (error) {
      console.error(error);
      setError(authError(error));
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.replace("/guide");
    } catch (error) {
      console.error(error);
      setError(authError(error));
    } finally { setLoading(false); }
  };

  if (checking) return <main className="center-screen">Loading...</main>;

  return (
    <main className="login-page">
      <section className="login-layout">
        <div className="login-left">
          <div className="login-decoration login-dot ld-1" />
          <div className="login-decoration login-dot ld-2" />
          <div className="login-decoration login-dot ld-3" />
          <div className="login-decoration login-ring lr-1" />
          <div className="login-decoration login-ring lr-2" />
          <div className="login-decoration login-ring lr-3" />

          <a className="mini-logo-link" href="/" aria-label="KSM IoT">
            <img src="/Logo_IoT.png" alt="Logo IoT" className="mini-logo-img" />
          </a>

          <div className="login-card">
            <h1>Login Now</h1>
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="email"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-label="Email or Username"
                required
              />
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-label="Password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? "Hide" : ""}
                </button>
              </div>
              {error && <p className="login-error">{error}</p>}
              <button className="primary-login" type="submit" disabled={loading}>
                {loading ? "PLEASE WAIT..." : "LOGIN"}
              </button>
            </form>

            <div className="or-login">Or login with</div>
            <button className="google-login" type="button" onClick={handleGoogle} disabled={loading}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="google-mark">
                <path fill="#4285F4" d="M21.35 12.27c0-.68-.06-1.34-.18-1.97H12v3.73h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.85-1.7 2.9-4.2 2.9-7.15z" />
                <path fill="#34A853" d="M12 21.85c2.65 0 4.87-.87 6.49-2.43l-3.15-2.45c-.87.58-1.98.92-3.34.92-2.56 0-4.73-1.73-5.51-4.05H3.23v2.53A9.8 9.8 0 0 0 12 21.85z" />
                <path fill="#FBBC04" d="M6.49 13.84A5.88 5.88 0 0 1 6.18 12c0-.64.11-1.26.31-1.84V7.63H3.23A9.85 9.85 0 0 0 2.15 12c0 1.58.38 3.07 1.08 4.37l3.26-2.53z" />
                <path fill="#EA4335" d="M12 6.11c1.44 0 2.74.5 3.76 1.47l2.82-2.82C16.87 3.14 14.65 2.15 12 2.15a9.8 9.8 0 0 0-8.77 5.48l3.26 2.53C7.27 7.84 9.44 6.11 12 6.11z" />
              </svg>
              <span>Google</span>
            </button>
            <p className="signup-text">Not a member? <a href="/signup">Sign up now</a></p>
          </div>
        </div>

        <div className="login-right">
          <div className="big-curve curve-a" />
          <div className="big-curve curve-b" />
          <div className="big-curve curve-c" />
          <div className="right-deco ring-a" />
          <div className="right-deco ring-b" />
          <div className="right-deco ring-c" />
          <div className="right-deco dot-a" />
          <div className="right-deco dot-b" />
          <div className="right-deco dot-c" />

          <div className="main-logo-wrap">
            <img src="/Logo_IoT.png" alt="Logo IoT" className="main-logo-img" />
          </div>
        </div>
      </section>
    </main>
  );
}
