/**
 * L'AURORA RESTAURANT & BAR - MENU CATALOG DATA
 */

const DEFAULT_MENU_ITEMS = [
  // --- SIGNATURE MAINS & BURGERS ---
  {
    id: "dish-1",
    name: "Truffle Wagyu Deluxe Burger",
    category: "burgers",
    price: 24.50,
    isVeg: false,
    isChefSpecial: true,
    isGlutenFree: false,
    calories: 780,
    description: "Dry-aged Wagyu beef patty, black truffle aioli, aged English cheddar, crispy pancetta, caramelized onion jam on toasted brioche.",
    image: "assets/images/burger.jpg",
    modifiers: [
      { name: "Extra Truffle Aioli", price: 2.50 },
      { name: "Double Wagyu Patty", price: 7.00 },
      { name: "Aged Smoked Bacon", price: 3.00 },
      { name: "Gluten-Free Brioche", price: 2.00 }
    ],
    prepTime: "12-15 min"
  },
  {
    id: "dish-2",
    name: "Wood-Fired Neapolitan Margherita",
    category: "pizza",
    price: 19.00,
    isVeg: true,
    isChefSpecial: true,
    isGlutenFree: false,
    calories: 620,
    description: "San Marzano D.O.P. tomato sauce, artisanal buffalo mozzarella, fresh sweet basil, fleur de sel, cold-pressed Sicilian olive oil.",
    image: "assets/images/pizza.jpg",
    modifiers: [
      { name: "Extra Buffalo Mozzarella", price: 3.50 },
      { name: "Organic Burrata Crown", price: 5.00 },
      { name: "Calabrian Chili Oil", price: 1.50 },
      { name: "Gluten-Free Crust", price: 3.00 }
    ],
    prepTime: "10-12 min"
  },
  {
    id: "dish-3",
    name: "Jumbo Prawn Truffle Fettuccine",
    category: "pasta",
    price: 28.00,
    isVeg: false,
    isChefSpecial: true,
    isGlutenFree: false,
    calories: 710,
    description: "Handmade squid ink & egg fettuccine, pan-seared jumbo tiger prawns, creamy white truffle butter sauce, 24-month Parmigiano Reggiano.",
    image: "assets/images/pasta.jpg",
    modifiers: [
      { name: "Extra Jumbo Tiger Prawns (2x)", price: 8.00 },
      { name: "Shaved Fresh Black Truffle", price: 9.00 },
      { name: "Extra Parmigiano", price: 2.00 }
    ],
    prepTime: "15-18 min"
  },
  {
    id: "dish-4",
    name: "Deconstructed Berry Cheesecake",
    category: "desserts",
    price: 14.50,
    isVeg: true,
    isChefSpecial: true,
    isGlutenFree: false,
    calories: 460,
    description: "Velvety Madagascar vanilla bean cream cheese quenelle, wild berry coulis, almond-graham butter crumble, 24k edible gold leaf.",
    image: "assets/images/cheesecake.jpg",
    modifiers: [
      { name: "Tahitian Vanilla Gelato Scoop", price: 3.50 },
      { name: "Extra Raspberry Coulis", price: 1.50 }
    ],
    prepTime: "5-8 min"
  },
  {
    id: "dish-5",
    name: "Dragonfruit Passionfruit Mojito",
    category: "beverages",
    price: 13.50,
    isVeg: true,
    isChefSpecial: true,
    isGlutenFree: true,
    calories: 190,
    description: "Fresh red pitaya dragonfruit puree, passionfruit nectar, hand-crushed garden spearmint, Key lime juice, effervescent club soda.",
    image: "assets/images/cocktail.jpg",
    modifiers: [
      { name: "Add Aged Caribbean Rum", price: 4.00 },
      { name: "Spiced Passionfruit Foam", price: 2.00 },
      { name: "Sugar-Free Agave", price: 0.00 }
    ],
    prepTime: "3-5 min"
  },
  {
    id: "dish-6",
    name: "Crispy Calamari Fritti",
    category: "appetizers",
    price: 16.50,
    isVeg: false,
    isChefSpecial: false,
    isGlutenFree: false,
    calories: 420,
    description: "Tender Monterey squid dusted in semolina and tossed with blistered shishito peppers, served with roasted garlic saffron aioli.",
    image: "assets/images/burger.jpg", // fallback
    modifiers: [
      { name: "Extra Saffron Aioli", price: 2.00 },
      { name: "Spicy Marinara Dip", price: 1.50 }
    ],
    prepTime: "8-10 min"
  },
  {
    id: "dish-7",
    name: "Black Angus Ribeye Steak (10oz)",
    category: "mains",
    price: 38.00,
    isVeg: false,
    isChefSpecial: true,
    isGlutenFree: true,
    calories: 890,
    description: "Prime USDA Black Angus center-cut ribeye charbroiled to perfection, bone marrow herb butter, roasted heirloom root vegetables.",
    image: "assets/images/burger.jpg",
    modifiers: [
      { name: "Cooking: Rare", price: 0.00 },
      { name: "Cooking: Medium-Rare", price: 0.00 },
      { name: "Cooking: Medium", price: 0.00 },
      { name: "Cooking: Well-Done", price: 0.00 },
      { name: "Truffle Peppercorn Sauce", price: 3.50 },
      { name: "Side of Truffle Fries", price: 5.00 }
    ],
    prepTime: "18-22 min"
  },
  {
    id: "dish-8",
    name: "Wild Mushroom & Truffle Risotto",
    category: "mains",
    price: 22.00,
    isVeg: true,
    isChefSpecial: false,
    isGlutenFree: true,
    calories: 580,
    description: "Carnaroli rice slow-simmered in aromatic porcini broth with chanterelles, king oyster mushrooms, micro thyme, and Pecorino Romano.",
    image: "assets/images/pasta.jpg",
    modifiers: [
      { name: "White Truffle Infusion", price: 4.00 },
      { name: "Grilled Herb Chicken", price: 6.00 }
    ],
    prepTime: "15-20 min"
  },
  {
    id: "dish-9",
    name: "Diavola Spicy Salami Pizza",
    category: "pizza",
    price: 21.50,
    isVeg: false,
    isChefSpecial: false,
    isGlutenFree: false,
    calories: 720,
    description: "Spicy Calabrese soppressata salami, smoked provolone, roasted red peppers, hot honey glaze, fresh oregano on crispy blistered crust.",
    image: "assets/images/pizza.jpg",
    modifiers: [
      { name: "Extra Hot Honey Drizzle", price: 1.50 },
      { name: "Fresh Jalapeño Slices", price: 1.00 },
      { name: "Gluten-Free Crust", price: 3.00 }
    ],
    prepTime: "10-12 min"
  },
  {
    id: "dish-10",
    name: "Smoked Gouda Portobello Burger",
    category: "burgers",
    price: 18.00,
    isVeg: true,
    isChefSpecial: false,
    isGlutenFree: false,
    calories: 590,
    description: "Balsamic marinated grilled portobello mushroom cap, melted smoked Gouda, baby arugula, sun-dried tomato relish on artisan brioche.",
    image: "assets/images/burger.jpg",
    modifiers: [
      { name: "Add Avocado Slices", price: 2.50 },
      { name: "Vegan Cheddar Substitute", price: 1.50 },
      { name: "Sweet Potato Fries Sub", price: 2.50 }
    ],
    prepTime: "10-14 min"
  },
  {
    id: "dish-11",
    name: "Artisanal Burrata & Heirloom Salad",
    category: "appetizers",
    price: 17.00,
    isVeg: true,
    isChefSpecial: false,
    isGlutenFree: true,
    calories: 380,
    description: "Creamy Pugliese burrata ball, tri-color heirloom beefsteak tomatoes, 15-year aged Modena balsamic glaze, basil emulsion, toasted pine nuts.",
    image: "assets/images/pizza.jpg",
    modifiers: [
      { name: "Add Prosciutto di Parma", price: 4.50 },
      { name: "Grilled Sourdough Bread", price: 2.50 }
    ],
    prepTime: "6-8 min"
  },
  {
    id: "dish-12",
    name: "Classic Italian Tiramisu al Mascarpone",
    category: "desserts",
    price: 12.00,
    isVeg: true,
    isChefSpecial: false,
    isGlutenFree: false,
    calories: 430,
    description: "Savoiardi ladyfingers soaked in single-origin Illy espresso, amaretto liqueur, whipped mascarpone zabaione cream, Valrhona cocoa powder.",
    image: "assets/images/cheesecake.jpg",
    modifiers: [
      { name: "Espresso Shot on the Side", price: 3.00 },
      { name: "Chocolate Hazelnut Drizzle", price: 1.50 }
    ],
    prepTime: "4-6 min"
  },
  {
    id: "dish-13",
    name: "Cold Pressed Blood Orange Spritz",
    category: "beverages",
    price: 9.50,
    isVeg: true,
    isChefSpecial: false,
    isGlutenFree: true,
    calories: 140,
    description: "Sparkling botanical tonic infused with fresh Sicilian blood orange juice, rosemary sprig, angostura bitters, dehydrated orange wheel.",
    image: "assets/images/cocktail.jpg",
    modifiers: [
      { name: "Add Prosecco (Alcoholic)", price: 4.50 },
      { name: "Extra Fresh Mint", price: 0.50 }
    ],
    prepTime: "3-4 min"
  },
  {
    id: "dish-14",
    name: "Artisan Iced Caramel Macchiato",
    category: "beverages",
    price: 7.00,
    isVeg: true,
    isChefSpecial: false,
    isGlutenFree: true,
    calories: 220,
    description: "Double ristretto espresso layered over silky cold oat milk and house-made bourbon sea-salt caramel drizzle.",
    image: "assets/images/cocktail.jpg",
    modifiers: [
      { name: "Almond Milk", price: 0.75 },
      { name: "Extra Espresso Shot", price: 1.50 },
      { name: "Whipped Cream Crown", price: 1.00 }
    ],
    prepTime: "3-5 min"
  }
];

