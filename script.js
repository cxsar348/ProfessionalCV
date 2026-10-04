/* =========================================================
   CÉSAR PAREDES — CV
   Theme, language and profile-tab controllers + print export.
   ========================================================= */

const rootElement = document.documentElement;
rootElement.classList.add('js');

const themeToggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');
const downloadBtn = document.getElementById('download-btn');
const toolbar = document.querySelector('.nav');
const profileTabs = Array.from(document.querySelectorAll('.profile-tab'));
const profilePanels = Array.from(document.querySelectorAll('[data-profile-panel]'));

const STORAGE_THEME = 'cv.theme';
const STORAGE_LANGUAGE = 'cv.language';
const STORAGE_PROFILE = 'cv.profile';

let currentLanguage = 'es';
let currentProfile = 'tech';
let initialized = false;
let switchTimer = null;
let started = false;
let cachedProjects = null;
let projectsLoaded = false;

/* ---------- Translations ---------- */
const translations = {
  es: {
    'toolbar-tag': 'Currículum Vitae',
    'tab-tech': 'Perfil Tech',
    'tab-admin': 'Perfil Administrativo',
    'download-cv': 'Descargar PDF',
    'toggle-dark': 'Modo oscuro',
    'toggle-light': 'Modo claro',
    'language-en': 'English',
    'language-es': 'Español',

    'name': 'César Paredes',
    'location': 'San Antonio de los Altos, Miranda, Venezuela',
    'status': 'Disponible para nuevas oportunidades',
    'sec-summary-label': 'Perfil',
    'sec-skills-label': 'Habilidades',
    'sec-experience-label': 'Experiencia',
    'sec-education-label': 'Educación',
    'sec-languages-label': 'Idiomas',
    'sec-references-label': 'Referencias',
    'sec-contact-label': 'Contacto',
    'sec-summary-meta': 'Cómo pienso y trabajo',
    'sec-summary-stat': '+6 años de experiencia',
    'sec-skills-meta': 'Herramientas que uso a diario',
    'sec-skills-stat': '5 áreas · +18 habilidades',
    'sec-experience-meta': 'Dónde y qué he hecho',
    'sec-experience-stat': '4 roles · 2018—2026',
    'sec-education-meta': 'Formación y estudios',
    'sec-education-stat': '2 programas activos',
    'sec-languages-meta': 'Con quién puedo comunicarme',
    'sec-languages-stat': '2 idiomas',
    'sec-references-meta': 'Quién respalda mi trabajo',
    'sec-references-stat': '4 contactos',
    'sec-contact-meta': 'Medios de contacto',
    'sec-contact-stat': '5 canales',
    'lang-es-name': 'Español',
    'lang-es-level': 'Nativo',
    'lang-en-name': 'Inglés',
    'lang-en-level': 'B1 · Intermedio',
    'sec-projects-label': 'Proyectos',
    'sec-projects-meta': 'Lo que construyo y comparto',
    'sec-projects-stat': 'GitHub · @cxsar348',
    'sec-projects': 'Proyectos',
    'projects-cta': 'Ver todos los proyectos en GitHub',
    'projects-empty': 'Explora mis repositorios públicos en GitHub.',
    'projects-loading': 'Cargando proyectos…',
    'contact-label-email': 'Email',
    'contact-label-phone': 'Teléfono',
    'contact-label-whatsapp': 'WhatsApp',
    'contact-label-telegram': 'Telegram',
    'contact-label-linkedin': 'LinkedIn',
    'stat-exp-label': 'Experiencia',
    'stat-exp-value': '+6 años',
    'stat-loc-label': 'Ubicación',
    'stat-loc-value': 'Venezuela',
    'stat-focus-label': 'Especialidad',
    'stat-focus-tech': 'Datos y automatización',
    'stat-focus-admin': 'Detección de errores y flujos administrativos',
    'stat-lang-label': 'Idiomas',
    ' stat-lang-value': 'ES · EN (B1) · IT (A1) ',
    'tech-hero-1': 'La organización',
    'tech-hero-2': 'es solo el punto de partida.',
    'tech-hero-prefix': 'Diseño',
    'tech-hero-suffix': 'que funcionan.',
    'tech-hero-word': 'automatizaciones',
    'tech-hero-words': 'sistemas,automatizaciones,reportes',
    'admin-hero-1': 'La organización',
    'admin-hero-2': 'es donde nace la eficiencia.',
    'admin-hero-prefix': 'Gestión de',
    'admin-hero-suffix': 'con precisión.',
    'admin-hero-word': 'conciliaciones',
    'admin-hero-words': 'conciliaciones,procesos,controles',
    'sec-summary': 'Resumen Profesional',
    'sec-skills': 'Habilidades',
    'sec-experience': 'Experiencia Profesional',
    'sec-education': 'Educación',
    'sec-languages': 'Idiomas',
    'sec-references': 'Referencias',
    'references-copy': 'Referencias profesionales disponibles a solicitud.',
    'about-objectives-title': 'Objetivos',
    'about-objectives-copy': 'Comprensión total de los procesos y las tareas e integrar análisis y tecnología para impulsar la productividad empresarial y eficiencia operativa.',
    'about-approach-title': 'Enfoque profesional',
    'about-approach-copy': 'Optimizar la arquitectura operacional mediante la reingeniería de procesos existentes, el análisis estratégico de datos, la automatización y el control financiero, orientando los esfuerzos a la eficiencia operativa y la maximización de rentabilidad.',
    'contact-copy': 'Si te gustó mi perfil y crees que puedo encajar en tu equipo, escríbeme.',
    'languages-list': 'Español (Nativo) • Inglés (B1)',

    /* --- Tech profile --- */
    'tech-title': 'Analista de Datos y Automatización',
    'tech-summary': 'Analista con formación en Contaduría Pública y Administración Informática, orientado a la optimización de procesos mediante datos y tecnología. Experiencia en SQL, Excel avanzado, Google Cloud, AWS y herramientas de inteligencia artificial local para automatizar tareas, diseñar reportes y reducir tiempos operativos. Enfoque en precisión, trazabilidad de la información y mejora continua.',
    'tech-cat-1': 'Datos y Análisis:',
    'tech-cat-2': 'Desarrollo Web:',
    'tech-cat-3': 'Cloud y Plataformas:',
    'tech-cat-4': 'Automatización e IA:',
    'tech-cat-5': 'Habilidades Blandas:',
    'tech-skills-1': 'SQL, Excel avanzado (tablas dinámicas), Análisis de datos, Elaboración de reportes',
    'tech-skills-2': 'HTML, CSS',
    'tech-skills-3': 'Google Cloud (GCP), Amazon Web Services (AWS)',
    'tech-skills-4': 'Automatización de procesos, Prompt Engineering, IA aplicada, Ollama (IA local), Hermes Agent, Open Claw',
    'tech-skills-5': 'Resolución de problemas, Pensamiento crítico, Trabajo en equipo, Adaptabilidad, Atención al detalle',
    'tech-job1-role': 'Analista de Automatización y Procesos',
    'tech-job1-b1': 'Implementación de herramientas tecnológicas y automatización de procesos basados en AI y procesos ya existentes, reduciendo los tiempos operativos en un 30%.',
    'tech-job1-b2': 'Diseño y conciliación de flujos de datos para conciliaciones bancarias y registro de operaciones, garantizando la trazabilidad contable.',
    'tech-job1-b3': 'Automatización de recopilación y control de documentación contable y administrativa para mejorar su acceso y gestión.',
    'tech-job1-b4': 'Manejo discreto de información confidencial y el cumplimiento de obligaciones fiscales y parafiscales de múltiples empresas.',
    'tech-job2-role': 'Analista de Datos Financieros',
    'tech-job2-b1': 'Elaboración y análisis de estados financieros mensuales para evaluar el desempeño económico.',
    'tech-job2-b2': 'Construcción de reportes financieros para la toma de decisiones gerenciales.',
    'tech-job2-b3': 'Optimización de procesos contables mediante plantillas y automatizaciones en Excel.',
    'tech-job2-b4': 'Coordinación con auditorías internas y externas aportando información trazable y verificable.',
    'tech-job3-role': 'Analista Administrativo y Datos',
    'tech-job3-b1': 'Registro y conciliación de movimientos bancarios garantizando la consistencia de la información financiera.',
    'tech-job3-b2': 'Gestión y actualización de inventarios físicos y digitales con control de datos.',
    'tech-job3-b3': 'Elaboración y control de facturas, presupuestos y órdenes de compra.',
    'tech-job3-b4': 'Implementación de sistemas de archivo físico y digital mejorando la eficiencia operativa.',
    'tech-job4-role': 'Asistente Administrativo',
    'tech-job4-b1': 'Supervisión y validación de conciliaciones bancarias.',
    'tech-job4-b2': 'Organización y control de documentación contable y administrativa.',
    'tech-job4-b3': 'Supervisión y actualización de inventarios.',
    'tech-job4-b4': 'Manejo de información confidencial y apoyo a la mejora de procesos administrativos.',

    /* --- Admin profile --- */
    'admin-title': 'Analista Administrativo y financiero',
    'admin-summary': 'Analista gestión financiera, conciliaciones bancarias, control documental y cumplimiento tributario y parafiscal. Especializado en la optimización de procesos administrativos y en la elaboración de flujos de trabajo para la optimización de los recursos. Enfocado en la precisión, la reducción de errores y el control interno.',
    'admin-cat-1': 'Gestión Financiera:',
    'admin-cat-2': 'Contabilidad y Tributos:',
    'admin-cat-3': 'Administración y Control:',
    'admin-cat-4': 'Herramientas:',
    'admin-cat-5': 'Habilidades Blandas:',
    'admin-skills-1': 'Conciliaciones bancarias, Cuentas por cobrar y pagar, Flujo de caja, Análisis financiero',
    'admin-skills-2': 'Estados financieros, Cumplimiento fiscal y parafiscal, Registro de operaciones, Auditorías',
    'admin-skills-3': 'Control documental, Gestión de inventarios, Facturación, Presupuestos y órdenes de compra',
    'admin-skills-4': 'Excel avanzado (tablas dinámicas), Herramientas de ofimática, SQL (análisis de datos)',
    'admin-skills-5': 'Atención al detalle, Resolución de problemas, Organización, Trabajo en equipo, Confidencialidad',
    'admin-job0-company': 'Inversiones MARG, C.A',
    'admin-job0-role': 'Analista Administrativo y Financiero',
    'admin-job0-b1': 'Gestión de conciliaciones bancarias y registro de operaciones financieras, asegurando la trazabilidad contable precisa.',
    'admin-job0-b2': 'Control y seguimiento de los movimientos de inventario diarios, asegurando el registro oportuno de la entrada y salida de mercancía y fortaleciendo la trazabilidad operativa.',
    'admin-job0-b3': 'Gestión, clasificación y organización de la documentación financiera, facilitando la localización y disponibilidad de soportes para los procesos contables, administrativos y de control interno.',
    'admin-job0-b4': 'Gestión de ventas y facturación a clientes mayoristas, incluyendo la preparación y seguimiento de documentos comerciales, registro de operaciones y control de la documentación asociada a cada venta.',
    'admin-job1-role': 'Analista Administrativo y Contable',
    'admin-job1-b1': 'Implementación de herramientas tecnológicas y automatización de procesos basados en AI y procesos ya existentes, reduciendo los tiempos operativos en un 30%.',
    'admin-job1-b2': 'Responsabilidad de declaraciones mensuales y quincenales fiscales y parafiscales de múltiples empresas.',
    'admin-job1-b3': 'Organización y control de la documentación contable y administrativa para optimizar su acceso y gestión.',
    'admin-job1-b4': 'Gestión de conciliaciones bancarias y registro de operaciones financieras, asegurando la correcta trazabilidad contable.',
    'admin-job2-role': 'Analista Contable',
    'admin-job2-b1': 'Elaboración y análisis de estados financieros mensuales, contribuyendo a la evaluación del desempeño económico.',
    'admin-job2-b2': 'Control y seguimiento a cuentas por cobrar y pagar, asegurando la gestión del flujo de caja.',
    'admin-job2-b3': 'Preparación de reportes financieros para la toma de decisiones gerenciales.',
    'admin-job2-b4': 'Coordinación con auditorías internas y externas.',
    'admin-job3-role': 'Auxiliar Administrativo y Contable',
    'admin-job3-b1': 'Registro y conciliación de movimientos bancarios, garantizando la consistencia de la información financiera.',
    'admin-job3-b2': 'Elaboración y control de facturas, presupuestos y órdenes de compra.',
    'admin-job3-b3': 'Gestión y actualización de inventarios físicos y digitales.',
    'admin-job3-b4': 'Administración de cobros y pagos a proveedores e implementación de sistemas de archivo físico y digital.',
    'admin-job4-role': 'Auxiliar de Administración',
    'admin-job4-b1': 'Supervisión y validación de conciliaciones bancarias.',
    'admin-job4-b2': 'Organización y control de documentación contable y administrativa.',
    'admin-job4-b3': 'Supervisión y actualización de inventarios.',
    'admin-job4-b4': 'Manejo de información confidencial y apoyo a la mejora de procesos administrativos.',

    /* --- Shared company / date / education --- */
    'job1-company': 'Barrios y Asociados C.A. — Venezuela',
    'job1-date': '2025 – 2026',
    'job2-company': 'GOLF SUITES C.A. — Venezuela',
    'job2-date': '2024 – 2025',
    'job3-company': 'MAPB C.A. — Venezuela',
    'job3-date': '2019 – 2023',
    'job4-company': 'Carnicería Brasa y Leña C.A. — Venezuela',
    'job4-date': '2018 – 2021',
    'edu1-degree': 'Contaduría Pública',
    'edu1-year': '2021 – Presente',
    'edu1-school': 'UNETRANS',
    'edu2-degree': 'Administración Informática',
    'edu2-year': '2024 – Presente',
    'edu2-school': 'UNERS',
    'edu3-degree': 'Contaduría Pública',
    'edu3-year': '2026 – Presente',
    'edu3-school': 'Universidad Central de Venezuela'
  },

  en: {
    'toolbar-tag': 'Curriculum Vitae',
    'tab-tech': 'Tech Profile',
    'tab-admin': 'Administrative Profile',
    'download-cv': 'Download PDF',
    'toggle-dark': 'Dark Mode',
    'toggle-light': 'Light Mode',
    'language-en': 'English',
    'language-es': 'Español',

    'name': 'César Paredes',
    'location': 'San Antonio de los Altos, Miranda, Venezuela',
    'status': 'Available for new opportunities',
    'sec-summary-label': 'Profile',
    'sec-skills-label': 'Skills',
    'sec-experience-label': 'Experience',
    'sec-education-label': 'Education',
    'sec-languages-label': 'Languages',
    'sec-references-label': 'References',
    'sec-contact-label': 'Contact',
    'sec-summary-meta': 'How I think and work',
    'sec-summary-stat': '6+ years of experience',
    'sec-skills-meta': 'Tools I use every day',
    'sec-skills-stat': '5 areas · 18+ skills',
    'sec-experience-meta': 'Where and what I have done',
    'sec-experience-stat': '4 roles · 2018—2026',
    'sec-education-meta': 'Training and studies',
    'sec-education-stat': '2 active programs',
    'sec-languages-meta': 'Who I can talk to',
    'sec-languages-stat': '2 languages',
    'sec-references-meta': 'Who backs my work',
    'sec-references-stat': '4 contacts',
    'sec-contact-meta': 'Let’s connect',
    'sec-contact-stat': '5 channels',
    'lang-es-name': 'Spanish',
    'lang-es-level': 'Native',
    'lang-en-name': 'English',
    'lang-en-level': 'B1 · Intermediate',
    'lang-it-name': 'Italian',
    'lang-it-level': 'A1 · Basic',
    'sec-projects-label': 'Projects',
    'sec-projects-meta': 'Things I build and share',
    'sec-projects-stat': 'GitHub · @cxsar348',
    'sec-projects': 'Projects',
    'projects-cta': 'See all projects on GitHub',
    'projects-empty': 'Explore my public repositories on GitHub.',
    'projects-loading': 'Loading projects…',
    'contact-label-email': 'Email',
    'contact-label-phone': 'Phone',
    'contact-label-whatsapp': 'WhatsApp',
    'contact-label-telegram': 'Telegram',
    'contact-label-linkedin': 'LinkedIn',
    'stat-exp-label': 'Experience',
    'stat-exp-value': '+6 years',
    'stat-loc-label': 'Location',
    'stat-loc-value': 'Venezuela',
    'stat-focus-label': 'Focus',
    'stat-focus-tech': 'Data & automation',
    'stat-focus-admin': 'Financial management & control',
    'stat-lang-label': 'Languages',
    'stat-lang-value': 'ES · EN (B1) · IT (A1)',
    'tech-hero-1': 'Precision',
    'tech-hero-2': 'is only the starting point.',
    'tech-hero-prefix': 'I build',
    'tech-hero-suffix': 'that work.',
    'tech-hero-word': 'automations',
    'tech-hero-words': 'systems,automations,reports',
    'admin-hero-1': 'Organization',
    'admin-hero-2': 'is where efficiency begins.',
    'admin-hero-prefix': 'I manage',
    'admin-hero-suffix': 'with precision.',
    'admin-hero-word': 'reconciliations',
    'admin-hero-words': 'reconciliations,reports,controls',
    'sec-summary': 'Professional Summary',
    'sec-skills': 'Skills',
    'sec-experience': 'Professional Experience',
    'sec-education': 'Education',
    'sec-languages': 'Languages',
    'sec-references': 'References',
    'references-copy': 'Professional references available upon request.',
    'about-objectives-title': 'Objectives',
    'about-objectives-copy': 'Complete understanding of processes and tasks, integrating analysis and technology to boost business productivity and operational efficiency.',
    'about-approach-title': 'Professional approach',
    'about-approach-copy': 'Apply data-driven solutions, automation and financial control to simplify processes and maximize results.',
    'contact-copy': 'If you liked my profile and think I could fit your team, let’s connect.',
    'languages-list': 'Spanish (Native) • English (B1)',

    /* --- Tech profile --- */
    'tech-title': 'Data & Automation Analyst',
    'tech-summary': 'Analyst with a background in Public Accounting and Computer Administration, focused on process optimization through data and technology. Experience with SQL, advanced Excel, Google Cloud, AWS and local AI tools to automate tasks, build reports and reduce operational time. Focused on accuracy, data traceability and continuous improvement.',
    'tech-cat-1': 'Data & Analysis:',
    'tech-cat-2': 'Web Development:',
    'tech-cat-3': 'Cloud & Platforms:',
    'tech-cat-4': 'Automation & AI:',
    'tech-cat-5': 'Soft Skills:',
    'tech-skills-1': 'SQL, Advanced Excel (Pivot Tables), Data Analysis, Reporting',
    'tech-skills-2': 'HTML, CSS',
    'tech-skills-3': 'Google Cloud (GCP), Amazon Web Services (AWS)',
    'tech-skills-4': 'Process Automation, Prompt Engineering, Applied AI, Ollama (Local AI), Hermes Agent, Open Claw',
    'tech-skills-5': 'Problem solving, Critical thinking, Teamwork, Adaptability, Attention to detail',
    'tech-job1-role': 'Automation & Process Analyst',
    'tech-job1-b1': 'Implemented technology tools and process automation, reducing operational time by 30%.',
    'tech-job1-b2': 'Designed and maintained data workflows for bank reconciliations and transaction records, ensuring accounting traceability.',
    'tech-job1-b3': 'Automated the organization and control of accounting and administrative documentation to improve access and management.',
    'tech-job1-b4': 'Ensured handling of confidential information and compliance with tax and parafiscal obligations for multiple companies.',
    'tech-job2-role': 'Financial Data Analyst',
    'tech-job2-b1': 'Prepared and analyzed monthly financial statements to assess economic performance.',
    'tech-job2-b2': 'Built financial reports for managerial decision-making.',
    'tech-job2-b3': 'Optimized accounting processes using Excel templates and automation.',
    'tech-job2-b4': 'Coordinated with internal and external audits, providing traceable and verifiable information.',
    'tech-job3-role': 'Administrative & Data Analyst',
    'tech-job3-b1': 'Recorded and reconciled bank transactions, ensuring consistency of financial information.',
    'tech-job3-b2': 'Managed and updated physical and digital inventories with data control.',
    'tech-job3-b3': 'Prepared and controlled invoices, budgets and purchase orders.',
    'tech-job3-b4': 'Implemented physical and digital filing systems, improving operational efficiency.',
    'tech-job4-role': 'Administrative Assistant',
    'tech-job4-b1': 'Supervised and validated bank reconciliations.',
    'tech-job4-b2': 'Organized and controlled accounting and administrative documentation.',
    'tech-job4-b3': 'Supervised and updated inventories.',
    'tech-job4-b4': 'Handled confidential information and supported the improvement of administrative processes.',

    /* --- Admin profile --- */
    'admin-title': 'Administrative & Accounting Analyst',
    'admin-summary': 'Accounting analyst with experience in financial management, bank reconciliations, document control and tax and parafiscal compliance. Specialized in administrative process optimization and the preparation of financial reports for decision-making. Focused on accuracy, error reduction and internal control.',
    'admin-cat-1': 'Financial Management:',
    'admin-cat-2': 'Accounting & Tax:',
    'admin-cat-3': 'Administration & Control:',
    'admin-cat-4': 'Tools:',
    'admin-cat-5': 'Soft Skills:',
    'admin-skills-1': 'Bank reconciliations, Accounts receivable and payable, Cash flow, Financial analysis',
    'admin-skills-2': 'Financial statements, Tax and parafiscal compliance, Transaction records, Audits',
    'admin-skills-3': 'Document control, Inventory management, Invoicing, Budgets and purchase orders',
    'admin-skills-4': 'Advanced Excel (Pivot Tables), Office tools, SQL (Data analysis)',
    'admin-skills-5': 'Attention to detail, Problem solving, Organization, Teamwork, Confidentiality',
    'admin-job0-company': 'Inversiones MARG, C.A',
    'admin-job0-role': 'Financial & Administrative Analyst',
    'admin-job0-b1': 'Managed bank reconciliations and recording of financial operations, ensuring accurate accounting traceability.',
    'admin-job0-b2': 'Control and monitoring of daily inventory movements, ensuring timely recording of goods movement and strengthening operational traceability.',
    'admin-job0-b3': 'Management, classification and organization of financial documentation, facilitating the location and availability of supports for accounting, administrative and internal control processes.',
    'admin-job0-b4': 'Management of sales and invoicing to wholesale customers, including the preparation and follow-up of commercial documents, operation recording and control of the documentation associated with each sale.',
    'admin-job1-role': 'Administrative & Accounting Analyst',
    'admin-job1-b1': 'Managed bank reconciliations and recording of financial operations, ensuring accurate accounting traceability.',
    'admin-job1-b2': 'Organized and controlled accounting and administrative documentation to optimize access and management.',
    'admin-job1-b3': 'Implemented technology tools and process automation, reducing operational time by 30%.',
    'admin-job1-b4': 'Ensured handling of confidential information and compliance with tax and parafiscal obligations for multiple companies.',
    'admin-job2-role': 'Accounting Analyst',
    'admin-job2-b1': 'Prepared and analyzed monthly financial statements, contributing to the assessment of economic performance.',
    'admin-job2-b2': 'Controlled and monitored accounts receivable and payable, ensuring cash flow management.',
    'admin-job2-b3': 'Prepared financial reports for managerial decision-making.',
    'admin-job2-b4': 'Coordinated with internal and external audits.',
    'admin-job3-role': 'Administrative & Accounting Assistant',
    'admin-job3-b1': 'Recorded and reconciled bank transactions, ensuring consistency of financial information.',
    'admin-job3-b2': 'Prepared and controlled invoices, budgets and purchase orders.',
    'admin-job3-b3': 'Managed and updated physical and digital inventories.',
    'admin-job3-b4': 'Managed collections and supplier payments and implemented physical and digital filing systems.',
    'admin-job4-role': 'Administration Assistant',
    'admin-job4-b1': 'Supervised and validated bank reconciliations.',
    'admin-job4-b2': 'Organized and controlled accounting and administrative documentation.',
    'admin-job4-b3': 'Supervised and updated inventories.',
    'admin-job4-b4': 'Handled confidential information and supported the improvement of administrative processes.',

    /* --- Shared company / date / education --- */
    'job1-company': 'Barrios y Asociados C.A. — Venezuela',
    'job1-date': '2025 – 2026',
    'job2-company': 'GOLF SUITES C.A. — Venezuela',
    'job2-date': '2024 – 2025',
    'job3-company': 'MAPB C.A. — Venezuela',
    'job3-date': '2019 – 2023',
    'job4-company': 'Carnicería Brasa y Leña C.A. — Venezuela',
    'job4-date': '2018 – 2021',
    'edu1-degree': 'Accounting',
    'edu1-year': '2021 – Present',
    'edu1-school': 'UNETRANS',
    'edu2-degree': 'Administrative Informatics',
    'edu2-year': '2024 – Present',
    'edu2-school': 'UNERS',
      'edu3-degree': 'Accounting',
    'edu3-year': '2026 – Present',
    'edu3-school': 'Universidad Central de Venezuela'
  }
};

