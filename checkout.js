/* ===========================================
   TWINKLES BY ANJUM — checkout.js
   Dedicated to the 3-step checkout SPA flow.
   Loaded AFTER supabase-js CDN and products.js.

   Modules:
   1. Supabase client
   2. State
   3. Step navigation
   4. Cart + summary renderer
   5. Step 2 form validation
   6. Payment tile selection
   7. Clipboard copy buttons
   8. Place Order → Supabase insert
   9. Confirmation screen
   10. Receipt upload → Supabase Storage
=========================================== */

'use strict';

/* ─── 1. SUPABASE CLIENT ──────────────────────────────────────────
   Uses the UMD global injected by the CDN <script> tag in checkout.html.
   Replace these two values if your project URL or key ever changes.
────────────────────────────────────────────────────────────────── */
const { createClient } = window.supabase;

const SUPABASE_URL = 'https://kzmazljoferibhphbckc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6bWF6bGpvZmVyaWJocGhiY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzYwNzksImV4cCI6MjA5ODE1MjA3OX0.kub41gVEG42yvDtOtTnTCEJ1fGRLv2Tc_l8wfwUbLkI';

const sbClient = createClient(SUPABASE_URL, SUPABASE_KEY);


/* ─── 2. STATE ────────────────────────────────────────────────────
   Kept minimal — no framework needed.
────────────────────────────────────────────────────────────────── */
let currentStep          = 1;
let selectedPaymentMethod = '';
let placedOrderId        = '';


/* ─── 3. STEP NAVIGATION ──────────────────────────────────────────
   Uses inline display:none / display:block rather than a .hidden
   class to avoid CSS specificity conflicts with main.js.
────────────────────────────────────────────────────────────────── */
const PANELS = ['coPanel1', 'coPanel2', 'coPanel3'];
const STEPS  = ['coStep1',  'coStep2',  'coStep3'];
const LINES  = ['coLine1',  'coLine2'];

const goToStep = (step) => {
  // Show only the active panel
  PANELS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.display = (i + 1 === step) ? 'block' : 'none';
  });

  // Update stepper circle states
  STEPS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (i + 1 === step)      el.classList.add('active');
    else if (i + 1 < step)   el.classList.add('done');
  });

  // Update connector lines
  LINES.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('done', i + 1 < step);
  });

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


/* ─── 4. CART + SUMMARY RENDERER ─────────────────────────────────
   Renders into both the left-column Step 1 list and the right
   sticky summary sidebar. Called once products are available.
────────────────────────────────────────────────────────────────── */
const renderSummary = () => {
  if (!window.Cart || !window.PRODUCTS) return;

  const cartItems  = window.Cart.get();
  const subtotal   = window.Cart.getSubtotal();
  const grandTotal = subtotal + 200;

  /* ── Right sidebar ── */
  const summaryList = document.getElementById('coSummaryList');
  if (summaryList) {
    if (cartItems.length === 0) {
      summaryList.innerHTML =
        '<p style="font-size:0.82rem;color:#9ca3af;text-align:center;padding:16px 0;">Your bag is empty.</p>';
    } else {
      summaryList.innerHTML = cartItems.map(item => {
        const prod = window.PRODUCTS.find(p => p.id === item.id);
        if (!prod) return '';
        return `
          <div class="co-summary-item">
            <div class="co-summary-item-info">
              <div class="co-summary-item-name">${prod.name}</div>
              <div class="co-summary-item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="co-summary-item-price">Rs.&nbsp;${(prod.price * item.quantity).toLocaleString()}</div>
          </div>`;
      }).join('');
    }

    document.getElementById('coSubtotal').textContent   = 'Rs. ' + subtotal.toLocaleString();
    document.getElementById('coGrandTotal').textContent = 'Rs. ' + grandTotal.toLocaleString();
  }

  /* ── Step 1 left panel ── */
  const cartList = document.getElementById('coCartList');
  if (!cartList) return;

  if (cartItems.length === 0) {
    cartList.innerHTML = `
      <div style="text-align:center; padding: 40px 0;">
        <p style="font-size:1.1rem; margin-bottom: var(--space-md);">🛍️ Your bag is empty!</p>
        <a href="shop.html" class="btn-co-primary">Browse Shop</a>
      </div>`;
    const nextBtn = document.getElementById('btnStep1Next');
    if (nextBtn) nextBtn.disabled = true;
  } else {
    cartList.innerHTML = cartItems.map(item => {
      const prod = window.PRODUCTS.find(p => p.id === item.id);
      if (!prod) return '';
      return `
        <div class="co-cart-item">
          <div>
            <div class="co-cart-item-name">${prod.name}</div>
            <div class="co-cart-item-qty">Qty: ${item.quantity} &times; Rs.&nbsp;${prod.price.toLocaleString()}</div>
          </div>
          <div class="co-cart-item-price">Rs.&nbsp;${(prod.price * item.quantity).toLocaleString()}</div>
        </div>`;
    }).join('');
  }
};


