/* SECTION: THEME CONTROLLER
   PURPOSE: Manage dark mode state and persist user preference.
   BEHAVIOR: Toggles CSS variables using a data-theme attribute. */

const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;
const STORAGE_THEME = 'preferredTheme';
const STORAGE_LANGUAGE = 'preferredLanguage';
let currentLanguage = 'en';

const translations = {
  es: {
    'brand-label': 'Personal CV',
    'brand-title': 'César Paredes',
    'brand-subtitle': 'Analista de Gestión Financiera y Control Administrativo',
    'download-cv': 'Descargar CV',
    'nav-about': 'Perfil Profesional',
    'nav-experience': 'Experiencia',
    'nav-skills': 'Habilidades',
    'nav-education': 'Educación',
    'nav-contact': 'Contacto',
    'about-label': 'Perfil Profesional',
    'about-title': 'Resumen Ejecutivo',
    'about-copy': 'Analista de Gestión Financiera y Control Administrativo con experiencia en gestión financiera, conciliaciones bancarias, control documental y cumplimiento tributario. Especializado en la optimización de procesos mediante herramientas tecnológicas, automatización de tareas y análisis de datos. Capacidad para transformar procesos operativos en sistemas más eficientes, garantizando precisión financiera, reducción de errores y apoyo estratégico para la toma de decisiones empresariales.',
    'experience-label': 'Experiencia',
    'experience-title': 'Línea de tiempo profesional',
    'skills-label': 'Habilidades',
    'skills-title': 'Habilidades',
    'skill_html': 'HTML',
    'skill_css': 'CSS',
    'skill_ollama': 'Ollama (IA local)',
    'skill_hermes': 'Hermes Agent (Asistente IA)',
    'skill_excel': 'Excel avanzado',
    'skill_proactividad': 'Proactividad',
    'skill_soft': 'Habilidades blandas',
    'skill_sql': 'SQL (análisis de datos)',
    'skill_presion': 'Trabajo bajo presión',
    'skill_critico': 'Pensamiento crítico',
    'skill_gcp': 'Google Cloud (GCP)',
    'skill_lateral': 'Pensamiento lateral',
    'skill_equipo': 'Trabajo en equipo',
    'skill_detalle': 'Atención al detalle',
    'skill_openclaw': 'Open Claw',
    'skill_resolucion': 'Resolución de problemas',
    'skill_adaptacion': 'Capacidad de adaptación',
    'skill_aws': 'Amazon Web Services (AWS)',
    'skill_aprendizaje': 'Capacidad de aprendizaje',
    'skill_ofimatica': 'Herramientas de ofimática',
    'education-label': 'Educación',
    'education-title': 'Aprendizaje y Desarrollo',
    'about-objectives-title': 'Objetivos',
    'about-objectives-copy': 'Comprensión total de los procesos y las tareas e integrar análisis y tecnología para impulsar la productividad empresarial y eficiencia operativa.',
    'about-approach-title': 'Enfoque profesional',
    'about-approach-copy': 'Aplicar soluciones basadas en datos, automatización y control financiero para simplificar procesos y maximizar resultados.',
    'experience-item-1-copy': 'Gestión de conciliaciones bancarias y registro de operaciones financieras, asegurando la correcta trazabilidad contable. Organización y control de documentación contable y administrativa para optimizar su acceso y gestión. Implementación de herramientas tecnológicas y automatización de procesos, logrando una reducción del 30% en tiempos operativos. Apoyo en la mejora de procesos administrativos, manejo de información confidencial y cumplimiento de obligaciones fiscales y parafiscales para múltiples empresas.',
    'experience-item-2-copy': 'Elaboración y análisis de estados financieros mensuales, contribuyendo a la evaluación del desempeño económico. Control y seguimiento de cuentas por cobrar y pagar, asegurando la correcta gestión del flujo de caja. Preparación de reportes financieros para la toma de decisiones gerenciales, optimización de procesos contables y coordinación con auditorías internas y externas.',
    'experience-item-3-copy': 'Registro y conciliación de movimientos bancarios, garantizando la consistencia de la información financiera. Elaboración y control de facturas, presupuestos y órdenes de compra. Gestión y actualización de inventarios físicos y digitales. Apoyo en la preparación de reportes financieros mensuales, administración de cobros y pagos a proveedores, e implementación de sistemas de archivo físico y digital para mejorar la eficiencia operativa.',
    'experience-item-4-copy': 'Registro y conciliación de movimientos bancarios, garantizando la consistencia de la información financiera. Elaboración y control de facturas, presupuestos y órdenes de compra. Gestión y actualización de inventarios físicos y digitales. Apoyo en la preparación de reportes financieros mensuales, administración de cobros y pagos a proveedores, e implementación de sistemas de archivo físico y digital para mejorar la eficiencia operativa.',
    'education-degree-1': 'Contaduría Pública',
    'education-degree-1-year': 'UNETRANS 2021 - Presente',
    'education-degree-2': 'Administración Informática',
    'education-degree-2-year': 'UNERS 2024 - Presente',
    'references-label': 'Referencias',
    'references-title': 'Referencias Profesionales',
    'references-copy': 'Referencias disponibles a solicitud. Puedo proporcionar contactos de supervisores anteriores y colegas que pueden dar fe de mi ética de trabajo, habilidades y contribuciones en roles anteriores. No dudes en solicitar esta información durante el proceso de entrevista para obtener una visión más completa de mi desempeño profesional.',
    'contact-label': 'Contacto',
    'contact-title': 'Contáctame',
    'contact-copy': 'Si te gustó mi perfil y crees que pueda encajar en su equipo, contáctame por cualquiera de estos medios.',
    'pdf-label': 'CV Standar',
    'pdf-title': 'CV preview',
    'viewer-note': 'Si la vista previa de la PDF no es visible, puedes descargarlo haciendo click en el botón de descarga.',
    'toggle-dark': 'Modo oscuro',
    'toggle-light': 'Modo claro',
    'language-note': 'Puedes cambiar el idioma a tu preferencia / You can choose your preferred language.'
    ,
    'toggle-language-note-show': 'Mostrar nota',
    'toggle-language-note-hide': 'Ocultar nota'
    ,
    'language-en': 'English',
    'language-es': 'Español'
  },
  en: {
    'brand-label': 'Personal CV',
    'brand-title': 'César Paredes',
    'brand-subtitle': 'Financial Management and Administrative Control Analyst',
    'download-cv': 'Download CV',
    'nav-about': 'Professional Profile',
    'nav-experience': 'Experience',
    'nav-skills': 'Skills',
    'nav-education': 'Education',
    'nav-contact': 'Contact',
    'about-label': 'Professional Profile',
    'about-title': 'Executive Summary',
    'about-copy': 'Financial Management and Administrative Control Analyst with experience in financial management, bank reconciliations, document control and tax compliance. Specialized in process optimization through technological tools, task automation and data analysis. Ability to transform operational processes into more efficient systems, ensuring financial accuracy, error reduction and strategic support for business decision making.',
    'experience-label': 'Experience',
    'experience-title': 'Professional Timeline',
    'skills-label': 'Skills',
    'skills-title': 'Skills',
    'skill_html': 'HTML',
    'skill_css': 'CSS',
    'skill_ollama': 'Ollama (Local AI)',
    'skill_hermes': 'Hermes Agent (AI Assistant)',
    'skill_excel': 'Advanced Excel',
    'skill_proactividad': 'Proactivity',
    'skill_soft': 'Soft skills',
    'skill_sql': 'SQL (Data analysis)',
    'skill_presion': 'Work under pressure',
    'skill_critico': 'Critical thinking',
    'skill_gcp': 'Google Cloud (GCP)',
    'skill_lateral': 'Lateral thinking',
    'skill_equipo': 'Teamwork',
    'skill_detalle': 'Attention to detail',
    'skill_openclaw': 'Open Claw',
    'skill_resolucion': 'Problem solving',
    'skill_adaptacion': 'Adaptability',
    'skill_aws': 'Amazon Web Services (AWS)',
    'skill_aprendizaje': 'Learning ability',
    'skill_ofimatica': 'Office tools',
    'education-label': 'Education',
    'education-title': 'Learning and Development',
    'about-objectives-title': 'Objectives',
    'about-objectives-copy': 'Complete understanding of processes and tasks, integrating analysis and technology to boost business productivity and operational efficiency.',
    'about-approach-title': 'Professional approach',
    'about-approach-copy': 'Apply data-driven solutions, automation and financial control to simplify processes and maximize results.',
    'experience-item-1-copy': 'Management of bank reconciliations and recording of financial operations, ensuring accurate accounting traceability. Organization and control of accounting and administrative documentation to optimize access and management. Implementation of technological tools and process automation, resulting in a 30% reduction in operational time. Support in improving administrative processes, handling confidential information and complying with tax and parafiscal obligations for multiple companies.',
    'experience-item-2-copy': 'Preparation and analysis of monthly financial statements, contributing to the assessment of economic performance. Control and monitoring of accounts receivable and payable, ensuring proper cash flow management. Preparation of financial reports for managerial decision-making, optimization of accounting processes and coordination with internal and external audits.',
    'experience-item-3-copy': 'Recording and reconciliation of bank transactions, ensuring consistency of financial information. Preparation and control of invoices, budgets and purchase orders. Management and updating of physical and digital inventories. Support in preparing monthly financial reports, administration of collections and supplier payments, and implementation of physical and digital filing systems to improve operational efficiency.',
    'experience-item-4-copy': 'Recording and reconciliation of bank transactions, ensuring consistency of financial information. Preparation and control of invoices, budgets and purchase orders. Management and updating of physical and digital inventories. Support in preparing monthly financial reports, administration of collections and supplier payments, and implementation of physical and digital filing systems to improve operational efficiency.',
    'education-degree-1': 'Public Accounting',
    'education-degree-1-year': 'UNETRANS 2021 - Present',
    'education-degree-2': ' Informatic Administration',
    'education-degree-2-year': 'UNERS 2024 - Present',
    'references-label': 'References',
    'references-title': 'Professional References',
    'references-copy': 'References available upon request. I can provide contacts for former supervisors and colleagues who can attest to my work ethic, skills and contributions in previous roles. Feel free to request this information during the interview process for a fuller view of my professional performance.',
    'contact-label': 'Contact',
    'contact-title': 'Let’s connect',
    'contact-copy': 'If you liked my profile and believe I could fit your team, contact me through any of these channels.',
    'pdf-label': 'CV Standard',
    'pdf-title': 'CV preview',
    'viewer-note': 'If the PDF preview is not visible, you can download it by clicking the download button.',
    'toggle-dark': 'Dark Mode',
    'toggle-light': 'Light Mode',
    'language-note': 'Puedes cambiar el idioma a tu preferencia / You can choose your preferred language.',
    'toggle-language-note-show': 'Show note',
    'toggle-language-note-hide': 'Hide note'
    ,
    'language-en': 'English',
    'language-es': 'Español'
  }
};