/* ---------- Language ---------- */
function translatePage(locale) {
  const dictionary = translations[locale] || translations.es;
  document.querySelectorAll('[data-i18n-key]').forEach((element) => {
    const key = element.getAttribute('data-i18n-key');
    const text = dictionary[key];
    if (text !== undefined) {
      element.textContent = text;
    }
  });
  rootElement.lang = locale;
  highlightMetrics();
}

/* Wrap the key figure ("30%") so it can carry the accent color. */
function highlightMetrics() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const targets = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (
      node.nodeValue &&
      node.nodeValue.includes('30%') &&
      node.parentElement &&
      !node.parentElement.classList.contains('metric')
    ) {
      targets.push(node);
    }
  }
  targets.forEach((node) => {
    const fragment = document.createDocumentFragment();
    node.nodeValue.split(/(30%)/).forEach((part) => {
      if (part === '30%') {
        const span = document.createElement('span');
        span.className = 'metric';
        span.textContent = part;
        fragment.appendChild(span);
      } else if (part) {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    node.parentNode.replaceChild(fragment, node);
  });
}

function updateLanguageButton() {
  if (!languageToggle) return;
  const icon = languageToggle.querySelector('.toggle-icon');
  const text = languageToggle.querySelector('.toggle-text');
  if (icon) icon.textContent = '🌐';
  if (text) {
    const key = currentLanguage === 'en' ? 'language-en' : 'language-es';
    text.textContent = translations[currentLanguage]?.[key] || 'English';
  }
  languageToggle.setAttribute('aria-label', currentLanguage === 'en' ? 'Select English' : 'Seleccionar español');
}

function setLanguage(locale) {
  currentLanguage = locale;
  localStorage.setItem(STORAGE_LANGUAGE, locale);
  translatePage(locale);
  renderSkills();
  document.querySelectorAll('.skill-title').forEach((title) => {
    title.textContent = title.textContent.replace(/\s*:\s*$/, '');
  });
  buildHeroWords();
  if (projectsLoaded) renderProjects();
  updateThemeButton(rootElement.getAttribute('data-theme') || 'light');
  updateLanguageButton();
}

/* Split comma-separated skill lines into inline items separated by a middot. */
function renderSkills() {
  document.querySelectorAll('.skill-values').forEach((element) => {
    const text = translations[currentLanguage]?.[element.dataset.i18nKey] ?? element.textContent;
    element.textContent = '';
    text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        const skill = document.createElement('span');
        skill.className = 'skill';
        skill.textContent = item;
        element.appendChild(skill);
      });
  });
}

