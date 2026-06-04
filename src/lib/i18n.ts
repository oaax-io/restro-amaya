import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  de: {
    translation: {
      nav: { home: "Start", menu: "Speisekarte", gallery: "Galerie", about: "Über uns", jobs: "Stellen", reserve: "Reservieren", events: "Events", lounge: "Lounge" },
      hero: {
        kicker: "Restaurant · Cigar Lounge · Events · Rothenburg LU",
        cta: "Tisch reservieren",
        secondary: "Mehr entdecken",
        slides: {
          restaurant: { tag: "01 — Restaurant", title: "Wild gewachsen.", sub: "Küche zwischen Dschungel und Stadt — kompromisslos modern, geerdet in Aromen aus aller Welt." },
          lounge:     { tag: "02 — Cigar Lounge", title: "Rauch & Samt.", sub: "Premium Zigarren, gereifte Spirituosen, gedämpftes Licht. Ein Refugium für Kenner." },
          bar:        { tag: "03 — Bar", title: "Liquid Jungle.", sub: "Signature Cocktails, botanische Infusionen, ausgefallene Spirits — handcrafted hinter der Bar." },
          events:     { tag: "04 — Events", title: "Nächte ohne Regeln.", sub: "Private Events, DJ-Nights, Geburtstage. Wir verwandeln den Raum in deine Bühne." },
        },
      },
      reserveWidget: { title: "Reservierung", date: "Datum", time: "Uhrzeit", guests: "Gäste", cta: "Verfügbarkeit prüfen" },
      story: {
        kicker: "Über Amaya",
        title: "Vier Welten. Ein Ort.",
        body: "Amaya ist mehr als ein Restaurant. Wir vereinen Küche, Bar, Cigar Lounge und Eventfläche in einer dramatischen Dschungel-Atmosphäre — mitten in Rothenburg, Luzern.",
      },
      menu: { title: "Speisekarte", kicker: "Karte", empty: "Bald verfügbar." },
      gallery: { title: "Galerie", kicker: "Eindrücke" },
      about: { title: "Über uns", kicker: "Kontakt", hours: "Öffnungszeiten", address: "Adresse", contact: "Kontakt" },
      jobs: { title: "Offene Stellen", kicker: "Karriere", apply: "Bewerben", none: "Aktuell sind keine Stellen offen." },
      reserve: {
        title: "Reservieren",
        kicker: "Ein Tisch für Sie",
        name: "Name", email: "E-Mail", phone: "Telefon", date: "Datum", time: "Uhrzeit",
        party: "Personen", notes: "Wünsche / Anmerkungen", submit: "Anfrage senden",
        success: "Vielen Dank! Wir bestätigen Ihre Anfrage in Kürze per E-Mail.",
        error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      },
      footer: { rights: "Alle Rechte vorbehalten", admin: "Admin" },
      days: { mon: "Montag", tue: "Dienstag", wed: "Mittwoch", thu: "Donnerstag", fri: "Freitag", sat: "Samstag", sun: "Sonntag" },
      closed: "Geschlossen",
    },
  },
  en: {
    translation: {
      nav: { home: "Home", menu: "Menu", gallery: "Gallery", about: "About", jobs: "Careers", reserve: "Reserve", events: "Events", lounge: "Lounge" },
      hero: {
        kicker: "Restaurant · Cigar Lounge · Events · Rothenburg LU",
        cta: "Reserve a table",
        secondary: "Discover more",
        slides: {
          restaurant: { tag: "01 — Restaurant", title: "Wildly grown.", sub: "A kitchen between jungle and city — uncompromisingly modern, rooted in flavours from around the world." },
          lounge:     { tag: "02 — Cigar Lounge", title: "Smoke & velvet.", sub: "Premium cigars, aged spirits, dimmed light. A refuge for connoisseurs." },
          bar:        { tag: "03 — Bar", title: "Liquid jungle.", sub: "Signature cocktails, botanical infusions, rare spirits — hand-crafted behind the bar." },
          events:     { tag: "04 — Events", title: "Nights without rules.", sub: "Private events, DJ nights, birthdays. We turn the room into your stage." },
        },
      },
      reserveWidget: { title: "Reservation", date: "Date", time: "Time", guests: "Guests", cta: "Check availability" },
      story: {
        kicker: "About Amaya",
        title: "Four worlds. One place.",
        body: "Amaya is more than a restaurant. We unite kitchen, bar, cigar lounge and events in a dramatic jungle atmosphere — right in Rothenburg, Lucerne.",
      },
      menu: { title: "Menu", kicker: "Carte", empty: "Coming soon." },
      gallery: { title: "Gallery", kicker: "Impressions" },
      about: { title: "About us", kicker: "Contact", hours: "Opening hours", address: "Address", contact: "Contact" },
      jobs: { title: "Open positions", kicker: "Careers", apply: "Apply", none: "No open positions at the moment." },
      reserve: {
        title: "Reservation",
        kicker: "A table for you",
        name: "Name", email: "Email", phone: "Phone", date: "Date", time: "Time",
        party: "Guests", notes: "Notes / wishes", submit: "Send request",
        success: "Thank you! We will confirm your request by email shortly.",
        error: "Something went wrong. Please try again.",
      },
      footer: { rights: "All rights reserved", admin: "Admin" },
      days: { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" },
      closed: "Closed",
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: typeof window !== "undefined" ? localStorage.getItem("amaya-lang") || "de" : "de",
    fallbackLng: "de",
    interpolation: { escapeValue: false },
    returnObjects: true,
  });
} else {
  // refresh bundles on HMR
  i18n.addResourceBundle("de", "translation", resources.de.translation, true, true);
  i18n.addResourceBundle("en", "translation", resources.en.translation, true, true);
}

export default i18n;
