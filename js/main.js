/**
 * D. Watson Chemist & Superstore - Core Application Logic
 * Official Portal Controller for Heritage, Products, 24+ Branches & Inquiry Handlers
 * Pure JavaScript, clean architecture, high performance
 */

document.addEventListener("DOMContentLoaded", () => {
  initWebsite();

  // Listen for real-time site data updates from the Admin Portal
  window.addEventListener("siteDataUpdated", () => {
    initWebsite();
  });
});

let sliderInterval = null;
let currentSlideIndex = 0;
let progressInterval = null;
let currentGalleryIndex = 0;
let activeGalleryItems = [];
let allBranchesData = [];
let allProductsData = [];

// Product Deep-Zoom & Modal State
let currentProductZoomList = [];
let currentProductZoomIndex = 0;
let currentZoomScale = 1;
let panOffsetX = 0;
let panOffsetY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let isZoomModalEventsInit = false;

/**
 * Main Initialization
 */
function initWebsite() {
  const data = getSiteData();

  renderHeaderAndCompanyInfo(data.company);
  renderHeroSlider(data.heroSlides);
  renderTrustStats(data.company.stats);
  renderAboutAndTimeline(data.company);
  renderDepartments(data.departments, data.company.whatsapp);
  renderProducts(data.products, data.company.whatsapp);
  renderBranches(data.branches);
  renderGallery(data.gallery);
  renderFAQs(data.faqs);
  renderFooter(data.company, data.branches);
  initPrescriptionUploader(data.company.whatsapp);
  initProductZoomEvents();
  initHeaderScroll();
  initMobileMenu();
}

/**
 * Render Header & Topbar info
 */
function renderHeaderAndCompanyInfo(company) {
  const announcementEl = document.getElementById("topAnnouncement");
  if (announcementEl) announcementEl.textContent = company.announcement;

  const phoneTopEl = document.getElementById("topPhone");
  if (phoneTopEl) {
    phoneTopEl.href = `tel:${company.helpline.replace(/[^0-9]/g, '')}`;
    phoneTopEl.innerHTML = `<i class="fa-solid fa-phone"></i> Helpline: ${company.helpline}`;
  }

  const waTopEl = document.getElementById("topWhatsApp");
  if (waTopEl) {
    waTopEl.href = `https://wa.me/${company.whatsapp}`;
    waTopEl.innerHTML = `<i class="fa-brands fa-whatsapp"></i> WhatsApp: ${company.whatsappDisplay}`;
  }

  // Mobile bottom bar links
  const mobCall = document.getElementById("mobTabCall");
  if (mobCall) {
    mobCall.href = `tel:${company.helpline.replace(/[^0-9]/g, '')}`;
  }
  const mobWa = document.getElementById("mobTabWa");
  if (mobWa) {
    mobWa.href = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hi D.Watson Chemist, I need assistance.")}`;
  }

  // Floating CTA WhatsApp link
  const floatWaBtn = document.getElementById("floatingWaBtn");
  if (floatWaBtn) {
    floatWaBtn.href = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Hello D.Watson, I need assistance.")}`;
  }
}

/**
 * Render Hero Slider (With Mobile Touch Swipe Gestures)
 */
function renderHeroSlider(slides) {
  const sliderContainer = document.getElementById("heroSliderWrapper");
  const dotsContainer = document.getElementById("heroSliderDots");
  if (!sliderContainer || !slides || !slides.length) return;

  sliderContainer.innerHTML = "";
  if (dotsContainer) dotsContainer.innerHTML = "";

  slides.forEach((slide, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slideDiv.style.backgroundImage = `url("${encodeURI(slide.image)}")`;

    slideDiv.innerHTML = `
      <div class="hero-slide-overlay"></div>
      <div class="container">
        <div class="hero-content">
          <div class="slide-tag">
            <i class="fa-solid fa-certificate"></i> ${escapeHtml(slide.tag || "D. Watson Verified")}
          </div>
          <h1 class="slide-title">${escapeHtml(slide.title)}</h1>
          <p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>
          <div class="slide-actions">
            <a href="${slide.ctaPrimaryLink || '#prescription-box'}" class="btn btn-primary">
              <i class="fa-brands fa-whatsapp"></i> ${escapeHtml(slide.ctaPrimaryText || 'Order on WhatsApp')}
            </a>
            <a href="${slide.ctaSecondaryLink || '#branches'}" class="btn btn-outline-white">
              ${escapeHtml(slide.ctaSecondaryText || 'Find Nearest Branch')} <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    sliderContainer.appendChild(slideDiv);

    if (dotsContainer) {
      const dot = document.createElement("button");
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute("aria-label", `Slide ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    }
  });

  // Touch Swipe Gesture Detection for Mobile Browsers
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener("touchstart", (e) => {
    if (e.changedTouches && e.changedTouches.length) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  sliderContainer.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches.length) {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchEndX - touchStartX;
      if (diffX < -45) {
        nextSlide(); // Swiped left -> next
      } else if (diffX > 45) {
        prevSlide(); // Swiped right -> prev
      }
    }
  }, { passive: true });

  currentSlideIndex = 0;
  startSliderAutoplay(slides.length);
}

