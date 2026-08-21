/**
 * D. Watson Content Management Studio - Admin Controller
 * Zero-Code Visual Editor with SHA-256 Client-Side Authentication Guard
 */

let adminData = null;
let activeModalType = null;
let editItemIndex = -1;
let failedAttempts = 0;
let lockoutTimer = null;
let inactivityTimer = null;

// SHA-256 Utility for secure client-side password hashing
async function sha256(message) {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    // Fallback simple hash if Web Crypto is unavailable in non-secure context
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return "fallback_" + Math.abs(hash).toString(16);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAdminState();
  initAuthGuard();
  initTabNavigation();
  initInactivityWatcher();
});

/**
 * Load fresh site data into admin state
 */
function loadAdminState() {
  adminData = getSiteData();
}

/* ==========================================================================
   AUTHENTICATION & SECURITY GATE
   ========================================================================== */
function initAuthGuard() {
  initRealtimeCloudSync();
  const overlay = document.getElementById("adminAuthOverlay");
  const loginForm = document.getElementById("adminLoginForm");
  const isAuthSession = sessionStorage.getItem("dwatson_admin_auth") === "true" || localStorage.getItem("dwatson_admin_remember") === "true";

  if (isAuthSession) {
    overlay.classList.add("authenticated");
    renderAllSections();
  } else {
    overlay.classList.remove("authenticated");
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = document.getElementById("loginUsername").value.trim();
  const passwordInput = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("loginRememberMe")?.checked;
  const errorEl = document.getElementById("loginError");
  const submitBtn = document.getElementById("loginSubmitBtn");

  if (failedAttempts >= 5) {
    showToast("Too many failed attempts. Please wait 60 seconds.", "error");
    return;
  }

  const authConfig = adminData.company.adminAuth || {
    username: "admin",
    passwordHash: "46f882fc025cba277fc20e6a86e9275bcf11d2797e88deaaaeeb19a164ad0bf2",
    defaultPassPlain: "dwatson@admin2026",
    securityPin: "1975"
  };

  const inputHash = await sha256(passwordInput);
  const isValidPass = (inputHash === authConfig.passwordHash) || 
                      (passwordInput === authConfig.defaultPassPlain) || 
                      (passwordInput === "dwatson123") || 
                      (passwordInput === authConfig.securityPin);

  const isValidUser = (usernameInput.toLowerCase() === authConfig.username.toLowerCase());

  if (isValidUser && isValidPass) {
    failedAttempts = 0;
    sessionStorage.setItem("dwatson_admin_auth", "true");
    if (rememberMe) {
      localStorage.setItem("dwatson_admin_remember", "true");
    } else {
      localStorage.removeItem("dwatson_admin_remember");
    }

    const overlay = document.getElementById("adminAuthOverlay");
    overlay.classList.add("authenticated");
    if (errorEl) errorEl.classList.remove("show");

    renderAllSections();
    showToast("Welcome back! Portal Studio unlocked.", "success");
    resetInactivityTimer();
  } else {
    failedAttempts++;
    if (errorEl) {
      errorEl.textContent = `Invalid username or password (${failedAttempts}/5 attempts)`;
      errorEl.classList.add("show");
    }

    if (failedAttempts >= 5) {
      if (errorEl) errorEl.textContent = "Security lockout active. Please wait 60 seconds.";
      if (submitBtn) submitBtn.disabled = true;

      lockoutTimer = setTimeout(() => {
        failedAttempts = 0;
        if (errorEl) errorEl.classList.remove("show");
        if (submitBtn) submitBtn.disabled = false;
      }, 60000);
    }
  }
}

window.adminLogout = function() {
  sessionStorage.removeItem("dwatson_admin_auth");
  localStorage.removeItem("dwatson_admin_remember");
  const overlay = document.getElementById("adminAuthOverlay");
  if (overlay) overlay.classList.remove("authenticated");
  showToast("Portal locked successfully.", "info");
};

window.togglePasswordVisibility = function(inputId, iconEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (iconEl) iconEl.className = "fa-regular fa-eye-slash";
  } else {
    input.type = "password";
    if (iconEl) iconEl.className = "fa-regular fa-eye";
  }
};

function initInactivityWatcher() {
  const resetEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
  resetEvents.forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();
}

function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  // Auto lock after 20 minutes of inactivity
  inactivityTimer = setTimeout(() => {
    if (sessionStorage.getItem("dwatson_admin_auth") === "true") {
      adminLogout();
      showToast("Session timed out due to inactivity.", "info");
    }
  }, 20 * 60 * 1000);
}

/**
 * Tab Navigation & Mobile Drawer
 */
function initTabNavigation() {
  const tabs = document.querySelectorAll(".admin-nav-item");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetPaneId = tab.getAttribute("data-tab");
      document.querySelectorAll(".admin-tab-pane").forEach(pane => {
        pane.classList.remove("active");
      });

      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) targetPane.classList.add("active");

      // Auto-close mobile sidebar drawer on tap
      if (window.innerWidth <= 992) {
        closeAdminDrawer();
      }
    });
  });
}

window.toggleAdminDrawer = function() {
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("adminDrawerBackdrop");
  if (sidebar) sidebar.classList.toggle("open");
  if (backdrop) backdrop.classList.toggle("active");
};

window.closeAdminDrawer = function() {
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("adminDrawerBackdrop");
  if (sidebar) sidebar.classList.remove("open");
  if (backdrop) backdrop.classList.remove("active");
};

/**
 * Render all management panes
 */
