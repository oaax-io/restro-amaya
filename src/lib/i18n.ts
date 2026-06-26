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
      menu: {
        title: "Speisekarte",
        kicker: "Karte",
        empty: "Bald verfügbar.",
        intro: "Frisch, ehrlich, kompromisslos. Unsere Karte wechselt mit den Jahreszeiten — was hier steht, ist heute auf dem Teller.",
        tabs: { weekly: "Wochenmenü", lunch: "Lunch Karte", amayaMesa: "Amaya Mesa", sushiSharing: "Asian Fusion", wine: "Wein Karte" },
        weekly: { title: "Wochenmenü", lead: "Wöchentlich wechselnde Gerichte." },
        lunch: { title: "Lunch Karte", lead: "Mo–Fr, 11:30–14:00. Auch zum Mitnehmen erhältlich." },
        amayaMesa: { title: "Amaya Mesa", lead: "À-la-carte à la Amaya. Ab 18:00. Reservation empfohlen." },
        sushiSharing: { title: "Asian Fusion", lead: "Zum Teilen oder geniessen — frisch, fein und kunstvoll zubereitet." },
        wine: { title: "Wein Karte", lead: "Weine ausgewählt, die passen — von der Glas- bis zur Flaschenwahl." },
        tags: { v: "vegetarisch", vg: "vegan", gf: "glutenfrei", spicy: "scharf", signature: "Signature" },
        allergens: "Informationen zu Allergenen und Zutaten erhalten Sie auf Anfrage bei unserem Service.",
        cta: "Tisch reservieren",
      },
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
      menu: {
        title: "Menu",
        kicker: "Carte",
        empty: "Coming soon.",
        intro: "Fresh, honest, uncompromising. Our menu changes with the seasons — what's listed here is on the plate today.",
        tabs: { weekly: "Weekly menu", lunch: "Lunch menu", amayaMesa: "Amaya Mesa", sushiSharing: "Asian Fusion", wine: "Wine list" },
        weekly: { title: "Weekly menu", lead: "Weekly changing dishes." },
        lunch: { title: "Lunch menu", lead: "Mon–Fri, 11:30–14:00. Takeaway available." },
        amayaMesa: { title: "Amaya Mesa", lead: "À-la-carte à la Amaya. From 18:00. Reservation recommended." },
        sushiSharing: { title: "Asian Fusion", lead: "To share or savour — fresh, delicate and artfully prepared." },
        wine: { title: "Wine list", lead: "Wines selected to match — by the glass or by the bottle." },
        tags: { v: "vegetarian", vg: "vegan", gf: "gluten-free", spicy: "spicy", signature: "Signature" },
        allergens: "Please ask our team for allergen and ingredient information.",
        cta: "Reserve a table",
      },
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
    react: { useSuspense: false },
  });
} else {
  // refresh bundles on HMR
  i18n.addResourceBundle("de", "translation", resources.de.translation, true, true);
  i18n.addResourceBundle("en", "translation", resources.en.translation, true, true);
}

export default i18n;
