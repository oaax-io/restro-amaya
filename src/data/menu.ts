export type MenuItem = {
  name: { de: string; en: string };
  desc: { de: string; en: string };
  price: string;
  tags?: ("v" | "vg" | "gf" | "spicy" | "signature")[];
  allergens?: string;
  highlight?: boolean;
};

export type MenuSection = {
  id: string;
  title: { de: string; en: string };
  subtitle?: { de: string; en: string };
  items: MenuItem[];
};

export type WineItem = {
  name: { de: string; en: string };
  desc?: { de: string; en: string };
  origin?: { de: string; en: string };
  glass?: string;
  bottle: string;
};

export type WineMenuSection = {
  id: string;
  title: { de: string; en: string };
  subtitle?: { de: string; en: string };
  items: WineItem[];
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
    id: "lunch-vorspeisen",
    title: { de: "Vorspeisen", en: "Appetizer" },
    items: [
      {
        name: { de: "Edamame", en: "Edamame" },
        desc: {
          de: "Gedämpfte Sojabohnen mit Meersalz oder mit Knoblauch & Chili",
          en: "Steamed soybeans lightly seasoned with sea salt or with garlic & chili",
        },
        price: "11.00",
        allergens: "K",
        tags: ["vg"],
      },
      {
        name: { de: "Pimientos de Padrón", en: "Pimientos de Padrón" },
        desc: {
          de: "Gegrillte, milde Paprikaschoten mit Meersalz",
          en: "Grilled peppers with sea salt",
        },
        price: "13.00",
        tags: ["vg"],
      },
      {
        name: { de: "Burrata", en: "Burrata" },
        desc: {
          de: "Cremige italienische Frischkäse mit Basilikum und Tomaten",
          en: "Creamy Italian cream cheese with basil and tomatoes",
        },
        price: "22.00 / mit Pulpo 29.00",
        allergens: "L, Z",
        tags: ["v"],
      },
      {
        name: { de: "Pulled Pork Gyoza", en: "Pulled Pork Gyoza" },
        desc: {
          de: "Pulled Pork, Sunomono & Shoyu-Reduktion",
          en: "Pulled pork, sunomono & shoyu reduction",
        },
        price: "18.00",
        allergens: "A, K",
      },
      {
        name: { de: "Tatar Amaya Style", en: "Tatar Amaya Style" },
        desc: {
          de: "Rindstatar im AMAYA Style und Eigelb",
          en: "Beef tartare in AMAYA style and egg yolk",
        },
        price: "100g 28.00 / 140g 36.00",
        allergens: "H",
        tags: ["signature"],
        highlight: true,
      },
    ],
  },
  {
    id: "lunch-hauptgaenge",
    title: { de: "Hauptgänge", en: "Main Course" },
    items: [
      {
        name: { de: "Dal", en: "Dal" },
        desc: {
          de: "Linsencurry mit Basmati Reis, Limette und Koriander",
          en: "Lentil curry with basmati rice, lime and coriander",
        },
        price: "24.00 / mit Chicken 32.00 / Naan +8.00",
        allergens: "A",
        tags: ["vg", "spicy"],
      },
      {
        name: { de: "Butter Chicken", en: "Butter Chicken" },
        desc: { de: "Mit Basmati Reis", en: "With basmati rice" },
        price: "34.00 / + Naan Brot 8.00",
        allergens: "U",
      },
      {
        name: { de: "Teriyaki Rindsburger", en: "Teriyaki Beef Burger" },
        desc: {
          de: "Gerösteter Ananas, gereifter Käse, japanische Mayo & Aomori-Pommes",
          en: "Roasted pineapple, aged cheese, Japanese mayo & Aomori fries",
        },
        price: "32.00",
        allergens: "A, U",
      },
      {
        name: { de: "Nikkei Thunfisch Sashimi", en: "Nikkei Tuna Sashimi" },
        desc: {
          de: "Zitrusmarinade & pikante Akzente",
          en: "Citrus marinade & spicy accents",
        },
        price: "35.00",
        allergens: "U",
      },
      {
        name: { de: "Wagyu", en: "Wagyu" },
        desc: { de: "+1 Beilage", en: "+1 side dish" },
        price: "150g 79.00",
        allergens: "F, L",
        tags: ["signature"],
        highlight: true,
      },
      {
        name: { de: "Rinds Ribeye", en: "Beef Ribeye" },
        desc: {
          de: "Rahmspinat & Ofen-Süsskartoffel",
          en: "Cream spinach & oven-baked sweet potato",
        },
        price: "200g 54.00",
        allergens: "A, G, L",
        highlight: true,
      },
      {
        name: { de: "Tenderloin", en: "Tenderloin" },
        desc: { de: "+1 Beilage", en: "+1 side dish" },
        price: "180g 65.00",
        allergens: "L",
        highlight: true,
      },
    ],
  },
  {
    id: "lunch-beilagen",
    title: { de: "Beilagen", en: "Side Dishes" },
    items: [
      {
        name: { de: "Salad Bowl", en: "Salad Bowl" },
        desc: { de: "", en: "" },
        price: "8.00",
        allergens: "L, M",
        tags: ["vg"],
      },
      {
        name: { de: "Grilled Vegetables", en: "Grilled Vegetables" },
        desc: { de: "", en: "" },
        price: "9.00",
        allergens: "L",
        tags: ["vg"],
      },
      {
        name: { de: "Linguine al Tartufo", en: "Linguine al Tartufo" },
        desc: {
          de: "Als Hauptgang mit Trüffel 58.00",
          en: "As main with truffle 58.00",
        },
        price: "9.00 / mit Trüffel-Öl 12.00",
        allergens: "A, C, G, L",
        tags: ["v"],
      },
      {
        name: { de: "Country Fries", en: "Country Fries" },
        desc: { de: "", en: "" },
        price: "12.00",
        tags: ["vg"],
      },
      {
        name: { de: "Fries mit Trüffel-Öl", en: "Fries with Truffle Oil" },
        desc: { de: "", en: "" },
        price: "14.00",
        tags: ["vg"],
      },
      {
        name: { de: "Aomori Fries", en: "Aomori Fries" },
        desc: { de: "", en: "" },
        price: "12.00",
        tags: ["vg"],
      },
    ],
  },
  {
    id: "lunch-dessert",
    title: { de: "Dessert", en: "Dessert" },
    items: [
      {
        name: { de: "Matcha Panna Cotta", en: "Matcha Panna Cotta" },
        desc: { de: "", en: "" },
        price: "12.50",
        allergens: "G, L",
      },
      {
        name: { de: "Japanisches Mochi", en: "Japanese Mochi" },
        desc: { de: "", en: "" },
        price: "7.00",
        allergens: "F",
      },
      {
        name: { de: "Kataifi Strudel & Vanille-Sauce", en: "Kataifi Strudel & Vanilla Sauce" },
        desc: { de: "", en: "" },
        price: "12.50",
        allergens: "A, G, L, H",
      },
      {
        name: { de: "Pistazien Tiramisu", en: "Pistachio Tiramisu" },
        desc: { de: "", en: "" },
        price: "13.50",
        allergens: "A, G, H",
      },
      {
        name: { de: "Lemon Sorbet", en: "Lemon Sorbet" },
        desc: { de: "", en: "" },
        price: "13.00",
        tags: ["vg"],
      },
    ],
  },
];

