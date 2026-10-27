/**
 * L'AURORA POS & BILLING SYSTEM - MAIN CONTROLLER
 */

class POSApp {
  constructor() {
    this.storage = posStorage;
    this.audio = posAudio;
    
    // Core State
    this.settings = this.storage.getSettings();
    this.menu = this.storage.getMenu();
    this.tables = this.storage.getTables();
    
    this.activeOrderMode = 'dine-in'; // dine-in, takeaway, delivery
    this.activeTableId = 'T-01';
    this.currentOrderId = this.storage.getNextOrderId();
    this.activeCategory = 'all';
    this.activeDietFilter = 'all';
    this.searchQuery = '';
    
    this.cart = [];
    this.discountPercent = 0;
    this.selectedTipPercent = 0;
    this.currentPaymentMethod = 'cash';
    this.currentTenderedCash = 0;
    this.splitGuestCount = 4;
    
    // Dish customizer temp holder
    this.pendingCustomizeDish = null;

    this.init();
  }

  init() {
    this.setupClock();
    this.setupTheme();
    this.setupEventListeners();
    this.loadActiveTableOrder();
    this.renderCategories();
    this.renderMenu();
    this.renderTables();
    this.renderKds();
    this.renderAnalytics();
    this.renderCart();
    this.updateBrandHeader();
    this.populateSettingsForm();
  }

  // --- Brand & Settings ---
  updateBrandHeader() {
    const s = this.settings;
    const nameEl = document.getElementById('nav-brand-name');
    if (nameEl) nameEl.textContent = s.restaurantName.split(' ')[0] || "L'AURORA";
    
    const serverEl = document.getElementById('nav-server-info');
    if (serverEl) serverEl.textContent = `${s.cashierName} • Reg #01`;
  }

  formatMoney(amount) {
    const sym = this.settings.currencySymbol || '$';
    return `${sym}${Number(amount || 0).toFixed(2)}`;
  }

  setupClock() {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      
      const timeEl = document.getElementById('live-clock-time');
      const dateEl = document.getElementById('live-clock-date');
      if (timeEl) timeEl.textContent = timeStr;
      if (dateEl) dateEl.textContent = dateStr;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('laurora_pos_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('laurora_pos_theme', isLight ? 'light' : 'dark');
    this.audio.playClick();
    this.showToast(`Switched to ${isLight ? 'Light Bistro' : 'Dark Obsidian'} theme`, 'info');
  }

  // --- Category & Menu Rendering ---
  renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = DEFAULT_CATEGORIES.map(cat => `
      <button type="button" class="cat-tab-btn ${this.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        <span class="cat-icon">${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.cat-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCategory = btn.dataset.cat;
        this.audio.playClick();
        this.renderCategories();
        this.renderMenu();
      });
    });
  }

  renderMenu() {
    const container = document.getElementById('dishes-container');
    if (!container) return;

    let items = this.menu;

    // Filter by Category
    if (this.activeCategory !== 'all') {
      items = items.filter(d => d.category === this.activeCategory);
    }

    // Filter by Diet
    if (this.activeDietFilter === 'veg') {
      items = items.filter(d => d.isVeg);
    } else if (this.activeDietFilter === 'nonveg') {
      items = items.filter(d => !d.isVeg);
    } else if (this.activeDietFilter === 'special') {
      items = items.filter(d => d.isChefSpecial);
    } else if (this.activeDietFilter === 'gf') {
      items = items.filter(d => d.isGlutenFree);
    }

    // Filter by Search Query
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q)
      );
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <p>No delicious dishes matched your search or filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(dish => {
      const dietBadge = dish.isVeg ? 
        `<span class="dish-badge badge-diet-veg">🟢 Veg</span>` : 
        `<span class="dish-badge badge-diet-nonveg">🔴 Non-Veg</span>`;
      const specialBadge = dish.isChefSpecial ? 
        `<span class="dish-badge badge-special">⭐ Chef Pick</span>` : '';

      return `
        <article class="dish-card" data-dish-id="${dish.id}">
          <div class="dish-image-wrap">
            <img src="${dish.image}" alt="${dish.name}" class="dish-img" loading="lazy">
            <div class="dish-badges">
              ${specialBadge}
              ${dietBadge}
            </div>
          </div>
          <div class="dish-body">
            <h3 class="dish-title">${dish.name}</h3>
            <p class="dish-desc">${dish.description}</p>
            <div class="dish-footer">
              <span class="dish-price">${this.formatMoney(dish.price)}</span>
              <button type="button" class="add-dish-btn" title="Add to Order" aria-label="Add ${dish.name}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners
    container.querySelectorAll('.dish-card').forEach(card => {
      card.addEventListener('click', () => {
        const dishId = card.dataset.dishId;
        const dish = this.menu.find(d => d.id === dishId);
        if (!dish) return;

        // If dish has modifiers or options, open customization modal; otherwise add directly
        if (dish.modifiers && dish.modifiers.length > 0) {
          this.openCustomizerModal(dish);
        } else {
          this.addToCart(dish, [], "");
        }
      });
    });
  }

  // --- Customizer Modal ---
  openCustomizerModal(dish) {
    this.pendingCustomizeDish = dish;
    const modal = document.getElementById('modal-customizer');
    document.getElementById('customizer-dish-title').textContent = `Customize: ${dish.name}`;
    document.getElementById('customizer-name-display').textContent = dish.name;
    document.getElementById('customizer-base-price').textContent = this.formatMoney(dish.price);
    document.getElementById('customizer-dish-img').src = dish.image;
    document.getElementById('customizer-special-notes').value = '';

    const listContainer = document.getElementById('customizer-modifiers-list');
    listContainer.innerHTML = dish.modifiers.map((mod, idx) => `
      <label style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); cursor: pointer;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <input type="checkbox" name="custom-mod" value="${idx}" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
          <span style="font-size: 0.85rem; font-weight: 600;">${mod.name}</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-gold);">
          ${mod.price > 0 ? `+${this.formatMoney(mod.price)}` : 'Included'}
        </span>
      </label>
    `).join('');

    modal.classList.add('active');
    this.audio.playClick();
  }

  confirmCustomizerAdd() {
    if (!this.pendingCustomizeDish) return;
    const modal = document.getElementById('modal-customizer');
    const checkedInputs = modal.querySelectorAll('input[name="custom-mod"]:checked');
    const selectedMods = Array.from(checkedInputs).map(inp => this.pendingCustomizeDish.modifiers[parseInt(inp.value, 10)]);
    const notes = document.getElementById('customizer-special-notes').value.trim();

    this.addToCart(this.pendingCustomizeDish, selectedMods, notes);
    modal.classList.remove('active');
    this.pendingCustomizeDish = null;
  }

  // --- Cart Management ---
  addToCart(dish, selectedModifiers = [], notes = "") {
    // Generate unique composite key
    const modKey = selectedModifiers.map(m => m.name).sort().join('|');
    const itemKey = `${dish.id}__${modKey}__${notes}`;

    const existingIndex = this.cart.findIndex(i => i.itemKey === itemKey);
    if (existingIndex > -1) {
      this.cart[existingIndex].qty += 1;
    } else {
      const modifierSum = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
      this.cart.push({
        id: dish.id,
        itemKey,
        name: dish.name,
        basePrice: dish.price,
        unitPrice: dish.price + modifierSum,
        qty: 1,
        selectedModifiers,
        notes
      });
    }

    this.audio.playBeep();
    this.saveCurrentTableOrder();
    this.renderCart();
    this.showToast(`Added ${dish.name} to ticket`, 'success');
  }

  updateItemQty(itemKey, delta) {
    const idx = this.cart.findIndex(i => i.itemKey === itemKey);
    if (idx === -1) return;

    this.cart[idx].qty += delta;
    if (this.cart[idx].qty <= 0) {
      this.cart.splice(idx, 1);
      this.audio.playClick();
    } else {
      this.audio.playBeep();
    }

    this.saveCurrentTableOrder();
    this.renderCart();
  }

  removeItem(itemKey) {
    this.cart = this.cart.filter(i => i.itemKey !== itemKey);
    this.audio.playClick();
    this.saveCurrentTableOrder();
    this.renderCart();
  }

  clearCart() {
    if (this.cart.length === 0) return;
    if (confirm("Are you sure you want to clear the entire active ticket?")) {
      this.cart = [];
      this.audio.playClick();
      this.saveCurrentTableOrder();
      this.renderCart();
      this.showToast("Ticket cleared", "info");
    }
  }

  calculateTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
    const discountAmount = subtotal * (this.discountPercent / 100);
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);