/* ─── 5. STEP 2 FORM VALIDATION ──────────────────────────────────
   Marks required fields with the .error class if empty.
   Returns true only when all required fields pass.
────────────────────────────────────────────────────────────────── */
const validateDetails = () => {
  const required = [
    { id: 'billName',    label: 'Full name' },
    { id: 'billPhone',   label: 'Phone number' },
    { id: 'billAddress', label: 'Shipping address' },
    { id: 'billCity',    label: 'City' },
  ];

  let valid = true;

  required.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const empty = !el.value.trim();
    el.classList.toggle('error', empty);
    if (empty) valid = false;
  });

  return valid;
};


/* ─── 6. PAYMENT TILE SELECTION ──────────────────────────────────
   Shows / hides the appropriate payment detail box when a
   radio tile is selected.
────────────────────────────────────────────────────────────────── */
const DETAIL_BOX_MAP = {
  'JAZZCASH':     'detailsJazz',
  'EASYPAISA':    'detailsEasy',
  'BANK DETAILS': 'detailsBank',
};

const initPaymentTiles = () => {
  document.querySelectorAll('input[name="payMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedPaymentMethod = radio.value;

      // Hide all boxes then show the selected one
      Object.values(DETAIL_BOX_MAP).forEach(boxId => {
        const box = document.getElementById(boxId);
        if (box) box.style.display = 'none';
      });

      const targetId = DETAIL_BOX_MAP[selectedPaymentMethod];
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) target.style.display = 'block';
      }

      // Clear the "no method selected" error
      const errEl = document.getElementById('coPayError');
      if (errEl) errEl.style.display = 'none';
    });
  });
};


/* ─── 7. CLIPBOARD COPY BUTTONS ──────────────────────────────────
   Works for both the Step 3 detail boxes and any copy buttons
   inside the confirmation screen.
────────────────────────────────────────────────────────────────── */
const initCopyButtons = () => {
  // Re-query every time to catch dynamically inserted buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-co-copy');
    if (!btn) return;

    const targetEl = document.getElementById(btn.dataset.target);
    if (!targetEl) return;

    navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied ✓';
      btn.style.color = '#10b981';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.color = '';
      }, 1800);
    }).catch(() => {
      // Fallback for browsers that deny clipboard in non-https
      btn.textContent = 'Please copy manually';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  });
};