export const AMAYA_MESA: MenuSection[] = [
  {
    id: "mesa-vorspeisen",
    title: { de: "Vorspeisen", en: "Starters" },
    items: [
      {
        name: { de: "Edamame", en: "Edamame" },
        desc: {
          de: "Gedämpfte Sojabohnen mit Meersalz oder mit Knoblauch & Chili",
          en: "Steamed soybeans lightly seasoned with sea salt or with garlic & chili",
        },
        price: "11.00",
        allergens: "K",
        tags: ["vg"],
      },
      {
        name: { de: "Pimientos de Padrón", en: "Pimientos de Padrón" },
        desc: {
          de: "Gegrillte, milde Paprikaschoten mit Meersalz",
          en: "Grilled peppers with sea salt",
        },
        price: "13.00",
        tags: ["vg"],
      },
      {
        name: { de: "Burrata", en: "Burrata" },
        desc: {
          de: "Cremiger italienischer Frischkäse mit Basilikum und Tomaten",
          en: "Creamy Italian cream cheese with basil and tomatoes",
        },
        price: "22.00 / mit Pulpo 29.00",
        allergens: "L, Z",
        tags: ["v"],
      },
      {
        name: { de: "Pulled Pork Gyoza", en: "Pulled Pork Gyoza" },
        desc: {
          de: "Pulled Pork, Sunomono & Shoyu-Reduktion",
          en: "Pulled pork, sunomono & shoyu reduction",
        },
        price: "18.00",
        allergens: "A, K",
      },
      {
        name: { de: "Tuna Tatar", en: "Tuna Tartare" },
        desc: { de: "Yuzu-Gel, gerösteter Sesam", en: "Yuzu gel, roasted sesame" },
        price: "22.00",
        allergens: "I, W",
      },
      {
        name: { de: "Watermelon Carpaccio", en: "Watermelon Carpaccio" },
        desc: { de: "Feta, Minze und Pistazien", en: "Feta cheese, mint and pistachio" },
        price: "20.00",
        allergens: "L, S",
        tags: ["v", "spicy"],
      },
      {
        name: { de: "Black Tiger Prawns", en: "Black Tiger Prawns" },
        desc: {
          de: "Papaya-Salat, Ahornlack, Hibiskusgel & Petersilienemulsion",
          en: "Papaya salad, maple glaze, hibiscus gel & parsley emulsion",
        },
        price: "24.00",
        allergens: "G",
        highlight: true,
      },
      {
        name: { de: "Tatar Amaya Style", en: "Tatar Amaya Style" },
        desc: {
          de: "Rindstatar im AMAYA Style und Eigelb",
          en: "Beef tartare in AMAYA style and egg yolk",
        },
        price: "100g 28.00 / 140g 36.00",
        allergens: "H",
        tags: ["signature"],
        highlight: true,
      },
      {
        name: { de: "Flambiertes Wagyu-Carpaccio", en: "Flambéed Wagyu Carpaccio" },
        desc: { de: "Hausgemachte Algen, Wasabi-Sauce", en: "Homemade seaweed, wasabi sauce" },
        price: "35.00",
        allergens: "K",
        tags: ["signature"],
        highlight: true,
      },
    ],
  },
  {
    id: "mesa-hauptgaenge",
    title: { de: "Hauptgänge", en: "Main Course" },
    items: [
      {
        name: { de: "Dal", en: "Dal" },
        desc: {
          de: "Linsencurry mit Basmati Reis, Limette und Koriander",
          en: "Lentil curry with basmati rice, lime and coriander",
        },
        price: "24.00 / mit Chicken 32.00 / Naan +8.00",
        allergens: "A",
        tags: ["vg", "spicy"],
      },
      {
        name: { de: "Teriyaki Rindsburger", en: "Teriyaki Beef Burger" },
        desc: {
          de: "Gerösteter Ananas, gereifter Käse, japanische Mayo & Aomori-Pommes",
          en: "Roasted pineapple, aged cheese, Japanese mayo & Aomori fries",
        },
        price: "32.00",
        allergens: "A, U",
      },
      {
        name: { de: "Butter Chicken", en: "Butter Chicken" },
        desc: { de: "Mit Basmati Reis", en: "With basmati rice" },
        price: "34.00 / + Naan Brot 8.00",
        allergens: "U",
      },
      {
        name: { de: "Nikkei Thunfisch Sashimi", en: "Nikkei Tuna Sashimi" },
        desc: { de: "Zitrusmarinade & pikante Akzente", en: "Citrus marinade & spicy accents" },
        price: "35.00",
        allergens: "U",
      },
      {
        name: { de: "Chilean Sea Bass", en: "Chilean Sea Bass" },
        desc: { de: "Mit Bimi (Wildbrokkoli)", en: "With wild broccoli" },
        price: "45.00",
        allergens: "I",
      },
      {
        name: { de: "Rinds Ribeye", en: "Beef Ribeye" },
        desc: {
          de: "Rahmspinat & Ofen-Süsskartoffel",
          en: "Cream spinach & oven-baked sweet potato",
        },
        price: "200g 54.00",
        allergens: "A, G, L",
        highlight: true,
      },
      {
        name: { de: "Wagyu", en: "Wagyu" },
        desc: {
          de: "+1 Beilage Mesa Amaya +29.00",
          en: "+1 side dish Mesa Amaya +29.00",
        },
        price: "150g 79.00",
        allergens: "F, L",
        tags: ["signature"],
        highlight: true,
      },
      {
        name: { de: "Tenderloin", en: "Tenderloin" },
        desc: { de: "+1 Beilage Mesa Amaya +9.00", en: "+1 side dish Mesa Amaya +9.00" },
        price: "180g 65.00",
        allergens: "L",
        highlight: true,
      },
    ],
  },
  {
    id: "mesa-beilagen",
    title: { de: "Beilagen", en: "Side Dishes" },
    items: [
      {
        name: { de: "Salad Bowl", en: "Salad Bowl" },
        desc: { de: "", en: "" },
        price: "8.00",
        allergens: "L, M",
        tags: ["vg"],
      },
      {
        name: { de: "Grilled Vegetables", en: "Grilled Vegetables" },
        desc: { de: "", en: "" },
        price: "9.00",
        allergens: "L",
        tags: ["vg"],
      },
      {
        name: { de: "Linguine al Tartufo", en: "Linguine al Tartufo" },
        desc: {
          de: "Als Hauptgang mit Trüffel 58.00",
          en: "As main with truffle 58.00",
        },
        price: "9.00 / mit Trüffel-Öl 12.00",
        allergens: "A, C, G, L",
        tags: ["v"],
      },
      {
        name: { de: "Country Fries", en: "Country Fries" },
        desc: { de: "", en: "" },
        price: "12.00",
        tags: ["vg"],
      },
      {
        name: { de: "Fries mit Trüffel-Öl", en: "Fries with Truffle Oil" },
        desc: { de: "", en: "" },
        price: "14.00",
        tags: ["vg"],
      },
      {
        name: { de: "Aomori Fries", en: "Aomori Fries" },
        desc: { de: "", en: "" },
        price: "12.00",
        tags: ["vg"],
      },
    ],
  },
  {
    id: "mesa-dessert",
    title: { de: "Desserts", en: "Desserts" },
    items: [
      {
        name: { de: "Matcha Panna Cotta", en: "Matcha Panna Cotta" },
        desc: { de: "", en: "" },
        price: "12.50",
        allergens: "G, L",
      },
      {
        name: { de: "Japanisches Mochi", en: "Japanese Mochi" },
        desc: { de: "", en: "" },
        price: "7.00",
        allergens: "F",
      },
      {
        name: { de: "Kataifi Strudel & Vanille-Sauce", en: "Kataifi Strudel & Vanilla Sauce" },
        desc: { de: "", en: "" },
        price: "12.50",
        allergens: "A, G, L, H",
      },
      {
        name: { de: "Pistazien Tiramisu", en: "Pistachio Tiramisu" },
        desc: { de: "", en: "" },
        price: "13.50",
        allergens: "A, G, H",
      },
      {
        name: { de: "Lemon Sorbet", en: "Lemon Sorbet" },
        desc: { de: "", en: "" },
        price: "13.00",
        tags: ["vg"],
      },
    ],
  },
];

