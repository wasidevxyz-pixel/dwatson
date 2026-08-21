/**
 * D. Watson Chemist & Superstore - Central Data Store
 * Official Data: Heritage, 24+ Branches, Featured Products, Gallery, Helpline & Admin Settings
 * Official Sources: dwatson.co | dwatson.pk | facebook.com/DWatsonChemist
 */

const DEFAULT_SITE_DATA = {
  company: {
    name: "D. Watson Chemist & Superstore",
    shortName: "D. Watson",
    tagline: "Your Trusted Partner in Health, Beauty & Everyday Care",
    badge: "Est. 1975 • Pakistan's Premier Pharmacy & Superstore Chain",
    phone: "051-8438111",
    helpline: "051-8438111",
    whatsapp: "923329716666",
    whatsappDisplay: "0332-9716666",
    messenger: "https://m.me/DWatsonChemist",
    email: "care@dwatson.co",
    website: "https://dwatson.co",
    address: "Flagship Mega Store: 94-West, Jinnah Avenue, Block I, Blue Area, Islamabad",
    announcement: "✨ 100% Genuine Medicines Guaranteed • 24/7 Universal Helpline: 051-8438111 • WhatsApp Express Delivery: 0332-9716666",
    
    // Heritage and Story
    aboutShort: "For five decades, D. Watson has stood as Pakistan's most trusted name in authentic healthcare, pharmaceuticals, luxury international cosmetics, precision optics, hospital surgical equipment, and premium superstore shopping.",
    aboutHistory: "Founded in 1975 by Chairman Zafar Iqbal Bakhtawari and Zahid Bakhtawari, D. Watson was born from a profound personal story of gratitude. Named in homage to Dr. Watson, a British eye specialist who successfully restored Mr. Bakhtawari's sight in England during his youth, the pharmacy grew from a modest shop on Murree Road into the federal capital's iconic departmental superstore chain. Today, we operate 24+ modern mega branches with temperature-controlled cold chains, certified clinical pharmacists, and world-class retail departments.",
    
    // Historical Milestones
    historyTimeline: [
      {
        year: "1975",
        title: "The Genesis & Tribute to Dr. Watson",
        desc: "Founded by Zafar Iqbal Bakhtawari and Zahid Bakhtawari. Named in gratitude to British ophthalmologist Dr. Watson who cured Mr. Bakhtawari's eye illness in England."
      },
      {
        year: "1982",
        title: "Blue Area Flagship Landmark",
        desc: "Inaugurated Islamabad's first multi-level healthcare mega superstore on Jinnah Avenue, setting the national gold standard for pharmacy retail."
      },
      {
        year: "1995",
        title: "Twin Cities Regional Expansion",
        desc: "Expanded across key commercial hubs in Islamabad and Rawalpindi, including Saddar Cantonment, F-6 Super Market, and Chandni Chowk."
      },
      {
        year: "2005",
        title: "Pioneering Departmental Superstore Concept",
        desc: "Integrated specialized divisions for international luxury cosmetics, computerized optics clinics, hospital surgical devices, and gourmet hypermarket groceries under one roof."
      },
      {
        year: "2018",
        title: "Stringent Cold-Chain & Pharmacist Certification",
        desc: "Equipped all pharmacy dispensing stations with computerized cold-chain climate monitors (2°C - 8°C) to guarantee 100% potency for life-saving biologicals and vaccines."
      },
      {
        year: "2026",
        title: "Omnichannel Digital Healthcare Hub",
        desc: "Operating 24+ premier branches with 24/7 express home delivery, digital WhatsApp prescription dispensing, and centralized customer helpline (051-8438111)."
      }
    ],

    stats: [
      { number: "50+", label: "Years of Trust & Legacy", icon: "fa-award" },
      { number: "25+", label: "Official Modern Branches", icon: "fa-building" },
      { number: "100%", label: "Authentic & Genuine Guarantee", icon: "fa-shield-halved" },
      { number: "50k+", label: "Curated Healthcare & Retail SKU's", icon: "fa-boxes-stacked" }
    ],

    social: {
      facebook: "https://www.facebook.com/DWatsonChemist/",
      instagram: "https://instagram.com/dwatsonchemist",
      whatsapp: "https://wa.me/923329716666",
      messenger: "https://m.me/DWatsonChemist"
    },

    // Admin Security Credentials (Protected Client-Side Gate)
    adminAuth: {
      username: "admin",
      // SHA-256 hash of "dwatson@admin2026"
      passwordHash: "46f882fc025cba277fc20e6a86e9275bcf11d2797e88deaaaeeb19a164ad0bf2",
      defaultPassPlain: "dwatson@admin2026",
      securityPin: "1975"
    }
  },

  heroSlides: [
    {
      id: 1,
      tag: "Certified Healthcare & Pharmacy",
      title: "100% Authentic Medicines & 24/7 Pharmaceutical Care",
      subtitle: "Stringent temperature-controlled cold storage, licensed clinical pharmacists on duty, and express prescription dispensing at your service.",
      image: "assets/images/pharmacy.jpg",
      badgeText: "Verified Genuine Meds",
      ctaPrimaryText: "Send Prescription on WhatsApp",
      ctaPrimaryLink: "#prescription-box",
      ctaSecondaryText: "Find Nearest Pharmacy",
      ctaSecondaryLink: "#branches",
      theme: "red-blue"
    },
    {
      id: 2,
      tag: "Global Luxury & Skincare",
      title: "Prestigious Cosmetics & International Fragrances",
      subtitle: "Discover 100% genuine world-renowned skincare, luxury fragrances, dermatological essentials, and designer makeup collections.",
      image: "assets/images/cosmetics.jpg",
      badgeText: "Original Brand Imports",
      ctaPrimaryText: "Explore Cosmetics",
      ctaPrimaryLink: "#products",
      ctaSecondaryText: "WhatsApp Beauty Desk",
      ctaSecondaryLink: "https://wa.me/923329716666?text=Hi%20D.Watson,%20I%20am%20inquiring%20about%20cosmetics%20and%20fragrances",
      theme: "blue-red"
    },
    {
      id: 3,
      tag: "Gourmet Grocery & Superstore",
      title: "Your Premier Family Superstore & Daily Essentials",
      subtitle: "A world of fresh groceries, premium imported confectionery, gourmet delicacies, baby care, and daily household FMCG under one roof.",
      image: "assets/images/grocery.jpg",
      badgeText: "Fresh & Imported",
      ctaPrimaryText: "Superstore Overview",
      ctaPrimaryLink: "#departments",
      ctaSecondaryText: "View Branches",
      ctaSecondaryLink: "#branches",
      theme: "red-blue"
    },
    {
      id: 4,
      tag: "Precision Vision & Eyewear",
      title: "Advanced Optics & Designer Eyewear Boutique",
      subtitle: "Computerized eye refraction, licensed optometrists, premium progressive lenses, and trending designer frames & polarized sunglasses.",
      image: "assets/images/optics.jpg",
      badgeText: "Certified Optometry",
      ctaPrimaryText: "Optics Department",
      ctaPrimaryLink: "#departments",
      ctaSecondaryText: "Book Eye Test",
      ctaSecondaryLink: "https://wa.me/923329716666?text=Hi%20D.Watson,%20I%20would%20like%20to%20inquire%20about%20an%20Optics%20and%20Eye%20Test%20appointment",
      theme: "blue-red"
    },
    {
      id: 5,
      tag: "Surgical & Hospital Care",
      title: "Comprehensive Surgical, Rehab & Diagnostic Devices",
      subtitle: "Hospital-grade surgical instruments, orthopedic supports, digital vitals monitors, mobility wheelchairs, and home-care medical equipment.",
      image: "assets/images/surgical.jpg",
      badgeText: "Clinical Grade",
      ctaPrimaryText: "Surgical Catalog",
      ctaPrimaryLink: "#departments",
      ctaSecondaryText: "Inquire Equipment",
      ctaSecondaryLink: "https://wa.me/923329716666?text=Hi%20D.Watson,%20I%20need%20information%20regarding%20surgical%20and%20medical%20equipment",
      theme: "red-blue"
    },
    {
      id: 6,
      tag: "Personal Comfort & Apparel",
      title: "Exclusive Undergarments & Comfort Loungewear",
      subtitle: "Curated selection of top international and premium local brands in innerwear, sleepwear, and everyday comfort essentials for men, women & kids.",
      image: "assets/images/apparel.jpg",
      badgeText: "Premium Comfort",
      ctaPrimaryText: "Explore Collection",
      ctaPrimaryLink: "#departments",
      ctaSecondaryText: "Customer Support",
      ctaSecondaryLink: "#contact",
      theme: "blue-red"
    }
  ],

  departments: [
    {
      id: "pharmacy",
      name: "Pharmacy & Medicines",
      badge: "Core Specialty",
      tagline: "100% Genuine Prescription & OTC Medicines",
      image: "assets/images/pharmacy.jpg",
      icon: "fa-solid fa-prescription-bottle-medical",
      description: "Our licensed pharmacies operate under rigorous temperature and quality protocols. We carry rare life-saving drugs, oncology, cardiology, pediatric, and daily wellness medications with certified pharmacist counseling.",
      features: [
        "Temperature-Controlled Storage (2°C - 8°C cold chain)",
        "Qualified Registered Pharmacists on staff 24/7",
        "Direct manufacturer sourcing — Zero counterfeit risk",
        "Instant Prescription WhatsApp dispensing verification"
      ],
      whatsappMsg: "Hi D.Watson, I need assistance with Pharmacy medicines and prescription availability."
    },
    {
      id: "cosmetics",
      name: "Cosmetics & Skincare",
      badge: "Luxury & Dermatological",
      tagline: "International Beauty, Fragrances & Derma Care",
      image: "assets/images/cosmetics.jpg",
      icon: "fa-solid fa-wand-magic-sparkles",
      description: "Step into our prestigious beauty counters featuring authentic international fragrances, dermatologist-recommended skincare (La Roche-Posay, CeraVe, Bioderma, Vichy), and iconic cosmetic brands.",
      features: [
        "100% Original imported perfumes & colognes",
        "Dermatologist-recommended clinical skincare",
        "Expert beauty advisors & skin consultation",
        "Premium haircare, nail care & luxury personal care"
      ],
      whatsappMsg: "Hi D.Watson, I am inquiring about Cosmetics and Skincare product availability."
    },
    {
      id: "grocery",
      name: "Superstore & Grocery",
      badge: "Full Hypermarket Range",
      tagline: "Premium Daily Groceries & Imported Goods",
      image: "assets/images/grocery.jpg",
      icon: "fa-solid fa-cart-shopping",
      description: "Our modern superstores offer an extensive variety of daily grocery essentials, imported beverages, organic snacks, baby foods, toiletries, and household supplies organized in spacious aisles.",
      features: [
        "Wide range of imported gourmet & dietary goods",
        "Comprehensive baby nutrition & care products",
        "Fresh packaged essentials & household pantry staples",
        "Express billing counters & dedicated customer assistance"
      ],
      whatsappMsg: "Hi D.Watson, I would like to inquire about Superstore and Grocery items."
    },
    {
      id: "optics",
      name: "Optics & Eye Care",
      badge: "Vision Clinic",
      tagline: "Computerized Testing & Designer Eyewear",
      image: "assets/images/optics.jpg",
      icon: "fa-solid fa-glasses",
      description: "Our in-house vision clinics are equipped with high-precision optical diagnostic machines and certified optometrists. Choose from high-fashion designer frames, sunglasses, and anti-glare prescription lenses.",
      features: [
        "Free computerized eye examinations with qualified optometrists",
        "Designer frames & polarized sunglasses collection",
        "Blue-cut, progressive, and photochromic high-index lenses",
        "Premium contact lenses & specialized lens solutions"
      ],
      whatsappMsg: "Hi D.Watson, I would like to inquire about Optics frames, lenses, or eye testing."
    },
    {
      id: "surgical",
      name: "Surgical & Medical Equipment",
      badge: "Clinical Grade",
      tagline: "Hospital Supplies, Diagnostics & Rehab Aids",
      image: "assets/images/surgical.jpg",
      icon: "fa-solid fa-stethoscope",
      description: "Providing patients, clinics, and hospitals with top-tier diagnostic devices (BP monitors, glucometers, nebulizers), mobility aids (wheelchairs, walkers), orthopedic braces, and sterile surgical disposables.",
      features: [
        "Digital BP monitors, pulse oximeters & nebulizers (Omron, Beurer)",
        "Orthopedic supports, knee braces, cervical collars & belts",
        "Standard & motorized wheelchairs, walking sticks, commodes",
        "Sterile surgical instruments, gloves, and wound dressings"
      ],
      whatsappMsg: "Hi D.Watson, I am looking for Surgical equipment and healthcare supplies."
    },
    {
      id: "undergarments",
      name: "Undergarments & Comfort Apparel",
      badge: "Boutique Collection",
      tagline: "High-Quality Innerwear & Loungewear",
      image: "assets/images/apparel.jpg",
      icon: "fa-solid fa-shirt",
      description: "A private, comfortable shopping section offering top local and international innerwear, shapewear, thermal wear, and loungewear crafted with breathable, skin-friendly fabrics for the entire family.",
      features: [
        "Leading brand collections (Triumph, Jockey, IFG, and more)",
        "Dedicated private fitting assistance and sizing guides",
        "Premium cotton innerwear for men, women, and kids",
        "Seasonal thermal wear, socks, sleepwear & loungewear"
      ],
      whatsappMsg: "Hi D.Watson, I want to inquire about Undergarments and Comfort apparel."
    }
  ],

  // Featured Products Curated from Official Facebook Page & Store Shelves
  products: [
    {
      id: "p1",
      name: "CeraVe Moisturizing Cream (454g)",
      category: "cosmetics",
      categoryName: "Cosmetics & Skincare",
      brand: "CeraVe USA",
      price: "PKR 5,450",
      tag: "Dermatologist Recommended",
      image: "assets/images/CeraVe Moisturizing Cream (454g).jpg",
      description: "Original imported 3 essential ceramides barrier restoring cream for dry to very dry skin.",
      inStock: true
    },
    {
      id: "p2",
      name: "La Roche-Posay Effaclar Duo+M",
      category: "cosmetics",
      categoryName: "Cosmetics & Skincare",
      brand: "La Roche-Posay France",
      price: "PKR 6,200",
      tag: "Anti-Blemish Care",
      image: "assets/images/La Roche-Posay Effaclar Duo+M.jpg",
      description: "Triple-action anti-imperfections, anti-marks & anti-recurrence treatment for acne-prone skin.",
      inStock: true
    },
    {
      id: "p3",
      name: "Omron M2 Basic Digital BP Monitor",
      category: "surgical",
      categoryName: "Surgical & Health Devices",
      brand: "Omron Healthcare",
      price: "PKR 9,850",
      tag: "Clinical Accuracy",
      image: "assets/images/Omron M2 Basic Digital BP Monitor.jpg",
      description: "Fully automatic upper arm blood pressure monitor with Intellisense technology and irregular heartbeat detector.",
      inStock: true
    },
    {
      id: "p4",
      name: "Accu-Chek Instant Blood Glucose Meter",
      category: "surgical",
      categoryName: "Surgical & Health Devices",
      brand: "Roche Diagnostics",
      price: "PKR 3,950",
      tag: "Instant Diabetes Check",
      image: "assets/images/Accu-Chek Instant Blood Glucose Meter.jpg",
      description: "Wireless blood glucose monitoring system with target range indicator and test strip ejector.",
      inStock: true
    },
    {
      id: "p5",
      name: "Ray-Ban Aviator Classic Polarized",
      category: "optics",
      categoryName: "Optics & Eyewear",
      brand: "Ray-Ban Official",
      price: "PKR 28,500",
      tag: "100% UV400 Protection",
      image: "assets/images/Ray-Ban Aviator Classic Polarized.jpg",
      description: "Iconic gold frame with polarized green classic G-15 crystal lenses.",
      inStock: true
    },
    {
      id: "p6",
      name: "Acuvue Oasys with HydraLuxe Contact Lenses",
      category: "optics",
      categoryName: "Optics & Eyewear",
      brand: "Johnson & Johnson",
      price: "PKR 7,500",
      tag: "Daily Disposable (30pk)",
      image: "assets/images/Acuvue Oasys with HydraLuxe Contact Lenses.jpg",
      description: "Tear-infused contact lenses designed for demanding days and tired, dry eyes.",
      inStock: true
    },
    {
      id: "p7",
      name: "Aptamil Gold+ Stage 1 Infant Formula (900g)",
      category: "grocery",
      categoryName: "Baby Care & Nutrition",
      brand: "Nutricia Danone",
      price: "PKR 7,950",
      tag: "Imported Nutrition",
      image: "assets/images/grocery.jpg",
      description: "Premium nutritionally complete infant milk formula suitable from birth to 6 months.",
      inStock: true
    },
    {
      id: "p8",
      name: "Seven Seas Cod Liver Oil + Omega 3 (500ml)",
      category: "pharmacy",
      categoryName: "Medicines & Supplements",
      brand: "Seven Seas UK",
      price: "PKR 4,800",
      tag: "Immune & Brain Support",
      image: "assets/images/pharmacy.jpg",
      description: "Rich in natural Vitamins A, D and essential Omega-3 fatty acids EPA and DHA.",
      inStock: true
    },
    {
      id: "p9",
      name: "Centrum Adults Multivitamin (100 Tabs)",
      category: "pharmacy",
      categoryName: "Medicines & Supplements",
      brand: "Centrum USA",
      price: "PKR 5,900",
      tag: "Daily Vitality",
      image: "assets/images/pharmacy.jpg",
      description: "Complete multivitamin with micronutrients to feed cells, boost energy, immunity & metabolism.",
      inStock: true
    },
    {
      id: "p10",
      name: "Bioderma Sensibio H2O Micellar Water (500ml)",
      category: "cosmetics",
      categoryName: "Cosmetics & Skincare",
      brand: "Bioderma France",
      price: "PKR 5,200",
      tag: "Cult Cleanser",
      image: "assets/images/cosmetics.jpg",
      description: "Iconic soothing non-rinse micellar water makeup remover for sensitive skin.",
      inStock: true
    },
    {
      id: "p11",
      name: "Folding Lightweight Mobility Wheelchair",
      category: "surgical",
      categoryName: "Surgical & Health Devices",
      brand: "D. Watson Surgical",
      price: "PKR 24,000",
      tag: "Hospital Grade",
      image: "assets/images/surgical.jpg",
      description: "Durable chrome-plated steel frame wheelchair with ergonomic armrests and swing-away footrests.",
      inStock: true
    },
    {
      id: "p12",
      name: "Lindt Excellence 85% Cocoa Dark Chocolate",
      category: "grocery",
      categoryName: "Supermarket & Grocery",
      brand: "Lindt Switzerland",
      price: "PKR 1,150",
      tag: "Imported Confectionery",
      image: "assets/images/grocery.jpg",
      description: "Rich, full-bodied dark chocolate crafted with passion by Lindt Swiss master chocolatiers.",
      inStock: true
    }
  ],

  // Complete Official D. Watson Branch Locator from dwatson.co & dwatson.pk
  branches: [
    // --- ISLAMABAD (14 Branches) ---
    {
      id: "b_blue_area",
      name: "Blue Area Flagship Mega Store",
      city: "Islamabad",
      area: "Blue Area",
      address: "94-West, Jinnah Avenue, Block I, Blue Area (Opposite Saudi Pak Tower), Islamabad",
      phone: "051-8438111 / 051-2822222",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/store_flagship.jpg",
      services: ["24/7 Pharmacy", "Cosmetics Studio", "Mega Superstore", "Optics Clinic", "Surgical Supplies", "Undergarments"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Blue+Area+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_f6",
      name: "Super Market F-6 Markaz",
      city: "Islamabad",
      area: "Sector F-6",
      address: "School Road, Super Market, F-6 Markaz, Islamabad",
      phone: "051-8438111 / 051-2827534",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/pharmacy.jpg",
      services: ["24/7 Pharmacy", "Luxury Cosmetics", "Grocery Essentials", "Optics", "Undergarments"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+F-6+Super+Market+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_f7",
      name: "F-7 Markaz (Din Pavilion)",
      city: "Islamabad",
      area: "Sector F-7",
      address: "Din Pavilion, College Road, F-7 Markaz, Islamabad",
      phone: "051-8444479 / 051-2270425",
      timings: "08:00 AM - 01:00 AM Daily",
      is24Hours: false,
      image: "assets/images/cosmetics.jpg",
      services: ["Pharmacy", "Luxury Cosmetics", "Personal Care", "Optics"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+F-7+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_f10",
      name: "F-10 Markaz Mega Branch",
      city: "Islamabad",
      area: "Sector F-10",
      address: "Plot 14, Main Double Road, F-10 Markaz, Islamabad",
      phone: "051-2215784 / 051-8438111",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/pharmacy.jpg",
      services: ["24/7 Pharmacy", "Cosmetics Counter", "Superstore", "Optics Clinic", "Surgical Dept"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+F-10+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_f11",
      name: "F-11 Markaz Branch",
      city: "Islamabad",
      area: "Sector F-11",
      address: "Time Square Plaza, Hilal Road, F-11 Markaz, Islamabad",
      phone: "051-8441791 / 051-2102882",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/grocery.jpg",
      services: ["24/7 Pharmacy", "Superstore", "Cosmetics", "Optics"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+F-11+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_g9",
      name: "G-9 Markaz (Karachi Company)",
      city: "Islamabad",
      area: "Sector G-9",
      address: "Commercial Center, G-9 Markaz, Islamabad",
      phone: "051-2852211 / 051-2852233",
      timings: "08:00 AM - 12:00 AM Daily",
      is24Hours: false,
      image: "assets/images/grocery.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Surgical Supplies"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+G-9+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_g11",
      name: "G-11 Markaz Branch",
      city: "Islamabad",
      area: "Sector G-11",
      address: "Al-Hameed Center, Main Double Road, G-11 Markaz, Islamabad",
      phone: "051-8438111",
      timings: "08:00 AM - 12:00 AM Daily",
      is24Hours: false,
      image: "assets/images/pharmacy.jpg",
      services: ["Pharmacy", "Cosmetics", "Superstore Essentials"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+G-11+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_g15",
      name: "G-15 Markaz (JK Housing)",
      city: "Islamabad",
      area: "Sector G-15",
      address: "Commercial Market, JK Housing Society, G-15 Markaz, Islamabad",
      phone: "051-8438111",
      timings: "08:00 AM - 11:00 PM Daily",
      is24Hours: false,
      image: "assets/images/grocery.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Baby Care"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+G-15+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_i8",
      name: "I-8 Markaz Branch",
      city: "Islamabad",
      area: "Sector I-8",
      address: "Pakland Plaza, I-8 Markaz, Islamabad",
      phone: "051-8487354 / 051-8438111",
      timings: "08:00 AM - 01:00 AM Daily",
      is24Hours: false,
      image: "assets/images/cosmetics.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Optics"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+I-8+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_i10",
      name: "I-10 Markaz Branch",
      city: "Islamabad",
      area: "Sector I-10",
      address: "Al-Aseel Plaza, Korang Road, I-10 Markaz, Islamabad",
      phone: "051-4867777 / 051-8438111",
      timings: "08:00 AM - 12:00 AM Daily",
      is24Hours: false,
      image: "assets/images/grocery.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Surgical"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+I-10+Markaz+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_dha",
      name: "DHA Phase 2 Central Branch",
      city: "Islamabad",
      area: "DHA / Bahria",
      address: "Main Commercial Boulevard, Sector A, DHA Phase 2, Islamabad",
      phone: "051-6101287 / 051-8438111",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/store_flagship.jpg",
      services: ["24/7 Pharmacy", "Cosmetics", "Superstore", "Optics", "Surgical"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+DHA+Phase+2+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_pwd",
      name: "PWD Main Boulevard Branch",
      city: "Islamabad",
      area: "PWD / Pakistan Town",
      address: "Main PWD Road, Block B, PWD Society, Islamabad",
      phone: "051-5156072 / 051-5156062",
      timings: "08:00 AM - 01:00 AM Daily",
      is24Hours: false,
      image: "assets/images/grocery.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Baby Care"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+PWD+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_ghauri",
      name: "Ghauri Town Branch",
      city: "Islamabad",
      area: "Ghauri Town",
      address: "Zohaib Arcade, Main Double Road, Phase 5-A, Ghauri Town, Islamabad",
      phone: "051-8438111",
      timings: "08:00 AM - 12:00 AM Daily",
      is24Hours: false,
      image: "assets/images/pharmacy.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Personal Care"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Ghauri+Town+Islamabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_gulberg_isb",
      name: "Gulberg Greens Branch",
      city: "Islamabad",
      area: "Gulberg Greens",
      address: "Business Avenue, Block B, Gulberg Greens, Islamabad",
      phone: "051-8438111",
      timings: "08:00 AM - 12:00 AM Daily",
      is24Hours: false,
      image: "assets/images/store_flagship.jpg",
      services: ["Pharmacy", "Cosmetics Studio", "Superstore", "Optics"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Gulberg+Greens+Islamabad",
      whatsapp: "923329716666"
    },

    // --- RAWALPINDI (5 Branches) ---
    {
      id: "b_saddar",
      name: "Saddar Cantonment Branch",
      city: "Rawalpindi",
      area: "Saddar",
      address: "Al-Amin Plaza, Bank Road, Saddar Cantt, Rawalpindi",
      phone: "051-5701070 / 051-5701071",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/surgical.jpg",
      services: ["24/7 Pharmacy", "Optics Lab", "Surgical Hub", "Cosmetics", "Undergarments"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Saddar+Rawalpindi",
      whatsapp: "923329716666"
    },
    {
      id: "b_chandni",
      name: "Chandni Chowk Branch",
      city: "Rawalpindi",
      area: "Chandni Chowk",
      address: "Al-Fateh Plaza, Chandni Chowk, Murree Road, Rawalpindi",
      phone: "051-4571471 / 051-4571472",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/pharmacy.jpg",
      services: ["24/7 Pharmacy", "Superstore", "Cosmetics", "Surgical Supplies"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Chandni+Chowk+Rawalpindi",
      whatsapp: "923329716666"
    },
    {
      id: "b_bahria4",
      name: "Bahria Town Phase 4 Civic Center",
      city: "Rawalpindi",
      area: "Bahria Town",
      address: "Civic Center, Main Boulevard, Phase 4, Bahria Town, Rawalpindi",
      phone: "051-5739999 / 051-8438111",
      timings: "08:00 AM - 01:00 AM Daily",
      is24Hours: false,
      image: "assets/images/optics.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Optics Boutique"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Bahria+Town+Phase+4+Rawalpindi",
      whatsapp: "923329716666"
    },
    {
      id: "b_bahria6",
      name: "Bahria Town Phase 6 Branch",
      city: "Rawalpindi",
      area: "Bahria Town",
      address: "Fortune Arcade, Main Boulevard, Phase 6, Bahria Town, Rawalpindi",
      phone: "051-8770601 / 051-8770603",
      timings: "08:00 AM - 01:00 AM Daily",
      is24Hours: false,
      image: "assets/images/store_flagship.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Optics"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Bahria+Town+Phase+6",
      whatsapp: "923329716666"
    },
    {
      id: "b_chaklala",
      name: "Chaklala Scheme 3 Branch",
      city: "Rawalpindi",
      area: "Chaklala",
      address: "Commercial Market, Main Road, Chaklala Scheme 3, Rawalpindi",
      phone: "051-5766257 / 051-8438111",
      timings: "08:00 AM - 12:00 AM Daily",
      is24Hours: false,
      image: "assets/images/cosmetics.jpg",
      services: ["Pharmacy", "Cosmetics", "Superstore Essentials"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Chaklala+Scheme+3",
      whatsapp: "923329716666"
    },

    // --- LAHORE & REGIONAL HUBS (6 Branches) ---
    {
      id: "b_lahore",
      name: "Gulberg III Mega Center",
      city: "Lahore",
      area: "Gulberg",
      address: "Main Boulevard, Gulberg III (Near MM Alam Road), Lahore",
      phone: "042-35712345 / 051-8438111",
      timings: "Open 24 Hours • 7 Days a Week",
      is24Hours: true,
      image: "assets/images/store_flagship.jpg",
      services: ["24/7 Pharmacy", "Luxury Cosmetics", "Gourmet Supermarket", "Optics", "Surgical"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Gulberg+Lahore",
      whatsapp: "923329716666"
    },
    {
      id: "b_abbottabad",
      name: "Abbottabad Central Branch",
      city: "Other Cities",
      area: "Abbottabad",
      address: "Main Mansehra Road, Near DHQ Hospital, Abbottabad",
      phone: "0992-381111 / 051-8438111",
      timings: "08:00 AM - 11:00 PM Daily",
      is24Hours: false,
      image: "assets/images/pharmacy.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Surgical"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Abbottabad",
      whatsapp: "923329716666"
    },
    {
      id: "b_attock",
      name: "Attock City Branch",
      city: "Other Cities",
      area: "Attock",
      address: "Al Kareem Plaza, Near DHQ Hospital, Attock City",
      phone: "057-2611111 / 051-8438111",
      timings: "08:00 AM - 11:00 PM Daily",
      is24Hours: false,
      image: "assets/images/surgical.jpg",
      services: ["Pharmacy", "Surgical Supplies", "Cosmetics", "Grocery"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Attock",
      whatsapp: "923329716666"
    },
    {
      id: "b_gujar_khan",
      name: "Gujar Khan Branch",
      city: "Other Cities",
      area: "Gujar Khan",
      address: "Ward No. 2, New Barki Jadeed, Main G.T. Road, Gujar Khan",
      phone: "051-3511111 / 051-8438111",
      timings: "08:00 AM - 11:00 PM Daily",
      is24Hours: false,
      image: "assets/images/grocery.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Baby Care"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Gujar+Khan",
      whatsapp: "923329716666"
    },
    {
      id: "b_swat",
      name: "Swat Mingora Branch",
      city: "Other Cities",
      area: "Swat",
      address: "Near Balogram Ground, Main Airport Road, Mingora, Swat",
      phone: "0946-721111 / 051-8438111",
      timings: "08:00 AM - 10:00 PM Daily",
      is24Hours: false,
      image: "assets/images/store_flagship.jpg",
      services: ["Pharmacy", "Superstore", "Cosmetics", "Optics"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Swat",
      whatsapp: "923329716666"
    },
    {
      id: "b_mansehra",
      name: "Mansehra Bypass Branch",
      city: "Other Cities",
      area: "Mansehra",
      address: "Opposite Food Hut, Township Bypass Chowk, Mansehra",
      phone: "0997-301111 / 051-8438111",
      timings: "08:00 AM - 10:00 PM Daily",
      is24Hours: false,
      image: "assets/images/pharmacy.jpg",
      services: ["Pharmacy", "Cosmetics", "Superstore", "Surgical"],
      mapUrl: "https://maps.google.com/?q=D.+Watson+Mansehra",
      whatsapp: "923329716666"
    }
  ],

  gallery: [
    {
      id: "g1",
      title: "Flagship Mega Store Architecture",
      category: "stores",
      categoryName: "Store Facade",
      image: "assets/images/store_flagship.jpg",
      description: "D. Watson's multi-level flagship superstore in Jinnah Avenue, Blue Area Islamabad."
    },
    {
      id: "g2",
      title: "24/7 Temperature-Controlled Pharmacy Lab",
      category: "pharmacy",
      categoryName: "Pharmacy & Labs",
      image: "assets/images/pharmacy.jpg",
      description: "Certified clinical dispensing counter with 2°C - 8°C cold chain vaccine refrigerators."
    },
    {
      id: "g3",
      title: "International Luxury Cosmetics Lounge",
      category: "cosmetics",
      categoryName: "Cosmetics & Skincare",
      image: "assets/images/cosmetics.jpg",
      description: "Prestigious beauty department featuring authentic imported perfumes, serums, and French skincare."
    },
    {
      id: "g4",
      title: "Gourmet Hypermarket & Confectionery Aisles",
      category: "grocery",
      categoryName: "Supermarket Aisles",
      image: "assets/images/grocery.jpg",
      description: "Spacious grocery aisles offering premium imported snacks, infant nutrition, and household goods."
    },
    {
      id: "g5",
      title: "Optics Clinic & Designer Eyewear Boutique",
      category: "optics",
      categoryName: "Optics & Eye Care",
      image: "assets/images/optics.jpg",
      description: "Equipped with computerized refraction autorefractometers and trending designer frames."
    },
    {
      id: "g6",
      title: "Hospital Grade Surgical & Diagnostic Care",
      category: "surgical",
      categoryName: "Surgical Equipment",
      image: "assets/images/surgical.jpg",
      description: "Hospital monitors, orthopedic rehabilitation braces, oxygen concentrators, and mobility wheelchairs."
    },
    {
      id: "g7",
      title: "Personal Comfort & Innerwear Boutique",
      category: "apparel",
      categoryName: "Comfort Apparel",
      image: "assets/images/apparel.jpg",
      description: "Curated collections of premium breathable innerwear, sleepwear, and shapewear."
    },
    {
      id: "g8",
      title: "Cold Chain Biological Storage Facility",
      category: "pharmacy",
      categoryName: "Pharmacy & Labs",
      image: "assets/images/pharmacy.jpg",
      description: "High-precision digital climate monitoring for insulin, oncology, and specialty injectables."
    }
  ],

  faqs: [
    {
      q: "How can I verify medicine availability or send my prescription?",
      a: "You can click the 'Upload Prescription' button on our website or text our WhatsApp team directly at 0332-9716666. Our registered pharmacists will verify stock immediately and assist you with fast home delivery.",
      cat: "Pharmacy"
    },
    {
      q: "Are all medicines, skincare, and perfumes 100% genuine at D. Watson?",
      a: "Absolutely. D. Watson has maintained an uncompromising zero-tolerance counterfeit policy for over 50 years. We source pharmaceuticals and cosmetics directly from authorized global manufacturers and licensed national distributors under strict cold-chain compliance.",
      cat: "Authenticity"
    },
    {
      q: "Which D. Watson branches operate 24 Hours a day?",
      a: "Our Blue Area Flagship, F-6 Super Market, F-10 Markaz, F-11 Markaz, DHA Phase 2 Islamabad, Saddar Rawalpindi, Chandni Chowk Rawalpindi, and Gulberg Lahore branches operate 24 hours a day, 7 days a week, including all public holidays.",
      cat: "Branches"
    },
    {
      q: "Do you offer express home delivery for medicines and superstore goods?",
      a: "Yes! We offer prompt home delivery across Islamabad, Rawalpindi, and Lahore. Simply place your order via WhatsApp (0332-9716666) or call our centralized helpline (051-8438111).",
      cat: "Delivery"
    },
    {
      q: "Can I get a computerized eye exam at D. Watson Optics?",
      a: "Yes, our certified optometrists provide free computerized eye refractions and precision vision testing at our optical branches. You can walk in anytime or reserve an appointment via WhatsApp.",
      cat: "Optics"
    }
  ]
};

// LocalStorage Storage Key (v5)
const STORAGE_KEY = "dwatson_site_data_v5";

/**
 * Get current site data (from LocalStorage or fallback to default)
 */
function getSiteData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-heal any stale whatsapp numbers if present
      if (parsed.company && parsed.company.whatsapp && (parsed.company.whatsapp.includes("9716666") || !parsed.company.whatsapp)) {
        parsed.company.whatsapp = DEFAULT_SITE_DATA.company.whatsapp;
        parsed.company.whatsappDisplay = DEFAULT_SITE_DATA.company.whatsappDisplay;
      }
      return {
        ...DEFAULT_SITE_DATA,
        ...parsed,
        company: { 
          ...DEFAULT_SITE_DATA.company, 
          ...(parsed.company || {}),
          historyTimeline: Array.isArray(parsed.company && parsed.company.historyTimeline) && parsed.company.historyTimeline.length ? parsed.company.historyTimeline : DEFAULT_SITE_DATA.company.historyTimeline,
          adminAuth: {
            ...DEFAULT_SITE_DATA.company.adminAuth,
            ...((parsed.company && parsed.company.adminAuth) || {})
          }
        },
        heroSlides: Array.isArray(parsed.heroSlides) && parsed.heroSlides.length ? parsed.heroSlides : DEFAULT_SITE_DATA.heroSlides,
        departments: Array.isArray(parsed.departments) && parsed.departments.length ? parsed.departments : DEFAULT_SITE_DATA.departments,
        products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : DEFAULT_SITE_DATA.products,
        branches: Array.isArray(parsed.branches) && parsed.branches.length ? parsed.branches : DEFAULT_SITE_DATA.branches,
        gallery: Array.isArray(parsed.gallery) && parsed.gallery.length ? parsed.gallery : DEFAULT_SITE_DATA.gallery,
        faqs: Array.isArray(parsed.faqs) && parsed.faqs.length ? parsed.faqs : DEFAULT_SITE_DATA.faqs
      };
    }
  } catch (e) {
    console.warn("Error loading site data from localStorage, using default:", e);
  }
  return DEFAULT_SITE_DATA;
}

/**
 * Save updated site data to LocalStorage
 */
function saveSiteData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("siteDataUpdated"));
    return true;
  } catch (e) {
    console.error("Failed to save site data:", e);
    return false;
  }
}

/**
 * Reset site data to factory defaults
 */
function resetSiteData() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("siteDataUpdated"));
}

/**
 * Export site data as JSON string or download file
 */
function exportSiteDataJSON() {
  const data = getSiteData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dwatson-site-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import site data from JSON string
 */
function importSiteDataJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.company || !data.heroSlides || !data.branches) {
      throw new Error("Invalid format: Required fields are missing.");
    }
    saveSiteData(data);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Unified Inquiries, Product Orders & Prescription Storage Helpers
 */
const INQUIRIES_STORAGE_KEY = "dwatson_all_inquiries";
const PRESCRIPTION_STORAGE_KEY = "dwatson_prescription_orders";

function getCustomerInquiries() {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {
    console.warn("Error reading inquiries records:", e);
  }

  // Fallback: check legacy prescription storage if new storage is empty
  const legacyRx = getPrescriptionsData();
  if (legacyRx && legacyRx.length) {
    return legacyRx.map(item => ({
      ...item,
      type: item.type || "prescription"
    }));
  }

  return [];
}

/**
 * Real-time Cloud Sync Configuration
 */
const CLOUD_SYNC_TOPIC = "dwatson_pharmacy_inquiries_2026";
const CLOUD_SYNC_URL = `https://ntfy.sh/${CLOUD_SYNC_TOPIC}`;

async function pushInquiryToCloud(inquiry) {
  try {
    const isProduct = inquiry.type === "product";
    const titleText = isProduct 
      ? `New Product Order: ${inquiry.productName} (${inquiry.price || 'Inquire'})` 
      : `New Prescription: ${inquiry.name || 'Customer'} (${inquiry.branch || 'Branch'})`;

    const headers = {
      "Title": titleText.replace(/[^\x00-\x7F]/g, ""),
      "Priority": "high",
      "Tags": isProduct ? "shopping_bags,package" : "pill,medical_symbol"
    };

    if (inquiry.photoUrl) {
      headers["Click"] = inquiry.photoUrl;
      headers["Attach"] = inquiry.photoUrl;
    }

    const payload = JSON.stringify(inquiry);

    // Use fetch with keepalive for guaranteed mobile delivery during page switch
    const res = await fetch(CLOUD_SYNC_URL, {
      method: "POST",
      headers: headers,
      body: payload,
      keepalive: true
    });
    console.log("Inquiry pushed to Real-Time Cloud Sync:", inquiry.id);
    return res.ok;
  } catch (err) {
    console.warn("Cloud sync push error:", err);
    return false;
  }
}

async function saveCustomerInquiry(item) {
  try {
    const list = getCustomerInquiries();
    list.unshift(item);
    // Keep up to 150 recent records
    const trimmed = list.slice(0, 150);
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(trimmed));
    
    window.dispatchEvent(new Event("inquiriesDataUpdated"));
    window.dispatchEvent(new Event("prescriptionDataUpdated"));

    // Broadcast live across all devices via Cloud Database Sync
    await pushInquiryToCloud(item);
    return true;
  } catch (e) {
    console.error("Error saving customer inquiry:", e);
    return false;
  }
}

function deleteCustomerInquiry(id) {
  try {
    let list = getCustomerInquiries();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("inquiriesDataUpdated"));
    window.dispatchEvent(new Event("prescriptionDataUpdated"));
    return true;
  } catch (e) {
    console.error("Error deleting inquiry:", e);
    return false;
  }
}

// Legacy wrappers for prescription backward compatibility
function getPrescriptionsData() {
  try {
    const raw = localStorage.getItem(PRESCRIPTION_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {
    console.warn("Error reading prescription records:", e);
  }
  return [];
}

async function savePrescriptionOrder(order) {
  try {
    const list = getPrescriptionsData();
    list.unshift(order);
    const trimmed = list.slice(0, 100);
    localStorage.setItem(PRESCRIPTION_STORAGE_KEY, JSON.stringify(trimmed));
    
    // Also save in unified inquiries & push to cloud sync
    await saveCustomerInquiry({
      ...order,
      type: "prescription"
    });

    window.dispatchEvent(new Event("prescriptionDataUpdated"));
    return true;
  } catch (e) {
    console.error("Error saving prescription order:", e);
    return false;
  }
}

function deletePrescriptionOrder(orderId) {
  deleteCustomerInquiry(orderId);
  try {
    let list = getPrescriptionsData();
    list = list.filter(item => item.id !== orderId);
    localStorage.setItem(PRESCRIPTION_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("prescriptionDataUpdated"));
    return true;
  } catch (e) {
    console.error("Error deleting prescription order:", e);
    return false;
  }
}

