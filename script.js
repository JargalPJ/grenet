"use strict";

const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const languageToggle = document.getElementById("languageToggle");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const pageProgress = document.getElementById("pageProgress");
const toast = document.getElementById("toast");

function safeStorageGet(key, fallback) {
  try { return window.localStorage.getItem(key) || fallback; }
  catch { return fallback; }
}

function safeStorageSet(key, value) {
  try { window.localStorage.setItem(key, value); }
  catch { /* Storage may be unavailable in local preview or privacy mode. */ }
}

let currentLanguage = safeStorageGet("grenetLanguage", "mn");
let currentTheme = safeStorageGet("grenetTheme", "dark");
let toastTimer;

const translations = {
  placeholders: {
    mn: {
      name: "Таны нэр",
      email: "name@company.mn",
      message: "Зорилго, байгууллагын салбар, одоогийн нөхцөлийн талаар товч бичнэ үү."
    },
    en: {
      name: "Your name",
      email: "name@company.com",
      message: "Briefly describe your objective, industry, and current situation."
    }
  },
  readiness: {
    mn: [
      { max: 25, level: "Суурь түвшин", advice: "Бодлого, өгөгдлийн inventory, хариуцагч болон 90 хоногийн ESG readiness roadmap-аас эхлэх нь тохиромжтой." },
      { max: 50, level: "Хөгжиж буй түвшин", advice: "Тархай өгөгдлөө нэгтгэж, material issue, data owner, calculation control-оо албажуулах шаардлагатай." },
      { max: 75, level: "Бүтэцтэй түвшин", advice: "Тайлагналын mapping, Scope 3, нотлох баримтын мөр болон удирдлагын dashboard-аа сайжруулах боломжтой." },
      { max: 100, level: "Ахисан түвшин", advice: "Assurance readiness, автомат дата холболт, target setting болон supplier engagement руу шилжихэд бэлэн байна." }
    ],
    en: [
      { max: 25, level: "Foundation stage", advice: "Start with a policy, data inventory, accountable owners, and a 90-day ESG readiness roadmap." },
      { max: 50, level: "Emerging stage", advice: "Consolidate fragmented data and formalize material issues, data owners, and calculation controls." },
      { max: 75, level: "Structured stage", advice: "Improve disclosure mapping, Scope 3, evidence trails, and management dashboards." },
      { max: 100, level: "Advanced stage", advice: "You are ready to focus on assurance readiness, automated integrations, targets, and supplier engagement." }
    ]
  },
  segments: {
    ipo: {
      mn: { title: "IPO болон хөрөнгийн зах зээлд бэлтгэх", text: "Ил тод байдал, governance, material risks, KPI болон хөрөнгө оруулагчид ойлгомжтой disclosure шаардлагатай дунд, том компани.", output: "ESG readiness + disclosure roadmap" },
      en: { title: "Prepare for IPO and capital markets", text: "Mid-sized and large companies needing transparent governance, material risk, KPI, and investor-ready disclosures.", output: "ESG readiness + disclosure roadmap" }
    },
    export: {
      mn: { title: "Олон улсын нийлүүлэлтийн шаардлага хангах", text: "Экспорт, гадаад худалдан авагч, олон улсын гэрээний ESG questionnaire, traceability, GHG болон хөдөлмөрийн мэдээлэл шаардлагатай үйлдвэрлэгч.", output: "Buyer questionnaire + evidence pack" },
      en: { title: "Meet international supply-chain requirements", text: "Exporters and manufacturers needing ESG questionnaires, traceability, GHG, and labor information for international buyers.", output: "Buyer questionnaire + evidence pack" }
    },
    finance: {
      mn: { title: "Зээл, хөрөнгө оруулалт, тендерт бэлтгэх", text: "Ногоон зээл, хөрөнгө оруулагч, VC, олон улсын төсөлд өгөгдөлд суурилсан ESG profile болон risk narrative хэрэгтэй бизнес.", output: "Finance-ready ESG profile" },
      en: { title: "Prepare for loans, investment, and tenders", text: "Businesses seeking green loans, investors, VC, or international projects and needing a data-backed ESG profile and risk narrative.", output: "Finance-ready ESG profile" }
    },
    impact: {
      mn: { title: "Байгаль орчин, ХАБЭА-н нөлөөг удирдах", text: "Уул уурхай, барилга, үйлдвэрлэл, эрчим хүч, үйлчилгээний байгууллагад ус, эрчим хүч, CO₂, хог хаягдал, H&S-ийн бодит хяналт хэрэгтэй.", output: "Operational ESG dashboard" },
      en: { title: "Manage environmental and H&S impacts", text: "Mining, construction, manufacturing, energy, and service companies needing operational visibility over water, energy, CO₂, waste, and H&S.", output: "Operational ESG dashboard" }
    },
    advisor: {
      mn: { title: "Үйлчлүүлэгчдээ ESG үйлчилгээ хүргэх", text: "Аудитор, нягтлан бодогч, санхүүгийн зөвлөх, хуульч өөрийн харилцагчид стандартчилсан data register, scoring, reporting workflow ашиглах боломжтой.", output: "White-label methodology toolkit" },
      en: { title: "Deliver ESG services to clients", text: "Auditors, accountants, financial advisors, and lawyers can use standardized data registers, scoring, and reporting workflows for their clients.", output: "White-label methodology toolkit" }
    }
  },
  roadmap: {
    1: {
      mn: { stage: "ҮЕ ШАТ 1", title: "Судалгаа, загварчлал, платформын MVP", text: "Хэрэглэгчийн хэрэгцээ, ESG data model, стандартын mapping, UI flow болон үндсэн dashboard прототипийг хөгжүүлэх." },
      en: { stage: "STAGE 1", title: "Research, modelling, and platform MVP", text: "Develop user needs, the ESG data model, standards mapping, UI flow, and the core dashboard prototype." }
    },
    2: {
      mn: { stage: "ҮЕ ШАТ 2", title: "Физик төхөөрөмжийн прототип ба туршилт", text: "Smart energy/water meter, CO₂ sensor, QR collection-ийн шаардлага, нийлүүлэгч, холболт, туршилтын өгөгдлийг баталгаажуулах." },
      en: { stage: "STAGE 2", title: "Physical device prototype and testing", text: "Validate smart energy/water meters, CO₂ sensors, QR collection requirements, suppliers, integrations, and test data." }
    },
    3: {
      mn: { stage: "ҮЕ ШАТ 3", title: "ESG тайлангийн жишээ ба scoring engine", text: "Туршилтын өгөгдлөөр Scope 1–3, KPI, material risk, disclosure index болон тайлангийн жишээ боловсруулна." },
      en: { stage: "STAGE 3", title: "Sample ESG report and scoring engine", text: "Use pilot data to develop Scope 1–3 calculations, KPIs, material risks, a disclosure index, and a sample report." }
    },
    4: {
      mn: { stage: "ҮЕ ШАТ 4", title: "1–2 байгууллагын pilot implementation", text: "Бодит хэрэглэгчийн data flow, usability, control, тайлангийн хугацаа, үнэ цэнийн таамгийг туршиж сайжруулна." },
      en: { stage: "STAGE 4", title: "Pilot implementation with 1–2 organizations", text: "Test and improve real-world data flows, usability, controls, reporting time, and the value proposition." }
    },
    5: {
      mn: { stage: "ҮЕ ШАТ 5", title: "Зах зээлд нэвтрүүлэх ба түншлэл", text: "SaaS багц, SLA, onboarding, сургалт, B2B борлуулалт болон аудит/банк/төслийн түншлэлийн сувгийг нээнэ." },
      en: { stage: "STAGE 5", title: "Market launch and partnerships", text: "Launch SaaS packages, SLAs, onboarding, training, B2B sales, and partnership channels with audit firms, banks, and projects." }
    }
  }
};

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function applyLanguage(language) {
  currentLanguage = language;
  root.lang = language;

  document.querySelectorAll("[data-mn][data-en]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  languageToggle.textContent = language === "mn" ? "EN" : "MN";
  languageToggle.setAttribute("aria-label", language === "mn" ? "Switch to English" : "Монгол хэл рүү солих");

  const placeholderSet = translations.placeholders[language];
  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactMessage = document.getElementById("contactMessage");
  if (contactName) contactName.placeholder = placeholderSet.name;
  if (contactEmail) contactEmail.placeholder = placeholderSet.email;
  if (contactMessage) contactMessage.placeholder = placeholderSet.message;

  updateAssessment();
  updateSegment(document.querySelector(".segment-tab.active")?.dataset.segment || "ipo");
  updateRoadmap(document.querySelector(".roadmap-step.active")?.dataset.roadmap || "1");
  safeStorageSet("grenetLanguage", language);
}

function applyTheme(theme) {
  currentTheme = theme;
  root.dataset.theme = theme;
  themeToggle.innerHTML = `<span aria-hidden="true">${theme === "dark" ? "☀" : "◐"}</span>`;
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Гэрэлтэй горимд шилжих" : "Харанхуй горимд шилжих");
  safeStorageSet("grenetTheme", theme);
}

languageToggle?.addEventListener("click", () => applyLanguage(currentLanguage === "mn" ? "en" : "mn"));
themeToggle?.addEventListener("click", () => applyTheme(currentTheme === "dark" ? "light" : "dark"));

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("menu-open", isOpen);
});

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  });
});

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  if (pageProgress) pageProgress.style.width = `${ratio}%`;
  header?.classList.toggle("scrolled", scrollTop > 18);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px" });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const orbitDescriptions = {
  ESG: { mn: "IFRS S1/S2, GRI, SASB, materiality, GHG ба disclosure architecture.", en: "IFRS S1/S2, GRI, SASB, materiality, GHG, and disclosure architecture." },
  FIN: { mn: "Төсөв, мөнгөн урсгал, KPI, үнэлгээ, банк ба зээлийн шинжилгээ.", en: "Budgets, cash flow, KPIs, valuation, banking, and credit analytics." },
  TECH: { mn: "Data register, dashboard, score, automation, IoT болон web prototype.", en: "Data registers, dashboards, scoring, automation, IoT, and web prototypes." }
};
const orbitTooltip = document.getElementById("orbitTooltip");
document.querySelectorAll(".orbit-node").forEach((node) => {
  const show = () => {
    const key = node.dataset.orbit;
    orbitTooltip.textContent = orbitDescriptions[key][currentLanguage];
  };
  node.addEventListener("mouseenter", show);
  node.addEventListener("focus", show);
});

