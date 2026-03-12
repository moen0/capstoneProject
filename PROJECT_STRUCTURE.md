# Project Structure - AIGuidebook (Clarify)

```
capstoneProject-Sinsan/
│
├── api/                          # API Endpoints (Serverless Functions)
│   ├── login.js                  # Håndterer brukerinnlogging
│   └── register.js               # Håndterer brukerregistrering
│   └── Forklaring: Serverless API-funksjoner for Vercel deployment.
│                   Separert fra frontend for bedre sikkerhet og modulær arkitektur.
│
├── css/                          # Stilark
│   └── style.css                 # Hovedstilark for hele applikasjonen
│   └── Forklaring: All styling samlet på ett sted for konsistent design
│                   og enkel vedlikehold. Bruker moderne CSS med variabler.
│
├── docs/                         # Dokumentasjon og Setup
│   ├── database-setup.sql        # SQL-script for database-oppsett
│   └── SETUP.md                  # Installasjon- og setup-instruksjoner
│   └── Forklaring: Teknisk dokumentasjon og setup-filer for utviklere
│                   som skal sette opp prosjektet lokalt.
│
├── JS/                           # Frontend JavaScript
│   └── main.js                   # Hovedscript for interaktivitet (navbar, animasjoner)
│   └── Forklaring: Client-side JavaScript for UI-interaksjoner.
│                   Separert fra backend-logikk i src/.
│
├── src/                          # Backend Source Code
│   └── server.js                 # Node.js/Express server (utviklingsserver)
│   └── Forklaring: Backend-logikk og server-konfigurasjon.
│                   Brukes for lokal utvikling før Vercel deployment.
│
├── HTML Filer (Root Level)       # Frontend Pages
│   ├── index.html                # Hjemmeside/landing page
│   ├── guidelines.html           # AI-retningslinjer side
│   ├── risks.html                # Risikoer ved AI-bruk
│   ├── integrity.html            # Akademisk integritet
│   ├── checklist.html            # Sjekkliste for ansvarlig AI-bruk
│   ├── quiz.html                 # Interaktiv quiz (13 spørsmål)
│   ├── login.html                # Innloggingsside
│   └── registration.html         # Registreringsside
│   └── Forklaring: HTML-filer i root for enkel tilgang og hosting.
│                   Følger konvensjon for statiske nettsider.
│
├── Konfigurasjons- og Dependencies
│   ├── .env                      # Environment variabler (IKKE commit til Git)
│   ├── .git/                     # Git versjonskontroll
│   ├── node_modules/             # NPM pakker (IKKE commit til Git)
│   ├── package.json              # NPM dependencies og scripts
│   ├── package-lock.json         # Låser NPM package-versjoner
│   ├── vercel.json               # Vercel deployment konfigurasjon
│   └── README.md                 # Prosjektbeskrivelse og dokumentasjon
│   └── Forklaring: Standard Node.js prosjekt-setup med Vercel hosting.
│
└── PROJECT_STRUCTURE.md          # Denne filen!
    └── Forklaring: Dokumenterer prosjektstruktur for teammedlemmer.

```

## Arkitektur Beslutninger

### 1. **Separation of Concerns**
- **Frontend** (HTML/CSS/JS) er separert fra **Backend** (api/, src/)
- Dette gjør det enklere å vedlikeholde og teste hver del uavhengig

### 2. **Serverless Architecture**
- API-endepunkter er i `api/` mappen for Vercel serverless functions
- Ingen tradisjonell server trengs i produksjon - skalerbar og kostnadseffektiv

### 3. **Static First**
- HTML-filer i root gjør siden rask å laste og enkel å hoste
- Minimal JavaScript for bedre ytelse og tilgjengelighet

### 4. **Modular Design**
- Hver HTML-side har sitt eget formål og kan vedlikeholdes separat
- Delt navbar og footer via JS for konsistent brukeropplevelse

### 5. **Environment Configuration**
- `.env` for sensitive data (database credentials, API keys)
- `vercel.json` for production deployment settings

## Hvorfor denne strukturen?

✅ **Skalerbar** - Serverless functions vokser med trafikk  
✅ **Vedlikeholdbar** - Tydelig separasjon mellom frontend og backend  
✅ **Sikker** - API-logikk skjult på server-side  
✅ **Rask** - Statiske HTML-filer lastes ekstremt raskt  
✅ **Moderne** - Følger best practices for web development 2026  

## Tech Stack

- **Frontend**: HTML5, CSS3 (med variabler), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Vercel Postgres)
- **Hosting**: Vercel (Serverless Platform)
- **Version Control**: Git + GitHub