    const tax1Rate = parseFloat(this.settings.tax1Rate) || 0;
    const tax2Rate = parseFloat(this.settings.tax2Rate) || 0;
    const tax1Amount = taxableSubtotal * (tax1Rate / 100);
    const tax2Amount = taxableSubtotal * (tax2Rate / 100);
    const totalTax = tax1Amount + tax2Amount;

    let serviceChargeAmount = 0;
    if (this.settings.serviceChargeEnabled && this.activeOrderMode === 'dine-in') {
      const sRate = parseFloat(this.settings.serviceChargeRate) || 0;
      serviceChargeAmount = taxableSubtotal * (sRate / 100);
    }

    const tipAmount = taxableSubtotal * (this.selectedTipPercent / 100);
    const grandTotal = taxableSubtotal + totalTax + serviceChargeAmount + tipAmount;

    return {
      subtotal,
      discountAmount,
      taxableSubtotal,
      tax1Amount,
      tax2Amount,
      totalTax,
      serviceChargeAmount,
      tipAmount,
      grandTotal
    };
  }

  renderCart() {
    const listEl = document.getElementById('cart-items-list');
    const orderIdEl = document.getElementById('cart-order-id');
    const checkoutBtn = document.getElementById('btn-proceed-pay');
    const tableTagEl = document.getElementById('cart-table-tag');
    
    if (orderIdEl) orderIdEl.textContent = this.currentOrderId;
    
    // Update Table Tag in Cart Header
    const currentTable = this.tables.find(t => t.id === this.activeTableId);
    if (tableTagEl) {
      if (this.activeOrderMode === 'dine-in') {
        tableTagEl.textContent = currentTable ? `🍽️ ${currentTable.name} (${currentTable.section})` : '🍽️ Dine-In Table';
      } else if (this.activeOrderMode === 'takeaway') {
        tableTagEl.textContent = '🛍️ Takeaway Counter';
      } else {
        tableTagEl.textContent = '🛵 Delivery Order';
      }
    }

    if (this.cart.length === 0) {
      listEl.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">🍽️</div>
          <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-secondary);">Your ticket is empty</p>
          <span style="font-size: 0.78rem;">Tap on any dish from the menu to start composing this order.</span>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      listEl.innerHTML = this.cart.map(item => {
        const itemTotal = item.unitPrice * item.qty;
        const modStrings = item.selectedModifiers.map(m => m.name).join(', ');
        
        return `
          <div class="cart-item-row" data-key="${item.itemKey}">
            <div class="cart-item-top">
              <div>
                <span class="cart-item-title">${item.name}</span>
                ${modStrings ? `<div class="cart-item-mods">+ ${modStrings}</div>` : ''}
                ${item.notes ? `<div style="font-size: 0.72rem; color: var(--accent-rose); font-style: italic;">Note: ${item.notes}</div>` : ''}
              </div>
              <button type="button" class="cart-item-delete" title="Remove" data-remove="${item.itemKey}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div class="cart-item-bottom">
              <div class="qty-stepper">
                <button type="button" class="qty-btn" data-minus="${item.itemKey}">-</button>
                <span class="qty-val">${item.qty}</span>
                <button type="button" class="qty-btn" data-plus="${item.itemKey}">+</button>
              </div>
              <span class="cart-item-total">${this.formatMoney(itemTotal)}</span>
            </div>
          </div>
        `;
      }).join('');

      if (checkoutBtn) checkoutBtn.disabled = false;

      // Attach Stepper & Remove Event Listeners
      listEl.querySelectorAll('[data-minus]').forEach(btn => {
        btn.addEventListener('click', () => this.updateItemQty(btn.dataset.minus, -1));
      });
      listEl.querySelectorAll('[data-plus]').forEach(btn => {
        btn.addEventListener('click', () => this.updateItemQty(btn.dataset.plus, 1));
      });
      listEl.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => this.removeItem(btn.dataset.remove));
      });
    }

    // Calculations Summary
    const totals = this.calculateTotals();
    
    document.getElementById('summary-subtotal').textContent = this.formatMoney(totals.subtotal);
    
    const discRow = document.getElementById('summary-discount-row');
    if (this.discountPercent > 0) {
      discRow.style.display = 'flex';
      document.getElementById('summary-discount-pct').textContent = this.discountPercent;
      document.getElementById('summary-discount-val').textContent = `-${this.formatMoney(totals.discountAmount)}`;
    } else {
      discRow.style.display = 'none';
    }

    document.getElementById('summary-tax-amount').textContent = this.formatMoney(totals.totalTax);
    
    const serviceRow = document.getElementById('summary-service-row');
    if (this.settings.serviceChargeEnabled && this.activeOrderMode === 'dine-in') {
      serviceRow.style.display = 'flex';
      document.getElementById('summary-service-amount').textContent = this.formatMoney(totals.serviceChargeAmount);
    } else {
      serviceRow.style.display = 'none';
    }

    document.getElementById('summary-grand-total').textContent = this.formatMoney(totals.grandTotal);
  }

  // --- Table Operations ---
  loadActiveTableOrder() {
    const table = this.tables.find(t => t.id === this.activeTableId);
    const guestInput = document.getElementById('cart-guest-name');
    const guestCountInput = document.getElementById('cart-guest-count');
    const activeTableDot = document.getElementById('active-table-dot');
    const activeTableText = document.getElementById('active-table-text');

    if (table) {
      if (activeTableText) {
        activeTableText.innerHTML = `Table: <strong>${table.name}</strong>`;
      }
      if (activeTableDot) {
        activeTableDot.className = `table-status-dot ${table.status === 'occupied' ? 'occupied' : ''}`;
      }

      if (table.order) {
        this.cart = table.order.items.map(i => ({
          ...i,
          itemKey: `${i.id}__${(i.selectedModifiers || []).map(m => m.name).sort().join('|')}__${i.notes || ''}`
        }));
        if (guestInput) guestInput.value = table.order.guestName || '';
        if (guestCountInput) guestCountInput.value = table.order.guestCount || table.capacity;
      } else {
        this.cart = [];
        if (guestInput) guestInput.value = '';
        if (guestCountInput) guestCountInput.value = table.capacity;
      }
    }
  }

  saveCurrentTableOrder() {
    if (this.activeOrderMode !== 'dine-in') return;
    const table = this.tables.find(t => t.id === this.activeTableId);
    if (!table) return;

    const guestName = (document.getElementById('cart-guest-name')?.value || '').trim();
    const guestCount = parseInt(document.getElementById('cart-guest-count')?.value || '2', 10);

    if (this.cart.length > 0) {
      table.status = 'occupied';
      table.order = {
        guestName: guestName || 'Walk-in Guest',
        guestCount,
        startTime: table.order?.startTime || Date.now(),
        items: this.cart,
        kotSent: table.order?.kotSent || false
      };
    } else {
      table.status = 'available';
      table.order = null;
    }

    this.storage.saveTables(this.tables);
    this.renderTables();
  }

  selectTable(tableId) {
    this.activeTableId = tableId;
    this.audio.playClick();
    this.loadActiveTableOrder();
    this.renderCart();
    this.renderTables();
    this.switchView('menu');
  }

  renderTables() {
    const container = document.getElementById('floor-zones-container');
    if (!container) return;

    // Group tables by section
    const sections = {};
    this.tables.forEach(t => {
      if (!sections[t.section]) sections[t.section] = [];
      sections[t.section].push(t);
    });

    container.innerHTML = Object.entries(sections).map(([sectionName, tableList]) => `
      <div class="floor-zone-block">
        <h3 class="zone-title">📍 ${sectionName}</h3>
        <div class="zone-grid">
          ${tableList.map(t => {
            const isSelected = t.id === this.activeTableId;
            let statusBadgeClass = `badge-${t.status}`;
            let statusLabel = t.status.toUpperCase();
            let elapsedText = '';
            let amountText = '';

            if (t.order) {
              const minutes = Math.floor((Date.now() - t.order.startTime) / 60000);
              elapsedText = `⏳ Seated: ${minutes}m`;
              const orderTotal = t.order.items.reduce((s, i) => s + (i.unitPrice || i.price) * i.qty, 0);
              amountText = this.formatMoney(orderTotal);
            }

            return `
              <div class="table-card status-${t.status} ${isSelected ? 'selected-active-table' : ''}" data-table-id="${t.id}" style="${isSelected ? 'box-shadow: 0 0 0 2px var(--accent-gold);' : ''}">
                <div class="table-top-info">
                  <span class="table-number-label">${t.name}</span>
                  <span class="table-badge-status ${statusBadgeClass}">${statusLabel}</span>
                </div>
                <div class="table-mid-details">
                  <div>Capacity: 👥 ${t.capacity} guests</div>
                  ${t.order ? `
                    <div class="table-guest-name">👤 ${t.order.guestName}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${elapsedText}</div>
                    <div class="table-order-amount">${amountText}</div>
                  ` : `
                    <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 6px;">Ready for guests</div>
                  `}
                </div>
                <div class="table-actions-strip">
                  <button type="button" class="table-action-btn btn-table-open" data-select-table="${t.id}">
                    ${t.id === this.activeTableId ? '✓ Active Table' : 'Open Ticket'}
                  </button>
                  ${t.order ? `
                    <button type="button" class="table-action-btn btn-table-clear" data-clear-table="${t.id}" title="Clear Table" style="color: var(--accent-rose);">
                      Vacate
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Attach Table Card Listeners
    container.querySelectorAll('[data-select-table]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectTable(btn.dataset.selectTable);
      });
    });

    container.querySelectorAll('[data-clear-table]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tId = btn.dataset.clearTable;
        if (confirm(`Vacate and reset table ${tId}?`)) {
          const t = this.tables.find(x => x.id === tId);
          if (t) {
            t.status = 'available';
            t.order = null;
            this.storage.saveTables(this.tables);
            if (this.activeTableId === tId) {
              this.cart = [];
              this.renderCart();
            }
            this.renderTables();
            this.showToast(`Table ${tId} vacated`, 'info');
          }
        }
      });
    });

    container.querySelectorAll('.table-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectTable(card.dataset.tableId);
      });
    });
  }

  // --- Kitchen Display System (KDS) ---
  fireKitchenOrder() {
    if (this.cart.length === 0) {
      this.showToast("Cannot fire empty ticket to kitchen!", "danger");
      this.audio.playError();
      return;
    }

    const currentTable = this.tables.find(t => t.id === this.activeTableId);
    const tableName = this.activeOrderMode === 'dine-in' ? (currentTable ? currentTable.name : 'Table') : 'Takeaway';
    
    const kotId = `KOT-${Math.floor(100 + Math.random() * 900)}`;
    const kotData = {
      kotId,
      orderId: this.currentOrderId,
      tableName,
      orderType: this.activeOrderMode,
      time: Date.now(),
      items: this.cart.map(i => ({
        name: i.name,
        qty: i.qty,
        notes: [i.notes, ...i.selectedModifiers.map(m => m.name)].filter(Boolean).join(', ')
      })),
      status: 'new'
    };

    this.storage.addKot(kotData);
    this.audio.playKitchenBell();
    this.showToast(`🔥 Kitchen Ticket #${kotId} fired successfully!`, 'success');

    // Mark current table order as KOT sent
    if (currentTable && currentTable.order) {
      currentTable.order.kotSent = true;
      this.storage.saveTables(this.tables);
    }

    this.renderKds();
  }

  renderKds() {
    const queue = this.storage.getKotQueue();
    const streamNew = document.getElementById('kds-stream-new');
    const streamPrep = document.getElementById('kds-stream-prep');
    const streamReady = document.getElementById('kds-stream-ready');

    const newOrders = queue.filter(k => k.status === 'new');
    const prepOrders = queue.filter(k => k.status === 'preparing');
    const readyOrders = queue.filter(k => k.status === 'ready');

    // Update Counter Badges
    document.getElementById('kds-count-new').textContent = newOrders.length;
    document.getElementById('kds-count-prep').textContent = prepOrders.length;
    document.getElementById('kds-count-ready').textContent = readyOrders.length;
    
    const navBadge = document.getElementById('kds-badge-count');
    if (navBadge) {
      const activeCount = newOrders.length + prepOrders.length;
      navBadge.textContent = activeCount;
      navBadge.style.display = activeCount > 0 ? 'inline-block' : 'none';
    }

    const renderCard = (kot, nextActionLabel, nextStatus) => {
      const elapsedMin = Math.floor((Date.now() - kot.time) / 60000);
      const isUrgent = elapsedMin >= 15;

      return `
        <div class="kds-ticket-card ${kot.status} ${isUrgent ? 'urgent' : ''}" data-kot-id="${kot.kotId}">
          <div class="kds-ticket-header">
            <div>
              <span class="kds-ticket-id">${kot.kotId}</span>
              <span style="font-size: 0.75rem; color: var(--text-secondary); margin-left: 6px;">[${kot.tableName}]</span>
            </div>
            <span class="kds-ticket-timer" style="${isUrgent ? 'background: var(--accent-rose); color: white;' : ''}">
              ${elapsedMin}m ago
            </span>
          </div>

          <ul class="kds-ticket-items">
            ${kot.items.map(it => `
              <li class="kds-item-row">
                <div>
                  <span class="kds-item-qty">${it.qty}x</span>
                  <span>${it.name}</span>
                  ${it.notes ? `<span class="kds-item-notes">${it.notes}</span>` : ''}
                </div>
              </li>
            `).join('')}
          </ul>

          ${nextStatus ? `
            <button type="button" class="kds-action-btn" data-advance-kot="${kot.kotId}" data-next-status="${nextStatus}">
              ${nextActionLabel}
            </button>
          ` : `
            <button type="button" class="kds-action-btn" data-advance-kot="${kot.kotId}" data-next-status="completed" style="background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald);">
              ✓ Mark Served & Done
            </button>
          `}
        </div>
      `;
    };

    if (streamNew) {
      streamNew.innerHTML = newOrders.length ? 
        newOrders.map(k => renderCard(k, '🍳 Start Cooking', 'preparing')).join('') :
        `<div style="text-align: center; color: var(--text-muted); padding: 30px 10px; font-size: 0.8rem;">No pending incoming tickets</div>`;
    }

    if (streamPrep) {
      streamPrep.innerHTML = prepOrders.length ? 
        prepOrders.map(k => renderCard(k, '✨ Mark Plated & Ready', 'ready')).join('') :
        `<div style="text-align: center; color: var(--text-muted); padding: 30px 10px; font-size: 0.8rem;">No tickets currently on stove</div>`;
    }

    if (streamReady) {
      streamReady.innerHTML = readyOrders.length ? 
        readyOrders.map(k => renderCard(k, '✓ Mark Picked Up & Served', 'completed')).join('') :
        `<div style="text-align: center; color: var(--text-muted); padding: 30px 10px; font-size: 0.8rem;">No dishes waiting on pass</div>`;
    }

    // Attach advance status listeners
    document.querySelectorAll('[data-advance-kot]').forEach(btn => {
      btn.addEventListener('click', () => {
        const kotId = btn.dataset.advanceKot;
        const nextStatus = btn.dataset.nextStatus;
        if (nextStatus === 'completed') {
          // Remove from active queue
          const queue = this.storage.getKotQueue().filter(k => k.kotId !== kotId);
          this.storage.saveKotQueue(queue);
          this.showToast(`Ticket ${kotId} served!`, 'success');
        } else {
          this.storage.updateKotStatus(kotId, nextStatus);
        }
        this.audio.playClick();
        this.renderKds();
      });
    });
  }

  // --- Payment & Checkout Modal ---
  openPaymentModal() {
    if (this.cart.length === 0) {
      this.showToast("Your cart is empty!", "danger");
      return;
    }

    const totals = this.calculateTotals();
    const modal = document.getElementById('modal-payment');
    document.getElementById('modal-pay-amount').textContent = this.formatMoney(totals.grandTotal);
    document.getElementById('qr-amount-display').textContent = this.formatMoney(totals.grandTotal);
    document.getElementById('cash-calc-total').textContent = this.formatMoney(totals.grandTotal);

    this.currentTenderedCash = totals.grandTotal;
    const cashInput = document.getElementById('cash-received-input');
    if (cashInput) {
      cashInput.value = totals.grandTotal.toFixed(2);
    }
    this.updateCashChange();

    modal.classList.add('active');
    this.audio.playClick();
  }

  updateCashChange() {
    const totals = this.calculateTotals();
    const inputVal = parseFloat(document.getElementById('cash-received-input')?.value || '0');
    const tendered = isNaN(inputVal) ? 0 : inputVal;
    const change = Math.max(0, tendered - totals.grandTotal);

    document.getElementById('cash-calc-tendered').textContent = this.formatMoney(tendered);
    document.getElementById('cash-calc-change').textContent = this.formatMoney(change);
  }

  confirmSettlement() {
    const totals = this.calculateTotals();
    const guestName = (document.getElementById('cart-guest-name')?.value || '').trim() || 'Walk-in Guest';
    const currentTable = this.tables.find(t => t.id === this.activeTableId);
    const tableName = this.activeOrderMode === 'dine-in' ? (currentTable ? currentTable.name : 'Table') : 'Takeaway';

    let payMethodName = 'Cash';
    if (this.currentPaymentMethod === 'card') payMethodName = 'Card (Visa/Mastercard)';
    if (this.currentPaymentMethod === 'qr') payMethodName = 'Digital QR / UPI';
    if (this.currentPaymentMethod === 'wallet') payMethodName = 'Apple Pay';

    const invoice = {
      id: this.currentOrderId,
      timestamp: Date.now(),
      tableId: this.activeOrderMode === 'dine-in' ? this.activeTableId : null,
      tableName,
      orderType: this.activeOrderMode,
      guestName,
      serverName: this.settings.cashierName,
      items: this.cart.map(i => ({
        id: i.id,
        name: i.name,
        price: i.unitPrice,
        qty: i.qty,
        total: i.unitPrice * i.qty,
        modifiers: i.selectedModifiers.map(m => m.name)
      })),
      subtotal: totals.subtotal,
      discountPercent: this.discountPercent,
      discountAmount: totals.discountAmount,
      tax1Amount: totals.tax1Amount,
      tax2Amount: totals.tax2Amount,
      totalTax: totals.totalTax,
      serviceChargeAmount: totals.serviceChargeAmount,
      tipAmount: totals.tipAmount,
      grandTotal: totals.grandTotal,
      paymentMethod: payMethodName,
      status: 'Paid'
    };

    // Save Invoice to Storage
    this.storage.saveInvoice(invoice);

    // Audio Cash Chime
    this.audio.playCashRegister();

    // Close Payment Modal
    document.getElementById('modal-payment').classList.remove('active');

    // Vacate table if dine-in
    if (this.activeOrderMode === 'dine-in' && currentTable) {
      currentTable.status = 'available';
      currentTable.order = null;
      this.storage.saveTables(this.tables);
      this.renderTables();
    }

    // Show Printable Receipt Modal
    this.showPrintableReceipt(invoice);
    this.renderAnalytics();
    this.showToast(`🎉 Order #${invoice.id} settled successfully!`, 'success');
  }

  // --- Thermal Receipt Modal ---
  showPrintableReceipt(inv) {
    const s = this.settings;
    document.getElementById('rcpt-restaurant-name').textContent = s.restaurantName;
    document.getElementById('rcpt-tagline').textContent = s.tagline;
    document.getElementById('rcpt-address').textContent = s.address;
    document.getElementById('rcpt-phone').textContent = `Tel: ${s.phone}`;
    document.getElementById('rcpt-gstin').textContent = `Tax ID: ${s.gstin}`;

    document.getElementById('rcpt-invoice-id').textContent = inv.id;
    document.getElementById('rcpt-date-time').textContent = new Date(inv.timestamp).toLocaleString();
    document.getElementById('rcpt-table-name').textContent = inv.tableName;
    document.getElementById('rcpt-server-name').textContent = inv.serverName;
    document.getElementById('rcpt-customer-name').textContent = inv.guestName;

    // Items table
    const itemsTbody = document.getElementById('rcpt-items-body');
    itemsTbody.innerHTML = inv.items.map(it => `
      <tr>
        <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${it.name}
          ${it.modifiers?.length ? `<div style="font-size: 8px; color: #555;">+ ${it.modifiers.join(', ')}</div>` : ''}
        </td>
        <td class="num-col">${it.qty}</td>
        <td class="num-col">${this.formatMoney(it.price)}</td>
        <td class="num-col">${this.formatMoney(it.total)}</td>
      </tr>
    `).join('');

    document.getElementById('rcpt-subtotal').textContent = this.formatMoney(inv.subtotal);
    
    const discRow = document.getElementById('rcpt-discount-row');
    if (inv.discountAmount > 0) {
      discRow.style.display = 'flex';
      document.getElementById('rcpt-discount').textContent = `-${this.formatMoney(inv.discountAmount)}`;
    } else {
      discRow.style.display = 'none';
    }

    document.getElementById('rcpt-tax').textContent = this.formatMoney(inv.totalTax);
    
    const srvRow = document.getElementById('rcpt-service-row');
    if (inv.serviceChargeAmount > 0) {
      srvRow.style.display = 'flex';
      document.getElementById('rcpt-service').textContent = this.formatMoney(inv.serviceChargeAmount);
    } else {
      srvRow.style.display = 'none';
    }

    const tipRow = document.getElementById('rcpt-tip-row');
    if (inv.tipAmount > 0) {
      tipRow.style.display = 'flex';
      document.getElementById('rcpt-tip').textContent = this.formatMoney(inv.tipAmount);
    } else {
      tipRow.style.display = 'none';
    }

    document.getElementById('rcpt-grand-total').textContent = this.formatMoney(inv.grandTotal);
    document.getElementById('rcpt-payment-mode').textContent = inv.paymentMethod.toUpperCase();

    const receiptModal = document.getElementById('printable-receipt-modal');
    receiptModal.classList.add('active');
  }

  startNewOrder() {
    document.getElementById('printable-receipt-modal').classList.remove('active');
    this.cart = [];
    this.discountPercent = 0;
    this.selectedTipPercent = 0;
    this.currentOrderId = this.storage.getNextOrderId();
    
    // Reset guest input
    const gInput = document.getElementById('cart-guest-name');
    if (gInput) gInput.value = '';

    // Reset discount buttons
    document.querySelectorAll('.discount-preset-strip .discount-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.discount === '0');
    });

    this.renderCart();
    this.audio.playClick();
    this.showToast(`Ready for next customer! Ticket #${this.currentOrderId}`, 'info');
  }

  // --- Split Bill Modal ---
  openSplitModal() {
    if (this.cart.length === 0) {
      this.showToast("Cannot split empty bill!", "danger");
      return;
    }
    const totals = this.calculateTotals();
    const modal = document.getElementById('modal-split-bill');
    document.getElementById('split-total-display').textContent = this.formatMoney(totals.grandTotal);
    this.updateSplitCalculation();
    modal.classList.add('active');
    this.audio.playClick();
  }

  updateSplitCalculation() {
    const totals = this.calculateTotals();
    const perPerson = totals.grandTotal / this.splitGuestCount;
    document.getElementById('split-guests-count').textContent = this.splitGuestCount;
    document.getElementById('split-per-person').textContent = this.formatMoney(perPerson);
  }

  // --- Analytics & Reports ---
  renderAnalytics() {
    const invoices = this.storage.getInvoices();
    const grossRev = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalOrders = invoices.length;
    const aov = totalOrders > 0 ? (grossRev / totalOrders) : 0;
    const totalTaxes = invoices.reduce((sum, inv) => sum + (inv.totalTax || 0) + (inv.serviceChargeAmount || 0), 0);

    const grossEl = document.getElementById('kpi-gross-revenue');
    if (grossEl) grossEl.textContent = this.formatMoney(grossRev);
    
    const countEl = document.getElementById('kpi-orders-count');
    if (countEl) countEl.textContent = totalOrders;
    
    const aovEl = document.getElementById('kpi-aov');
    if (aovEl) aovEl.textContent = this.formatMoney(aov);

    const taxEl = document.getElementById('kpi-taxes');
    if (taxEl) taxEl.textContent = this.formatMoney(totalTaxes);

    const tbody = document.getElementById('invoices-table-body');
    if (!tbody) return;

    if (invoices.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;">No completed transactions yet today.</td></tr>`;
      return;
    }

    tbody.innerHTML = invoices.map(inv => {
      const timeStr = new Date(inv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const itemsCount = inv.items.reduce((s, i) => s + i.qty, 0);

      return `
        <tr>
          <td><span class="inv-code">${inv.id}</span></td>
          <td>${timeStr}</td>
          <td><span style="text-transform: capitalize;">${inv.orderType}</span></td>
          <td>${inv.tableName} (${inv.guestName})</td>
          <td>${itemsCount} items</td>
          <td><span class="inv-amount">${this.formatMoney(inv.grandTotal)}</span></td>
          <td>${inv.paymentMethod}</td>
          <td>
            <button type="button" class="btn-kot" data-reprint="${inv.id}" style="padding: 4px 10px; font-size: 0.72rem;">
              Reprint
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-reprint]').forEach(btn => {
      btn.addEventListener('click', () => {
        const invId = btn.dataset.reprint;
        const target = invoices.find(i => i.id === invId);
        if (target) {
          this.showPrintableReceipt(target);
        }
      });
    });
  }

  exportCsvReport() {
    const invoices = this.storage.getInvoices();
    if (invoices.length === 0) {
      this.showToast("No sales records to export!", "danger");
      return;
    }

    const headers = ["Invoice ID", "Date", "Time", "Order Type", "Table", "Customer", "Items Count", "Subtotal", "Discount", "Tax", "Tip", "Grand Total", "Payment Mode"];
    const rows = invoices.map(i => {
      const d = new Date(i.timestamp);
      return [
        i.id,
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        i.orderType,
        i.tableName,
        `"${i.guestName}"`,
        i.items.reduce((s, x) => s + x.qty, 0),
        i.subtotal.toFixed(2),
        i.discountAmount.toFixed(2),
        i.totalTax.toFixed(2),
        i.tipAmount.toFixed(2),
        i.grandTotal.toFixed(2),
        `"${i.paymentMethod}"`
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aurora_pos_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("CSV Sales Report downloaded!", "success");
  }

  // --- Settings Form ---
  populateSettingsForm() {
    const s = this.settings;
    const nameInp = document.getElementById('setting-name');
    if (nameInp) nameInp.value = s.restaurantName;
    
    const tagInp = document.getElementById('setting-tagline');
    if (tagInp) tagInp.value = s.tagline;

    const addrInp = document.getElementById('setting-address');
    if (addrInp) addrInp.value = s.address;

    const phoneInp = document.getElementById('setting-phone');
    if (phoneInp) phoneInp.value = s.phone;

    const gstinInp = document.getElementById('setting-gstin');
    if (gstinInp) gstinInp.value = s.gstin;

    const currSelect = document.getElementById('setting-currency');
    if (currSelect) {
      currSelect.value = `${s.currencySymbol}|${s.currencyCode}`;
    }

    const tax1Inp = document.getElementById('setting-tax1-rate');
    if (tax1Inp) tax1Inp.value = s.tax1Rate;

    const tax2Inp = document.getElementById('setting-tax2-rate');
    if (tax2Inp) tax2Inp.value = s.tax2Rate;

    const srvCheck = document.getElementById('setting-service-charge');
    if (srvCheck) srvCheck.checked = s.serviceChargeEnabled;

    const sndCheck = document.getElementById('setting-sounds');
    if (sndCheck) sndCheck.checked = s.enableSounds;
  }

  saveSettingsFromForm() {
    const currVal = document.getElementById('setting-currency').value.split('|');
    this.settings = {
      ...this.settings,
      restaurantName: document.getElementById('setting-name').value.trim() || "L'AURORA RESTAURANT",
      tagline: document.getElementById('setting-tagline').value.trim(),
      address: document.getElementById('setting-address').value.trim(),
      phone: document.getElementById('setting-phone').value.trim(),
      gstin: document.getElementById('setting-gstin').value.trim(),
      currencySymbol: currVal[0],
      currencyCode: currVal[1],
      tax1Rate: parseFloat(document.getElementById('setting-tax1-rate').value) || 0,
      tax2Rate: parseFloat(document.getElementById('setting-tax2-rate').value) || 0,
      serviceChargeEnabled: document.getElementById('setting-service-charge').checked,
      enableSounds: document.getElementById('setting-sounds').checked
    };

    this.audio.enabled = this.settings.enableSounds;
    this.storage.saveSettings(this.settings);
    this.updateBrandHeader();
    this.renderMenu();
    this.renderCart();
    this.renderTables();
    this.renderAnalytics();
    this.audio.playClick();
    this.showToast("Settings updated successfully!", "success");
  }

  // --- View Switcher ---
  switchView(viewName) {
    document.querySelectorAll('.pos-view-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));

    const targetPane = document.getElementById(`view-${viewName}`);
    const targetTab = document.getElementById(`tab-${viewName}`);

    if (targetPane) targetPane.classList.add('active');
    if (targetTab) targetTab.classList.add('active');

    this.audio.playClick();
  }

  // --- Toast System ---
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pos-toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✨';
    if (type === 'danger') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- Event Listeners Setup ---
  setupEventListeners() {
    // Nav View Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchView(btn.dataset.view));
    });

    // Order Mode Switcher (Dine-In, Takeaway, Delivery)
    document.querySelectorAll('.order-mode-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.order-mode-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeOrderMode = pill.dataset.mode;
        this.audio.playClick();
        this.renderCart();
        this.showToast(`Order mode switched to ${this.activeOrderMode.toUpperCase()}`, 'info');
      });
    });

    // Theme Toggle
    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => this.toggleTheme());

    // Sound Toggle
    document.getElementById('btn-toggle-sound')?.addEventListener('click', () => {
      this.audio.enabled = !this.audio.enabled;
      this.settings.enableSounds = this.audio.enabled;
      this.storage.saveSettings(this.settings);
      this.showToast(`Sound feedback: ${this.audio.enabled ? 'Enabled' : 'Muted'}`, 'info');
    });

    // Open Table Selector button on header
    document.getElementById('btn-open-table-selector')?.addEventListener('click', () => {
      this.switchView('tables');
    });

    // Dietary Filter Pills
    document.querySelectorAll('.diet-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.diet-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeDietFilter = pill.dataset.diet;
        this.audio.playClick();
        this.renderMenu();
      });
    });

    // Live Search Input
    const searchInp = document.getElementById('menu-search-input');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderMenu();
      });

      // Keyboard shortcut '/' to focus search
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInp) {
          e.preventDefault();
          searchInp.focus();
        }
      });
    }

    // Cart Discount Buttons
    document.querySelectorAll('.discount-preset-strip .discount-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.discount-preset-strip .discount-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.discountPercent = parseFloat(btn.dataset.discount) || 0;
        this.audio.playClick();
        this.renderCart();
      });
    });

    // Cart Clear
    document.getElementById('btn-clear-cart')?.addEventListener('click', () => this.clearCart());

    // Fire KOT Button
    document.getElementById('btn-send-kot')?.addEventListener('click', () => this.fireKitchenOrder());

    // Split Bill Button
    document.getElementById('btn-open-split-modal')?.addEventListener('click', () => this.openSplitModal());

    // Split Presets Buttons
    document.querySelectorAll('#split-preset-buttons button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#split-preset-buttons button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.splitGuestCount = parseInt(btn.dataset.split, 10);
        this.audio.playClick();
        this.updateSplitCalculation();
      });
    });

    // Checkout / Settle Bill Button
    document.getElementById('btn-proceed-pay')?.addEventListener('click', () => this.openPaymentModal());

    // Payment Mode Tabs
    document.querySelectorAll('.pay-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.payment-view-pane').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        this.currentPaymentMethod = tab.dataset.paymethod;
        const targetView = document.getElementById(`pay-view-${this.currentPaymentMethod}`);
        if (targetView) targetView.classList.add('active');
        this.audio.playClick();
      });
    });

    // Tip Buttons
    document.querySelectorAll('#tip-preset-strip button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#tip-preset-strip button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedTipPercent = parseFloat(btn.dataset.tip) || 0;
        this.audio.playClick();
        this.renderCart();
        const totals = this.calculateTotals();
        document.getElementById('modal-pay-amount').textContent = this.formatMoney(totals.grandTotal);
        document.getElementById('cash-calc-total').textContent = this.formatMoney(totals.grandTotal);
        this.updateCashChange();
      });
    });

    // Cash Denomination Presets
    document.getElementById('cash-exact-btn')?.addEventListener('click', () => {
      const totals = this.calculateTotals();
      const input = document.getElementById('cash-received-input');
      if (input) input.value = totals.grandTotal.toFixed(2);
      this.updateCashChange();
      this.audio.playClick();
    });

    document.querySelectorAll('[data-cash]').forEach(btn => {
      btn.addEventListener('click', () => {
        const addVal = parseFloat(btn.dataset.cash);
        const input = document.getElementById('cash-received-input');
        if (input) {
          const current = parseFloat(input.value) || 0;
          input.value = (current + addVal).toFixed(2);
        }
        this.updateCashChange();
        this.audio.playClick();
      });
    });

    // Cash input live listener
    document.getElementById('cash-received-input')?.addEventListener('input', () => {
      this.updateCashChange();
    });

    // Card Tap Simulator
    document.getElementById('btn-simulate-card-tap')?.addEventListener('click', () => {
      this.audio.playBeep();
      this.showToast("Contactless EMV card accepted & authorized! ✔️", "success");
    });

    // Confirm Payment
    document.getElementById('btn-confirm-payment')?.addEventListener('click', () => this.confirmSettlement());

    // Print Receipt Button
    document.getElementById('btn-print-receipt')?.addEventListener('click', () => {
      window.print();
    });

    // Receipt New Order Button
    document.getElementById('btn-receipt-new-order')?.addEventListener('click', () => this.startNewOrder());

    // Customizer Modal Add Button
    document.getElementById('btn-customizer-add-cart')?.addEventListener('click', () => this.confirmCustomizerAdd());

    // Close Modals
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.closeModal;
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
        this.audio.playClick();
      });
    });

    // Export CSV
    document.getElementById('btn-export-csv')?.addEventListener('click', () => this.exportCsvReport());

    // Save Settings
    document.getElementById('btn-save-settings')?.addEventListener('click', () => this.saveSettingsFromForm());

    // Reset Demo Data
    document.getElementById('btn-reset-demo')?.addEventListener('click', () => {
      if (confirm("Reset POS data to default restaurant catalog? All saved invoices will be reset.")) {
        this.storage.resetAllData();
        window.location.reload();
      }
    });
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.posApp = new POSApp();
});