/* ─── 8. PLACE ORDER → SUPABASE INSERT ───────────────────────────
   Gathers form data + cart, inserts a single row into `orders`,
   and retrieves only the generated UUID back via .select('id').
────────────────────────────────────────────────────────────────── */
const placeOrder = async () => {
  // Guard: payment method must be selected
  if (!selectedPaymentMethod) {
    const errEl = document.getElementById('coPayError');
    if (errEl) errEl.style.display = 'block';
    return;
  }

  const btn     = document.getElementById('btnPlaceOrder');
  const btnText = document.getElementById('btnPlaceOrderText');
  const spinner = document.getElementById('btnPlaceOrderSpinner');

  // Show loading state
  if (btn)     btn.disabled = true;
  if (btnText) btnText.textContent = 'Placing Order…';
  if (spinner) spinner.style.display = 'inline-block';

  // Build cart_items jsonb payload
  const cartItems = (window.Cart?.get() || []).map(item => {
    const prod = window.PRODUCTS?.find(p => p.id === item.id);
    return {
      id:       item.id,
      name:     prod?.name     ?? item.id,
      price:    prod?.price    ?? 0,
      quantity: item.quantity,
      subtotal: (prod?.price ?? 0) * item.quantity,
    };
  });

  const subtotal   = window.Cart?.getSubtotal() ?? 0;
  const grandTotal = subtotal + 200;

  const payload = {
    full_name:        (document.getElementById('billName')?.value    ?? '').trim(),
    email:            (document.getElementById('billEmail')?.value   ?? '').trim() || null,
    phone:            (document.getElementById('billPhone')?.value   ?? '').trim(),
    shipping_address: (document.getElementById('billAddress')?.value ?? '').trim(),
    city:             (document.getElementById('billCity')?.value    ?? '').trim(),
    state:            (document.getElementById('billState')?.value   ?? '').trim() || null,
    postal_code:      (document.getElementById('billZip')?.value     ?? '').trim() || null,
    payment_method:   selectedPaymentMethod,
    payment_status:   'pending_payment',
    cart_items:       cartItems,
    order_subtotal:   subtotal,
    order_total:      grandTotal,
  };

  try {
    const { data, error } = await sbClient
      .from('orders')
      .insert([payload])
      .select('id')
      .single();

    if (error) throw error;

    placedOrderId = data.id;
    window.Cart?.clear();       // Wipe localStorage cart
    showConfirmation();

  } catch (err) {
    console.error('[checkout.js] Supabase insert failed:', err);

    // Restore button
    if (btn)     btn.disabled = false;
    if (btnText) btnText.textContent = 'Place Order';
    if (spinner) spinner.style.display = 'none';

    alert(
      'Something went wrong saving your order.\n\n' +
      'Please try again or contact us directly via WhatsApp. 💕'
    );
  }
};


/* ─── 9. CONFIRMATION SCREEN ─────────────────────────────────────
   Hides the stepper + grid, shows the confirm panel with the
   order ID and correct payment instructions.
────────────────────────────────────────────────────────────────── */
const CONFIRM_PAYMENT_HTML = {
  'JAZZCASH': (jazzNum) => `
    <h4>Transfer Order Total — JazzCash</h4>
    <div class="co-account-row" style="margin-top:0;">
      <div>
        <p class="co-account-name">Anjum Iqbal</p>
        <p class="co-account-num" id="confirmJazzNum">${jazzNum}</p>
      </div>
      <button type="button" class="btn-co-copy" data-target="confirmJazzNum">Copy</button>
    </div>`,

  'EASYPAISA': (easyNum) => `
    <h4>Transfer Order Total — EasyPaisa</h4>
    <div class="co-account-row" style="margin-top:0;">
      <div>
        <p class="co-account-name">Anjum Iqbal</p>
        <p class="co-account-num" id="confirmEasyNum">${easyNum}</p>
      </div>
      <button type="button" class="btn-co-copy" data-target="confirmEasyNum">Copy</button>
    </div>`,

  'BANK DETAILS': () => `
    <h4>Transfer Order Total — Bank Transfer</h4>
    <p style="font-size:0.82rem;color:var(--clr-text-muted);margin-top:4px;">
      Bank details are shown above. Please use your <strong>Order ID</strong> as the payment reference / remarks field.
    </p>`,
};

const showConfirmation = () => {
  // Hide stepper + grid
  const stepper = document.getElementById('coStepper');
  const grid    = document.getElementById('coGrid');
  const hero    = document.getElementById('coPageHero');

  if (stepper) stepper.style.display = 'none';
  if (grid)    grid.style.display    = 'none';
  if (hero)    hero.style.display    = 'none';

  // Show confirm panel
  const panel = document.getElementById('coConfirmPanel');
  if (panel) panel.style.display = 'block';

  // Set order ID
  const orderIdEl = document.getElementById('coOrderId');
  if (orderIdEl) orderIdEl.textContent = placedOrderId;

  // Populate payment instructions
  const paymentDetailsEl = document.getElementById('coConfirmPaymentDetails');
  if (paymentDetailsEl) {
    const jazzNum = document.getElementById('jazzNum')?.textContent ?? '—';
    const easyNum = document.getElementById('easyNum')?.textContent ?? '—';

    const builder = CONFIRM_PAYMENT_HTML[selectedPaymentMethod];
    paymentDetailsEl.innerHTML = builder
      ? builder(selectedPaymentMethod === 'JAZZCASH' ? jazzNum : easyNum)
      : '';
  }
};


