"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail, signOut, updateProfile, User, deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" aria-pressed={checked} className={checked ? "toggle on" : "toggle"} onClick={() => onChange(!checked)}><span /></button>;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [deviceAlerts, setDeviceAlerts] = useState(true);
  const [offlineAlerts, setOfflineAlerts] = useState(true);
  const [alwaysOn, setAlwaysOn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) return router.replace("/");
      setUser(u); setName(u.displayName || "");
    });
  }, [router]);

  useEffect(() => {
    setNotifications(localStorage.getItem("ksmiot-notifications") !== "off");
    setDeviceAlerts(localStorage.getItem("ksmiot-device-alerts") !== "off");
    setOfflineAlerts(localStorage.getItem("ksmiot-offline-alerts") !== "off");
    setAlwaysOn(localStorage.getItem("ksmiot-always-on") === "on");
    setDarkMode(localStorage.getItem("ksmiot-theme") === "dark");
  }, []);

  const setPreference = (key: string, value: boolean, storageValue = value ? "on" : "off") => localStorage.setItem(key, storageValue);

  const saveName = async () => {
    if (!auth.currentUser) return;
    try { await updateProfile(auth.currentUser, { displayName: name.trim() || undefined }); setNotice("Nama profil disimpan."); }
    catch { setNotice("Nama profil gagal disimpan."); }
  };

  const resetPassword = async () => {
    if (!user?.email) return;
    try { await sendPasswordResetEmail(auth, user.email); setNotice("Email reset password telah dikirim."); }
    catch { setNotice("Gagal mengirim email reset password."); }
  };

  const logout = async () => { await signOut(auth); router.replace("/"); };

  const removeAccount = async () => {
    if (!auth.currentUser) return;
    if (!window.confirm("Hapus akun ini secara permanen? Data autentikasi Firebase akan dihapus.")) return;
    try { await deleteUser(auth.currentUser); router.replace("/"); }
    catch { setNotice("Akun membutuhkan login ulang sebelum dapat dihapus."); }
  };

  if (!user) return <div className="page-loading">Loading...</div>;

  return (
    <div className="settings-page">
      <div className="settings-grid">
        <section className="settings-card profile-card">
          <div className="section-title"><span>Account</span><strong>Profile</strong></div>
          <div className="profile-row"><div className="profile-avatar">{(name || user.email || "U").slice(0,1).toUpperCase()}</div><div><h2>{name || "User"}</h2><p>{user.email}</p></div></div>
          <label>Display name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>
          <label>Email<input value={user.email || ""} readOnly /></label>
          <button className="solid-button" onClick={saveName}>Save profile</button>
          {notice && <div className="settings-notice">{notice}</div>}
        </section>

        <section className="settings-card">
          <div className="section-title"><span>Security</span><strong>Account security</strong></div>
          <div className="setting-line"><div><b>Password</b><small>Reset password melalui email Firebase.</small></div><button className="outline-button" onClick={resetPassword}>Reset password</button></div>
          <div className="setting-line"><div><b>Sign out</b><small>Keluar dari akun pada perangkat ini.</small></div><button className="outline-button danger" onClick={logout}>Logout</button></div>
          <div className="setting-line"><div><b>Delete account</b><small>Hapus akun Firebase secara permanen.</small></div><button className="outline-button danger" onClick={removeAccount}>Delete</button></div>
        </section>

        <section className="settings-card">
          <div className="section-title"><span>Notifications</span><strong>Notification settings</strong></div>
          <SettingRow title="All notifications" desc="Aktifkan semua notifikasi aplikasi." value={notifications} onChange={v => { setNotifications(v); setPreference("ksmiot-notifications", v); }} />
          <SettingRow title="Device notifications" desc="Notifikasi dari status dan event perangkat." value={deviceAlerts} onChange={v => { setDeviceAlerts(v); setPreference("ksmiot-device-alerts", v); }} />
          <SettingRow title="Offline notifications" desc="Beri tahu ketika perangkat offline." value={offlineAlerts} onChange={v => { setOfflineAlerts(v); setPreference("ksmiot-offline-alerts", v); }} />
        </section>

        <section className="settings-card">
          <div className="section-title"><span>Interface</span><strong>Application settings</strong></div>
          <SettingRow title="Dark theme" desc="Gunakan tema gelap untuk area aplikasi." value={darkMode} onChange={v => { setDarkMode(v); document.documentElement.dataset.theme = v ? "dark" : "light"; setPreference("ksmiot-theme", v, v ? "dark" : "light"); }} />
          <SettingRow title="Keep screen always on" desc="Preferensi tampilan; penerapannya bergantung browser/perangkat." value={alwaysOn} onChange={v => { setAlwaysOn(v); setPreference("ksmiot-always-on", v); }} />
          <div className="setting-line"><div><b>Language</b><small>Bahasa antarmuka aplikasi.</small></div><select defaultValue="id"><option value="id">Bahasa Indonesia</option><option value="en">English</option></select></div>
          <div className="setting-line"><div><b>Timezone</b><small>Zona waktu untuk tampilan aktivitas.</small></div><select defaultValue="Asia/Jakarta"><option>Asia/Jakarta</option><option>Asia/Singapore</option><option>UTC</option></select></div>
        </section>
      </div>
    </div>
  );
}

function SettingRow({ title, desc, value, onChange }: { title: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return <div className="setting-line"><div><b>{title}</b><small>{desc}</small></div><Toggle checked={value} onChange={onChange} /></div>;
}
