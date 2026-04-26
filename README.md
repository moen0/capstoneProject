# Clarify

En nettside som hjelper universitetsstudenter å bruke AI-verktøy på en ansvarlig og etisk måte i akademisk sammenheng.

## Om prosjektet

Clarify er et semesterprosjekt utviklet for PRO1000 ved USN i Bø. Målet er å gi studenter konkrete retningslinjer, interaktive verktøy og praktisk kunnskap om hvordan AI-verktøy som ChatGPT kan brukes trygt og etisk i studiesammenheng – uten å gå på kompromiss med akademisk integritet.

## Sider og funksjoner

### Retningslinjer
Strukturert veiledning delt inn i tre faner:
- **Retningslinjer** – hva er akseptabel og uakseptabel AI-bruk
- **Risikoer** – personvern, datasikkerhet og fallgruver
- **Akademisk integritet** – plagiering, ærlighet og institusjonens regler

### Risikovurdering (Checklist)
Interaktiv sjekkliste der studenten svarer på spørsmål om sin AI-bruk og får en vurdering av om innleveringen har lav, middels eller høy risiko.

### AI-kunnskapsquiz
En quiz med 13 spørsmål som tester forståelsen av ansvarlig AI-bruk. Resultater og fremgang lagres på brukerprofilen.

### Prompt-hjelper
Verktøy der studenten skriver en prompt og får umiddelbar tilbakemelding på kvaliteten. Gode prompts kan lagres til profilen.

### Brukerprofil
Personlig profilside med:
- Opptjente badges/prestasjoner basert på aktivitet
- Oversikt over lagrede prompts fra Prompt-hjelperen

### Autentisering
Komplett brukerflyt med registrering, innlogging og tilbakestilling av passord via sikkerhetsspørsmål.

## Teknisk stack

| Lag | Teknologi |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Ikoner | Font Awesome 4.7 |
| Fonter | Space Grotesk (Google Fonts) |

## API-endepunkter

Alle endepunkter ligger under `/api/` og kjøres som Vercel serverless functions.

| Endepunkt | Metode | Beskrivelse |
|---|---|---|
| `/api/login` | POST | Logger inn bruker |
| `/api/register` | POST | Registrerer ny bruker |
| `/api/get-profile` | GET | Henter profil, stats og badges |
| `/api/get-prompts` | GET | Henter lagrede prompts |
| `/api/save-prompt` | POST | Lagrer en prompt |
| `/api/delete-prompt` | DELETE | Sletter en prompt |
| `/api/update-stats` | POST | Oppdaterer brukerstatistikk |
| `/api/get-security-question` | GET | Henter sikkerhetsspørsmål |
| `/api/reset-password` | POST | Tilbakestiller passord |

## Prosjektstruktur

```
/
├── api/                  # Vercel serverless functions
├── css/
│   └── style.css         # All styling
├── images/               # Bilder og ikoner
├── JS/
│   ├── auth-helper.js    # Autentiseringslogikk
│   ├── main.js           # Navbar og felles logikk
│   ├── profile.js        # Profilside
│   ├── prompt-helper.js  # Prompt-hjelper
│   └── quiz.js           # Quiz-logikk
├── index.html            # Forsiden
├── guidelines.html       # Retningslinjer
├── checklist.html        # Risikovurdering
├── quiz.html             # Quiz
├── prompt.html           # Prompt-hjelper
├── profile.html          # Brukerprofil
├── login.html            # Innlogging
├── registration.html     # Registrering
└── forgot-password.html  # Glemt passord
```