/* ─── 10. RECEIPT UPLOAD → SUPABASE STORAGE ──────────────────────
   Uploads the receipt image/PDF to the `receipts` Supabase Storage
   bucket, then patches the matching order row with receipt_url.
   
   NOTE: Create a public storage bucket named "receipts" in your
   Supabase dashboard first (Storage → New bucket → name: receipts → Public).
────────────────────────────────────────────────────────────────── */
const initReceiptUpload = () => {
  const uploadBtn  = document.getElementById('btnUploadReceipt');
  const fileInput  = document.getElementById('receiptFile');
  const statusEl   = document.getElementById('uploadStatus');

  if (!uploadBtn) return;

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput?.files?.[0];

    const setStatus = (msg, color) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.style.color  = color;
      statusEl.style.display = 'block';
    };

    if (!file) {
      setStatus('Please select a file first.', '#ef4444');
      return;
    }

    if (!placedOrderId) {
      setStatus('Order ID missing — please refresh and try again.', '#ef4444');
      return;
    }

    uploadBtn.disabled   = true;
    uploadBtn.textContent = 'Uploading…';

    const ext      = file.name.split('.').pop().toLowerCase();
    const filePath = `receipts/${placedOrderId}.${ext}`;

    try {
      // Upload file
      const { error: uploadError } = await sbClient.storage
        .from('receipts')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = sbClient.storage
        .from('receipts')
        .getPublicUrl(filePath);

      // Patch the order row
      const { error: updateError } = await sbClient
        .from('orders')
        .update({ receipt_url: urlData.publicUrl })
        .eq('id', placedOrderId);

      if (updateError) throw updateError;

      setStatus('✓ Receipt uploaded! We will verify your payment shortly. 💕', '#10b981');
      uploadBtn.textContent = 'Uploaded ✓';

    } catch (err) {
      console.error('[checkout.js] Receipt upload failed:', err);
      setStatus(
        'Upload failed. Please send your receipt via WhatsApp instead. Error: ' + (err.message ?? ''),
        '#ef4444'
      );
      uploadBtn.disabled    = false;
      uploadBtn.textContent = 'Try Again';
    }
  });
};


/* ─── INIT ────────────────────────────────────────────────────────
   Wires all event listeners once the DOM is ready.
────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Step navigation buttons */
  document.getElementById('btnStep1Next')
    ?.addEventListener('click', () => goToStep(2));

  document.getElementById('btnStep2Back')
    ?.addEventListener('click', () => goToStep(1));

  document.getElementById('btnStep2Next')
    ?.addEventListener('click', () => {
      if (validateDetails()) goToStep(3);
    });

  document.getElementById('btnStep3Back')
    ?.addEventListener('click', () => goToStep(2));

  document.getElementById('btnPlaceOrder')
    ?.addEventListener('click', placeOrder);

  /* Clear error highlight as user types */
  ['billName', 'billPhone', 'billAddress', 'billCity'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', function () {
      this.classList.remove('error');
    });
  });

  initPaymentTiles();
  initCopyButtons();
  initReceiptUpload();

  /* Wait for window.PRODUCTS to be populated by products.js,
     then render both the cart list and the sidebar summary.    */
  const waitForProducts = setInterval(() => {
    if (window.PRODUCTS && window.PRODUCTS.length > 0) {
      clearInterval(waitForProducts);
      renderSummary();
    }
  }, 50);

  /* Fallback: if products never load (e.g. empty catalog)
     still render after 1.5s so the empty-bag state shows.     */
  setTimeout(() => {
    clearInterval(waitForProducts);
    renderSummary();
  }, 1500);

});
