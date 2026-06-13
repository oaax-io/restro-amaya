export type MenuItem = {
  name: { de: string; en: string };
  desc: { de: string; en: string };
  price: string;
  tags?: ("v" | "vg" | "gf" | "spicy" | "signature")[];
};

export type MenuSection = {
  id: string;
  title: { de: string; en: string };
  subtitle?: { de: string; en: string };
  items: MenuItem[];
};

export type WeeklyDay = {
  day: "mon" | "tue" | "wed" | "thu" | "fri";
  starter: { de: string; en: string };
  main: { de: string; en: string };
  dessert: { de: string; en: string };
};

export const WEEKLY_MENU: {
  priceTwo: string;
  priceThree: string;
  note: { de: string; en: string };
  days: WeeklyDay[];
} = {
  priceTwo: "CHF 28",
  priceThree: "CHF 36",
  note: {
    de: "Wochenmenü Mo–Fr, 11:30–14:00. Inkl. Tagessuppe oder Salat.",
    en: "Weekly menu Mon–Fri, 11:30–14:00. Includes soup or salad of the day.",
  },
  days: [
    {
      day: "mon",
      starter: { de: "Grüne Papaya · Erdnuss · Limette", en: "Green papaya · peanut · lime" },
      main: { de: "Massaman Curry vom Rind · Jasminreis", en: "Beef massaman curry · jasmine rice" },
      dessert: { de: "Kokos-Panna-Cotta · Mango", en: "Coconut panna cotta · mango" },
    },
    {
      day: "tue",
      starter: { de: "Geflämmter Lachs · Yuzu · Avocado", en: "Torched salmon · yuzu · avocado" },
      main: { de: "Miso-glasierter Black Cod · Pak Choi", en: "Miso-glazed black cod · pak choi" },
      dessert: { de: "Matcha-Crème · weisse Schokolade", en: "Matcha cream · white chocolate" },
    },
    {
      day: "wed",
      starter: { de: "Burrata · gegrillte Feige · Basilikumöl", en: "Burrata · grilled fig · basil oil" },
      main: { de: "Hausgemachte Ravioli · brauner Salbeibutter · Trüffel", en: "Hand-made ravioli · sage butter · truffle" },
      dessert: { de: "Tiramisu Amaya-Style", en: "Tiramisu Amaya-style" },
    },
    {
      day: "thu",
      starter: { de: "Ceviche vom Wolfsbarsch · Leche de Tigre", en: "Sea bass ceviche · leche de tigre" },
      main: { de: "Argentinisches Entrecôte · Chimichurri · Süsskartoffel", en: "Argentinian entrecôte · chimichurri · sweet potato" },
      dessert: { de: "Dulce de Leche · gesalzene Karamell-Glace", en: "Dulce de leche · salted caramel ice cream" },
    },
    {
      day: "fri",
      starter: { de: "Tom Kha Gai · Galgant · Koriander", en: "Tom kha gai · galangal · cilantro" },
      main: { de: "Pad Thai mit Tigergarnelen", en: "Pad thai with tiger prawns" },
      dessert: { de: "Ananas-Carpaccio · Chili · Limetten-Sorbet", en: "Pineapple carpaccio · chili · lime sorbet" },
    },
  ],
};

export const LUNCH_MENU: MenuSection[] = [
  {
    id: "lunch-bowls",
    title: { de: "Bowls & Leichtes", en: "Bowls & light" },
    subtitle: {
      de: "Schnell, frisch, kraftvoll — zum Mittag perfekt.",
      en: "Quick, fresh, powerful — perfect for lunch.",
    },
    items: [
      {
        name: { de: "Jungle Poke Bowl", en: "Jungle poke bowl" },
        desc: {
          de: "Sushi-Reis, marinierter Thunfisch, Edamame, Avocado, Mango, Ponzu",
          en: "Sushi rice, marinated tuna, edamame, avocado, mango, ponzu",
        },
        price: "24",
        tags: ["signature"],
      },
      {
        name: { de: "Buddha Bowl", en: "Buddha bowl" },
        desc: {
          de: "Quinoa, geröstete Süsskartoffel, Kichererbsen, Tahini-Dressing",
          en: "Quinoa, roasted sweet potato, chickpeas, tahini dressing",
        },
        price: "21",
        tags: ["vg", "gf"],
      },
      {
        name: { de: "Bún Bò Saigon", en: "Bún bò Saigon" },
        desc: {
          de: "Reisnudelsalat, Zitronengras-Rind, Kräuter, Erdnuss, Nuoc Cham",
          en: "Rice noodle salad, lemongrass beef, herbs, peanut, nuoc cham",
        },
        price: "23",
      },
    ],
  },
  {
    id: "lunch-classics",
    title: { de: "Klassiker", en: "Classics" },
    items: [
      {
        name: { de: "Amaya Burger", en: "Amaya burger" },
        desc: {
          de: "180g Black-Angus, Cheddar, karamellisierte Zwiebeln, Pommes",
          en: "180g Black Angus, cheddar, caramelised onions, fries",
        },
        price: "26",
        tags: ["signature"],
      },
      {
        name: { de: "Wiener Schnitzel", en: "Wiener Schnitzel" },
        desc: { de: "Kalb, Bratkartoffeln, Preiselbeeren, Zitrone", en: "Veal, fried potatoes, lingonberry, lemon" },
        price: "32",
      },
      {
        name: { de: "Spaghetti Vongole", en: "Spaghetti vongole" },
        desc: { de: "Venusmuscheln, Knoblauch, Weisswein, Peperoncino", en: "Clams, garlic, white wine, peperoncino" },
        price: "27",
        tags: ["spicy"],
      },
      {
        name: { de: "Caesar Salad", en: "Caesar salad" },
        desc: { de: "Römersalat, Parmesan, Anchovis-Dressing, Croutons", en: "Romaine, parmesan, anchovy dressing, croutons" },
        price: "19",
      },
    ],
  },
];