function activateProductTab(tabName) {
  document.querySelectorAll(".product-tab").forEach((tab) => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".product-panel").forEach((panel) => {
    const active = panel.dataset.panel === tabName;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
}
document.querySelectorAll(".product-tab").forEach((tab) => tab.addEventListener("click", () => activateProductTab(tab.dataset.tab)));

const liveNumberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
setInterval(() => {
  if (document.hidden) return;
  document.querySelectorAll(".live-number").forEach((number) => {
    const base = Number(number.dataset.base);
    const decimal = String(base).includes(".");
    const variation = base * ((Math.random() - 0.5) * 0.003);
    const value = base + variation;
    number.textContent = decimal ? value.toFixed(1) : liveNumberFormatter.format(Math.round(value));
  });
}, 2800);

const matrixTooltip = document.getElementById("matrixTooltip");
document.querySelectorAll(".matrix-grid button").forEach((button) => {
  const update = () => { matrixTooltip.textContent = button.dataset.risk; };
  button.addEventListener("mouseenter", update);
  button.addEventListener("focus", update);
});

// Service accordion: keep one main item open while allowing accessible toggling.
document.querySelectorAll(".service-summary").forEach((summary) => {
  summary.addEventListener("click", () => {
    const item = summary.closest(".service-item");
    const detail = item.querySelector(".service-detail");
    const currentlyOpen = item.classList.contains("open");

    document.querySelectorAll(".service-item").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".service-summary")?.setAttribute("aria-expanded", "false");
      const otherDetail = other.querySelector(".service-detail");
      if (otherDetail) otherDetail.hidden = true;
      const toggle = other.querySelector(".service-toggle");
      if (toggle) toggle.textContent = "+";
    });

    if (!currentlyOpen) {
      item.classList.add("open");
      summary.setAttribute("aria-expanded", "true");
      detail.hidden = false;
      item.querySelector(".service-toggle").textContent = "−";
    }
  });
});

