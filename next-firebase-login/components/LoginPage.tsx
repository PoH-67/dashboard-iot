"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function getFirebaseCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    return String(error.code);
  }
  return "";
}

function formatFirebaseError(error: unknown) {
  const code = getFirebaseCode(error);

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau password salah.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/popup-closed-by-user":
      return "Login Google dibatalkan.";
    case "auth/popup-blocked":
      return "Popup Google diblokir browser. Izinkan popup untuk localhost.";
    case "auth/unauthorized-domain":
      return "Domain belum diizinkan Firebase. Tambahkan localhost di Authorized domains.";
    case "auth/operation-not-allowed":
      return "Metode login belum diaktifkan di Firebase Authentication.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
    default:
      return "Login gagal. Buka Console browser (F12) untuk melihat detail Firebase.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingSession(false);

      if (currentUser) {
        router.replace("/dashboard");
      }
    });

    return unsubscribe;
  }, [router]);

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/dashboard");
    } catch (firebaseError) {
      console.error("Firebase login error:", firebaseError, getFirebaseCode(firebaseError));
      setError(formatFirebaseError(firebaseError));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.replace("/dashboard");
    } catch (firebaseError) {
      console.error("Firebase Google login error:", firebaseError, getFirebaseCode(firebaseError));
      setError(formatFirebaseError(firebaseError));
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession || user) {
    return <main className="center-screen">Loading...</main>;
  }

  return (
    <main className="login-page">
      <section className="login-window" aria-label="Login page">
        <div className="left-panel">
          <div className="decor-circle decor-circle-a" />
          <div className="decor-circle decor-circle-b" />
          <div className="decor-ring decor-ring-a" />
          <div className="decor-ring decor-ring-b" />
          <div className="decor-dot decor-dot-a" />
          <div className="decor-dot decor-dot-b" />
          <div className="decor-dot decor-dot-c" />

          <div className="mini-logo" title="Ganti logo manual">
            <span className="mini-logo-mark">+</span>
          </div>

          <div className="login-card">
            <h1>Login Now</h1>

            <form onSubmit={handleEmailLogin} className="login-form">
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email or Username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label className="sr-only" htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {error && <p className="error-message">{error}</p>}

              <button className="login-button" type="submit" disabled={loading}>
                {loading ? "PLEASE WAIT..." : "LOGIN"}
              </button>
            </form>

            <div className="login-with">Or login with</div>

            <button
              className="google-button"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M21.35 12.27c0-.68-.06-1.34-.18-1.97H12v3.73h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.85-1.7 2.9-4.2 2.9-7.15z" />
                <path fill="#34A853" d="M12 21.85c2.65 0 4.87-.87 6.49-2.43l-3.15-2.45c-.87.58-1.98.92-3.34.92-2.56 0-4.73-1.73-5.51-4.05H3.23v2.53A9.8 9.8 0 0 0 12 21.85z" />
                <path fill="#FBBC04" d="M6.49 13.84A5.88 5.88 0 0 1 6.18 12c0-.64.11-1.26.31-1.84V7.63H3.23A9.85 9.85 0 0 0 2.15 12c0 1.58.38 3.07 1.08 4.37l3.26-2.53z" />
                <path fill="#EA4335" d="M12 6.11c1.44 0 2.74.5 3.76 1.47l2.82-2.82C16.87 3.14 14.65 2.15 12 2.15a9.8 9.8 0 0 0-8.77 5.48l3.26 2.53C7.27 7.84 9.44 6.11 12 6.11z" />
              </svg>
              <span>Google</span>
            </button>

            <p className="signup-text">
              Not a member? <a href="/signup">Sign up now</a>
            </p>
          </div>
        </div>

        <div className="right-panel" aria-hidden="true">
          <div className="arc arc-1" />
          <div className="arc arc-2" />
          <div className="arc arc-3" />
          <div className="right-ring ring-1" />
          <div className="right-ring ring-2" />
          <div className="right-ring ring-3" />
          <div className="right-dot dot-1" />
          <div className="right-dot dot-2" />
          <div className="right-dot dot-3" />

          <div className="logo-placeholder" title="Ganti dengan logo kamu">
            <div className="logo-placeholder-cloud">LOGO</div>
            <div className="logo-placeholder-caption">YOUR LOGO</div>
          </div>
        </div>
      </section>
    </main>
  );
}