export const DINNER_MENU: MenuSection[] = [
  {
    id: "dinner-snacks",
    title: { de: "Snacks & Sharing", en: "Snacks & sharing" },
    subtitle: { de: "Zum Teilen — oder nicht.", en: "Made to share — or not." },
    items: [
      {
        name: { de: "Edamame · Sansho-Pfeffer · Meersalz", en: "Edamame · sansho pepper · sea salt" },
        desc: { de: "Frisch gedämpft", en: "Freshly steamed" },
        price: "9",
        tags: ["vg", "gf"],
      },
      {
        name: { de: "Bao Bun · Kross gebratener Schweinebauch", en: "Bao bun · crispy pork belly" },
        desc: { de: "Hoisin, Frühlingszwiebel, Gurke", en: "Hoisin, spring onion, cucumber" },
        price: "14",
      },
      {
        name: { de: "Padron-Paprika · Flor-de-Sal", en: "Padrón peppers · flor de sal" },
        desc: { de: "In Olivenöl gebraten", en: "Pan-fried in olive oil" },
        price: "12",
        tags: ["v", "gf"],
      },
      {
        name: { de: "Tuna Tataki · Ponzu · Sesam", en: "Tuna tataki · ponzu · sesame" },
        desc: { de: "Geflämmt, hauchdünn aufgeschnitten", en: "Torched, sliced paper-thin" },
        price: "22",
        tags: ["signature"],
      },
    ],
  },
  {
    id: "dinner-starters",
    title: { de: "Vorspeisen", en: "Starters" },
    items: [
      {
        name: { de: "Wagyu Tatar · Wachtelei · Trüffel", en: "Wagyu tartare · quail egg · truffle" },
        desc: { de: "Hand geschnitten, Sauerteig-Toast", en: "Hand-cut, sourdough toast" },
        price: "28",
        tags: ["signature"],
      },
      {
        name: { de: "Rote Bete · Ziegenkäse · Walnuss", en: "Beetroot · goat cheese · walnut" },
        desc: { de: "Im Salzteig gebacken, Honig-Vinaigrette", en: "Salt-baked, honey vinaigrette" },
        price: "18",
        tags: ["v"],
      },
      {
        name: { de: "Jakobsmuscheln · Blumenkohl · Curry", en: "Scallops · cauliflower · curry" },
        desc: { de: "Drei Stück, gebraten", en: "Three pieces, seared" },
        price: "26",
      },
    ],
  },
  {
    id: "dinner-mains",
    title: { de: "Hauptgänge", en: "Mains" },
    items: [
      {
        name: { de: "Dry Aged Tomahawk · 1.2kg (für 2)", en: "Dry aged tomahawk · 1.2kg (for 2)" },
        desc: { de: "Josper-Grill, Knochenmark-Jus, zwei Beilagen", en: "Josper grill, bone marrow jus, two sides" },
        price: "148",
        tags: ["signature"],
      },
      {
        name: { de: "Black Cod · Miso · Pak Choi", en: "Black cod · miso · pak choi" },
        desc: { de: "48 Stunden mariniert, Yuzu-Beurre-Blanc", en: "48-hour marinated, yuzu beurre blanc" },
        price: "54",
      },
      {
        name: { de: "Lammrücken · Aubergine · Granatapfel", en: "Lamb loin · eggplant · pomegranate" },
        desc: { de: "Rosa gebraten, Ras-el-Hanout-Jus", en: "Pink-roasted, ras el hanout jus" },
        price: "46",
      },
      {
        name: { de: "Risotto · Steinpilz · Alba-Trüffel", en: "Risotto · porcini · Alba truffle" },
        desc: { de: "Carnaroli, Parmesan 36 Monate", en: "Carnaroli, parmesan 36 months" },
        price: "38",
        tags: ["v"],
      },
      {
        name: { de: "Royal Curry · Tigergarnele · Kokos", en: "Royal curry · tiger prawn · coconut" },
        desc: { de: "Hausgemachte rote Currypaste, Jasminreis", en: "House-made red curry paste, jasmine rice" },
        price: "39",
        tags: ["spicy", "gf"],
      },
    ],
  },
  {
    id: "dinner-desserts",
    title: { de: "Desserts", en: "Desserts" },
    items: [
      {
        name: { de: "Schokoladen-Fondant · Salted Caramel", en: "Chocolate fondant · salted caramel" },
        desc: { de: "Valrhona 70%, Vanille-Glace", en: "Valrhona 70%, vanilla ice cream" },
        price: "14",
      },
      {
        name: { de: "Mango-Sticky-Rice", en: "Mango sticky rice" },
        desc: { de: "Süsser Klebreis, Kokoscrème, frische Mango", en: "Sweet sticky rice, coconut cream, fresh mango" },
        price: "13",
        tags: ["vg", "gf"],
      },
      {
        name: { de: "Käseplatte", en: "Cheese board" },
        desc: { de: "Auswahl aus der Region, Feigensenf, Nüsse", en: "Regional selection, fig mustard, nuts" },
        price: "19",
        tags: ["v"],
      },
    ],
  },
];