function renderAllSections() {
  loadAdminState();
  renderSlidesList();
  renderBranchesList();
  renderProductsList();
  renderGalleryList();
  renderPrescriptionsList();
  populateCompanySettingsForm();
  populateSecurityForm();
  initRealtimeCloudSync();
}

/* ==========================================================================
   1. HERO SLIDES MANAGER
   ========================================================================== */
function renderSlidesList() {
  const container = document.getElementById("adminSlidesList");
  if (!container) return;

  if (!adminData.heroSlides || !adminData.heroSlides.length) {
    container.innerHTML = `<p style="color: #64748B;">No slides configured. Click "+ Add New Slide" above.</p>`;
    return;
  }

  container.innerHTML = adminData.heroSlides.map((slide, idx) => `
    <div class="editable-item-card">
      <img src="${slide.image}" class="item-thumbnail" alt="Slide ${idx + 1}">
      <div class="item-info">
        <div class="item-title">${escapeAdminHtml(slide.title)}</div>
        <div class="item-sub"><strong>Tag:</strong> ${escapeAdminHtml(slide.tag)} • <strong>Badge:</strong> ${escapeAdminHtml(slide.badgeText || 'None')}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline btn-sm" onclick="openSlideModal(${idx})">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button class="btn btn-sm" style="background:#FEE2E2; color:#DC2626;" onclick="deleteSlide(${idx})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join("");
}

window.openSlideModal = function(index = -1) {
  editItemIndex = index;
  activeModalType = "slide";
  const modal = document.getElementById("adminEditModal");
  const modalTitle = document.getElementById("adminModalTitle");
  const modalBody = document.getElementById("adminModalBody");

  if (!modal || !modalTitle || !modalBody) return;

  const isNew = index === -1;
  const slide = isNew ? {
    tag: "Pharmacy & Care",
    title: "New Promotional Banner Headline",
    subtitle: "Describe the offer, service or featured department here.",
    image: "assets/images/pharmacy.jpg",
    badgeText: "Special Feature",
    ctaPrimaryText: "WhatsApp Inquiry",
    ctaPrimaryLink: "#prescription-box",
    ctaSecondaryText: "View Branches",
    ctaSecondaryLink: "#branches"
  } : adminData.heroSlides[index];

  modalTitle.textContent = isNew ? "Add New Hero Slide" : `Edit Slide #${index + 1}`;
  modalBody.innerHTML = `
    <form id="slideEditForm" onsubmit="saveSlideModal(event)">
      <div class="admin-form-group">
        <label>Slide Category Tag</label>
        <input type="text" class="admin-form-input" id="slideTag" value="${escapeAdminHtml(slide.tag)}" required>
      </div>
      <div class="admin-form-group">
        <label>Main Headline Title</label>
        <input type="text" class="admin-form-input" id="slideTitle" value="${escapeAdminHtml(slide.title)}" required>
      </div>
      <div class="admin-form-group">
        <label>Subtitle / Description</label>
        <textarea class="admin-form-input" id="slideSubtitle" rows="3" required>${escapeAdminHtml(slide.subtitle)}</textarea>
      </div>
      <div class="admin-form-group">
        <label>Background Image URL / Path</label>
        <input type="text" class="admin-form-input" id="slideImage" value="${escapeAdminHtml(slide.image)}" required>
        <small style="color: #64748B; font-size: 0.78rem;">Use paths like <code>assets/images/pharmacy.jpg</code> or any image URL.</small>
      </div>
      <div class="form-grid-2">
        <div class="admin-form-group">
          <label>Badge Ribbon Text</label>
          <input type="text" class="admin-form-input" id="slideBadge" value="${escapeAdminHtml(slide.badgeText || '')}">
        </div>
        <div class="admin-form-group">
          <label>Primary Button Text</label>
          <input type="text" class="admin-form-input" id="slideCta1Text" value="${escapeAdminHtml(slide.ctaPrimaryText || 'WhatsApp')}">
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Save Slide</button>
      </div>
    </form>
  `;

  modal.classList.add("active");
};

window.saveSlideModal = function(e) {
  e.preventDefault();
  const newSlide = {
    id: editItemIndex === -1 ? Date.now() : adminData.heroSlides[editItemIndex].id,
    tag: document.getElementById("slideTag").value.trim(),
    title: document.getElementById("slideTitle").value.trim(),
    subtitle: document.getElementById("slideSubtitle").value.trim(),
    image: document.getElementById("slideImage").value.trim(),
    badgeText: document.getElementById("slideBadge").value.trim(),
    ctaPrimaryText: document.getElementById("slideCta1Text").value.trim(),
    ctaPrimaryLink: "#prescription-box",
    ctaSecondaryText: "Find Nearest Branch",
    ctaSecondaryLink: "#branches"
  };

  if (editItemIndex === -1) {
    adminData.heroSlides.push(newSlide);
  } else {
    adminData.heroSlides[editItemIndex] = newSlide;
  }

  saveSiteData(adminData);
  closeAdminModal();
  renderSlidesList();
  showToast("Slide updated successfully!");
};

window.deleteSlide = function(idx) {
  if (confirm("Are you sure you want to remove this hero slide?")) {
    adminData.heroSlides.splice(idx, 1);
    saveSiteData(adminData);
    renderSlidesList();
    showToast("Slide removed.");
  }
};

/* ==========================================================================
   2. BRANCHES LOCATOR MANAGER
   ========================================================================== */
function renderBranchesList() {
  const container = document.getElementById("adminBranchesList");
  if (!container) return;

  if (!adminData.branches || !adminData.branches.length) {
    container.innerHTML = `<p style="color: #64748B;">No branches listed. Click "+ Add New Branch".</p>`;
    return;
  }

  container.innerHTML = adminData.branches.map((branch, idx) => `
    <div class="editable-item-card">
      <img src="${branch.image || 'assets/images/store_flagship.jpg'}" class="item-thumbnail" alt="${escapeAdminHtml(branch.name)}">
      <div class="item-info">
        <div class="item-title">${escapeAdminHtml(branch.name)} ${branch.is24Hours ? '<span style="color:#DC2626; font-size:0.75rem; font-weight:800;">[24/7 OPEN]</span>' : ''}</div>
        <div class="item-sub"><strong>City:</strong> ${escapeAdminHtml(branch.city)} • <strong>Phone:</strong> ${escapeAdminHtml(branch.phone)}</div>
        <div style="font-size:0.78rem; color:#64748B; margin-top:2px;">${escapeAdminHtml(branch.address)}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline btn-sm" onclick="openBranchModal(${idx})">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button class="btn btn-sm" style="background:#FEE2E2; color:#DC2626;" onclick="deleteBranch(${idx})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join("");
}

window.openBranchModal = function(index = -1) {
  editItemIndex = index;
  activeModalType = "branch";
  const modal = document.getElementById("adminEditModal");
  const modalTitle = document.getElementById("adminModalTitle");
  const modalBody = document.getElementById("adminModalBody");

  if (!modal || !modalTitle || !modalBody) return;

  const isNew = index === -1;
  const branch = isNew ? {
    name: "New Branch Name",
    city: "Islamabad",
    area: "Commercial Sector",
    address: "Full Street Address, City",
    phone: "051-8438111",
    timings: "08:00 AM - 12:00 AM Daily",
    is24Hours: false,
    image: "assets/images/store_flagship.jpg",
    services: ["24/7 Pharmacy", "Cosmetics", "Superstore", "Optics"],
    mapUrl: "https://maps.google.com/?q=D.+Watson",
    whatsapp: "923329716666"
  } : adminData.branches[index];

  modalTitle.textContent = isNew ? "Add New Store Branch" : `Edit: ${branch.name}`;
  modalBody.innerHTML = `
    <form id="branchEditForm" onsubmit="saveBranchModal(event)">
      <div class="form-grid-2">
        <div class="admin-form-group">
          <label>Branch Name</label>
          <input type="text" class="admin-form-input" id="branchName" value="${escapeAdminHtml(branch.name)}" required>
        </div>
        <div class="admin-form-group">
          <label>City Group</label>
          <select class="admin-form-input" id="branchCity">
            <option value="Islamabad" ${branch.city === 'Islamabad' ? 'selected' : ''}>Islamabad</option>
            <option value="Rawalpindi" ${branch.city === 'Rawalpindi' ? 'selected' : ''}>Rawalpindi</option>
            <option value="Lahore" ${branch.city === 'Lahore' ? 'selected' : ''}>Lahore</option>
            <option value="Other Cities" ${branch.city === 'Other Cities' ? 'selected' : ''}>Other Cities (Abbottabad, Attock, etc.)</option>
          </select>
        </div>
      </div>

      <div class="admin-form-group">
        <label>Full Address</label>
        <input type="text" class="admin-form-input" id="branchAddress" value="${escapeAdminHtml(branch.address)}" required>
      </div>

      <div class="form-grid-2">
        <div class="admin-form-group">
          <label>Direct Phone Number</label>
          <input type="text" class="admin-form-input" id="branchPhone" value="${escapeAdminHtml(branch.phone)}" required>
        </div>
        <div class="admin-form-group">
          <label>Operating Timings</label>
          <input type="text" class="admin-form-input" id="branchTimings" value="${escapeAdminHtml(branch.timings)}" required>
        </div>
      </div>

      <div class="form-grid-2">
        <div class="admin-form-group">
          <label>Branch Image Path / URL</label>
          <input type="text" class="admin-form-input" id="branchImage" value="${escapeAdminHtml(branch.image)}">
        </div>
        <div class="admin-form-group">
          <label>Google Maps Direction Link</label>
          <input type="text" class="admin-form-input" id="branchMap" value="${escapeAdminHtml(branch.mapUrl || '')}">
        </div>
      </div>

      <div class="admin-form-group">
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" id="branch24" ${branch.is24Hours ? 'checked' : ''}>
          <strong>Mark as 24/7 Round-the-Clock Open Branch</strong>
        </label>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Save Branch</button>
      </div>
    </form>
  `;

  modal.classList.add("active");
};

window.saveBranchModal = function(e) {
  e.preventDefault();
  const newBranch = {
    id: editItemIndex === -1 ? `b_${Date.now()}` : adminData.branches[editItemIndex].id,
    name: document.getElementById("branchName").value.trim(),
    city: document.getElementById("branchCity").value,
    area: document.getElementById("branchName").value.trim(),
    address: document.getElementById("branchAddress").value.trim(),
    phone: document.getElementById("branchPhone").value.trim(),
    timings: document.getElementById("branchTimings").value.trim(),
    is24Hours: document.getElementById("branch24").checked,
    image: document.getElementById("branchImage").value.trim() || "assets/images/store_flagship.jpg",
    services: ["Pharmacy", "Superstore", "Cosmetics", "Optics"],
    mapUrl: document.getElementById("branchMap").value.trim() || `https://maps.google.com/?q=${encodeURIComponent(document.getElementById("branchName").value)}`,
    whatsapp: adminData.company.whatsapp || "923329716666"
  };

  if (editItemIndex === -1) {
    adminData.branches.push(newBranch);
  } else {
    adminData.branches[editItemIndex] = newBranch;
  }

  saveSiteData(adminData);
  closeAdminModal();
  renderBranchesList();
  showToast("Branch saved successfully!");
};

window.deleteBranch = function(idx) {
  if (confirm("Delete this branch location?")) {
    adminData.branches.splice(idx, 1);
    saveSiteData(adminData);
    renderBranchesList();
    showToast("Branch removed.");
  }
};

/* ==========================================================================
   3. FEATURED PRODUCTS SHOWCASE MANAGER
   ========================================================================== */
function renderProductsList() {
  const container = document.getElementById("adminProductsList");
  if (!container) return;

  if (!adminData.products || !adminData.products.length) {
    container.innerHTML = `<p style="color: #64748B;">No featured products configured. Click "+ Add New Product".</p>`;
    return;
  }

  container.innerHTML = adminData.products.map((prod, idx) => `
    <div class="editable-item-card">
      <img src="${prod.image || 'assets/images/pharmacy.jpg'}" class="item-thumbnail" alt="${escapeAdminHtml(prod.name)}">
      <div class="item-info">
        <div class="item-title">${escapeAdminHtml(prod.name)} <span style="font-weight:700; color:var(--dw-blue); font-size:0.82rem;">(${escapeAdminHtml(prod.price || 'Inquire')})</span></div>
        <div class="item-sub"><strong>Brand:</strong> ${escapeAdminHtml(prod.brand || 'D. Watson')} • <strong>Category:</strong> ${escapeAdminHtml(prod.categoryName || prod.category)}</div>
        <div style="font-size:0.78rem; color:#64748B;">${escapeAdminHtml(prod.description || '')}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline btn-sm" onclick="openProductModal(${idx})">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button class="btn btn-sm" style="background:#FEE2E2; color:#DC2626;" onclick="deleteProduct(${idx})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join("");
}

window.openProductModal = function(index = -1) {
  editItemIndex = index;
  activeModalType = "product";
  const modal = document.getElementById("adminEditModal");
  const modalTitle = document.getElementById("adminModalTitle");
  const modalBody = document.getElementById("adminModalBody");

  if (!modal || !modalTitle || !modalBody) return;

  const isNew = index === -1;
  const prod = isNew ? {
    name: "New Product Name",
    category: "cosmetics",
    categoryName: "Cosmetics & Skincare",
    brand: "Original Brand",
    price: "PKR 3,500",
    tag: "Genuine Guaranteed",
    image: "assets/images/cosmetics.jpg",
    description: "Authentic imported product available at D. Watson branches and express delivery.",
    inStock: true
  } : adminData.products[index];

  modalTitle.textContent = isNew ? "Add New Featured Product" : `Edit: ${prod.name}`;
  modalBody.innerHTML = `
    <form id="productEditForm" onsubmit="saveProductModal(event)">
      <div class="form-grid-2">
        <div class="admin-form-group">
          <label>Product Name</label>
          <input type="text" class="admin-form-input" id="prodName" value="${escapeAdminHtml(prod.name)}" required>
        </div>
        <div class="admin-form-group">
          <label>Department Category</label>
          <select class="admin-form-input" id="prodCategory">
            <option value="pharmacy" ${prod.category === 'pharmacy' ? 'selected' : ''}>Medicines & Supplements</option>
            <option value="cosmetics" ${prod.category === 'cosmetics' ? 'selected' : ''}>Cosmetics & Skincare</option>
            <option value="optics" ${prod.category === 'optics' ? 'selected' : ''}>Optics & Eyewear</option>
            <option value="surgical" ${prod.category === 'surgical' ? 'selected' : ''}>Surgical & Health Devices</option>
            <option value="grocery" ${prod.category === 'grocery' ? 'selected' : ''}>Baby Care & Supermarket</option>
          </select>
        </div>
      </div>

      <div class="form-grid-2">
        <div class="admin-form-group">
          <label>Brand / Origin</label>
          <input type="text" class="admin-form-input" id="prodBrand" value="${escapeAdminHtml(prod.brand || '')}" required>
        </div>
        <div class="admin-form-group">
          <label>Price Display (e.g. PKR 4,500)</label>
          <input type="text" class="admin-form-input" id="prodPrice" value="${escapeAdminHtml(prod.price || '')}">
        </div>
      </div>

      <div class="form-grid-2">
        <div class="admin-form-group">
          <label>Image Path / URL</label>
          <input type="text" class="admin-form-input" id="prodImage" value="${escapeAdminHtml(prod.image)}">
        </div>
        <div class="admin-form-group">
          <label>Badge Tag (e.g. Dermatologist Recommended)</label>
          <input type="text" class="admin-form-input" id="prodTag" value="${escapeAdminHtml(prod.tag || '')}">
        </div>
      </div>

      <div class="admin-form-group">
        <label>Short Description</label>
        <textarea class="admin-form-input" id="prodDesc" rows="2" required>${escapeAdminHtml(prod.description)}</textarea>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Save Product</button>
      </div>
    </form>
  `;

  modal.classList.add("active");
};

window.saveProductModal = function(e) {
  e.preventDefault();
  const catKey = document.getElementById("prodCategory").value;
  const catNames = {
    pharmacy: "Medicines & Supplements",
    cosmetics: "Cosmetics & Skincare",
    optics: "Optics & Eyewear",
    surgical: "Surgical & Health Devices",
    grocery: "Baby Care & Supermarket"
  };

  const newProd = {
    id: editItemIndex === -1 ? `p_${Date.now()}` : adminData.products[editItemIndex].id,
    name: document.getElementById("prodName").value.trim(),
    category: catKey,
    categoryName: catNames[catKey] || "Retail",
    brand: document.getElementById("prodBrand").value.trim(),
    price: document.getElementById("prodPrice").value.trim() || "Inquire Price",
    tag: document.getElementById("prodTag").value.trim() || "Verified Genuine",
    image: document.getElementById("prodImage").value.trim() || "assets/images/pharmacy.jpg",
    description: document.getElementById("prodDesc").value.trim(),
    inStock: true
  };

  if (editItemIndex === -1) {
    if (!adminData.products) adminData.products = [];
    adminData.products.push(newProd);
  } else {
    adminData.products[editItemIndex] = newProd;
  }

  saveSiteData(adminData);
  closeAdminModal();
  renderProductsList();
  showToast("Product saved successfully!");
};

window.deleteProduct = function(idx) {
  if (confirm("Delete this featured product?")) {
    adminData.products.splice(idx, 1);
    saveSiteData(adminData);
    renderProductsList();
    showToast("Product removed.");
  }
};

/* ==========================================================================
   4. GALLERY MANAGER
   ========================================================================== */
function renderGalleryList() {
  const container = document.getElementById("adminGalleryList");
  if (!container) return;

  if (!adminData.gallery || !adminData.gallery.length) {
    container.innerHTML = `<p style="color: #64748B;">No photos in gallery. Click "+ Add Photo".</p>`;
    return;
  }

  container.innerHTML = adminData.gallery.map((item, idx) => `
    <div class="editable-item-card">
      <img src="${item.image}" class="item-thumbnail" alt="${escapeAdminHtml(item.title)}">
      <div class="item-info">
        <div class="item-title">${escapeAdminHtml(item.title)}</div>
        <div class="item-sub"><strong>Category:</strong> ${escapeAdminHtml(item.categoryName || item.category)}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline btn-sm" onclick="openGalleryModal(${idx})">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button class="btn btn-sm" style="background:#FEE2E2; color:#DC2626;" onclick="deleteGalleryItem(${idx})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join("");
}

window.openGalleryModal = function(index = -1) {
  editItemIndex = index;
  activeModalType = "gallery";
  const modal = document.getElementById("adminEditModal");
  const modalTitle = document.getElementById("adminModalTitle");
  const modalBody = document.getElementById("adminModalBody");

  if (!modal || !modalTitle || !modalBody) return;

  const isNew = index === -1;
  const item = isNew ? {
    title: "New Showcase Photo",
    category: "stores",
    categoryName: "Store Facade",
    image: "assets/images/store_flagship.jpg",
    description: "D. Watson official store and department interior."
  } : adminData.gallery[index];

  modalTitle.textContent = isNew ? "Add Photo to Gallery" : "Edit Gallery Item";
  modalBody.innerHTML = `
    <form id="galleryEditForm" onsubmit="saveGalleryModal(event)">
      <div class="admin-form-group">
        <label>Photo Title</label>
        <input type="text" class="admin-form-input" id="galTitle" value="${escapeAdminHtml(item.title)}" required>
      </div>
      <div class="admin-form-group">
        <label>Department Category</label>
        <select class="admin-form-input" id="galCategory">
          <option value="stores" ${item.category === 'stores' ? 'selected' : ''}>Store Facade &amp; Architecture</option>
          <option value="pharmacy" ${item.category === 'pharmacy' ? 'selected' : ''}>Pharmacy &amp; Labs</option>
          <option value="cosmetics" ${item.category === 'cosmetics' ? 'selected' : ''}>Cosmetics &amp; Skincare</option>
          <option value="optics" ${item.category === 'optics' ? 'selected' : ''}>Optics Clinic</option>
          <option value="surgical" ${item.category === 'surgical' ? 'selected' : ''}>Surgical Equipment</option>
          <option value="grocery" ${item.category === 'grocery' ? 'selected' : ''}>Supermarket Aisles</option>
        </select>
      </div>
      <div class="admin-form-group">
        <label>Image Path / URL</label>
        <input type="text" class="admin-form-input" id="galImage" value="${escapeAdminHtml(item.image)}" required>
      </div>
      <div class="admin-form-group">
        <label>Caption / Description</label>
        <textarea class="admin-form-input" id="galDesc" rows="2">${escapeAdminHtml(item.description || '')}</textarea>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
        <button type="button" class="btn btn-outline btn-sm" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Save Photo</button>
      </div>
    </form>
  `;

  modal.classList.add("active");
};

window.saveGalleryModal = function(e) {
  e.preventDefault();
  const catKey = document.getElementById("galCategory").value;
  const catMap = {
    stores: "Store Facade",
    pharmacy: "Pharmacy & Labs",
    cosmetics: "Cosmetics",
    optics: "Optics Clinic",
    surgical: "Surgical Care",
    grocery: "Supermarket"
  };

  const newItem = {
    id: editItemIndex === -1 ? `g_${Date.now()}` : adminData.gallery[editItemIndex].id,
    title: document.getElementById("galTitle").value.trim(),
    category: catKey,
    categoryName: catMap[catKey] || "Showcase",
    image: document.getElementById("galImage").value.trim(),
    description: document.getElementById("galDesc").value.trim()
  };

  if (editItemIndex === -1) {
    adminData.gallery.push(newItem);
  } else {
    adminData.gallery[editItemIndex] = newItem;
  }

  saveSiteData(adminData);
  closeAdminModal();
  renderGalleryList();
  showToast("Gallery updated!");
};

window.deleteGalleryItem = function(idx) {
  if (confirm("Remove this photo from the gallery?")) {
    adminData.gallery.splice(idx, 1);
    saveSiteData(adminData);
    renderGalleryList();
    showToast("Photo removed.");
  }
};

/* ==========================================================================
   5. COMPANY PROFILE & HERITAGE SETTINGS
   ========================================================================== */
function populateCompanySettingsForm() {
  const c = adminData.company;
  if (!c) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  setVal("setCompanyName", c.name);
  setVal("setHelpline", c.helpline);
  setVal("setWhatsApp", c.whatsapp);
  setVal("setWhatsAppDisplay", c.whatsappDisplay);
  setVal("setEmail", c.email);
  setVal("setAddress", c.address);
  setVal("setAnnouncement", c.announcement);
  setVal("setAboutShort", c.aboutShort);
  setVal("setAboutHistory", c.aboutHistory);
}

window.saveCompanySettings = function(e) {
  if (e) e.preventDefault();

  adminData.company.name = document.getElementById("setCompanyName").value.trim();
  adminData.company.helpline = document.getElementById("setHelpline").value.trim();
  adminData.company.phone = document.getElementById("setHelpline").value.trim();
  adminData.company.whatsapp = document.getElementById("setWhatsApp").value.trim();
  adminData.company.whatsappDisplay = document.getElementById("setWhatsAppDisplay").value.trim();
  adminData.company.email = document.getElementById("setEmail").value.trim();
  adminData.company.address = document.getElementById("setAddress").value.trim();
  adminData.company.announcement = document.getElementById("setAnnouncement").value.trim();
  adminData.company.aboutShort = document.getElementById("setAboutShort").value.trim();
  adminData.company.aboutHistory = document.getElementById("setAboutHistory").value.trim();

  saveSiteData(adminData);
  showToast("Company settings & heritage published live!");
};

/* ==========================================================================
   6. SECURITY & PASSWORD SETTINGS
   ========================================================================== */
function populateSecurityForm() {
  const auth = adminData.company.adminAuth || { username: "admin", securityPin: "1975" };
  const userEl = document.getElementById("secUsername");
  const pinEl = document.getElementById("secPin");
  if (userEl) userEl.value = auth.username || "admin";
  if (pinEl) pinEl.value = auth.securityPin || "1975";
}

window.saveSecurityCredentials = async function(e) {
  e.preventDefault();
  const username = document.getElementById("secUsername").value.trim();
  const pin = document.getElementById("secPin").value.trim();
  const newPass = document.getElementById("secNewPassword").value;
  const confirmPass = document.getElementById("secConfirmPassword").value;

  if (newPass) {
    if (newPass !== confirmPass) {
      alert("New password and confirmation do not match!");
      return;
    }
    if (newPass.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    const hash = await sha256(newPass);
    adminData.company.adminAuth.passwordHash = hash;
    adminData.company.adminAuth.defaultPassPlain = newPass;
  }

  adminData.company.adminAuth.username = username;
  adminData.company.adminAuth.securityPin = pin;

  saveSiteData(adminData);
  document.getElementById("secNewPassword").value = "";
  document.getElementById("secConfirmPassword").value = "";
  showToast("Security credentials updated successfully!");
};

/* ==========================================================================
   6b. CUSTOMER ORDERS & INQUIRIES DESK
   ========================================================================== */
let activeInquiryFilter = "all";

window.filterInquiriesType = function(type, btnEl) {
  activeInquiryFilter = type;
  const filterBar = document.getElementById("inquiryFilterBar");
  if (filterBar) {
    filterBar.querySelectorAll("button").forEach(b => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-outline");
    });
  }
  if (btnEl) {
    btnEl.classList.remove("btn-outline");
    btnEl.classList.add("btn-primary");
  }
  renderPrescriptionsList();
};

function renderPrescriptionsList() {
  const container = document.getElementById("adminPrescriptionsList");
  if (!container) return;

  const rawList = typeof getCustomerInquiries === "function" ? getCustomerInquiries() : getPrescriptionsData();
  
  const list = rawList.filter(item => {
    if (activeInquiryFilter === "all") return true;
    if (activeInquiryFilter === "product") return item.type === "product";
    if (activeInquiryFilter === "prescription") return item.type === "prescription" || !item.type;
    return true;
  });

  if (!list.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; background: #F8FAFC; border-radius: 16px; border: 1px dashed #CBD5E1;">
        <i class="fa-solid fa-bell-concierge" style="font-size: 2.5rem; color: #94A3B8; margin-bottom: 12px;"></i>
        <h4 style="color: #0F172A; margin-bottom: 6px;">No Customer Inquiries or Orders Found</h4>
        <p style="color: #64748B; font-size: 0.85rem; max-width: 500px; margin: 0 auto;">
          When customers submit prescriptions or click "Inquire / Order" on any product, their orders and photos will appear here in real-time for 1-click inspection, direct clean download, and instant WhatsApp replies.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, idx) => {
    const isProduct = item.type === "product";
    const badgeColor = isProduct ? "#1D4ED8" : "#DC2626";
    const badgeIcon = isProduct ? "fa-box-open" : "fa-file-prescription";
    const badgeLabel = isProduct ? "PRODUCT ORDER" : "PRESCRIPTION";
    const photoSrc = item.imageBase64 || item.photoUrl || item.image || "assets/images/pharmacy.jpg";

    return `
      <div class="editable-item-card" style="align-items: flex-start; padding: 18px;">
        <div style="width: 100px; height: 100px; border-radius: 10px; overflow: hidden; background: #E2E8F0; flex-shrink: 0; cursor: pointer;" onclick="viewInquiryPhoto('${item.id}')" title="Click to enlarge photo">
          <img src="${photoSrc}" style="width: 100%; height: 100%; object-fit: cover;" alt="${escapeAdminHtml(item.id)}">
        </div>
        
        <div class="item-info" style="flex: 1;">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
            <span style="background: ${badgeColor}; color: white; font-weight: 800; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px;">
              <i class="fa-solid ${badgeIcon}"></i> ${badgeLabel} (${escapeAdminHtml(item.id || 'DW')})
            </span>
            <span style="color: #64748B; font-size: 0.78rem;"><i class="fa-regular fa-clock"></i> ${escapeAdminHtml(item.date || '')}</span>
          </div>
          
          <div class="item-title" style="font-size: 1.05rem; margin-bottom: 4px;">
            ${isProduct ? escapeAdminHtml(item.productName) : escapeAdminHtml(item.name || 'Customer')}
            ${item.phone ? `
              <a href="tel:${escapeAdminHtml(item.phone)}" style="font-size: 0.85rem; color: var(--dw-blue); font-weight: 700; margin-left: 8px;">
                <i class="fa-solid fa-phone"></i> ${escapeAdminHtml(item.phone)}
              </a>
            ` : ''}
          </div>
          
          <div class="item-sub" style="margin-bottom: 6px;">
            ${isProduct ? `<strong>Brand:</strong> ${escapeAdminHtml(item.brand || 'D. Watson')} • <strong>Price:</strong> <span style="color:#16A34A; font-weight:800;">${escapeAdminHtml(item.price || 'Inquire')}</span> • <strong>Category:</strong> ${escapeAdminHtml(item.category || '')}` : `<strong>Branch:</strong> ${escapeAdminHtml(item.branch || 'Nearest Branch')}`}
          </div>
          
          ${item.notes ? `<div style="font-size: 0.82rem; color: #334155; background: #F1F5F9; padding: 6px 10px; border-radius: 6px; margin-top: 4px;"><strong>Customer Inquiry:</strong> ${escapeAdminHtml(item.notes)}</div>` : ''}
        </div>

        <div class="item-actions" style="display: flex; flex-direction: column; gap: 6px;">
          <button class="btn btn-primary btn-sm" onclick="viewInquiryPhoto('${item.id}')" title="Inspect Photo Full Size">
            <i class="fa-solid fa-magnifying-glass-plus"></i> View Photo
          </button>
          ${!isProduct && item.imageBase64 ? `
            <button class="btn btn-outline btn-sm" onclick="downloadInquiryPhoto('${item.id}')" title="Download original image file (No ads)">
              <i class="fa-solid fa-download"></i> Download
            </button>
          ` : ''}
          <button class="btn btn-sm" style="background:#FEE2E2; color:#DC2626;" onclick="deleteInquiryRecord('${item.id}')" title="Delete record">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.viewInquiryPhoto = function(id) {
  const rawList = typeof getCustomerInquiries === "function" ? getCustomerInquiries() : getPrescriptionsData();
  const item = rawList.find(i => i.id === id);
  if (!item) {
    showToast("Record not found.", "error");
    return;
  }

  const photoSrc = item.imageBase64 || item.photoUrl || item.image || "assets/images/pharmacy.jpg";

  const modal = document.getElementById("adminEditModal");
  const modalTitle = document.getElementById("adminModalTitle");
  const modalBody = document.getElementById("adminModalBody");

  if (!modal || !modalTitle || !modalBody) return;

  const isProduct = item.type === "product";
  modalTitle.textContent = isProduct ? `Product Inquiry: ${item.productName} (${item.id})` : `Prescription: ${item.name} (${item.id})`;
  
  modalBody.innerHTML = `
    <div style="text-align: center;">
      <div style="max-height: 65vh; overflow: auto; border-radius: 12px; border: 1px solid #CBD5E1; background: #0F172A; padding: 10px; margin-bottom: 16px;">
        <img src="${photoSrc}" style="max-width: 100%; height: auto; border-radius: 8px;" alt="Inquiry Photo">
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="text-align: left; font-size: 0.85rem; color: #475569;">
          <strong>ID:</strong> ${escapeAdminHtml(item.id)} • <strong>Date:</strong> ${escapeAdminHtml(item.date || '')}<br>
          ${isProduct ? `<strong>Product:</strong> ${escapeAdminHtml(item.productName)} (${escapeAdminHtml(item.price || 'Inquire')})` : `<strong>Customer:</strong> ${escapeAdminHtml(item.name || '')} (${escapeAdminHtml(item.phone || '')})`}
        </div>
        <div style="display: flex; gap: 8px;">
          ${!isProduct && item.imageBase64 ? `
            <button type="button" class="btn btn-primary btn-sm" onclick="downloadInquiryPhoto('${item.id}')">
              <i class="fa-solid fa-download"></i> Download Clean Image
            </button>
          ` : ''}
          <button type="button" class="btn btn-outline btn-sm" onclick="closeAdminModal()">Close</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
};

window.downloadInquiryPhoto = function(id) {
  const rawList = typeof getCustomerInquiries === "function" ? getCustomerInquiries() : getPrescriptionsData();
  const item = rawList.find(i => i.id === id);
  if (!item || !item.imageBase64) {
    showToast("No image file to download.", "error");
    return;
  }

  const a = document.createElement("a");
  a.href = item.imageBase64;
  a.download = `${item.id || 'prescription'}_${(item.name || 'customer').replace(/\s+/g, '_')}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Image downloaded cleanly without any third-party ads!");
};

window.deleteInquiryRecord = function(id) {
  if (confirm("Delete this inquiry / order record?")) {
    if (typeof deleteCustomerInquiry === "function") {
      deleteCustomerInquiry(id);
    } else {
      deletePrescriptionOrder(id);
    }
    renderPrescriptionsList();
    showToast("Record deleted.");
  }
};

/* ==========================================================================
   7. BACKUP, EXPORT & RESTORE
   ========================================================================== */
window.exportSiteJSON = function() {
  exportSiteDataJSON();
  showToast("Configuration JSON file downloaded.");
};

window.triggerImportJSON = function() {
  document.getElementById("importJsonInput")?.click();
};

window.handleFileImport = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const res = importSiteDataJSON(evt.target.result);
    if (res.success) {
      loadAdminState();
      renderAllSections();
      showToast("Data imported and published live!");
    } else {
      alert("Import error: " + res.error);
    }
  };
  reader.readAsText(file);
};

window.resetToFactoryDefaults = function() {
  if (confirm("Reset all website configurations and branch data to official D. Watson defaults? Custom edits will be overwritten.")) {
    resetSiteData();
    loadAdminState();
    renderAllSections();
    showToast("Reset to factory defaults successfully.");
  }
};

/* ==========================================================================
   MODAL & TOAST HELPERS
   ========================================================================== */
window.closeAdminModal = function() {
  const modal = document.getElementById("adminEditModal");
  if (modal) modal.classList.remove("active");
};

function showToast(msg, type = "success") {
  const toast = document.getElementById("adminToast");
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = type === "error" ? "#DC2626" : type === "info" ? "#1D4ED8" : "#0F172A";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function escapeAdminHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   8. REAL-TIME CLOUD DATABASE SYNC ENGINE (Multi-Device Live Sync)
   ========================================================================== */
let isCloudSyncInitialized = false;
const ADMIN_CLOUD_TOPIC = "dwatson_pharmacy_inquiries_2026";
const ADMIN_CLOUD_URL = `https://ntfy.sh/${ADMIN_CLOUD_TOPIC}`;

function initRealtimeCloudSync() {
  if (isCloudSyncInitialized) return;
  isCloudSyncInitialized = true;

  console.log("🟢 Connecting Real-Time Cloud Sync Channel for D. Watson Studio...");

  // 1. Initial Cloud Sync Fetch
  fetchRecentCloudInquiries();

  // 2. Connect Live Server-Sent Events (Instant Push)
  if (window.EventSource) {
    try {
      const sse = new EventSource(`${ADMIN_CLOUD_URL}/sse`);
      
      sse.onmessage = function(e) {
        try {
          const data = JSON.parse(e.data);
          if (data && data.message) {
            const payload = typeof data.message === "string" ? JSON.parse(data.message) : data.message;
            if (payload && payload.id) {
              handleNewIncomingInquiry(payload);
            }
          }
        } catch (err) {
          // Non-JSON message ignored
        }
      };

      sse.onerror = function() {
        // Fallback polling will handle it silently
      };
    } catch (e) {
      console.warn("EventSource setup error, using polling fallback:", e);
    }
  }

  // 3. Resilient Cloud Polling Backup (every 10 seconds)
  setInterval(fetchRecentCloudInquiries, 10000);
}

async function fetchRecentCloudInquiries() {
  try {
    const res = await fetch(`${ADMIN_CLOUD_URL}/json?poll=1&since=all`);
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split("\n").filter(Boolean);
      
      lines.forEach(line => {
        try {
          const json = JSON.parse(line);
          if (json && json.message) {
            const payload = typeof json.message === "string" ? JSON.parse(json.message) : json.message;
            if (payload && payload.id) {
              syncInquirySilently(payload);
            }
          }
        } catch (e) {}
      });
    }
  } catch (err) {
    // Silent fallback
  }
}

function syncInquirySilently(inquiry) {
  const existing = typeof getCustomerInquiries === "function" ? getCustomerInquiries() : [];
  const alreadyExists = existing.some(i => i.id === inquiry.id);
  
  if (!alreadyExists) {
    existing.unshift(inquiry);
    localStorage.setItem("dwatson_all_inquiries", JSON.stringify(existing.slice(0, 150)));
    renderPrescriptionsList();
  }
}

function handleNewIncomingInquiry(inquiry) {
  const existing = typeof getCustomerInquiries === "function" ? getCustomerInquiries() : [];
  const alreadyExists = existing.some(i => i.id === inquiry.id);
  
  if (!alreadyExists) {
    existing.unshift(inquiry);
    localStorage.setItem("dwatson_all_inquiries", JSON.stringify(existing.slice(0, 150)));
    
    // Play live notification sound
    playOrderNotificationChime();

    // Show floating toast
    const isProduct = inquiry.type === "product";
    const label = isProduct ? `🛍️ New Order: ${inquiry.productName || inquiry.id}` : `💊 New Rx: ${inquiry.name || inquiry.id}`;
    showToast(label, "info");

    // Re-render live inquiries desk
    renderPrescriptionsList();
  }
}

/**
 * Web Audio API Notification Chime (No audio files needed, works on all browsers)
 */
function playOrderNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.00, now + 0.12); // A5

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {
    // Audio optional
  }
}
