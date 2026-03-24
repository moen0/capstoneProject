# AI Guidebook - Setup Guide

## 🚀 Oppsett for lokal utvikling og Vercel deployment

### Steg 1: Installer Node.js
Først må du ha Node.js installert. Last ned fra [nodejs.org](https://nodejs.org/)

### Steg 2: Installer avhengigheter
Åpne terminal i prosjektmappen og kjør:
```bash
npm install
```

### Steg 3: Sett opp Supabase
1. Gå til [supabase.com](https://app.supabase.com/) og lag et prosjekt
2. Gå til SQL Editor og kjør hele scriptet fra `docs/database-setup.sql`

Dette vil opprette følgende tabeller:
- **users** - Brukerkontoer med autentisering
- **saved_prompts** - Lagrede prompts fra Prompt Helper
- **user_stats** - Brukerstatistikk for badge-systemet
- **user_badges** - Opplåste badges per bruker

💡 **Tips:** Du kan kopiere hele innholdet fra `docs/database-setup.sql` og lime det inn i Supabase SQL Editor.

### Steg 4: Konfigurer environment variables
1. Kopier `docs/.env.example` til `.env` (i root):
```bash
copy docs\.env.example .env
```

2. Åpne `.env` og legg inn dine Supabase-nøkler:
```
SUPABASE_URL=https://ditt-prosjekt-id.supabase.co
SUPABASE_ANON_KEY=din-lange-anon-key-her
```

Finn disse i Supabase Dashboard under: **Project Settings → API**

### Steg 5: Kjør lokalt
```bash
npm run dev
```

Dette starter en Express server på `http://localhost:3000`

Åpne i nettleseren:
- Registrering: `http://localhost:3000/registration.html`
- Login: `http://localhost:3000/login.html`
- Hjem: `http://localhost:3000/index.html`

### Steg 6: Deploy til Vercel

1. Installer Vercel CLI globalt (hvis du ikke har det):
```bash
npm install -g vercel
```

2. Login til Vercel:
```bash
vercel login
```

3. Deploy prosjektet:
```bash
vercel
```

4. Legg til environment variables i Vercel:
   - Gå til prosjektet i Vercel Dashboard
   - Settings → Environment Variables
   - Legg til:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`

5. Deploy til produksjon:
```bash
npm run deploy
```

✅ API_URL konfigureres automatisk basert på miljø (localhost vs produksjon).

## 📁 Prosjektstruktur

```
capstoneProject-Sinsan/
├── api/                    # Backend serverless functions
│   ├── register.js        # Registrering API
│   └── login.js           # Login API
├── css/
│   └── style.css
├── docs/                  # Dokumentasjon og konfigurasjon
│   ├── SETUP.md           # Denne filen
│   ├── database-setup.sql # SQL-script for Supabase
│   └── .env.example       # Environment variables template
├── JS/
│   └── main.js            # Frontend JavaScript
├── src/
│   └── server.js          # Express server (lokal utvikling)
├── *.html                 # HTML-filer
├── package.json           # Node.js dependencies
├── vercel.json           # Vercel konfigurasjon
└── .env                  # Environment variables (IKKE commit!)
```

## 🔒 Sikkerhet

- Passord blir hashet med bcrypt før lagring
- API-nøkler er lagret i environment variables
- Frontend kommuniserer kun med backend API
- Backend håndterer all database-kommunikasjon

## 🛠️ Nyttige kommandoer

```bash
npm run dev       # Start lokal development server
npm run build     # Build for produksjon
npm run deploy    # Deploy til Vercel produksjon
vercel logs       # Se deployment logs
```

## ❓ Feilsøking

**Problem**: API calls feiler lokalt
- **Løsning**: Sjekk at `API_URL` i main.js er satt til `http://localhost:3000`

**Problem**: Database connection error
- **Løsning**: Verifiser at `.env` har riktige Supabase credentials

**Problem**: CORS errors
- **Løsning**: API-endepunktene har CORS aktivert. Sjekk browser console for detaljer.