function translatePage(locale) {
  currentLanguage = locale;
  const translation = translations[locale] || translations.es;
  document.querySelectorAll('[data-i18n-key]').forEach((element) => {
    const key = element.getAttribute('data-i18n-key');
    if (!key) return;
    const text = translation[key];
    if (text) {
      element.textContent = text;
    }
  });
  rootElement.lang = locale;
}

function updateLanguageActive(locale) {
  document.querySelectorAll('.language-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === locale);
  });
}

function setLanguage(locale) {
  localStorage.setItem(STORAGE_LANGUAGE, locale);
  translatePage(locale);
  updateLanguageActive(locale);
  const currentTheme = rootElement.getAttribute('data-theme') || 'light';
  updateThemeButton(currentTheme);
  updateLanguageButton();
}

function loadLanguage() {
  const language = localStorage.getItem(STORAGE_LANGUAGE) || 'en';
  setLanguage(language);
}

function updateLanguageNoteToggle() {
  // legacy: language note UI has been removed; kept for backwards compat if needed
}

function updateLanguageButton() {
  const btn = document.getElementById('language-toggle');
  if (!btn) return;
  const icon = btn.querySelector('.toggle-icon');
  const text = btn.querySelector('.toggle-text');
  if (icon) icon.textContent = '🌐';
  if (text) {
    const key = currentLanguage === 'en' ? 'language-en' : 'language-es';
    text.textContent = translations[currentLanguage]?.[key] || (currentLanguage === 'en' ? 'English' : 'Español');
  }
  btn.setAttribute('aria-label', currentLanguage === 'en' ? 'Select English' : 'Seleccionar español');
}

