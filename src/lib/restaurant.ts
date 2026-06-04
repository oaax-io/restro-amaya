export const RESTAURANT = {
  name: "Amaya Restaurant & Bar",
  company: "Gastroverse AG",
  street: "Stationsstrasse 92",
  city: "6023 Rothenburg",
  phone: "+41 41 280 25 25",
  phoneRaw: "+41412802525",
  email: "reservation@amaya-restaurant.ch",
  hours: [
    { day: "mon", lunch: "11:30 – 14:00", dinner: null },
    { day: "tue", lunch: "11:30 – 14:00", dinner: "18:30 – 23:30" },
    { day: "wed", lunch: "11:30 – 14:00", dinner: "18:30 – 23:30" },
    { day: "thu", lunch: "11:30 – 14:00", dinner: "18:30 – 23:30" },
    { day: "fri", lunch: "11:30 – 14:00", dinner: "18:30 – 03:00" },
    { day: "sat", lunch: null, dinner: "18:30 – 03:00" },
    { day: "sun", lunch: null, dinner: null },
  ] as const,
};