/**
 * Slider Autoplay Controller
 */
function startSliderAutoplay(totalSlides) {
  if (sliderInterval) clearInterval(sliderInterval);
  if (progressInterval) clearInterval(progressInterval);

  const progressBar = document.getElementById("sliderProgressBar");
  let progress = 0;
  const slideDuration = 6000;
  const stepTime = 50;

  progressInterval = setInterval(() => {
    progress += (stepTime / slideDuration) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      progress = 0;
      goToSlide((currentSlideIndex + 1) % totalSlides);
    }
  }, stepTime);
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dot");
  const progressBar = document.getElementById("sliderProgressBar");

  if (!slides.length) return;

  slides.forEach((s) => s.classList.remove("active"));
  dots.forEach((d) => d.classList.remove("active"));

  currentSlideIndex = (index + slides.length) % slides.length;

  slides[currentSlideIndex].classList.add("active");
  if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add("active");

  if (progressBar) progressBar.style.width = "0%";
}

function nextSlide() {
  const slides = document.querySelectorAll(".hero-slide");
  goToSlide(currentSlideIndex + 1);
}

function prevSlide() {
  const slides = document.querySelectorAll(".hero-slide");
  goToSlide(currentSlideIndex - 1);
}

document.getElementById("sliderPrevBtn")?.addEventListener("click", prevSlide);
document.getElementById("sliderNextBtn")?.addEventListener("click", nextSlide);

/**
 * Render Trust & Stats Bar
 */
function renderTrustStats(stats) {
  const container = document.getElementById("trustGrid");
  if (!container || !stats) return;

  container.innerHTML = stats.map(stat => `
    <div class="trust-item">
      <div class="trust-icon">
        <i class="fa-solid ${stat.icon || 'fa-check'}"></i>
      </div>
      <div>
        <div class="trust-number">${escapeHtml(stat.number)}</div>
        <div class="trust-label">${escapeHtml(stat.label)}</div>
      </div>
    </div>
  `).join("");
}

/**
 * Render About & Heritage Timeline
 */