function getThemeLabel(theme) {
  const keys = theme === 'dark' ? 'toggle-dark' : 'toggle-light';
  return translations[currentLanguage]?.[keys] || translations.es[keys];
}

function updateThemeButton(theme) {
  const icon = themeToggle.querySelector('.toggle-icon');
  const text = themeToggle.querySelector('.toggle-text');
  if (icon) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
  if (text) {
    text.textContent = getThemeLabel(theme);
  }
}

function setTheme(theme) {
  rootElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_THEME, theme);
  updateThemeButton(theme);
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activate dark mode' : 'Activate light mode');
}

function loadTheme() {
  const savedTheme = localStorage.getItem(STORAGE_THEME);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
}

/* SECTION: SMOOTH NAVIGATION
   PURPOSE: Highlight nav links and support smooth scrolling behavior.
   BEHAVIOR: Uses IntersectionObserver to detect active sections on scroll. */

const navLinks = document.querySelectorAll('.page-nav .nav-link');
const sections = document.querySelectorAll('section[id]');

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      if (entry.isIntersecting) {
        section.classList.add('is-visible');
        setActiveLink(section.id);
      }
    });
  },
  {
    threshold: 0.35,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* SECTION: PAGE LOAD INITIALIZATION
   PURPOSE: Initialize theme and interactions after DOM is ready.
   BEHAVIOR: Sets up event listeners and reveals visible sections. */

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadLanguage();

  themeToggle.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
  const languageToggleBtn = document.getElementById('language-toggle');
  if (languageToggleBtn) {
    languageToggleBtn.addEventListener('click', () => {
      const newLang = currentLanguage === 'en' ? 'es' : 'en';
      setLanguage(newLang);
    });
  }

  // initialize language button label
  updateLanguageButton();

  const activeSection = Array.from(sections).find((section) => section.getBoundingClientRect().top >= 0);
  if (activeSection) {
    setActiveLink(activeSection.id);
  }
});