export const SUSHI_SHARING: MenuSection[] = [
  {
    id: "sushi-sharing-rolls",
    title: { de: "Sushi & Sharing", en: "Sushi & Sharing" },
    subtitle: {
      de: "Frisch gerollt — zum Teilen oder ganz für sich.",
      en: "Freshly rolled — to share or all for yourself.",
    },
    items: [
      {
        name: { de: "Lachs-Avocado Rolls · 4 Stk.", en: "Salmon-Avocado Rolls · 4 pcs" },
        desc: {
          de: "Avocado-Tatar & Tomaten-Chutney",
          en: "Avocado tartare & tomato chutney",
        },
        price: "26.00",
      },
      {
        name: { de: "Uramaki mit Feige & Nori · 4 Stk.", en: "Uramaki with Fig & Nori · 4 pcs" },
        desc: {
          de: "Getrocknetes Tomaten-Tatar & Federkohl",
          en: "Dried tomato tartare & kale",
        },
        price: "27.00",
      },
      {
        name: { de: "Spicy Tuna Maki · 2 Stk.", en: "Spicy Tuna Maki · 2 pcs" },
        desc: { de: "", en: "" },
        price: "12.00",
        tags: ["spicy"],
      },
      {
        name: { de: "Flambierte Wagyu Nigiri · 4 Stk.", en: "Flambéed Wagyu Nigiri · 4 pcs" },
        desc: {
          de: "Geräucherte Paprika-Emulsion",
          en: "Smoked pepper emulsion",
        },
        price: "38.00",
        tags: ["signature"],
        highlight: true,
      },
      {
        name: { de: "Wagyu Rolls · 4 Stk.", en: "Wagyu Rolls · 4 pcs" },
        desc: { de: "Feine Reduktion", en: "Fine reduction" },
        price: "34.00",
        tags: ["signature"],
        highlight: true,
      },
    ],
  },
];

