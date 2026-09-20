# Next.js + Firebase Login UI — Fullscreen

Frontend login dibuat full-screen mengikuti referensi: panel kiri biru muda, card login di tengah, panel kanan biru dengan arc, lingkaran, dan placeholder logo.

## Jalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Firebase

Buat file `.env.local` di folder yang sama dengan `package.json`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Aktifkan di Firebase Console:

- Authentication -> Sign-in method -> Email/Password
- Authentication -> Sign-in method -> Google
- Authentication -> Settings -> Authorized domains -> `localhost`

## Route

- `/` login
- `/signup` signup
- `/dashboard` halaman setelah login berhasil

## Ganti logo

Placeholder logo besar ada di `components/LoginPage.tsx` pada `.logo-placeholder`.

Logo kecil kiri atas ada di `.mini-logo`.