/* Rotating keyword in the hero heading (CSS-transition slide, duplicated tail for a seamless loop). */
let heroTimers = [];

function buildHeroWords() {
  heroTimers.forEach((id) => clearInterval(id));
  heroTimers = [];

  document.querySelectorAll('.hero-word').forEach((element) => {
    const words = (translations[currentLanguage]?.[element.dataset.wordsKey] || '')
      .split(',')
      .map((word) => word.trim())
      .filter(Boolean);
    const track = element.querySelector('.hero-word-track');
    if (!track || words.length === 0) return;

    track.textContent = '';
    words.concat(words[0]).forEach((word) => {
      const span = document.createElement('span');
      span.textContent = word;
      track.appendChild(span);
    });

    track.style.transition = 'none';
    track.style.transform = 'translateY(0)';
    void track.offsetWidth;
    track.style.transition = '';

    if (words.length < 2) return;

    let index = 0;
    heroTimers.push(
      setInterval(() => {
        index += 1;
        track.style.transform = `translateY(${-index}em)`;
        if (index === words.length) {
          setTimeout(() => {
            track.style.transition = 'none';
            track.style.transform = 'translateY(0)';
            void track.offsetWidth;
            track.style.transition = '';
          }, 750);
          index = 0;
        }
      }, 2600)
    );
  });
}

