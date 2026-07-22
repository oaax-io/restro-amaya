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

export type BarMenuSection = {
  id: string;
  title: { de: string; en: string };
  items: BarItem[];
};

export type BarItem = {
  name: { de: string; en: string };
  desc: { de: string; en: string };
  price: string;
  type?: "cocktail" | "mocktail";
};

export type WineMenuSection = {
  id: string;
  title: { de: string; en: string };
  subtitle?: { de: string; en: string };
  items: WineItem[];
};

export const WEEKLY_MENU: {
  dateRange: { de: string; en: string };
  title: { de: string; en: string };
  suppeSalat: { de: string; en: string; price: string };
  items: MenuItem[];
} = {
  dateRange: { de: "22/06 - 26/06", en: "22/06 - 26/06" },
  title: { de: "WOCHENGERICHTE", en: "WEEKLY DISHES" },
  suppeSalat: { de: "Suppe oder Salat", en: "Soup or salad", price: "CHF 3.50" },
  items: [
    {
      name: { de: "TROFIE MIT BASILIKUM PESTO", en: "TROFIE WITH BASIL PESTO" },
      desc: { de: "Haselnuss-Crunch / Melanzane-Chips", en: "Hazelnut crunch / aubergine chips" },
      price: "CHF 19.50",
    },
    {
      name: { de: "SÜSSKARTOFFEL AUS DEM OFEN", en: "OVEN-ROASTED SWEET POTATO" },
      desc: { de: "gefüllt mit Rahmpilzen / dazu Kürbiskern-Krokant", en: "stuffed with cream mushrooms / pumpkin seed brittle" },
      price: "CHF 25.50",
    },
    {
      name: { de: "POULET-CURRY", en: "CHICKEN CURRY" },
      desc: { de: "asiatischem Gemüse / Basmatireis und Koriander", en: "Asian vegetables / basmati rice and coriander" },
      price: "CHF 27.50",
    },
    {
      name: { de: "ZANDERFILET", en: "ZANDER FILLET" },
      desc: { de: "Cherry-Tomaten-gremolata / Salzkartoffel / Blattspinat", en: "Cherry tomato gremolata / baby potatoes / leaf spinach" },
      price: "CHF 28.50",
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
    id: "wine-bythe-glass-sparkling",
    title: { de: "Offenausschank · Schaumweine", en: "By the Glass · Sparkling" },
    subtitle: { de: "10 cl / 70 cl", en: "10 cl / 70 cl" },
    items: [
      { name: { de: "Prosecco Dry Paladin", en: "Prosecco Dry Paladin" }, desc: { de: "Glera", en: "Glera" }, origin: { de: "Italien, Venetien", en: "Italy, Veneto" }, glass: "9.00", bottle: "49.00" },
      { name: { de: "Nicolas Feuillatte Brut Réserve", en: "Nicolas Feuillatte Brut Réserve" }, desc: { de: "Pinot Meunier, Chardonnay, Pinot Noir", en: "Pinot Meunier, Chardonnay, Pinot Noir" }, origin: { de: "Frankreich, Champagne", en: "France, Champagne" }, glass: "21.00", bottle: "109.00" },
    ],
  },
  {
    id: "wine-bythe-glass-white",
    title: { de: "Offenausschank · Weisswein", en: "By the Glass · White" },
    subtitle: { de: "10 cl / 70 cl", en: "10 cl / 70 cl" },
    items: [
      { name: { de: "Ca' dei Frati Lugana 2023", en: "Ca' dei Frati Lugana 2023" }, desc: { de: "Trebbiano di Lugana", en: "Trebbiano di Lugana" }, origin: { de: "Italien, Venetien", en: "Italy, Veneto" }, glass: "8.50", bottle: "49.00" },
      { name: { de: "Kung-Fu Girl, Columbia Valley 2023", en: "Kung-Fu Girl, Columbia Valley 2023" }, desc: { de: "Riesling", en: "Riesling" }, origin: { de: "USA, Washington", en: "USA, Washington" }, glass: "9.00", bottle: "53.00" },
      { name: { de: "Chablis La Boissonneuse Julien Brocard 2022", en: "Chablis La Boissonneuse Julien Brocard 2022" }, desc: { de: "Chardonnay", en: "Chardonnay" }, origin: { de: "Frankreich, Burgund", en: "France, Burgundy" }, glass: "14.00", bottle: "74.00" },
    ],
  },
  {
    id: "wine-bythe-glass-rose",
    title: { de: "Offenausschank · Rosé", en: "By the Glass · Rosé" },
    subtitle: { de: "10 cl / 70 cl", en: "10 cl / 70 cl" },
    items: [
      { name: { de: "Studio by Miraval — Pitt & Perrin 2023", en: "Studio by Miraval — Pitt & Perrin 2023" }, desc: { de: "Cinsault, Grenache", en: "Cinsault, Grenache" }, origin: { de: "Frankreich, Provence", en: "France, Provence" }, glass: "9.00", bottle: "49.00" },
      { name: { de: "Senusade — Marche Rosato 2023", en: "Senusade — Marche Rosato 2023" }, desc: { de: "Sangiovese", en: "Sangiovese" }, origin: { de: "Italien, Marche", en: "Italy, Marche" }, glass: "10.00", bottle: "54.00" },
    ],
  },
  {
    id: "wine-bythe-glass-red",
    title: { de: "Offenausschank · Rotwein", en: "By the Glass · Red" },
    subtitle: { de: "10 cl / 70 cl", en: "10 cl / 70 cl" },
    items: [
      { name: { de: "Ripasso della Valpolicella — La Groletta", en: "Ripasso della Valpolicella — La Groletta" }, desc: { de: "Corvina, Rondinella", en: "Corvina, Rondinella" }, origin: { de: "Italien, Venetien", en: "Italy, Veneto" }, glass: "9.50", bottle: "56.00" },
      { name: { de: "Rioja Crianza La Montesa 2020", en: "Rioja Crianza La Montesa 2020" }, desc: { de: "Tempranillo, Garnacha", en: "Tempranillo, Garnacha" }, origin: { de: "Spanien, Rioja", en: "Spain, Rioja" }, glass: "10.00", bottle: "61.00" },
      { name: { de: "The Chocolate Block — Boekenhoutskloof 2021", en: "The Chocolate Block — Boekenhoutskloof 2021" }, desc: { de: "Shiraz, Grenache, Cabernet Sauvignon", en: "Shiraz, Grenache, Cabernet Sauvignon" }, origin: { de: "Südafrika, Franschhoek", en: "South Africa, Franschhoek" }, glass: "15.00", bottle: "89.00" },
    ],
  },
  {
    id: "wine-sparkling-italy",
    title: { de: "Schaumweine · Italien", en: "Sparkling · Italy" },
    items: [
      { name: { de: "Prosecco Extra Dry Calle Contarini", en: "Prosecco Extra Dry Calle Contarini" }, desc: { de: "Glera · 70 cl", en: "Glera · 70 cl" }, origin: { de: "Venetien", en: "Veneto" }, bottle: "49.00" },
      { name: { de: "Cuvée Royale Franciacorta Marchese Antinori", en: "Cuvée Royale Franciacorta Marchese Antinori" }, desc: { de: "Chardonnay, Pinot Noir · 70 cl", en: "Chardonnay, Pinot Noir · 70 cl" }, origin: { de: "Lombardei", en: "Lombardy" }, bottle: "89.00" },
    ],
  },
  {
    id: "wine-sparkling-france",
    title: { de: "Schaumweine · Frankreich", en: "Sparkling · France" },
    items: [
      { name: { de: "Nicolas Feuillatte Rosé Réserve Exclusive", en: "Nicolas Feuillatte Rosé Réserve Exclusive" }, desc: { de: "Pinot Noir, Pinot Meunier, Chardonnay · 70 cl", en: "Pinot Noir, Pinot Meunier, Chardonnay · 70 cl" }, origin: { de: "Champagne", en: "Champagne" }, bottle: "129.00" },
      { name: { de: "Moët & Chandon", en: "Moët & Chandon" }, desc: { de: "Chardonnay, Pinot Meunier, Pinot Noir · 70 cl", en: "Chardonnay, Pinot Meunier, Pinot Noir · 70 cl" }, origin: { de: "Champagne", en: "Champagne" }, bottle: "175.00" },
      { name: { de: "Moët & Chandon Ice Impérial", en: "Moët & Chandon Ice Impérial" }, desc: { de: "Chardonnay, Pinot Meunier, Pinot Noir · 70 cl", en: "Chardonnay, Pinot Meunier, Pinot Noir · 70 cl" }, origin: { de: "Champagne", en: "Champagne" }, bottle: "185.00" },
      { name: { de: "Dom Pérignon Brut 2015", en: "Dom Pérignon Brut 2015" }, desc: { de: "Chardonnay, Pinot Noir · 70 cl", en: "Chardonnay, Pinot Noir · 70 cl" }, origin: { de: "Champagne", en: "Champagne" }, bottle: "450.00" },
      { name: { de: "Dom Pérignon Brut Luminous 2015", en: "Dom Pérignon Brut Luminous 2015" }, desc: { de: "Chardonnay, Pinot Noir · 70 cl", en: "Chardonnay, Pinot Noir · 70 cl" }, origin: { de: "Champagne", en: "Champagne" }, bottle: "550.00" },
      { name: { de: "Ruinart Rosé", en: "Ruinart Rosé" }, desc: { de: "Chardonnay, Pinot Noir · 70 cl", en: "Chardonnay, Pinot Noir · 70 cl" }, origin: { de: "Champagne", en: "Champagne" }, bottle: "295.00" },
      { name: { de: "Ruinart Blanc de Blancs", en: "Ruinart Blanc de Blancs" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Champagne", en: "Champagne" }, bottle: "295.00" },
    ],
  },
  {
    id: "wine-white-italy",
    title: { de: "Weisswein · Italien", en: "White · Italy" },
    items: [
      { name: { de: "Ranera — Langhe DOC Cascine Drago 2021", en: "Ranera — Langhe DOC Cascine Drago 2021" }, desc: { de: "Riesling · 70 cl", en: "Riesling · 70 cl" }, origin: { de: "Piemont", en: "Piedmont" }, bottle: "52.00" },
      { name: { de: "Arneis delle Langhe 2023", en: "Arneis delle Langhe 2023" }, desc: { de: "Arneis · 70 cl", en: "Arneis · 70 cl" }, origin: { de: "Piemont", en: "Piedmont" }, bottle: "55.00" },
      { name: { de: "Con Vento Tenuta del Terriccio 2022", en: "Con Vento Tenuta del Terriccio 2022" }, desc: { de: "Viognier, Sauvignon Blanc · 70 cl", en: "Viognier, Sauvignon Blanc · 70 cl" }, origin: { de: "Toskana", en: "Tuscany" }, bottle: "63.00" },
      { name: { de: "Vermentino Tenuta Guado al Tasso 2023", en: "Vermentino Tenuta Guado al Tasso 2023" }, desc: { de: "Vermentino · 70 cl", en: "Vermentino · 70 cl" }, origin: { de: "Toskana", en: "Tuscany" }, bottle: "64.00" },
      { name: { de: "Donna Giovanna — Tenuta Iuzzolini 2022", en: "Donna Giovanna — Tenuta Iuzzolini 2022" }, desc: { de: "Magliocco · 70 cl", en: "Magliocco · 70 cl" }, origin: { de: "Kalabrien", en: "Calabria" }, bottle: "49.00" },
    ],
  },
  {
    id: "wine-white-france",
    title: { de: "Weisswein · Frankreich", en: "White · France" },
    items: [
      { name: { de: "Chablis Montée Tonnerre Julien Brocard 2021", en: "Chablis Montée Tonnerre Julien Brocard 2021" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "93.00" },
      { name: { de: "Mâcon Aux Scellés 2022", en: "Mâcon Aux Scellés 2022" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "69.00" },
      { name: { de: "Pouilly Fuissé Domaine Mathias 2022", en: "Pouilly Fuissé Domaine Mathias 2022" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "70.00" },
      { name: { de: "Santenay Tavannes Blanc Remoissenet 2020", en: "Santenay Tavannes Blanc Remoissenet 2020" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "110.00" },
      { name: { de: "Chassagne-Montrachet 2021", en: "Chassagne-Montrachet 2021" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "159.00" },
      { name: { de: "Meursault-Charmes 1er Cru 2020", en: "Meursault-Charmes 1er Cru 2020" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "210.00" },
      { name: { de: "Puligny Montrachet Domaine Leflaive 2018", en: "Puligny Montrachet Domaine Leflaive 2018" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "268.00" },
      { name: { de: "Corton Charlemagne Remoissenet 2022", en: "Corton Charlemagne Remoissenet 2022" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "285.00" },
      { name: { de: "Châteauneuf du Pape Clos des Papes blanc 2023", en: "Châteauneuf du Pape Clos des Papes blanc 2023" }, desc: { de: "Grenache Blanc, Roussanne · 70 cl", en: "Grenache Blanc, Roussanne · 70 cl" }, origin: { de: "Rhône", en: "Rhône" }, bottle: "145.00" },
      { name: { de: "Pouilly Fumé de Ladoucette 2023", en: "Pouilly Fumé de Ladoucette 2023" }, desc: { de: "Sauvignon Blanc · 70 cl", en: "Sauvignon Blanc · 70 cl" }, origin: { de: "Loire", en: "Loire" }, bottle: "74.00" },
    ],
  },
  {
    id: "wine-white-spain",
    title: { de: "Weisswein · Spanien", en: "White · Spain" },
    items: [
      { name: { de: "Rioja Plácet Valtomelloso Palac. Remondo 2022", en: "Rioja Plácet Valtomelloso Palac. Remondo 2022" }, desc: { de: "Viura · 70 cl", en: "Viura · 70 cl" }, origin: { de: "Rioja", en: "Rioja" }, bottle: "69.00" },
      { name: { de: "Verdejo Quivira 2023", en: "Verdejo Quivira 2023" }, desc: { de: "Verdejo · 70 cl", en: "Verdejo · 70 cl" }, origin: { de: "Rueda", en: "Rueda" }, bottle: "55.00" },
    ],
  },
  {
    id: "wine-white-switzerland",
    title: { de: "Weisswein · Schweiz", en: "White · Switzerland" },
    items: [
      { name: { de: "Yvorne Ligne Prestige Charles Rolaz 2023", en: "Yvorne Ligne Prestige Charles Rolaz 2023" }, desc: { de: "Chasselas · 70 cl", en: "Chasselas · 70 cl" }, origin: { de: "Waadt", en: "Vaud" }, bottle: "56.00" },
      { name: { de: "1844 Ballenz weiss R. & K. Lenz 2023", en: "1844 Ballenz White R. & K. Lenz 2023" }, desc: { de: "Chasselas · 70 cl", en: "Chasselas · 70 cl" }, origin: { de: "Wallis", en: "Valais" }, bottle: "56.00" },
      { name: { de: "Petite Arvine Tradition Bonvin 2022", en: "Petite Arvine Tradition Bonvin 2022" }, desc: { de: "Petite Arvine · 70 cl", en: "Petite Arvine · 70 cl" }, origin: { de: "Wallis", en: "Valais" }, bottle: "73.00" },
      { name: { de: "Castello di Morcote Bianco 2022", en: "Castello di Morcote Bianco 2022" }, desc: { de: "Merlot, Sauvignon Blanc · 70 cl", en: "Merlot, Sauvignon Blanc · 70 cl" }, origin: { de: "Tessin", en: "Ticino" }, bottle: "73.00" },
    ],
  },
  {
    id: "wine-white-usa",
    title: { de: "Weisswein · USA · Napa Valley", en: "White · USA · Napa Valley" },
    items: [
      { name: { de: "Sauvignon Blanc North Coast 2021 — Duckhorn Vineyards", en: "Sauvignon Blanc North Coast 2021 — Duckhorn Vineyards" }, desc: { de: "Sauvignon Blanc · 70 cl", en: "Sauvignon Blanc · 70 cl" }, origin: { de: "Napa Valley", en: "Napa Valley" }, bottle: "66.00" },
      { name: { de: "Chardonnay Napa Valley 2021 — Duckhorn Vineyards", en: "Chardonnay Napa Valley 2021 — Duckhorn Vineyards" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Napa Valley", en: "Napa Valley" }, bottle: "71.00" },
    ],
  },
  {
    id: "wine-rose",
    title: { de: "Roséweine", en: "Rosé" },
    items: [
      { name: { de: "Lumare — Tenuta Iuzzolini 2023", en: "Lumare — Tenuta Iuzzolini 2023" }, desc: { de: "Greco Nero · 70 cl", en: "Greco Nero · 70 cl" }, origin: { de: "Italien, Kalabrien", en: "Italy, Calabria" }, bottle: "49.00" },
      { name: { de: "Calafuria — Salento IGT 2023", en: "Calafuria — Salento IGT 2023" }, desc: { de: "Negroamaro · 70 cl", en: "Negroamaro · 70 cl" }, origin: { de: "Italien, Apulien", en: "Italy, Puglia" }, bottle: "50.00" },
      { name: { de: "Miraval Côtes de Provence — Pitt & Perrin 2023", en: "Miraval Côtes de Provence — Pitt & Perrin 2023" }, desc: { de: "Cinsault, Grenache · 70 cl", en: "Cinsault, Grenache · 70 cl" }, origin: { de: "Frankreich, Provence", en: "France, Provence" }, bottle: "75.00" },
      { name: { de: "Miraval Côtes de Provence — Pitt & Perrin 2023", en: "Miraval Côtes de Provence — Pitt & Perrin 2023" }, desc: { de: "Cinsault, Grenache · 150 cl", en: "Cinsault, Grenache · 150 cl" }, origin: { de: "Frankreich, Provence", en: "France, Provence" }, bottle: "150.00" },
      { name: { de: "Miraval Côtes de Provence — Pitt & Perrin 2023", en: "Miraval Côtes de Provence — Pitt & Perrin 2023" }, desc: { de: "Cinsault, Grenache · 300 cl", en: "Cinsault, Grenache · 300 cl" }, origin: { de: "Frankreich, Provence", en: "France, Provence" }, bottle: "400.00" },
      { name: { de: "Miraval Côtes de Provence — Pitt & Perrin 2023", en: "Miraval Côtes de Provence — Pitt & Perrin 2023" }, desc: { de: "Cinsault, Grenache · 600 cl", en: "Cinsault, Grenache · 600 cl" }, origin: { de: "Frankreich, Provence", en: "France, Provence" }, bottle: "950.00" },
      { name: { de: "Whispering Angel 2023", en: "Whispering Angel 2023" }, desc: { de: "Cinsault, Grenache · 70 cl", en: "Cinsault, Grenache · 70 cl" }, origin: { de: "Frankreich, Provence", en: "France, Provence" }, bottle: "82.00" },
      { name: { de: "Ott Château de Selle — Provence 2022", en: "Ott Château de Selle — Provence 2022" }, desc: { de: "Cinsault, Grenache · 70 cl", en: "Cinsault, Grenache · 70 cl" }, origin: { de: "Frankreich, Provence", en: "France, Provence" }, bottle: "89.00" },
    ],
  },
  {
    id: "wine-red-italy-tuscany",
    title: { de: "Rotwein · Italien · Toskana", en: "Red · Italy · Tuscany" },
    items: [
      { name: { de: "Peppoli Chianti Classico Marchesi Antinori 2022", en: "Peppoli Chianti Classico Marchesi Antinori 2022" }, desc: { de: "Sangiovese, 10% andere Sorten · 70 cl", en: "Sangiovese, 10% other varieties · 70 cl" }, bottle: "58.00" },
      { name: { de: "Insoglio del Cinghiale — Tenuta di Biserno 2022", en: "Insoglio del Cinghiale — Tenuta di Biserno 2022" }, desc: { de: "Syrah, Cabernet Franc · 70 cl", en: "Syrah, Cabernet Franc · 70 cl" }, bottle: "65.00" },
      { name: { de: "Il Pino di Biserno — Tenuta Biserno 2021", en: "Il Pino di Biserno — Tenuta Biserno 2021" }, desc: { de: "Cabernet Franc, Merlot · 70 cl", en: "Cabernet Franc, Merlot · 70 cl" }, bottle: "112.00" },
      { name: { de: "Le Serre Nuove dell'Ornellaia — Bolgheri 2021", en: "Le Serre Nuove dell'Ornellaia — Bolgheri 2021" }, desc: { de: "Cabernet Sauvignon, Merlot, Cabernet Franc · 70 cl", en: "Cabernet Sauvignon, Merlot, Cabernet Franc · 70 cl" }, bottle: "132.00" },
      { name: { de: "Tignanello — Marchesi Antinori 2021", en: "Tignanello — Marchesi Antinori 2021" }, desc: { de: "Sangiovese, Cabernet Sauvignon · 70 cl", en: "Sangiovese, Cabernet Sauvignon · 70 cl" }, bottle: "198.00" },
      { name: { de: "Tignanello — Marchesi Antinori 2021", en: "Tignanello — Marchesi Antinori 2021" }, desc: { de: "Sangiovese, Cabernet Sauvignon · 150 cl", en: "Sangiovese, Cabernet Sauvignon · 150 cl" }, bottle: "420.00" },
      { name: { de: "Bolgheri Superiore — Guado al Tasso 2021", en: "Bolgheri Superiore — Guado al Tasso 2021" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, bottle: "254.00" },
      { name: { de: "Sassicaia — Bolgheri Tenuta San Guido 2021", en: "Sassicaia — Bolgheri Tenuta San Guido 2021" }, desc: { de: "Cabernet Sauvignon, Cabernet Franc · 70 cl", en: "Cabernet Sauvignon, Cabernet Franc · 70 cl" }, bottle: "255.00" },
      { name: { de: "Redigaffi Tua Rita 2021", en: "Redigaffi Tua Rita 2021" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, bottle: "310.00" },
      { name: { de: "Ornellaia — Bolgheri Superiore 2021", en: "Ornellaia — Bolgheri Superiore 2021" }, desc: { de: "Cabernet Sauvignon, Merlot, Cabernet Franc", en: "Cabernet Sauvignon, Merlot, Cabernet Franc" }, bottle: "320.00" },
      { name: { de: "Solaia — Tenuta Tignanello 2020", en: "Solaia — Tenuta Tignanello 2020" }, desc: { de: "Cabernet Sauvignon, Sangiovese · 70 cl", en: "Cabernet Sauvignon, Sangiovese · 70 cl" }, bottle: "440.00" },
      { name: { de: "Brunello di Montalcino — La Gerla 2018", en: "Brunello di Montalcino — La Gerla 2018" }, desc: { de: "Sangiovese · 70 cl", en: "Sangiovese · 70 cl" }, bottle: "98.00" },
      { name: { de: "Brunello di Montalcino La Gerla 2016", en: "Brunello di Montalcino La Gerla 2016" }, desc: { de: "Sangiovese · 150 cl", en: "Sangiovese · 150 cl" }, bottle: "219.00" },
      { name: { de: "Brunello di Montalcino — Biondi Santi 2018", en: "Brunello di Montalcino — Biondi Santi 2018" }, desc: { de: "Sangiovese · 70 cl", en: "Sangiovese · 70 cl" }, bottle: "298.00" },
    ],
  },
  {
    id: "wine-red-italy-piedmont",
    title: { de: "Rotwein · Italien · Piemont", en: "Red · Italy · Piedmont" },
    items: [
      { name: { de: "Barbera d'Alba Rocche delle Rocche 2019", en: "Barbera d'Alba Rocche delle Rocche 2019" }, desc: { de: "Barbera · 70 cl", en: "Barbera · 70 cl" }, bottle: "56.00" },
      { name: { de: "Barolo Rocche dell'Annunziata Costamagna 2019", en: "Barolo Rocche dell'Annunziata Costamagna 2019" }, desc: { de: "Nebbiolo · 70 cl", en: "Nebbiolo · 70 cl" }, bottle: "112.00" },
      { name: { de: "Bricco dell'Uccellone, Barbera d'Asti DOCG 2020", en: "Bricco dell'Uccellone, Barbera d'Asti DOCG 2020" }, desc: { de: "Barbera · 70 cl", en: "Barbera · 70 cl" }, bottle: "119.00" },
    ],
  },
  {
    id: "wine-red-italy-veneto",
    title: { de: "Rotwein · Italien · Venetien", en: "Red · Italy · Veneto" },
    items: [
      { name: { de: "Amarone Marchesa Margherita Paladin 2020", en: "Amarone Marchesa Margherita Paladin 2020" }, desc: { de: "Corvina, Rondinella, Molinara · 70 cl", en: "Corvina, Rondinella, Molinara · 70 cl" }, bottle: "89.00" },
      { name: { de: "Vaio Amaron — Amarone della Valpolicella 2016", en: "Vaio Amaron — Amarone della Valpolicella 2016" }, desc: { de: "Corvina, Rondinella, Molinara · 70 cl", en: "Corvina, Rondinella, Molinara · 70 cl" }, bottle: "126.00" },
    ],
  },
  {
    id: "wine-red-italy-calabria",
    title: { de: "Rotwein · Italien · Kalabrien", en: "Red · Italy · Calabria" },
    items: [
      { name: { de: "Muranera — Tenuta Iuzzolini 2022", en: "Muranera — Tenuta Iuzzolini 2022" }, desc: { de: "Magliocco, Gaglioppo · 70 cl", en: "Magliocco, Gaglioppo · 70 cl" }, bottle: "72.00" },
      { name: { de: "Paternum — Tenuta Iuzzolini 2017", en: "Paternum — Tenuta Iuzzolini 2017" }, desc: { de: "Gaglioppo · 70 cl", en: "Gaglioppo · 70 cl" }, bottle: "124.00" },
      { name: { de: "Paternum — Tenuta Iuzzolini", en: "Paternum — Tenuta Iuzzolini" }, desc: { de: "Gaglioppo · 150 cl", en: "Gaglioppo · 150 cl" }, bottle: "250.00" },
    ],
  },
  {
    id: "wine-red-france",
    title: { de: "Rotwein · Frankreich", en: "Red · France" },
    items: [
      { name: { de: "Château La Communion 2020", en: "Château La Communion 2020" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, origin: { de: "Bordeaux", en: "Bordeaux" }, bottle: "59.00" },
      { name: { de: "Château Léoville-Poyferré", en: "Château Léoville-Poyferré" }, desc: { de: "Cabernet Sauvignon, Cabernet Franc, Merlot, Petit Verdot · 70 cl", en: "Cabernet Sauvignon, Cabernet Franc, Merlot, Petit Verdot · 70 cl" }, origin: { de: "Bordeaux", en: "Bordeaux" }, bottle: "205.00" },
      { name: { de: "Côtes du Rhône Pères de l'Église", en: "Côtes du Rhône Pères de l'Église" }, desc: { de: "Grenache, Carignan, Syrah · 70 cl", en: "Grenache, Carignan, Syrah · 70 cl" }, origin: { de: "Rhône", en: "Rhône" }, bottle: "52.00" },
      { name: { de: "Châteauneuf du Pape Clos des Papes 2020", en: "Châteauneuf du Pape Clos des Papes 2020" }, desc: { de: "Syrah, Grenache, Mourvèdre · 70 cl", en: "Syrah, Grenache, Mourvèdre · 70 cl" }, origin: { de: "Rhône", en: "Rhône" }, bottle: "192.00" },
      { name: { de: "Bourgogne Renommée Remoissenet", en: "Bourgogne Renommée Remoissenet" }, desc: { de: "Pinot Noir · 70 cl", en: "Pinot Noir · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "68.00" },
      { name: { de: "Givry Remoissenet 2020", en: "Givry Remoissenet 2020" }, desc: { de: "Pinot Noir · 70 cl", en: "Pinot Noir · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "77.00" },
      { name: { de: "Pommard Remoissenet 2019", en: "Pommard Remoissenet 2019" }, desc: { de: "Pinot Noir · 70 cl", en: "Pinot Noir · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "120.00" },
      { name: { de: "Gevrey Chambertin Remoissenet 2022", en: "Gevrey Chambertin Remoissenet 2022" }, desc: { de: "Pinot Noir · 70 cl", en: "Pinot Noir · 70 cl" }, origin: { de: "Burgund", en: "Burgundy" }, bottle: "124.00" },
      { name: { de: "Sansonnet 2019", en: "Sansonnet 2019" }, desc: { de: "Merlot, Cabernet Franc · 70 cl", en: "Merlot, Cabernet Franc · 70 cl" }, origin: { de: "Saint-Émilion", en: "Saint-Émilion" }, bottle: "89.00" },
      { name: { de: "Sansonnet 2019", en: "Sansonnet 2019" }, desc: { de: "Merlot, Cabernet Franc · 150 cl", en: "Merlot, Cabernet Franc · 150 cl" }, origin: { de: "Saint-Émilion", en: "Saint-Émilion" }, bottle: "189.00" },
    ],
  },
  {
    id: "wine-red-spain",
    title: { de: "Rotwein · Spanien", en: "Red · Spain" },
    items: [
      { name: { de: "Alion, Bodegas y Viñedos Alion 2020", en: "Alion, Bodegas y Viñedos Alion 2020" }, desc: { de: "Tempranillo · 70 cl", en: "Tempranillo · 70 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "155.00" },
      { name: { de: "Alion, Bodegas y Viñedos Alion 2020", en: "Alion, Bodegas y Viñedos Alion 2020" }, desc: { de: "Tempranillo · 150 cl", en: "Tempranillo · 150 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "320.00" },
      { name: { de: "Alion, Bodegas y Viñedos Alion 2020", en: "Alion, Bodegas y Viñedos Alion 2020" }, desc: { de: "Tempranillo · 300 cl", en: "Tempranillo · 300 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "680.00" },
      { name: { de: "Alion, Bodegas y Viñedos Alion 2020", en: "Alion, Bodegas y Viñedos Alion 2020" }, desc: { de: "Tempranillo · 600 cl", en: "Tempranillo · 600 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "1'420.00" },
      { name: { de: "Figuero 12 2020", en: "Figuero 12 2020" }, desc: { de: "Tempranillo · 70 cl", en: "Tempranillo · 70 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "78.00" },
      { name: { de: "Figuero 12 2020", en: "Figuero 12 2020" }, desc: { de: "Tempranillo · 150 cl", en: "Tempranillo · 150 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "150.00" },
      { name: { de: "Flor de Pingus 2020", en: "Flor de Pingus 2020" }, desc: { de: "Tempranillo · 70 cl", en: "Tempranillo · 70 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "169.00" },
      { name: { de: "Flor de Pingus 2020", en: "Flor de Pingus 2020" }, desc: { de: "Tempranillo · 150 cl", en: "Tempranillo · 150 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "320.00" },
      { name: { de: "Psi by Pingus 2021", en: "Psi by Pingus 2021" }, desc: { de: "Tempranillo · 70 cl", en: "Tempranillo · 70 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "85.00" },
      { name: { de: "Psi by Pingus 2021", en: "Psi by Pingus 2021" }, desc: { de: "Tempranillo · 150 cl", en: "Tempranillo · 150 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "175.00" },
      { name: { de: "Garmon 2020", en: "Garmon 2020" }, desc: { de: "Tempranillo · 70 cl", en: "Tempranillo · 70 cl" }, origin: { de: "Ribera del Duero", en: "Ribera del Duero" }, bottle: "90.00" },
      { name: { de: "Pétalos Descendientes de J. Palacios 2019", en: "Pétalos Descendientes de J. Palacios 2019" }, desc: { de: "Mencía · 70 cl", en: "Mencía · 70 cl" }, origin: { de: "Bierzo", en: "Bierzo" }, bottle: "59.00" },
      { name: { de: "El Nido Jumilla Ego Bodegas 2020", en: "El Nido Jumilla Ego Bodegas 2020" }, desc: { de: "Cabernet Sauvignon, Monastrell · 70 cl", en: "Cabernet Sauvignon, Monastrell · 70 cl" }, origin: { de: "Jumilla", en: "Jumilla" }, bottle: "329.00" },
      { name: { de: "Finca Dofí Álvaro Palacios 2021", en: "Finca Dofí Álvaro Palacios 2021" }, desc: { de: "Garnacha, Cariñena · 70 cl", en: "Garnacha, Cariñena · 70 cl" }, origin: { de: "Priorat", en: "Priorat" }, bottle: "126.00" },
      { name: { de: "Rioja Crianza La Montesa 2020", en: "Rioja Crianza La Montesa 2020" }, desc: { de: "Tempranillo, Garnacha · 150 cl", en: "Tempranillo, Garnacha · 150 cl" }, origin: { de: "Rioja", en: "Rioja" }, bottle: "129.00" },
      { name: { de: "Marqués de Murrieta Reserva 2019", en: "Marqués de Murrieta Reserva 2019" }, desc: { de: "Tempranillo · 70 cl", en: "Tempranillo · 70 cl" }, origin: { de: "Rioja", en: "Rioja" }, bottle: "76.00" },
      { name: { de: "Castillo Ygay Gran Reserva 2012", en: "Castillo Ygay Gran Reserva 2012" }, desc: { de: "Tempranillo, Mazuelo · 70 cl", en: "Tempranillo, Mazuelo · 70 cl" }, origin: { de: "Rioja", en: "Rioja" }, bottle: "320.00" },
    ],
  },
  {
    id: "wine-red-southafrica",
    title: { de: "Rotwein · Südafrika", en: "Red · South Africa" },
    items: [
      { name: { de: "The Chocolate Block — Boekenhoutskloof 2021", en: "The Chocolate Block — Boekenhoutskloof 2021" }, desc: { de: "Shiraz, Grenache, Cabernet Sauvignon · 150 cl", en: "Shiraz, Grenache, Cabernet Sauvignon · 150 cl" }, origin: { de: "Franschhoek", en: "Franschhoek" }, bottle: "170.00" },
      { name: { de: "Fusion V 2019", en: "Fusion V 2019" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, origin: { de: "Stellenbosch", en: "Stellenbosch" }, bottle: "99.00" },
      { name: { de: "Fusion V 2019", en: "Fusion V 2019" }, desc: { de: "Cabernet Sauvignon, Merlot · 150 cl", en: "Cabernet Sauvignon, Merlot · 150 cl" }, origin: { de: "Stellenbosch", en: "Stellenbosch" }, bottle: "209.00" },
      { name: { de: "The Echo of G 2015", en: "The Echo of G 2015" }, desc: { de: "Syrah, Cabernet Sauvignon, Cabernet Franc, Petit Verdot · 70 cl", en: "Syrah, Cabernet Sauvignon, Cabernet Franc, Petit Verdot · 70 cl" }, origin: { de: "Stellenbosch", en: "Stellenbosch" }, bottle: "209.00" },
      { name: { de: "The Black Lion De Toren 2019", en: "The Black Lion De Toren 2019" }, desc: { de: "Cabernet Sauvignon · 70 cl", en: "Cabernet Sauvignon · 70 cl" }, origin: { de: "Stellenbosch", en: "Stellenbosch" }, bottle: "320.00" },
    ],
  },
  {
    id: "wine-red-argentina",
    title: { de: "Rotwein · Argentinien", en: "Red · Argentina" },
    items: [
      { name: { de: "Dieter Meier Puro", en: "Dieter Meier Puro" }, desc: { de: "Malbec · 70 cl", en: "Malbec · 70 cl" }, origin: { de: "Mendoza", en: "Mendoza" }, bottle: "68.00" },
      { name: { de: "Malbec Signature — Valle de Uco 2019", en: "Malbec Signature — Valle de Uco 2019" }, desc: { de: "Malbec · 70 cl", en: "Malbec · 70 cl" }, origin: { de: "Valle de Uco", en: "Valle de Uco" }, bottle: "66.00" },
    ],
  },
  {
    id: "wine-red-switzerland",
    title: { de: "Rotwein · Schweiz", en: "Red · Switzerland" },
    items: [
      { name: { de: "Jeninser Pinot Noir Georg Schlegel 2022", en: "Jeninser Pinot Noir Georg Schlegel 2022" }, desc: { de: "Pinot Noir · 70 cl", en: "Pinot Noir · 70 cl" }, origin: { de: "Graubünden", en: "Graubünden" }, bottle: "63.00" },
      { name: { de: "Castello di Morcote 2021", en: "Castello di Morcote 2021" }, desc: { de: "Merlot, Cabernet Sauvignon · 70 cl", en: "Merlot, Cabernet Sauvignon · 70 cl" }, origin: { de: "Tessin", en: "Ticino" }, bottle: "79.00" },
      { name: { de: "Cornalin Tradition Bonvin 2022", en: "Cornalin Tradition Bonvin 2022" }, desc: { de: "Cornalin · 70 cl", en: "Cornalin · 70 cl" }, origin: { de: "Wallis", en: "Valais" }, bottle: "67.00" },
    ],
  },
  {
    id: "wine-red-usa",
    title: { de: "Rotwein · USA · Napa Valley", en: "Red · USA · Napa Valley" },
    items: [
      { name: { de: "The Prisoner, The Prisoner Wine Company 2021", en: "The Prisoner, The Prisoner Wine Company 2021" }, desc: { de: "Zinfandel, Cabernet Sauvignon · 70 cl", en: "Zinfandel, Cabernet Sauvignon · 70 cl" }, bottle: "117.00" },
      { name: { de: "Napa Valley Duckhorn 2019", en: "Napa Valley Duckhorn 2019" }, desc: { de: "Cabernet Sauvignon · 70 cl", en: "Cabernet Sauvignon · 70 cl" }, bottle: "129.00" },
      { name: { de: "Papillon, Orin Swift Cellars, Napa Valley 2020", en: "Papillon, Orin Swift Cellars, Napa Valley 2020" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, bottle: "155.00" },
      { name: { de: "The Discussion", en: "The Discussion" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, bottle: "224.00" },
    ],
  },
  {
    id: "wine-rarity-white",
    title: { de: "Rarität · Weisswein", en: "Rarity · White" },
    subtitle: { de: "◆ Sammlerstücke aus dem Keller", en: "◆ Cellar collectibles" },
    items: [
      { name: { de: "◆ Puligny Montrachet Les Pucelles Leflaive 2014", en: "◆ Puligny Montrachet Les Pucelles Leflaive 2014" }, desc: { de: "Chardonnay · 70 cl", en: "Chardonnay · 70 cl" }, origin: { de: "Frankreich, Burgund", en: "France, Burgundy" }, bottle: "740.00" },
      { name: { de: "◆ Castillo Ygay Blanco 1986", en: "◆ Castillo Ygay Blanco 1986" }, desc: { de: "Viura, Malvasia · 70 cl", en: "Viura, Malvasia · 70 cl" }, origin: { de: "Spanien, Rioja", en: "Spain, Rioja" }, bottle: "1'910.00" },
    ],
  },
  {
    id: "wine-rarity-red",
    title: { de: "Rarität · Rotwein", en: "Rarity · Red" },
    subtitle: { de: "◆ Sammlerstücke aus dem Keller", en: "◆ Cellar collectibles" },
    items: [
      { name: { de: "◆ Masseto, Toscana 2019", en: "◆ Masseto, Toscana 2019" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, origin: { de: "Italien, Toskana", en: "Italy, Tuscany" }, bottle: "880.00" },
      { name: { de: "◆ Brunello di Montalcino — Biondi Santi Riserva 2016", en: "◆ Brunello di Montalcino — Biondi Santi Riserva 2016" }, desc: { de: "Sangiovese · 70 cl", en: "Sangiovese · 70 cl" }, origin: { de: "Italien, Toskana", en: "Italy, Tuscany" }, bottle: "870.00" },
      { name: { de: "◆ Brunello di Montalcino Biondi Santi Riserva 2016", en: "◆ Brunello di Montalcino Biondi Santi Riserva 2016" }, desc: { de: "Sangiovese · 150 cl", en: "Sangiovese · 150 cl" }, origin: { de: "Italien, Toskana", en: "Italy, Tuscany" }, bottle: "1'890.00" },
      { name: { de: "◆ Château Margaux 2018", en: "◆ Château Margaux 2018" }, desc: { de: "Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot · 70 cl", en: "Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot · 70 cl" }, origin: { de: "Frankreich, Bordeaux", en: "France, Bordeaux" }, bottle: "1'290.00" },
      { name: { de: "◆ Château Cheval Blanc 2020", en: "◆ Château Cheval Blanc 2020" }, desc: { de: "Cabernet Franc, Merlot · 70 cl", en: "Cabernet Franc, Merlot · 70 cl" }, origin: { de: "Frankreich, Bordeaux", en: "France, Bordeaux" }, bottle: "1'320.00" },
      { name: { de: "◆ Château Lafite-Rothschild 2015", en: "◆ Château Lafite-Rothschild 2015" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, origin: { de: "Frankreich, Pauillac", en: "France, Pauillac" }, bottle: "1'440.00" },
      { name: { de: "◆ Château Lafite-Rothschild 2020", en: "◆ Château Lafite-Rothschild 2020" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, origin: { de: "Frankreich, Pauillac", en: "France, Pauillac" }, bottle: "1'440.00" },
      { name: { de: "◆ Château Lafite-Rothschild 1986", en: "◆ Château Lafite-Rothschild 1986" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, origin: { de: "Frankreich, Pauillac", en: "France, Pauillac" }, bottle: "1'580.00" },
      { name: { de: "◆ Château Lafite-Rothschild 2010", en: "◆ Château Lafite-Rothschild 2010" }, desc: { de: "Cabernet Sauvignon, Merlot · 70 cl", en: "Cabernet Sauvignon, Merlot · 70 cl" }, origin: { de: "Frankreich, Pauillac", en: "France, Pauillac" }, bottle: "1'760.00" },
      { name: { de: "◆ Pingus 2020", en: "◆ Pingus 2020" }, desc: { de: "Tempranillo · 70 cl", en: "Tempranillo · 70 cl" }, origin: { de: "Spanien, Ribera del Duero", en: "Spain, Ribera del Duero" }, bottle: "1'740.00" },
      { name: { de: "◆ Pétrus 1994", en: "◆ Pétrus 1994" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, origin: { de: "Frankreich, Pomerol", en: "France, Pomerol" }, bottle: "4'680.00" },
      { name: { de: "◆ Pétrus 2004", en: "◆ Pétrus 2004" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, origin: { de: "Frankreich, Pomerol", en: "France, Pomerol" }, bottle: "4'950.00" },
      { name: { de: "◆ Pétrus 2016", en: "◆ Pétrus 2016" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, origin: { de: "Frankreich, Pomerol", en: "France, Pomerol" }, bottle: "4'960.00" },
      { name: { de: "◆ Pétrus 2003", en: "◆ Pétrus 2003" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, origin: { de: "Frankreich, Pomerol", en: "France, Pomerol" }, bottle: "4'980.00" },
      { name: { de: "◆ Pétrus 2012", en: "◆ Pétrus 2012" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, origin: { de: "Frankreich, Pomerol", en: "France, Pomerol" }, bottle: "4'995.00" },
      { name: { de: "◆ Pétrus 2015", en: "◆ Pétrus 2015" }, desc: { de: "Merlot · 70 cl", en: "Merlot · 70 cl" }, origin: { de: "Frankreich, Pomerol", en: "France, Pomerol" }, bottle: "5'120.00" },
    ],
  },
];
