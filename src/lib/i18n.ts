import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  de: {
    translation: {
      nav: { home: "Start", menu: "Speisekarte", gallery: "Galerie", about: "Über uns", jobs: "Stellen", reserve: "Reservieren" },
      hero: {
        kicker: "Restaurant & Bar · Rothenburg LU",
        title: "Wo Geschmack zur Geschichte wird.",
        subtitle: "Indische Küche mit Schweizer Eleganz – im Herzen von Luzern.",
        cta: "Tisch reservieren",
        secondary: "Speisekarte ansehen",
      },
      story: {
        kicker: "Unsere Philosophie",
        title: "Eine Reise von Bombay nach Rothenburg.",
        body: "Im Amaya verbinden wir traditionelle indische Aromen mit modernem Handwerk. Jedes Gericht erzählt eine Geschichte aus Gewürzen, Glut und Zeit.",
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
      nav: { home: "Home", menu: "Menu", gallery: "Gallery", about: "About", jobs: "Careers", reserve: "Reserve" },
      hero: {
        kicker: "Restaurant & Bar · Rothenburg LU",
        title: "Where flavour becomes a story.",
        subtitle: "Indian cuisine with Swiss elegance — in the heart of Lucerne.",
        cta: "Reserve a table",
        secondary: "View the menu",
      },
      story: {
        kicker: "Our philosophy",
        title: "A journey from Bombay to Rothenburg.",
        body: "At Amaya we blend traditional Indian flavours with modern craft. Every dish tells a story of spice, ember, and time.",
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
  });
}

export default i18n;