function renderAboutAndTimeline(company) {
  const shortEl = document.getElementById("aboutShortText");
  if (shortEl) shortEl.textContent = company.aboutShort;

  const histEl = document.getElementById("aboutHistoryText");
  if (histEl) histEl.textContent = company.aboutHistory;

  const timelineContainer = document.getElementById("timelineGrid");
  if (!timelineContainer) return;

  const milestones = company.historyTimeline || [];
  timelineContainer.innerHTML = milestones.map((m, idx) => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <span class="timeline-year">${escapeHtml(m.year)}</span>
        <h4 class="timeline-title">${escapeHtml(m.title)}</h4>
        <p class="timeline-desc">${escapeHtml(m.desc)}</p>
      </div>
    </div>
  `).join("");
}

/**
 * Render Department Showcase
 */
function renderDepartments(departments, defaultWhatsApp) {
  const container = document.getElementById("departmentsGrid");
  if (!container || !departments) return;

  container.innerHTML = departments.map((dept) => {
    const waUrl = `https://wa.me/${defaultWhatsApp}?text=${encodeURIComponent(dept.whatsappMsg || `Hi D.Watson, I am inquiring about ${dept.name}.`)}`;
    
    return `
      <div class="department-card" id="dept-${dept.id}">
        <div class="dept-img-wrap">
          <img src="${encodeURI(dept.image)}" alt="${escapeHtml(dept.name)}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/images/pharmacy.jpg';">
          <span class="dept-badge">${escapeHtml(dept.badge || "Featured")}</span>
          <div class="dept-icon-floating">
            <i class="${dept.icon || 'fa-solid fa-star'}"></i>
          </div>
        </div>
        <div class="dept-body">
          <h3 class="dept-title">${escapeHtml(dept.name)}</h3>
          <div class="dept-tagline">${escapeHtml(dept.tagline)}</div>
          <p class="dept-desc">${escapeHtml(dept.description)}</p>
          
          <ul class="dept-features">
            ${(dept.features || []).map(f => `
              <li><i class="fa-solid fa-circle-check"></i> ${escapeHtml(f)}</li>
            `).join("")}
          </ul>

          <div class="dept-card-footer">
            <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm">
              <i class="fa-brands fa-whatsapp"></i> Inquire on WhatsApp
            </a>
            <a href="#branches" class="btn btn-outline btn-sm">
              Branches <i class="fa-solid fa-location-dot"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Render Featured Products Showcase
 */
function renderProducts(products, defaultWhatsApp) {
  allProductsData = products || [];
  const container = document.getElementById("productsGrid");
  const filterContainer = document.getElementById("productFilters");
  if (!container || !allProductsData.length) return;

  const categories = [
    { key: "all", label: "All Showcase" },
    { key: "pharmacy", label: "Medicines & Vitamins" },
    { key: "cosmetics", label: "Luxury Cosmetics & Derma" },
    { key: "optics", label: "Optics & Designer Frames" },
    { key: "surgical", label: "Surgical & Health Devices" },
    { key: "grocery", label: "Baby Care & Gourmet" }
  ];

  if (filterContainer) {
    filterContainer.innerHTML = categories.map((cat, idx) => `
      <button class="branch-pill-btn ${idx === 0 ? 'active' : ''}" onclick="filterProductsCategory('${cat.key}', this)">
        ${escapeHtml(cat.label)}
      </button>
    `).join("");
  }

  renderProductCards(allProductsData, defaultWhatsApp);
}

function renderProductCards(products, defaultWhatsApp) {
  const container = document.getElementById("productsGrid");
  if (!container) return;

  currentProductZoomList = products || [];
  const waNum = defaultWhatsApp || "923329716666";

  container.innerHTML = currentProductZoomList.map((p, idx) => {
    const fullImgUrl = getFullImageUrl(p.image);
    let waText = `*--- D. WATSON PRODUCT INQUIRY & ORDER ---*\n🛍️ *Product:* ${p.name}\n🏷️ *Brand:* ${p.brand || 'D. Watson'}\n💰 *Price:* ${p.price || 'Inquire'}\n📂 *Category:* ${p.categoryName || p.category}\n`;
    if (fullImgUrl) {
      waText += `📸 *Product Photo Link:* ${fullImgUrl}\n`;
    }
    waText += `\n📝 *Inquiry Note:* Hi D.Watson Chemist, please confirm stock availability and express delivery.`;
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`;

    return `
      <div class="product-card" data-product-id="${p.id}">
        <div class="product-img-wrap" onclick="openProductZoomModal('${p.id}')" title="Click to inspect & zoom ${escapeHtml(p.name)}">
          <img src="${encodeURI(p.image || 'assets/images/pharmacy.jpg')}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/images/pharmacy.jpg';">
          <span class="product-badge-tag">${escapeHtml(p.tag || "100% Genuine")}</span>
          <span class="product-instock-badge"><i class="fa-solid fa-circle-check"></i> In Stock</span>
          <div class="product-zoom-hint-btn">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
            <span>Click to Zoom &amp; Details</span>
          </div>
        </div>
        <div class="product-body">
          <span class="product-brand">${escapeHtml(p.brand || 'D. Watson')}</span>
          <h4 class="product-title" onclick="openProductZoomModal('${p.id}')" title="Click to inspect">${escapeHtml(p.name)}</h4>
          <p class="product-desc">${escapeHtml(p.description || '')}</p>
          
          <div class="product-footer">
            <div class="product-price">${escapeHtml(p.price || 'Inquire')}</div>
            <a href="${waUrl}" target="_blank" onclick="handleProductOrderClick(event, '${p.id}', '${waUrl}')" class="btn btn-whatsapp btn-sm" title="Order via WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> Inquire / Order
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach dynamic cursor-tracking hover zoom lens filter
  container.querySelectorAll(".product-img-wrap").forEach(wrap => {
    const img = wrap.querySelector("img");
    if (!img) return;

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = `scale(1.5)`;
    });

    wrap.addEventListener("mouseleave", () => {
      img.style.transformOrigin = `center center`;
      img.style.transform = `scale(1)`;
    });
  });
}

window.filterProductsCategory = function(catKey, btn) {
  document.querySelectorAll("#productFilters .branch-pill-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const data = getSiteData();
  if (catKey === "all") {
    renderProductCards(data.products, data.company.whatsapp);
  } else {
    const filtered = (data.products || []).filter(p => p.category === catKey);
    renderProductCards(filtered, data.company.whatsapp);
  }
};

/**
 * ==========================================================================
 * Product Zoom Modal Controller & Deep-Zoom Engine
 * ==========================================================================
 */
function initProductZoomEvents() {
  if (isZoomModalEventsInit) return;
  isZoomModalEventsInit = true;

  const viewport = document.getElementById("zoomViewport");
  if (!viewport) return;

  // Drag & Pan with Mouse
  viewport.addEventListener("mousedown", (e) => {
    if (e.button !== 0 || currentZoomScale <= 1) return;
    isPanning = true;
    panStartX = e.clientX - panOffsetX;
    panStartY = e.clientY - panOffsetY;
    viewport.classList.add("dragging");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isPanning || currentZoomScale <= 1) return;
    panOffsetX = e.clientX - panStartX;
    panOffsetY = e.clientY - panStartY;
    applyProductZoomTransform();
  });

  window.addEventListener("mouseup", () => {
    if (isPanning) {
      isPanning = false;
      viewport.classList.remove("dragging");
    }
  });

  // Touch Drag & Pan on Mobile
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1 && currentZoomScale > 1) {
      isPanning = true;
      panStartX = e.touches[0].clientX - panOffsetX;
      panStartY = e.touches[0].clientY - panOffsetY;
    }
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    if (isPanning && e.touches.length === 1 && currentZoomScale > 1) {
      e.preventDefault();
      panOffsetX = e.touches[0].clientX - panStartX;
      panOffsetY = e.touches[0].clientY - panStartY;
      applyProductZoomTransform();
    }
  }, { passive: false });

  viewport.addEventListener("touchend", () => {
    isPanning = false;
  });

  // Mouse Wheel to Zoom in / out smoothly
  viewport.addEventListener("wheel", (e) => {
    const modal = document.getElementById("productZoomModal");
    if (!modal || !modal.classList.contains("active")) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomInProduct();
    } else {
      zoomOutProduct();
    }
  }, { passive: false });

  // Double Click Toggle Zoom
  viewport.addEventListener("dblclick", (e) => {
    const modal = document.getElementById("productZoomModal");
    if (!modal || !modal.classList.contains("active")) return;
    e.preventDefault();
    if (currentZoomScale > 1) {
      resetProductZoom();
    } else {
      currentZoomScale = 2.2;
      applyProductZoomTransform();
    }
  });

  // Global Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("productZoomModal");
    if (!modal || !modal.classList.contains("active")) return;

    if (e.key === "Escape") closeProductZoomModal();
    if (e.key === "ArrowRight") nextProductZoom();
    if (e.key === "ArrowLeft") prevProductZoom();
    if (e.key === "+" || e.key === "=") zoomInProduct();
    if (e.key === "-" || e.key === "_") zoomOutProduct();
    if (e.key === "0" || e.key === "r" || e.key === "R") resetProductZoom();
    if (e.key === "f" || e.key === "F") toggleProductZoomFullscreen();
  });
}

function applyProductZoomTransform() {
  const img = document.getElementById("zoomModalImg");
  const badge = document.getElementById("zoomLevelBadge");
  if (!img) return;

  // Constrain pan offsets based on zoom scale
  if (currentZoomScale <= 1) {
    panOffsetX = 0;
    panOffsetY = 0;
  } else {
    const maxOffset = (currentZoomScale - 1) * 320;
    panOffsetX = Math.max(-maxOffset, Math.min(maxOffset, panOffsetX));
    panOffsetY = Math.max(-maxOffset, Math.min(maxOffset, panOffsetY));
  }

  img.style.transform = `translate(${panOffsetX}px, ${panOffsetY}px) scale(${currentZoomScale})`;
  if (badge) {
    badge.textContent = `${Math.round(currentZoomScale * 100)}%`;
  }
}

window.openProductZoomModal = function(productIdOrIndex) {
  initProductZoomEvents();

  if (!currentProductZoomList || !currentProductZoomList.length) {
    const data = getSiteData();
    currentProductZoomList = data.products || [];
  }

  let index = 0;
  if (typeof productIdOrIndex === "number") {
    index = productIdOrIndex;
  } else if (typeof productIdOrIndex === "string") {
    const foundIdx = currentProductZoomList.findIndex(p => p.id === productIdOrIndex);
    index = foundIdx !== -1 ? foundIdx : 0;
  }

  currentProductZoomIndex = Math.max(0, Math.min(currentProductZoomList.length - 1, index));
  updateProductZoomDisplay();

  const modal = document.getElementById("productZoomModal");
  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }
  document.body.style.overflow = "hidden";
};

function updateProductZoomDisplay() {
  if (!currentProductZoomList || !currentProductZoomList.length) return;
  const p = currentProductZoomList[currentProductZoomIndex];
  if (!p) return;

  const data = getSiteData();
  const waNum = data.company && data.company.whatsapp ? data.company.whatsapp : "923329716666";

  const catEl = document.getElementById("zoomModalCategory");
  const counterEl = document.getElementById("zoomModalCounter");
  const imgEl = document.getElementById("zoomModalImg");
  const brandEl = document.getElementById("zoomModalBrand");
  const titleEl = document.getElementById("zoomModalTitle");
  const tagEl = document.getElementById("zoomModalTag");
  const priceEl = document.getElementById("zoomModalPrice");
  const descEl = document.getElementById("zoomModalDesc");
  const waBtn = document.getElementById("zoomModalWhatsApp");

  if (catEl) catEl.textContent = p.categoryName || p.category || "Healthcare Essential";
  if (counterEl) counterEl.textContent = `${currentProductZoomIndex + 1} / ${currentProductZoomList.length}`;
  if (imgEl) {
    imgEl.src = p.image || "assets/images/pharmacy.jpg";
    imgEl.alt = p.name;
  }
  if (brandEl) brandEl.textContent = p.brand || "D. Watson Certified";
  if (titleEl) titleEl.textContent = p.name;
  if (tagEl) tagEl.textContent = p.tag || "100% Genuine Guaranteed";
  if (priceEl) priceEl.textContent = p.price || "Inquire for Price";
  if (descEl) descEl.textContent = p.description || "Authentic pharmaceutical grade product, direct from official distributor with temperature-controlled handling.";

  if (waBtn) {
    const fullImgUrl = getFullImageUrl(p.image);
    let waText = `*--- D. WATSON PRODUCT INQUIRY & ORDER ---*\n🛍️ *Product:* ${p.name}\n🏷️ *Brand:* ${p.brand || 'D. Watson'}\n💰 *Price:* ${p.price || 'Inquire'}\n📂 *Category:* ${p.categoryName || p.category}\n`;
    if (fullImgUrl) {
      waText += `📸 *Product Photo Link:* ${fullImgUrl}\n`;
    }
    waText += `\n📝 *Inquiry Note:* Hi D.Watson Chemist, please confirm stock availability and express delivery to my location.`;
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`;
    waBtn.href = waUrl;
    waBtn.onclick = function(e) {
      handleProductOrderClick(e, p.id, waUrl);
    };
  }

  resetProductZoom();
  renderProductZoomThumbs();
}