/* ---------- Theme ---------- */
function getThemeLabel(theme) {
  const key = theme === 'dark' ? 'toggle-dark' : 'toggle-light';
  return translations[currentLanguage]?.[key] || translations.es[key];
}

function updateThemeButton(theme) {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('.toggle-icon');
  const text = themeToggle.querySelector('.toggle-text');
  const nextIcon = theme === 'dark' ? '🌙' : '☀️';
  if (icon && icon.textContent !== nextIcon) {
    icon.textContent = nextIcon;
    if (initialized) retriggerIconPop(icon);
  }
  if (text) text.textContent = getThemeLabel(theme);
}

function retriggerIconPop(element) {
  element.classList.remove('icon-pop');
  void element.offsetWidth;
  element.classList.add('icon-pop');
}

function setTheme(theme) {
  rootElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_THEME, theme);
  updateThemeButton(theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activate light mode' : 'Activate dark mode');
  }
}

/* ---------- Profile tabs ---------- */
function updateProfileTabs(profile) {
  profileTabs.forEach((tab) => {
    const isActive = tab.dataset.profile === profile;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
}

function showProfilePanel(profile) {
  profilePanels.forEach((panel) => {
    const isActive = panel.dataset.profilePanel === profile;
    if (!isActive) {
      panel.hidden = true;
      panel.classList.remove('is-active', 'is-leaving');
      return;
    }
    panel.classList.remove('is-leaving');
    panel.hidden = false;
    panel.classList.add('is-active');
    revealElements(panel);
  });
}

function setProfile(profile, animate = true) {
  currentProfile = profile;
  localStorage.setItem(STORAGE_PROFILE, profile);
  updateProfileTabs(profile);

  clearTimeout(switchTimer);

  if (!animate) {
    showProfilePanel(profile);
    return;
  }

  const visible = profilePanels.find((panel) => !panel.hidden);
  const alreadyShowing =
    visible &&
    visible.dataset.profilePanel === profile &&
    !visible.classList.contains('is-leaving');

  if (alreadyShowing) return;

  if (visible) visible.classList.add('is-leaving');
  switchTimer = setTimeout(() => showProfilePanel(profile), 150);
}

/* ---------- Scroll reveal (Apple-style) ---------- */
let revealObserver = null;

function revealElements(container) {
  const items = container.querySelectorAll('.reveal, .line-clip');
  items.forEach((element, index) => {
    element.style.transitionDelay = Math.min(index * 60, 240) + 'ms';
    element.classList.remove('in-view');
    if (revealObserver) revealObserver.unobserve(element);
  });
  if (items.length) void container.offsetWidth;
  items.forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add('in-view');
    }
  });
}

