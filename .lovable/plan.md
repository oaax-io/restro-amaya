## Ziel
Modernes "Warm & Editorial" Redesign der Amaya Restaurant Website mit vollwertigem Admin-Bereich, Online-Reservierung mit E-Mail-Bestätigung und Mehrsprachigkeit (DE/EN).

## Inhalte (von amaya-restaurant.ch übernommen)
- Restaurant Amaya & Bar, Gastroverse AG, Stationsstrasse 92, 6023 Rothenburg
- Telefon: +41 41 280 25 25 · reservation@amaya-restaurant.ch
- Öffnungszeiten Mo–So (mit Mittag/Abend Split, Sa/So Bar bis 03:00)
- Bereiche: Restaurant, Bar, Galerie, Jobs

## Design-Richtung: Warm & Editorial
- Palette: warme Erdtöne (terrakotta, sand, deep clay), tiefes Espresso-Schwarz, cremiges Off-White
- Typografie: serifige Display-Schrift (z. B. "Instrument Serif" / "Cormorant") für Headlines, klare Grotesk ("Work Sans" / "Inter") für Body
- Layout: Magazine-Style mit großzügigem Weißraum, asymmetrische Hero, große Editorial-Bilder, sanfte Scroll-Animationen (Motion)
- Mikrointeraktionen: Hover-Lifts, Bild-Parallax, Text-Reveal beim Scrollen

## Öffentliche Seiten (DE/EN)
1. `/` Home — Hero, Story-Teaser, Highlight-Gerichte, Galerie-Preview, Reservierungs-CTA
2. `/menu` Speisekarte — nach Kategorien, dynamisch aus DB
3. `/gallery` Galerie — Editorial-Grid, Lightbox
4. `/reservation` Reservierung — Datum, Uhrzeit, Personen, Kontakt, Wünsche
5. `/about` Über uns / Kontakt — Adresse, Karte, Öffnungszeiten
6. `/jobs` Stellen — Liste offener Stellen + Detailseite `/jobs/$id`
7. Sprachumschalter DE/EN in der Nav

## Admin-Bereich (`/admin/*`, geschützt)
- `/auth` Login (Email/Passwort)
- `/admin` Dashboard mit Kennzahlen (offene Reservierungen, Gerichte, Jobs)
- `/admin/menu` CRUD Speisekarte (Kategorien + Gerichte mit Bild, Preis, Beschreibung DE/EN, Allergene, Sichtbarkeit)
- `/admin/reservations` Tabelle aller Anfragen mit Status (neu, bestätigt, abgelehnt, abgeschlossen), Filter nach Datum, E-Mail-Versand bei Statuswechsel
- `/admin/gallery` Bilder hochladen, sortieren, löschen
- `/admin/jobs` CRUD Stellenausschreibungen DE/EN
- Rollen über separate `user_roles` Tabelle (`admin`), Schutz via `_authenticated` + Rollencheck

## Reservierung mit E-Mail
- Öffentliches Formular speichert Anfrage in DB (Status `pending`)
- Sofortige Bestätigungs-E-Mail an Gast ("Anfrage eingegangen")
- Benachrichtigungs-E-Mail an `reservation@amaya-restaurant.ch`
- Admin bestätigt/lehnt ab → automatische Statusmail an Gast
- E-Mail-Versand via Lovable Cloud Emails (eigene Domain wird beim Setup eingerichtet)

## Technik
- **Stack**: TanStack Start (vorhanden), Tailwind v4, shadcn/ui, Motion für Animationen, react-i18next für DE/EN
- **Backend**: Lovable Cloud (Supabase) wird aktiviert
- **Tabellen**:
  - `profiles` (id, email, full_name)
  - `user_roles` (user_id, role enum `admin`) + `has_role()` SECURITY DEFINER
  - `menu_categories` (id, slug, name_de, name_en, sort_order)
  - `menu_items` (id, category_id, name_de/en, desc_de/en, price, image_url, allergens, is_visible, sort_order)
  - `reservations` (id, name, email, phone, party_size, date, time, notes, status, created_at)
  - `gallery_images` (id, image_url, caption_de/en, sort_order)
  - `jobs` (id, title_de/en, body_de/en, is_open, created_at)
- **Storage Buckets**: `menu-images`, `gallery`, `job-attachments` (public read, admin write)
- **RLS**: alle Tabellen aktiv; öffentliche Lesepfade für `menu_*`, `gallery_images`, `jobs (is_open)`; Schreibrechte nur für Admins; `reservations` INSERT für anon, SELECT/UPDATE nur Admin
- **Server Functions** für Reservierungs-Einreichung + E-Mail-Versand; Admin-Mutationen mit `requireSupabaseAuth` + Rollencheck
- **SEO**: Pro Route eigene Meta-Tags, OG-Image vom Hero, JSON-LD für Restaurant (Adresse, Öffnungszeiten)

## Reihenfolge der Umsetzung
1. Lovable Cloud aktivieren + Datenbank-Migrationen (Tabellen, RLS, Rollen, Storage)
2. Design-System (Farben, Fonts, Tokens in `styles.css`) + i18n-Setup
3. Public Layout (Nav mit Sprachumschalter, Footer mit Kontakt/Öffnungszeiten)
4. Home, Menu, Gallery, About, Jobs, Reservation Seiten
5. Auth (`/auth`) + `_authenticated/_admin` Layout mit Rollencheck
6. Admin-Module: Menu → Reservierungen → Galerie → Jobs
7. E-Mail-Domain einrichten + Reservierungs-Mails (Anfrage, Bestätigung, Ablehnung)
8. Seed-Daten (Gerichte/Galerie aus Originalseite), QA im Preview

## Was ich zum Schluss brauche
- Login der ersten Admin-Person (E-Mail) — kann nach dem Build angelegt werden
- Eine Sender-Domain für E-Mails (wird via Setup-Dialog erfasst)
- Bei Bildern aus der Originalseite: nutzen wir die vorhandenen Fotos oder generiere ich neue, passend zum Editorial-Stil?