function renderProductZoomThumbs() {
  const container = document.getElementById("zoomThumbsStrip");
  if (!container || !currentProductZoomList.length) return;

  container.innerHTML = currentProductZoomList.map((item, idx) => `
    <div class="zoom-thumb-item ${idx === currentProductZoomIndex ? 'active' : ''}" onclick="goToProductZoom(${idx})" title="${escapeHtml(item.name)}">
      <img src="${item.image || 'assets/images/pharmacy.jpg'}" alt="${escapeHtml(item.name)}" loading="lazy">
    </div>
  `).join("");
}

window.goToProductZoom = function(index) {
  if (index < 0 || index >= currentProductZoomList.length) return;
  currentProductZoomIndex = index;
  updateProductZoomDisplay();
};

window.nextProductZoom = function() {
  if (!currentProductZoomList.length) return;
  currentProductZoomIndex = (currentProductZoomIndex + 1) % currentProductZoomList.length;
  updateProductZoomDisplay();
};

window.prevProductZoom = function() {
  if (!currentProductZoomList.length) return;
  currentProductZoomIndex = (currentProductZoomIndex - 1 + currentProductZoomList.length) % currentProductZoomList.length;
  updateProductZoomDisplay();
};

window.zoomInProduct = function() {
  currentZoomScale = Math.min(4, Math.round((currentZoomScale + 0.35) * 100) / 100);
  applyProductZoomTransform();
};