export const WINE_MENU: WineMenuSection[] = [
  {
    id: "wine-by-glass",
    title: { de: "Weine by the Glass", en: "Wines by the glass" },
    subtitle: {
      de: "Ausgewählte Weine, die ein Glas verdienen.",
      en: "Selected wines worth pouring by the glass.",
    },
    items: [
      {
        name: { de: "Weisswein der Woche", en: "White wine of the week" },
        desc: { de: "Trocken, fruchtig, immer wechselnd", en: "Dry, fruity, rotating weekly" },
        origin: { de: "Schweiz / Europa", en: "Switzerland / Europe" },
        glass: "12",
        bottle: "48",
      },
      {
        name: { de: "Rotwein der Woche", en: "Red wine of the week" },
        desc: { de: "Trocken, würzig, immer wechselnd", en: "Dry, spicy, rotating weekly" },
        origin: { de: "Schweiz / Europa", en: "Switzerland / Europe" },
        glass: "13",
        bottle: "52",
      },
      {
        name: { de: "Champagner Glass", en: "Champagne glass" },
        desc: { de: "Blanc de Blancs, Brut", en: "Blanc de blancs, brut" },
        origin: { de: "Champagne, FR", en: "Champagne, FR" },
        glass: "22",
        bottle: "110",
      },
    ],
  },
  {
    id: "wine-white",
    title: { de: "Weisswein", en: "White wine" },
    items: [
      {
        name: { de: "Sauvignon Blanc, Domaine A", en: "Sauvignon blanc, Domaine A" },
        origin: { de: "Valais, CH", en: "Valais, CH" },
        bottle: "58",
      },
      {
        name: { de: "Chardonnay, Burgundy", en: "Chardonnay, Burgundy" },
        origin: { de: "Bourgogne, FR", en: "Burgundy, FR" },
        bottle: "72",
      },
      {
        name: { de: "Grüner Veltliner, Ried", en: "Grüner veltliner, Ried" },
        origin: { de: "Niederösterreich, AT", en: "Lower Austria, AT" },
        bottle: "64",
      },
    ],
  },
  {
    id: "wine-red",
    title: { de: "Rotwein", en: "Red wine" },
    items: [
      {
        name: { de: "Pinot Noir, Réserve", en: "Pinot noir, réserve" },
        origin: { de: "Aargau, CH", en: "Aargau, CH" },
        bottle: "68",
      },
      {
        name: { de: "Barolo, Castiglione", en: "Barolo, Castiglione" },
        origin: { de: "Piemont, IT", en: "Piedmont, IT" },
        bottle: "95",
      },
      {
        name: { de: "Cabernet Sauvignon, Napa Valley", en: "Cabernet sauvignon, Napa Valley" },
        origin: { de: "Kalifornien, USA", en: "California, USA" },
        bottle: "110",
      },
    ],
  },
  {
    id: "wine-rose-bubbles",
    title: { de: "Rosé & Sekt", en: "Rosé & sparkling" },
    items: [
      {
        name: { de: "Provence Rosé", en: "Provence rosé" },
        origin: { de: "Provence, FR", en: "Provence, FR" },
        bottle: "62",
      },
      {
        name: { de: "Prosecco Superiore, DOCG", en: "Prosecco superiore, DOCG" },
        origin: { de: "Veneto, IT", en: "Veneto, IT" },
        bottle: "54",
      },
    ],
  },
];