const readinessForm = document.getElementById("readinessForm");
const readinessScore = document.getElementById("readinessScore");
const readinessLevel = document.getElementById("readinessLevel");
const readinessAdvice = document.getElementById("readinessAdvice");
const assessmentResult = document.querySelector(".assessment-result");

function updateAssessment() {
  if (!readinessForm) return;
  const checked = [...readinessForm.querySelectorAll("input[type='radio']:checked")];
  const score = checked.reduce((total, input) => total + Number(input.value), 0);
  const completed = checked.length;
  readinessScore.textContent = String(score);
  assessmentResult?.style.setProperty("--assessment-score", `${score}%`);

  if (completed === 0) {
    readinessLevel.textContent = currentLanguage === "mn" ? "Хариултаа сонгоно уу" : "Select your answers";
    readinessAdvice.textContent = currentLanguage === "mn" ? "Таны хариултаас шалтгаалан зөвлөмж энд гарна." : "A recommendation will appear here based on your answers.";
    return;
  }

  const result = translations.readiness[currentLanguage].find((item) => score <= item.max) || translations.readiness[currentLanguage].at(-1);
  readinessLevel.textContent = `${result.level} · ${completed}/5`;
  readinessAdvice.textContent = result.advice;
}
readinessForm?.addEventListener("change", updateAssessment);
document.getElementById("resetAssessment")?.addEventListener("click", () => {
  readinessForm.reset();
  updateAssessment();
  showToast(currentLanguage === "mn" ? "Үнэлгээг дахин эхлүүллээ." : "Assessment reset.");
});

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.counter);
    const duration = 1200;
    const start = performance.now();
    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(element);
  });
}, { threshold: 0.4 });
document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