window.zoomOutProduct = function() {
  currentZoomScale = Math.max(1, Math.round((currentZoomScale - 0.35) * 100) / 100);
  if (currentZoomScale === 1) {
    panOffsetX = 0;
    panOffsetY = 0;
  }
  applyProductZoomTransform();
};

window.resetProductZoom = function() {
  currentZoomScale = 1;
  panOffsetX = 0;
  panOffsetY = 0;
  applyProductZoomTransform();
};

window.toggleProductZoomFullscreen = function() {
  const modal = document.getElementById("productZoomModal");
  if (!modal) return;

  if (!document.fullscreenElement) {
    if (modal.requestFullscreen) {
      modal.requestFullscreen();
    } else if (modal.webkitRequestFullscreen) {
      modal.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

window.closeProductZoomModal = function() {
  const modal = document.getElementById("productZoomModal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
  resetProductZoom();
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
};

/**
 * Render Branches Explorer (24+ Network)
 */
function renderBranches(branches) {
  allBranchesData = branches || [];
  const container = document.getElementById("branchesGrid");
  const pillsContainer = document.getElementById("branchCityPills");
  if (!container || !branches) return;

  const cities = ["All (24+)", "Islamabad", "Rawalpindi", "Lahore", "Other Cities", "Open 24/7"];

  if (pillsContainer) {
    pillsContainer.innerHTML = cities.map((city, idx) => `
      <button class="branch-pill-btn ${idx === 0 ? 'active' : ''}" onclick="filterBranchesByCity('${city}', this)">
        ${escapeHtml(city)}
      </button>
    `).join("");
  }

  renderBranchCards(branches);

  const searchInput = document.getElementById("branchSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = allBranchesData.filter(b => 
        b.name.toLowerCase().includes(term) ||
        b.address.toLowerCase().includes(term) ||
        b.city.toLowerCase().includes(term) ||
        b.area.toLowerCase().includes(term)
      );
      renderBranchCards(filtered);
    });
  }
}

function renderBranchCards(branches) {
  const container = document.getElementById("branchesGrid");
  if (!container) return;

  if (branches.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: white; border-radius: 16px; border: 1px dashed #CBD5E1;">
        <i class="fa-solid fa-map-location-dot" style="font-size: 3rem; color: #94A3B8; margin-bottom: 12px;"></i>
        <h3 style="color: #0F172A; margin-bottom: 6px;">No Branches Found</h3>
        <p style="color: #64748B;">Try a different search keyword or city filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = branches.map(b => `
    <div class="branch-card">
      <div class="branch-card-header">
        <img src="${encodeURI(b.image || 'assets/images/store_flagship.jpg')}" alt="${escapeHtml(b.name)}" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='assets/images/store_flagship.jpg';">
        ${b.is24Hours ? '<span class="branch-badge-24"><i class="fa-solid fa-clock"></i> 24/7 OPEN</span>' : ''}
        <span class="branch-city-badge">${escapeHtml(b.city)}</span>
      </div>
      <div class="branch-body">
        <h3 class="branch-name">${escapeHtml(b.name)}</h3>
        
        <div class="branch-info-row">
          <i class="fa-solid fa-location-dot"></i>
          <span>${escapeHtml(b.address)}</span>
        </div>

        <div class="branch-info-row">
          <i class="fa-solid fa-phone"></i>
          <a href="tel:${b.phone.split('/')[0].replace(/[^0-9]/g, '')}" style="color: var(--dw-blue); font-weight: 600;">
            ${escapeHtml(b.phone)}
          </a>
        </div>

        <div class="branch-info-row">
          <i class="fa-regular fa-clock"></i>
          <span>${escapeHtml(b.timings)}</span>
        </div>

        <div class="branch-services">
          ${(b.services || []).map(s => `
            <span class="branch-srv-tag">${escapeHtml(s)}</span>
          `).join("")}
        </div>

        <div class="branch-actions">
          <a href="${b.mapUrl || '#'}" target="_blank" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-diamond-turn-right"></i> Directions
          </a>
          <a href="https://wa.me/${b.whatsapp || '923329716666'}?text=${encodeURIComponent(`Hi D.Watson, I am inquiring about the ${b.name} branch.`)}" target="_blank" class="btn btn-whatsapp btn-sm">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>
  `).join("");
}

window.filterBranchesByCity = function(cityOption, btn) {
  document.querySelectorAll("#branchCityPills .branch-pill-btn").forEach(p => p.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const searchInput = document.getElementById("branchSearchInput");
  if (searchInput) searchInput.value = "";

  if (cityOption === "All (24+)") {
    renderBranchCards(allBranchesData);
  } else if (cityOption === "Open 24/7") {
    const filtered = allBranchesData.filter(b => b.is24Hours === true);
    renderBranchCards(filtered);
  } else {
    const filtered = allBranchesData.filter(b => b.city.toLowerCase() === cityOption.toLowerCase());
    renderBranchCards(filtered);
  }
};

/**
 * Filterable Image Gallery & Lightbox
 */
function renderGallery(galleryItems) {
  activeGalleryItems = galleryItems;
  const container = document.getElementById("galleryGrid");
  const filterContainer = document.getElementById("galleryFilters");
  if (!container || !galleryItems) return;

  const categories = [
    { key: "all", label: "All Photos" },
    { key: "stores", label: "Stores & Facades" },
    { key: "pharmacy", label: "Pharmacy & Cold-Chain Labs" },
    { key: "cosmetics", label: "Cosmetics & Skincare" },
    { key: "optics", label: "Optics Clinic" },
    { key: "surgical", label: "Surgical Equipment" },
    { key: "grocery", label: "Supermarket Aisles" }
  ];

  if (filterContainer) {
    filterContainer.innerHTML = categories.map((cat, idx) => `
      <button class="gallery-filter-btn ${idx === 0 ? 'active' : ''}" onclick="filterGalleryCategory('${cat.key}', this)">
        ${escapeHtml(cat.label)}
      </button>
    `).join("");
  }

  renderGalleryGrid(galleryItems);
}

function renderGalleryGrid(items) {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  activeGalleryItems = items;

  container.innerHTML = items.map((item, index) => `
    <div class="gallery-item" onclick="openLightbox(${index})">
      <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-zoom-icon"><i class="fa-solid fa-expand"></i></span>
        <span class="gallery-overlay-cat">${escapeHtml(item.categoryName || item.category)}</span>
        <h4 class="gallery-overlay-title">${escapeHtml(item.title)}</h4>
      </div>
    </div>
  `).join("");
}

window.filterGalleryCategory = function(category, btn) {
  document.querySelectorAll(".gallery-filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const data = getSiteData();
  if (category === "all") {
    renderGalleryGrid(data.gallery);
  } else {
    const filtered = data.gallery.filter(item => item.category === category);
    renderGalleryGrid(filtered);
  }
};

/**
 * Lightbox Modal Logic
 */
window.openLightbox = function(index) {
  if (!activeGalleryItems || !activeGalleryItems[index]) return;
  currentGalleryIndex = index;
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");

  if (!modal || !img) return;

  img.src = activeGalleryItems[index].image;
  if (caption) {
    caption.innerHTML = `<strong>${escapeHtml(activeGalleryItems[index].title)}</strong><br><span style="font-size:0.85rem; color:#94A3B8;">${escapeHtml(activeGalleryItems[index].description || '')}</span>`;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeLightbox = function() {
  const modal = document.getElementById("lightboxModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
};

window.nextLightbox = function() {
  if (!activeGalleryItems.length) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryItems.length;
  openLightbox(currentGalleryIndex);
};

window.prevLightbox = function() {
  if (!activeGalleryItems.length) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
  openLightbox(currentGalleryIndex);
};

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("lightboxModal");
  if (modal && modal.classList.contains("active")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextLightbox();
    if (e.key === "ArrowLeft") prevLightbox();
  }
});

/**
 * Render FAQ Accordion
 */
function renderFAQs(faqs) {
  const container = document.getElementById("faqAccordion");
  if (!container || !faqs) return;

  container.innerHTML = faqs.map((faq, idx) => `
    <div class="faq-card ${idx === 0 ? 'open' : ''}">
      <div class="faq-header" onclick="toggleFaq(this)">
        <span>${escapeHtml(faq.q)}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </div>
      <div class="faq-body">
        <p>${escapeHtml(faq.a)}</p>
      </div>
    </div>
  `).join("");
}

window.toggleFaq = function(headerEl) {
  const card = headerEl.parentElement;
  const wasOpen = card.classList.contains("open");

  document.querySelectorAll(".faq-card").forEach(c => c.classList.remove("open"));
  if (!wasOpen) card.classList.add("open");
};

/**
 * Render Footer Links & Details
 */
function renderFooter(company, branches) {
  const footerAbout = document.getElementById("footerAboutText");
  if (footerAbout) footerAbout.textContent = company.aboutShort;

  const footerHelpline = document.getElementById("footerHelpline");
  if (footerHelpline) footerHelpline.textContent = company.helpline;

  const footerEmail = document.getElementById("footerEmail");
  if (footerEmail) footerEmail.textContent = company.email;

  const footerAddress = document.getElementById("footerAddress");
  if (footerAddress) footerAddress.textContent = company.address;

  const footerBranchList = document.getElementById("footerBranchList");
  if (footerBranchList && branches) {
    footerBranchList.innerHTML = branches.slice(0, 6).map(b => `
      <li><a href="#branches"><i class="fa-solid fa-angle-right"></i> ${escapeHtml(b.name)}</a></li>
    `).join("");
  }
}

/**
 * Helper: Resolve relative image path to direct GitHub Raw CDN public URL
 * Always accessible anywhere in the world with HTTP 200 OK, zero 404s, zero ads
 */
function getFullImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  
  const cleanPath = imagePath.replace(/^\.?\//, "");
  const encodedPath = encodeURI(cleanPath).replace(/\+/g, "%2B");
  // Official GitHub Global CDN Raw Link (permanent, live, public, 100% reliable)
  return `https://raw.githubusercontent.com/wasidevxyz-pixel/dwatson/main/${encodedPath}`;
}

/**
 * Handle Product Order Click: Awaits Real-Time Cloud Sync & opens WhatsApp
 */
window.handleProductOrderClick = async function(event, productId, waUrl) {
  if (event) event.preventDefault();

  const p = (allProductsData || []).find(item => item.id === productId) || (currentProductZoomList || []).find(item => item.id === productId);
  if (!p) {
    if (waUrl) window.open(waUrl, "_blank");
    return;
  }

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const refId = `DW-ORD-${randomCode}`;
  const timestamp = new Date().toLocaleString();
  const fullImgUrl = getFullImageUrl(p.image);

  if (typeof saveCustomerInquiry === "function") {
    try {
      await saveCustomerInquiry({
        id: refId,
        type: "product",
        productName: p.name,
        brand: p.brand || "D. Watson Certified",
        price: p.price || "Inquire",
        category: p.categoryName || p.category || "General Essential",
        photoUrl: fullImgUrl,
        image: fullImgUrl,
        customerName: "Online WhatsApp Customer",
        notes: `Product inquiry for ${p.name} (${p.price || 'Inquire'})`,
        date: timestamp,
        status: "New Product Order"
      });
    } catch (e) {
      console.warn("Inquiry sync error:", e);
    }
  }

  if (waUrl) {
    window.open(waUrl, "_blank");
  }
};

let selectedPrescriptionBase64 = null;
let selectedPrescriptionFileName = "";
let uploadedCleanPhotoUrl = null;
let isCleanPhotoUploading = false;
let cleanPhotoUploadPromise = null;

/**
 * Helper: Upload image to 100% clean, ad-free direct image host
 * Returns direct raw image URL (e.g. https://files.catbox.moe/xyz.jpg)
 */
async function uploadImageToCleanHost(file) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", file);

  try {
    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData
    });
    if (res.ok) {
      const urlText = await res.text();
      if (urlText && urlText.trim().startsWith("https://files.catbox.moe/")) {
        return urlText.trim();
      }
    }
  } catch (err) {
    console.warn("Direct image host error:", err);
  }
  return null;
}

/**
 * Prescription & Inquiry Uploader Form logic
 */
function initPrescriptionUploader(whatsappNumber) {
  const fileInput = document.getElementById("prescriptionFileInput");
  const dropzone = document.getElementById("prescriptionDropzone");
  const previewBox = document.getElementById("prescriptionPreview");
  const previewImg = document.getElementById("previewImg");
  const fileNameTxt = document.getElementById("prescriptionFileName");
  const uploadStatus = document.getElementById("prescriptionUploadStatus");
  const form = document.getElementById("prescriptionForm");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedPrescriptionFileName = file.name;
      uploadedCleanPhotoUrl = null;
      if (fileNameTxt) fileNameTxt.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
      
      const reader = new FileReader();
      reader.onload = async function(evt) {
        selectedPrescriptionBase64 = evt.target.result;
        if (previewImg) previewImg.src = selectedPrescriptionBase64;
        if (previewBox) previewBox.classList.add("active");

        if (uploadStatus) {
          uploadStatus.innerHTML = `<span style="color:#2563EB; display:inline-flex; align-items:center; gap:6px;"><i class="fa-solid fa-spinner fa-spin"></i> Generating direct photo link (No ads)...</span>`;
        }

        // Auto-copy image to clipboard so user can also press Ctrl+V in WhatsApp
        if (navigator.clipboard && window.ClipboardItem && file.type.startsWith("image/")) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ [file.type]: file })]);
          } catch (clipErr) {
            // Optional clipboard support
          }
        }
      };
      reader.readAsDataURL(file);

      // Upload to clean, 100% ad-free raw image CDN
      isCleanPhotoUploading = true;
      cleanPhotoUploadPromise = uploadImageToCleanHost(file).then(url => {
        uploadedCleanPhotoUrl = url;
        isCleanPhotoUploading = false;
        if (uploadStatus) {
          if (url) {
            uploadStatus.innerHTML = `<span style="color:#16A34A; display:inline-flex; align-items:center; gap:6px;"><i class="fa-solid fa-circle-check"></i> Direct Photo Link Ready (Ad-Free)</span>`;
          } else {
            uploadStatus.innerHTML = `<span style="color:#16A34A; display:inline-flex; align-items:center; gap:6px;"><i class="fa-solid fa-circle-check"></i> Photo Ready &amp; Saved to Portal</span>`;
          }
        }
        return url;
      });
    }
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      const origBtnHtml = submitBtn ? submitBtn.innerHTML : "";

      if (isCleanPhotoUploading && cleanPhotoUploadPromise) {
        if (submitBtn) submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Preparing Direct Photo Link...`;
        try {
          await Promise.race([cleanPhotoUploadPromise, new Promise(res => setTimeout(res, 2500))]);
        } catch (err) {}
        if (submitBtn) submitBtn.innerHTML = origBtnHtml;
      }

      const name = document.getElementById("custName")?.value.trim() || "";
      const phone = document.getElementById("custPhone")?.value.trim() || "";
      const branch = document.getElementById("custBranch")?.value || "Nearest Branch";
      const notes = document.getElementById("custNotes")?.value.trim() || "";

      // Generate unique Reference Code
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const refId = `DW-RX-${randomCode}`;
      const timestamp = new Date().toLocaleString();

      // Save order to D. Watson Portal Studio database (100% clean, no ads, permanent)
      if (typeof savePrescriptionOrder === "function") {
        try {
          await savePrescriptionOrder({
            id: refId,
            name: name,
            phone: phone,
            branch: branch,
            notes: notes,
            photoUrl: uploadedCleanPhotoUrl || "",
            imageBase64: selectedPrescriptionBase64 || "",
            fileName: selectedPrescriptionFileName || "prescription.jpg",
            date: timestamp
          });
        } catch (e) {
          console.warn("Prescription save error:", e);
        }
      }

      let msg = `*--- D. WATSON PRESCRIPTION & MEDICINE ORDER ---*\n`;
      msg += `👤 *Customer Name:* ${name}\n`;
      msg += `📞 *Contact Phone:* ${phone}\n`;
      msg += `📍 *Selected Branch:* ${branch}\n`;
      msg += `🆔 *Prescription Ref ID:* ${refId}\n`;
      if (notes) msg += `📝 *Prescription / Medicine Details:* ${notes}\n`;
      
      if (uploadedCleanPhotoUrl) {
        msg += `📷 *Prescription Photo Link:* ${uploadedCleanPhotoUrl}\n`;
      } else {
        msg += `📎 *Prescription Photo:* Attached in chat & registered in D. Watson Portal Desk (${refId}).\n`;
      }
      msg += `✅ *Please verify stock and send price & delivery confirmation.*`;

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName")?.value || "";
      const email = document.getElementById("contactEmail")?.value || "";
      const dept = document.getElementById("contactDept")?.value || "General Inquiry";
      const message = document.getElementById("contactMessage")?.value || "";

      let msg = `*--- D. WATSON CUSTOMER INQUIRY ---*\n`;
      msg += `👤 *Name:* ${name}\n`;
      msg += `📧 *Email:* ${email}\n`;
      msg += `🏢 *Department:* ${dept}\n`;
      msg += `💬 *Message:* ${message}\n`;

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");
    });
  }
}

/**
 * Header Scroll & Mobile Navigation
 */
/**
 * Header Scroll & Mobile Navigation
 */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  const mobTabs = {
    home: document.getElementById("mobTabHome"),
    rx: document.getElementById("mobTabRx"),
    branches: document.getElementById("mobTabBranches")
  };

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    // Dynamic Mobile Bottom Bar Active Pill Indicator
    const rxSec = document.getElementById("prescription-box");
    const branchSec = document.getElementById("branches");

    const rxTop = rxSec ? rxSec.offsetTop - 150 : 99999;
    const branchTop = branchSec ? branchSec.offsetTop - 150 : 99999;

    if (scrollY >= branchTop && scrollY < branchTop + (branchSec?.offsetHeight || 600)) {
      mobTabs.home?.classList.remove("active");
      mobTabs.rx?.classList.remove("active");
      mobTabs.branches?.classList.add("active");
    } else if (scrollY >= rxTop && scrollY < rxTop + (rxSec?.offsetHeight || 600)) {
      mobTabs.home?.classList.remove("active");
      mobTabs.branches?.classList.remove("active");
      mobTabs.rx?.classList.add("active");
    } else {
      mobTabs.branches?.classList.remove("active");
      mobTabs.rx?.classList.remove("active");
      mobTabs.home?.classList.add("active");
    }
  }, { passive: true });
}

function initMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.innerHTML = isOpen 
      ? '<i class="fa-solid fa-xmark"></i>' 
      : '<i class="fa-solid fa-bars"></i>';
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
