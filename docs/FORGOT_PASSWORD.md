# Forgot Password Implementation

## Overview
Implementert sikkerhetsspørsmål basert password reset funksjonalitet.

## Files Created/Modified

### Created:
1. **forgot-password.html** - Password reset side med 2-stegs prosess
2. **api/get-security-question.js** - API for å hente sikkerhetsspørsmål
3. **api/reset-password.js** - API for å verifisere svar og resette passord

### Modified:
1. **registration.html** - Lagt til sikkerhetsspørsmål dropdown og svar felt
2. **api/register.js** - Oppdatert til å lagre sikkerhetsspørsmål og hashet svar
3. **login.html** - Koblet "Forgot password?" link til forgot-password.html
4. **docs/database-setup.sql** - Lagt til security_question og security_answer kolonner

## Database Changes Required

⚠️ **VIKTIG**: Du må oppdatere Supabase-databasen!

### Opsjon 1: Kjør SQL i Supabase SQL Editor
Gå til Supabase Dashboard → SQL Editor og kjør:

```sql
-- Legg til nye kolonner i users-tabellen
ALTER TABLE users 
ADD COLUMN security_question TEXT,
ADD COLUMN security_answer TEXT;
```

### Opsjon 2: Gjenskape tabellen (hvis du vil starte på nytt)
Kjør hele `docs/database-setup.sql` filen på nytt i Supabase SQL Editor.

**NB**: Dette vil slette alle eksisterende brukere!

## Security Questions Available

Brukere kan velge mellom:
- "What was the name of your first pet?"
- "In which city were you born?"
- "What is the name of your elementary school?"
- "What was your favorite teacher's name?"
- "What is your favorite food?"

## How It Works

### Registration Flow:
1. Bruker registrerer med brukernavn, passord og velger sikkerhetsspørsmål
2. Sikkerhetssvar hashet med bcrypt (samme som passord)
3. Lagres i database

### Password Reset Flow:
1. Bruker går til forgot-password.html
2. Skriver inn brukernavn → API henter sikkerhetsspørsmål
3. Bruker svarer på spørsmål og skriver nytt passord
4. API verifiserer svar (sammenligner med hashet versjon)
5. Hvis riktig → passord oppdateres

## Testing

### Test flyt:
1. Registrer ny bruker med sikkerhetsspørsmål
2. Logg ut
3. Gå til login-siden og klikk "Forgot password?"
4. Skriv inn brukernavn og se at riktig sikkerhetsspørsmål vises
5. Svar på spørsmålet og sett nytt passord
6. Logg inn med nytt passord

## Security Notes

- Sikkerhetssvar konverteres til lowercase og trimmes før hashing (case-insensitive)
- Både passord og sikkerhetssvar hashet med bcrypt (saltRounds: 10)
- Sikkerhetsspørsmål lagres som plaintext (ikke sensitiv data)
- API verifiserer at nytt passord er minst 6 tegn

## API Endpoints

### POST /api/get-security-question
Request:
```json
{
  "username": "johndoe"
}
```
Response:
```json
{
  "success": true,
  "securityQuestion": "pet"
}
```

### POST /api/reset-password
Request:
```json
{
  "username": "johndoe",
  "securityAnswer": "fluffy",
  "newPassword": "newpassword123"
}
```
Response:
```json
{
  "success": true,
  "message": "Passord tilbakestilt vellykket"
}
```
