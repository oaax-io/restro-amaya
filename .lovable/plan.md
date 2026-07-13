## Ziel
Interner Admin-Bereich `/admin/*` — nur Login, keine öffentliche Registrierung. Sidebar & UI im Amaya-CI (dunkles Grün `#0D2517`, Gold-Akzent `#E9A580`, Cream Text). Ein Super-Admin wird für `info@oaase.com` mit generiertem Passwort angelegt.

## Zugang & Rollen
- Login-Seite `/auth` — Email + Passwort, **kein** Sign-up-Formular
- Rolle `admin` in bestehender `user_roles`-Tabelle (bereits vorhanden inkl. `has_role()`)
- Layout `/_authenticated/_admin` prüft Admin-Rolle, sonst Redirect zu `/`
- Super-Admin: `info@oaase.com` wird über Auth-Admin-API angelegt, Passwort generiert, Rolle `admin` gesetzt → Passwort zeige ich dir im Chat

## Neue Datenmodelle
- **`opening_hours`** — Wochentag, Slot (Mittag/Abend/Bar), Öffnen/Schließen, sichtbar
  (aktuell hart in `restaurant.ts` — wird in DB verlagert, Footer/About lesen künftig aus DB)
- **`newsletter_subscribers`** — Email, `subscribed_at`, `status` (aktiv/abgemeldet), `source`
  (kleine öffentliche Anmeldebox im Footer speist diese Tabelle; kann optional weggelassen werden)

Bestehende Tabellen `gallery_images`, `menu_categories`, `menu_items`, `reservations`, `jobs` bleiben und werden im Admin bedient.

## Admin-Module (Sidebar-Navigation)
1. **Dashboard** — Kennzahlen (offene Reservierungen, sichtbare Gerichte, offene Stellen, Newsletter-Anmeldungen)
2. **Reservierungen** — Tabelle mit Status (neu / bestätigt / abgelehnt / abgeschlossen), Filter nach Datum, Detail-Panel
3. **Galerie** — Drag-Upload in Storage-Bucket `gallery`, Reihenfolge per Sort-Order, Caption DE/EN, Löschen
4. **Speisekarte** — Kategorien + Gerichte CRUD (DE/EN, Preis, Bild aus Bucket `menu-images`, Allergene, Sichtbarkeit, Sortierung)
5. **Öffnungszeiten** — Wochentage bearbeiten, Slots ein/aus
6. **Jobs** — CRUD Stellenanzeigen (DE/EN, offen/geschlossen)
7. **Newsletter** — Liste der Anmeldungen, CSV-Export, Einzelne abmelden
8. **Abmelden**

## Öffentliche Seiten – kleine Anpassungen
- `/gallery` liest aus `gallery_images` (aktuell Coming Soon) → echtes Editorial-Grid mit Lightbox
- `/about` / Footer: Öffnungszeiten künftig aus DB (Fallback wie heute, wenn leer)
- Footer bekommt kleine Newsletter-Anmeldebox

## Design / CI
- Sidebar-Hintergrund `#0D2517` (Amaya-Grün), aktive Items in Gold `#E9A580`, Text Cream `#F3E7D7`
- shadcn `Sidebar` mit `collapsible="icon"`, mobil offcanvas
- Admin-Content auf hellem, ruhigem Hintergrund (Card-Style) für gute Lesbarkeit von Tabellen/Formularen

## Sicherheit
- RLS auf allen neuen Tabellen; öffentliche SELECTs nur wo nötig (`opening_hours` sichtbar, Newsletter-Insert für anon)
- Admin-Mutationen ausschließlich über Server-Functions mit `requireSupabaseAuth` + `has_role(admin)`-Check
- Storage-Uploads: Buckets `gallery` und `menu-images` schon vorhanden (privat) → öffentliche READ-Policy fürs Anzeigen, WRITE nur für Admins
- Kein Sign-up-Endpoint; Auth-Seite zeigt nur Login + „Passwort vergessen"

## Reihenfolge der Umsetzung
1. Migration: `opening_hours`, `newsletter_subscribers`, Storage-Policies, Admin-Seed
2. Super-Admin (`info@oaase.com`) anlegen, Rolle `admin` zuweisen → Passwort im Chat
3. `/auth` Login-Only + `_authenticated/_admin` Layout mit Rollen-Gate & Sidebar (CI)
4. Reservierungen → Galerie → Speisekarte → Öffnungszeiten → Jobs → Newsletter
5. Public-Seiten `/gallery` an DB anbinden, Footer-Öffnungszeiten & Newsletter-Box
6. QA im Preview

## Technisches (kurz)
- TanStack Start Server Functions für alle Admin-Reads/Writes
- Bildupload via `supabase.storage.from('gallery').upload(...)` im Client, danach Insert in `gallery_images` mit Public-URL
- i18n: Admin-UI ausschließlich DE (intern), Content-Felder DE/EN wo relevant

## Was ich noch brauche
- Bestätigung, dass ich die Newsletter-Box im Footer aktivieren darf (sonst lasse ich sie weg und baue nur den Admin-Reader — Newsletter kann später ergänzt werden)
- Ob ich die aktuellen Öffnungszeiten aus `restaurant.ts` als Startwerte in die DB übernehmen soll (empfehle ich)