function updateSegment(key) {
  const target = document.getElementById("segmentContent");
  if (!target || !translations.segments[key]) return;
  const content = translations.segments[key][currentLanguage];
  target.innerHTML = `
    <small>${currentLanguage === "mn" ? "ХЭРЭГЦЭЭ" : "NEED"}</small>
    <h4>${content.title}</h4>
    <p>${content.text}</p>
    <div><span>Key output</span><strong>${content.output}</strong></div>
  `;
}
document.querySelectorAll(".segment-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".segment-tab").forEach((item) => item.classList.toggle("active", item === tab));
    updateSegment(tab.dataset.segment);
  });
});

function updateRoadmap(key) {
  const target = document.getElementById("roadmapDetail");
  if (!target || !translations.roadmap[key]) return;
  const content = translations.roadmap[key][currentLanguage];
  target.innerHTML = `
    <div class="roadmap-visual"><span>0${key}</span><div class="pulse-ring"></div></div>
    <div><small>${content.stage}</small><h4>${content.title}</h4><p>${content.text}</p></div>
  `;
}
document.querySelectorAll(".roadmap-step").forEach((step) => {
  step.addEventListener("click", () => {
    document.querySelectorAll(".roadmap-step").forEach((item) => item.classList.toggle("active", item === step));
    updateRoadmap(step.dataset.roadmap);
  });
});

const projectionDetails = document.querySelector(".projection-details");
projectionDetails?.addEventListener("toggle", () => {
  const icon = projectionDetails.querySelector("summary i");
  if (icon) icon.textContent = projectionDetails.open ? "×" : "+";
});

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px)`;
    });
    button.addEventListener("pointerleave", () => { button.style.transform = ""; });
  });
}

const observedSections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
observedSections.forEach((section) => sectionObserver.observe(section));

const copyEmail = document.getElementById("copyEmail");
copyEmail?.addEventListener("click", async () => {
  const email = "jargalgc@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    showToast(currentLanguage === "mn" ? "Имэйл хаягийг хууллаа." : "Email address copied.");
  } catch {
    const area = document.createElement("textarea");
    area.value = email;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast(currentLanguage === "mn" ? "Имэйл хаягийг хууллаа." : "Email address copied.");
  }
});

const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const service = document.getElementById("contactService").value;
  const message = document.getElementById("contactMessage").value.trim();
  const subject = encodeURIComponent(`GRENET inquiry — ${service}`);
  const bodyText = currentLanguage === "mn"
    ? `Сайн байна уу,\n\n${message}\n\nСонирхож буй үйлчилгээ: ${service}\nНэр: ${name}\nИмэйл: ${email}`
    : `Hello,\n\n${message}\n\nService of interest: ${service}\nName: ${name}\nEmail: ${email}`;
  window.location.href = `mailto:jargalgc@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
});

const year = document.getElementById("currentYear");
if (year) year.textContent = String(new Date().getFullYear());

applyTheme(currentTheme);
applyLanguage(currentLanguage);
activateProductTab("dashboard");
