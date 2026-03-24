# 🎯 Profile & Achievements System - Database Integration

## Oversikt
Systemet har blitt oppgradert fra localStorage til full database-lagring med Supabase. Dette gir persistent lagring på tvers av enheter og nettlesere.

## 🗄️ Nye Databasetabeller

### 1. `saved_prompts`
Lagrer brukerens beste prompts fra Prompt Helper.

**Kolonner:**
- `id` (UUID) - Unik ID
- `user_id` (UUID) - Referanse til users-tabellen
- `prompt_text` (TEXT) - Selve promptet
- `score` (INTEGER) - Score 0-100
- `category` (TEXT) - 'good', 'moderate', eller 'bad'
- `created_at` (TIMESTAMP) - Når promptet ble lagret

### 2. `user_stats`
Holder styr på brukerens aktivitet for badge-systemet.

**Kolonner:**
- `user_id` (UUID) - Primærnøkkel, referanse til users
- `prompt_helper_uses` (INTEGER) - Antall ganger Prompt Helper er brukt
- `quizzes_completed` (INTEGER) - Antall fullførte quizzer
- `perfect_quizzes` (INTEGER) - Antall quizzer med 100% score
- `updated_at` (TIMESTAMP) - Sist oppdatert

### 3. `user_badges`
Registrerer når brukere låser opp badges.

**Kolonner:**
- `id` (UUID) - Unik ID
- `user_id` (UUID) - Referanse til users
- `badge_id` (TEXT) - Badge-identifikator (f.eks. 'first-prompt')
- `unlocked_at` (TIMESTAMP) - Når badgen ble låst opp

## 🔌 Nye API Endpoints

### POST `/api/save-prompt`
Lagrer et prompt til databasen.

**Request body:**
```json
{
  "userId": "uuid-her",
  "promptText": "Explain photosynthesis...",
  "score": 85,
  "category": "good"
}
```

### GET `/api/get-prompts?userId={uuid}`
Henter alle lagrede prompts for en bruker.

### DELETE `/api/delete-prompt`
Sletter et spesifikt prompt.

**Request body:**
```json
{
  "promptId": "uuid-her"
}
```

### POST `/api/update-stats`
Oppdaterer brukerstatistikk og låser opp badges automatisk.

**Request body:**
```json
{
  "userId": "uuid-her",
  "statType": "prompt_helper_uses",
  "increment": 1
}
```

**Gyldige statType verdier:**
- `prompt_helper_uses`
- `quizzes_completed`
- `perfect_quizzes`

### GET `/api/get-profile?userId={uuid}`
Henter all profildata for en bruker (info, stats, badges, prompts).

## 🏆 Badge System

### Tilgjengelige Badges:

| Badge | Ikon | Betingelse |
|-------|------|------------|
| **First Steps** | 🎯 | Brukt Prompt Helper 1 gang |
| **Prompt Master** | ⭐ | Brukt Prompt Helper 3 ganger |
| **Prompt Expert** | 🏆 | Brukt Prompt Helper 10 ganger |
| **Quiz Starter** | 📚 | Fullført 1 quiz |
| **Quiz Master** | 🎓 | Fullført 3 quizzer |
| **Perfect Score** | 💯 | Fått 100% på en quiz |
| **Collector** | 💾 | Lagret 5 prompts |
| **Quality Writer** | ✨ | Lagret 3 excellent prompts (70+) |

Badges låses opp automatisk når brukerstatistikk oppdateres.

## 📱 Frontend Endringer

### Nye filer:
- `JS/auth-helper.js` - Session management og API-kall
- `JS/profile.js` - Helt omskrevet for database-integrasjon
- `profile.html` - Ny profilside

### Oppdaterte filer:
- `JS/prompt-helper.js` - Bruker API for å lagre prompts
- `JS/quiz.js` - Oppdaterer stats via API
- `JS/main.js` - Lagrer brukerinfo i sessionStorage

## 🔐 Autentisering

Systemet bruker nå **sessionStorage** for å holde bruker innlogget:
- Logges inn ved vellykket pålogging
- Persisterer kun i gjeldende browser-tab
- Slettes automatisk ved lukking av tab/nettleser

### Sjekke innlogget bruker:
```javascript
const user = window.AuthHelper.getCurrentUser();
if (!user) {
  // Bruker er ikke innlogget
}
```

### Gjøre API-kall:
```javascript
const response = await window.AuthHelper.apiCall('/get-profile?userId=' + user.id);
```

## 🚧 Fallback til localStorage

For brukere som ikke er innlogget, fungerer systemet fortsatt med localStorage som fallback:
- Stats lagres lokalt
- Prompts lagres lokalt
- Badges beregnes fra lokale data

Dette sikrer at funksjonaliteten fungerer selv uten innlogging.

## 📝 Oppsett

1. **Kjør database-scriptet:**
   ```bash
   # Åpne docs/database-setup.sql i Supabase SQL Editor og kjør
   ```

2. **Start serveren:**
   ```bash
   npm run dev
   ```

3. **Test funksjonaliteten:**
   - Registrer en ny bruker
   - Bruk Prompt Helper og lagre et godt prompt
   - Fullfør en quiz
   - Se profilsiden for badges og lagrede prompts

## 🔄 Migrering fra localStorage

Hvis du har eksisterende data i localStorage, vil den brukes som fallback. For å migrere til databasen:
1. Logg inn med din bruker
2. Bruk funksjonene (Prompt Helper, Quiz) på nytt
3. Nye data lagres automatisk i databasen

## ⚡ Ytelse

- Alle API-kall er asynkrone og blokkerer ikke UI
- Badge-sjekking kjøres server-side ved stats-oppdatering
- Profile-siden laster all data i én API-kall

## 🐛 Debugging

Sjekk browser console for feilmeldinger:
- `Error saving prompt` - Sjekk at userId er riktig
- `Kunne ikke hente prompts` - Sjekk database-tilkobling
- `API request failed` - Sjekk at serveren kjører

Se også network-tab for å inspektere API-kall.
