"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setChecking(false);
    if (user) router.replace("/guide");
  }), [router]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Konfirmasi password tidak sama.");
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/guide");
    } catch (err: any) {
      const code = err?.code;
      setError(code === "auth/email-already-in-use" ? "Email sudah terdaftar." : code === "auth/weak-password" ? "Password terlalu lemah. Gunakan minimal 6 karakter." : "Registrasi gagal. Periksa konfigurasi Firebase.");
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
          <a className="mini-logo-link" href="/" aria-label="KSM IoT"><img src="/Logo_IoT.png" alt="Logo IoT" className="mini-logo-img" /></a>
          <div className="login-card signup-card">
            <h1>Create Account</h1>
            <form onSubmit={submit} className="login-form">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
              <input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} minLength={6} required />
              {error && <p className="login-error">{error}</p>}
              <button className="primary-login" type="submit" disabled={loading}>{loading ? "PLEASE WAIT..." : "SIGN UP"}</button>
            </form>
            <p className="signup-text already">Already a member? <a href="/">Login now</a></p>
          </div>
        </div>
        <div className="login-right">
          <div className="big-curve curve-a" /><div className="big-curve curve-b" /><div className="big-curve curve-c" />
          <div className="right-deco ring-a" /><div className="right-deco ring-b" /><div className="right-deco ring-c" />
          <div className="right-deco dot-a" /><div className="right-deco dot-b" /><div className="right-deco dot-c" />
          <div className="main-logo-wrap"><img src="/Logo_IoT.png" alt="Logo IoT" className="main-logo-img" /></div>
        </div>
      </section>
    </main>
  );
}