const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Dishes", icon: "🍽️" },
  { id: "appetizers", name: "Appetizers", icon: "🥗" },
  { id: "mains", name: "Chef Mains", icon: "🥩" },
  { id: "pizza", name: "Woodfire Pizza", icon: "🍕" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "pasta", name: "Artisan Pasta", icon: "🍝" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "beverages", name: "Drinks & Bar", icon: "🍹" }
];

const DEFAULT_TABLES = [
  { id: "T-01", name: "Table 1", section: "Main Dining", capacity: 2, status: "available", order: null },
  { id: "T-02", name: "Table 2", section: "Main Dining", capacity: 4, status: "occupied", order: {
    guestName: "Emma Watson",
    guestCount: 3,
    startTime: Date.now() - 35 * 60 * 1000, // 35 min ago
    items: [
      { id: "dish-2", name: "Wood-Fired Neapolitan Margherita", price: 19.00, qty: 1, notes: "Crispy crust", selectedModifiers: [] },
      { id: "dish-5", name: "Dragonfruit Passionfruit Mojito", price: 13.50, qty: 2, notes: "Less ice", selectedModifiers: [] }
    ],
    kotSent: true
  }},
  { id: "T-03", name: "Table 3", section: "Main Dining", capacity: 4, status: "available", order: null },
  { id: "T-04", name: "Table 4", section: "Main Dining", capacity: 6, status: "billed", order: {
    guestName: "David Miller",
    guestCount: 5,
    startTime: Date.now() - 68 * 60 * 1000,
    items: [
      { id: "dish-1", name: "Truffle Wagyu Deluxe Burger", price: 24.50, qty: 2, notes: "Medium", selectedModifiers: [{ name: "Extra Truffle Aioli", price: 2.50 }] },
      { id: "dish-3", name: "Jumbo Prawn Truffle Fettuccine", price: 28.00, qty: 2, notes: "", selectedModifiers: [] },
      { id: "dish-4", name: "Deconstructed Berry Cheesecake", price: 14.50, qty: 2, notes: "", selectedModifiers: [] }
    ],
    kotSent: true
  }},
  { id: "T-05", name: "Table 5", section: "Main Dining", capacity: 2, status: "available", order: null },
  { id: "T-06", name: "Terrace T-1", section: "Terrace Garden", capacity: 4, status: "reserved", order: null, reservation: { name: "Sophia Green", time: "8:00 PM" } },
  { id: "T-07", name: "Terrace T-2", section: "Terrace Garden", capacity: 4, status: "available", order: null },
  { id: "T-08", name: "Terrace T-3", section: "Terrace Garden", capacity: 6, status: "available", order: null },
  { id: "T-09", name: "VIP Lounge A", section: "VIP Private Suite", capacity: 8, status: "available", order: null },
  { id: "T-10", name: "VIP Lounge B", section: "VIP Private Suite", capacity: 10, status: "occupied", order: {
    guestName: "Lord Sterling",
    guestCount: 6,
    startTime: Date.now() - 20 * 60 * 1000,
    items: [
      { id: "dish-7", name: "Black Angus Ribeye Steak (10oz)", price: 38.00, qty: 3, notes: "Medium Rare", selectedModifiers: [{ name: "Truffle Peppercorn Sauce", price: 3.50 }] },
      { id: "dish-5", name: "Dragonfruit Passionfruit Mojito", price: 13.50, qty: 4, notes: "", selectedModifiers: [] }
    ],
    kotSent: true
  }},
  { id: "BAR-1", name: "Bar Stool 1", section: "Cocktail Bar", capacity: 1, status: "available", order: null },
  { id: "BAR-2", name: "Bar Stool 2", section: "Cocktail Bar", capacity: 1, status: "available", order: null }
];

const DEFAULT_SETTINGS = {
  restaurantName: "L'AURORA FINE DINING & BISTRO",
  tagline: "Modern Gastronomy • Wine Bar • Private Lounge",
  address: "742 Evergreen Avenue, Financial District, New York, NY",
  phone: "+1 (555) 948-2200",
  email: "billing@lauroradining.com",
  gstin: "US-TAX-84920491-B",
  currencySymbol: "$",
  currencyCode: "USD",
  tax1Name: "State Sales Tax",
  tax1Rate: 5.0, // 5%
  tax2Name: "City Hospitality Tax",
  tax2Rate: 3.875, // 3.875%
  serviceChargeRate: 5.0, // 5% optional
  serviceChargeEnabled: true,
  enableSounds: true,
  invoicePrefix: "AUR",
  printerPaperWidth: "80mm", // 80mm standard POS roll or 58mm
  cashierName: "Alex Vance (POS-01)"
};
