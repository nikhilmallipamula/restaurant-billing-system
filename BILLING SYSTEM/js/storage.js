/**
 * LocalStorage and State Management Layer
 */

const STORAGE_KEYS = {
  SETTINGS: "laurora_pos_settings_v1",
  MENU: "laurora_pos_menu_v1",
  TABLES: "laurora_pos_tables_v1",
  INVOICES: "laurora_pos_invoices_v1",
  KOT_QUEUE: "laurora_pos_kot_queue_v1",
  ORDER_COUNTER: "laurora_pos_order_counter_v1"
};

class POSStorage {
  constructor() {
    this.initDefaults();
  }

  initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_MENU_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(DEFAULT_TABLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      // Pre-seed 3 past demo orders for realistic analytics on day 1
      const seedInvoices = [
        {
          id: "AUR-1045",
          timestamp: Date.now() - 3.5 * 3600 * 1000,
          tableId: "T-01",
          tableName: "Table 1",
          orderType: "dine-in",
          guestName: "Alexander Wright",
          serverName: "Alex Vance",
          items: [
            { id: "dish-1", name: "Truffle Wagyu Deluxe Burger", price: 24.50, qty: 2, total: 49.00 },
            { id: "dish-5", name: "Dragonfruit Passionfruit Mojito", price: 13.50, qty: 2, total: 27.00 }
          ],
          subtotal: 76.00,
          discountAmount: 0,
          discountPercent: 0,
          tax1Amount: 3.80,
          tax2Amount: 2.95,
          serviceChargeAmount: 3.80,
          tipAmount: 10.00,
          grandTotal: 96.55,
          paymentMethod: "Card (Visa)",
          status: "Paid"
        },
        {
          id: "AUR-1046",
          timestamp: Date.now() - 2.1 * 3600 * 1000,
          tableId: "T-03",
          tableName: "Table 3",
          orderType: "dine-in",
          guestName: "Elena Rostova",
          serverName: "Alex Vance",
          items: [
            { id: "dish-2", name: "Wood-Fired Neapolitan Margherita", price: 19.00, qty: 1, total: 19.00 },
            { id: "dish-3", name: "Jumbo Prawn Truffle Fettuccine", price: 28.00, qty: 1, total: 28.00 },
            { id: "dish-4", name: "Deconstructed Berry Cheesecake", price: 14.50, qty: 1, total: 14.50 }
          ],
          subtotal: 61.50,
          discountAmount: 6.15,
          discountPercent: 10,
          tax1Amount: 2.77,
          tax2Amount: 2.15,
          serviceChargeAmount: 2.77,
          tipAmount: 8.00,
          grandTotal: 71.04,
          paymentMethod: "Apple Pay",
          status: "Paid"
        },
        {
          id: "AUR-1047",
          timestamp: Date.now() - 55 * 60 * 1000,
          tableId: null,
          tableName: "Takeaway #04",
          orderType: "takeaway",
          guestName: "Marcus Sterling",
          serverName: "Alex Vance",
          items: [
            { id: "dish-1", name: "Truffle Wagyu Deluxe Burger", price: 24.50, qty: 1, total: 24.50 },
            { id: "dish-9", name: "Diavola Spicy Salami Pizza", price: 21.50, qty: 1, total: 21.50 }
          ],
          subtotal: 46.00,
          discountAmount: 0,
          discountPercent: 0,
          tax1Amount: 2.30,
          tax2Amount: 1.78,
          serviceChargeAmount: 0,
          tipAmount: 5.00,
          grandTotal: 55.08,
          paymentMethod: "Cash",
          status: "Paid"
        }
      ];
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(seedInvoices));
    }
    if (!localStorage.getItem(STORAGE_KEYS.KOT_QUEUE)) {
      const seedKot = [
        {
          kotId: "KOT-301",
          orderId: "AUR-1048",
          tableName: "Table 2",
          orderType: "dine-in",
          time: Date.now() - 25 * 60 * 1000,
          items: [
            { name: "Wood-Fired Neapolitan Margherita", qty: 1, notes: "Extra crispy crust" },
            { name: "Dragonfruit Passionfruit Mojito", qty: 2, notes: "Less ice" }
          ],
          status: "preparing" // new, preparing, ready, served
        },
        {
          kotId: "KOT-302",
          orderId: "AUR-1049",
          tableName: "VIP Lounge B",
          orderType: "dine-in",
          time: Date.now() - 14 * 60 * 1000,
          items: [
            { name: "Black Angus Ribeye Steak (10oz)", qty: 3, notes: "Medium Rare, Truffle Peppercorn Sauce" },
            { name: "Dragonfruit Passionfruit Mojito", qty: 4, notes: "Rush beverage service" }
          ],
          status: "preparing"
        }
      ];
      localStorage.setItem(STORAGE_KEYS.KOT_QUEUE, JSON.stringify(seedKot));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDER_COUNTER)) {
      localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, "1050");
    }
  }

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  getMenu() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU)) || DEFAULT_MENU_ITEMS;
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
  }

  saveMenu(menu) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menu));
  }

  getTables() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES)) || DEFAULT_TABLES;
    } catch {
      return DEFAULT_TABLES;
    }
  }

  saveTables(tables) {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }

  getInvoices() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES)) || [];
    } catch {
      return [];
    }
  }

  saveInvoice(invoice) {
    const list = this.getInvoices();
    list.unshift(invoice);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(list));
    return invoice;
  }

  getKotQueue() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.KOT_QUEUE)) || [];
    } catch {
      return [];
    }
  }

  saveKotQueue(queue) {
    localStorage.setItem(STORAGE_KEYS.KOT_QUEUE, JSON.stringify(queue));
  }

  addKot(kot) {
    const queue = this.getKotQueue();
    queue.push(kot);
    this.saveKotQueue(queue);
  }

  updateKotStatus(kotId, newStatus) {
    const queue = this.getKotQueue();
    const item = queue.find(k => k.kotId === kotId);
    if (item) {
      item.status = newStatus;
      this.saveKotQueue(queue);
    }
  }

  getNextOrderId() {
    const current = parseInt(localStorage.getItem(STORAGE_KEYS.ORDER_COUNTER) || "1050", 10);
    const settings = this.getSettings();
    const prefix = settings.invoicePrefix || "AUR";
    localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, (current + 1).toString());
    return `${prefix}-${current}`;
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.KOT_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.ORDER_COUNTER);
    this.initDefaults();
  }
}

const posStorage = new POSStorage();