function setupReveal() {
  if (typeof IntersectionObserver === 'undefined') {
    document
      .querySelectorAll('.reveal, .line-clip')
      .forEach((element) => element.classList.add('in-view'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
  );
  revealElements(document);
}

/* ---------- Toolbar condense on scroll ---------- */
function handleScroll() {
  if (toolbar) {
    toolbar.classList.toggle('is-scrolled', window.scrollY > 8);
  }
}

/* ---------- Projects (GitHub) ---------- */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function projCardHtml(repo) {
  const desc = repo.description ? `<p class="proj-desc">${escapeHtml(repo.description)}</p>` : '';
  const meta = [];
  if (repo.language) meta.push(`<span class="proj-lang">${escapeHtml(repo.language)}</span>`);
  if (repo.stargazers_count) meta.push(`<span>★ ${repo.stargazers_count}</span>`);
  return `<a class="proj-card reveal" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer noopener">
      <span class="proj-top"><span class="proj-name">${escapeHtml(repo.name)}</span><span class="proj-arrow" aria-hidden="true">↗</span></span>
      ${desc}
      <span class="proj-meta">${meta.join('')}</span>
    </a>`;
}

function projectsFallbackHtml() {
  const message = translations[currentLanguage]?.['projects-empty'] || '';
  return `<a class="proj-card reveal" href="https://github.com/cxsar348" target="_blank" rel="noreferrer noopener">
      <span class="proj-top"><span class="proj-name">GitHub · @cxsar348</span><span class="proj-arrow" aria-hidden="true">↗</span></span>
      <p class="proj-desc">${escapeHtml(message)}</p>
      <span class="proj-meta"><span class="proj-lang">GitHub</span></span>
    </a>`;
}

function revealNewNodes() {
  const nodes = document.querySelectorAll('.proj-card.reveal:not(.in-view)');
  if (revealObserver) {
    nodes.forEach((node) => revealObserver.observe(node));
  } else {
    nodes.forEach((node) => node.classList.add('in-view'));
  }
}

function renderProjects() {
  const lists = document.querySelectorAll('.proj-list');
  if (!lists.length) return;
  const html = cachedProjects && cachedProjects.length
    ? cachedProjects.map(projCardHtml).join('')
    : projectsFallbackHtml();
  lists.forEach((list) => {
    list.innerHTML = html;
  });
  revealNewNodes();
}

function loadProjects() {
  const list = document.querySelector('.proj-list');
  if (!list) return;
  const user = list.dataset.github || 'cxsar348';
  const loading = translations[currentLanguage]?.['projects-loading'] || '';
  document.querySelectorAll('.proj-list').forEach((el) => {
    el.innerHTML = `<p class="proj-loading">${escapeHtml(loading)}</p>`;
  });

  if (typeof fetch !== 'function') {
    cachedProjects = [];
    projectsLoaded = true;
    renderProjects();
    return;
  }

  fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`)
    .then((response) => {
      if (!response.ok) throw new Error('GitHub request failed');
      return response.json();
    })
    .then((repos) => {
      cachedProjects = (Array.isArray(repos) ? repos : [])
        .filter((repo) => !repo.fork)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
        .slice(0, 6);
      projectsLoaded = true;
      renderProjects();
    })
    .catch(() => {
      cachedProjects = [];
      projectsLoaded = true;
      renderProjects();
    });
}

/* ---------- Print / export PDF ---------- */
function exportProfilePdf() {
  const previousTitle = document.title;
  const fileBase = 'Cesar_Paredes_CV_' + (currentProfile === 'tech' ? 'Tech' : 'Administrativo');
  document.title = fileBase;
  window.print();
  window.addEventListener(
    'afterprint',
    () => {
      document.title = previousTitle;
    },
    { once: true }
  );
}

/* ---------- Initialization ---------- */
function init() {
  if (started) return;
  started = true;

  const savedTheme = localStorage.getItem(STORAGE_THEME);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  const savedLanguage = localStorage.getItem(STORAGE_LANGUAGE) || 'es';
  setLanguage(savedLanguage);

  const savedProfile = localStorage.getItem(STORAGE_PROFILE) || 'tech';
  setProfile(savedProfile, false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = rootElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      setLanguage(currentLanguage === 'en' ? 'es' : 'en');
    });
  }

  profileTabs.forEach((tab) => {
    tab.addEventListener('click', () => setProfile(tab.dataset.profile));
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', exportProfilePdf);
  }

  setupReveal();
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  loadProjects();

  initialized = true;
}

document.addEventListener('DOMContentLoaded', init);
