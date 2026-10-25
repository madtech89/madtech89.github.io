/**
 * MADTECH SHOWCASE - MAIN JAVASCRIPT ENGINE
 * Handles dynamic content loading from data/content.json or LocalStorage,
 * Project filtering, typing animation, modals, and interaction states.
 */

// Global Application State
window.appData = null;

// Fallback data in case of file:// protocol or offline access
const DEFAULT_DATA = {
  profile: {
    brandName: "MadTech",
    name: "Mehmet Ali Dağ",
    title: "Full Stack Yazılım Geliştirici & Dijital Çözüm Uzmanı",
    typedTitles: [
      "Full Stack Web Geliştirici",
      "Modern Web & Mobil Çözümleri",
      "UI/UX & Frontend Tasarımı",
      "Yüksek Performanslı Web Siteleri"
    ],
    shortBio: "Modern, hızlı ve estetik dijital deneyimler tasarlıyor; fikirlerinizi web dünyasında fark yaratan projelere dönüştürüyorum.",
    aboutText: "Merhaba! Yazılım geliştirme ve modern web teknolojileri alanında kullanıcı odaklı, ölçeklenebilir ve yüksek performanslı çözümler üretiyorum. Kurumsal web sitelerinden SaaS platformlarına, e-ticaret sistemlerinden API entegrasyonlarına kadar uçtan uca modern mimariler inşa ediyorum.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    phone: "+90 555 123 45 67",
    whatsapp: "905551234567",
    email: "iletisim@madtech.dev",
    location: "İstanbul, Türkiye",
    status: "Yeni Projelere Açık 🚀",
    cvUrl: "#"
  },
  stats: [
    { value: "25+", label: "Tamamlanan Proje" },
    { value: "5+", label: "Yıllık Deneyim" },
    { value: "100%", label: "Müşteri Memnuniyeti" },
    { value: "15+", label: "Aktif Teknoloji" }
  ],
  skills: [
    { name: "HTML5 & Modern CSS3", category: "frontend", level: 98, icon: "fa-brands fa-html5" },
    { name: "JavaScript (ES6+) & TypeScript", category: "frontend", level: 94, icon: "fa-brands fa-js" },
    { name: "React.js & Next.js", category: "frontend", level: 90, icon: "fa-brands fa-react" },
    { name: "Tailwind CSS & SASS", category: "frontend", level: 92, icon: "fa-solid fa-palette" },
    { name: "Node.js & Express", category: "backend", level: 88, icon: "fa-brands fa-node-js" },
    { name: "Python & FastAPI / Django", category: "backend", level: 82, icon: "fa-brands fa-python" },
    { name: "RESTful API & GraphQL", category: "backend", level: 90, icon: "fa-solid fa-server" },
    { name: "PostgreSQL & MongoDB", category: "database", level: 85, icon: "fa-solid fa-database" },
    { name: "Git & GitHub / CI-CD", category: "tools", level: 92, icon: "fa-brands fa-git-alt" },
    { name: "UI/UX & Figma", category: "tools", level: 86, icon: "fa-brands fa-figma" }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Nova SaaS Dashboard & Analytics",
      category: "web",
      summary: "Modern fintek ve veri analitiği sağlayan gerçek zamanlı SaaS yönetim paneli ve analiz arayüzü.",
      description: "Kullanıcıların finansal metriklerini, gelir raporlarını ve kullanıcı hareketlerini interaktif grafiklerle takip edebildiği yüksek hızlı analitik platformu. WebSocket desteğiyle anlık veri akışı ve özel dashboard widget'ları içerir.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
      liveUrl: "https://madtechstudio.github.io",
      githubUrl: "https://github.com/madtechstudio",
      featured: true
    },
    {
      id: "proj-2",
      title: "Aura E-Ticaret & Alışveriş Platformu",
      category: "ecommerce",
      summary: "Minimalist ve lüks giyim markaları için geliştirilmiş ultra hızlı e-ticaret vitrini ve sepet sistemi.",
      description: "Mobil öncelikli tasarıma sahip, filtreleme, sepet yönetimi, hızlı ödeme simülasyonu ve karanlık mod desteği sunan yeni nesil e-ticaret çözümü.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      technologies: ["Next.js", "Stripe API", "Node.js", "Zustand"],
      liveUrl: "https://madtechstudio.github.io",
      githubUrl: "https://github.com/madtechstudio",
      featured: true
    },
    {
      id: "proj-3",
      title: "Nexus Kurumsal Şirket Web Sitesi",
      category: "corporate",
      summary: "Yazılım ve danışmanlık ajansı için dinamik servis tanıtımı, referanslar ve teklif alma formu.",
      description: "3D interaktif mikro etkileşimler, glassmorphism estetiği ve dinamik teklif hesaplama modülü barındıran kurumsal tanıtım web sitesi.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
      technologies: ["HTML5", "Modern CSS3", "JavaScript", "GSAP"],
      liveUrl: "https://madtechstudio.github.io",
      githubUrl: "https://github.com/madtechstudio",
      featured: true
    },
    {
      id: "proj-4",
      title: "Kinetix Mobil Egzersiz & Sağlık Takibi",
      category: "mobile",
      summary: "Günlük spor rutinleri, kalori hesabı ve su takibi yapan modern mobil fitness arayüzü.",
      description: "Kullanıcıların antrenman planlarını özelleştirebildiği, sesli rehberlik ve grafiksel haftalık gelişim raporları sunan responsive hibrit mobil web uygulaması.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
      technologies: ["React Native", "Firebase", "Redux", "Expo"],
      liveUrl: "https://madtechstudio.github.io",
      githubUrl: "https://github.com/madtechstudio",
      featured: false
    },
    {
      id: "proj-5",
      title: "Synapse AI Metin & Görsel Üretim Aracı",
      category: "ai",
      summary: "Yapay zeka modellerini tek bir arayüzde birleştiren içerik üreticileri için çok amaçlı asistan.",
      description: "OpenAI ve açık kaynak LLM modellerini kullanarak blog yazıları, kod parçacıkları ve pazarlama metinleri üreten yapay zeka arayüzü ve şablon kütüphanesi.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
      technologies: ["Python", "FastAPI", "OpenAI API", "Tailwind"],
      liveUrl: "https://madtechstudio.github.io",
      githubUrl: "https://github.com/madtechstudio",
      featured: false
    },
    {
      id: "proj-6",
      title: "Pulse Kripto Portföy & Alarm Botu",
      category: "web",
      summary: "Kripto varlıkları canlı takip eden, fiyat uyarıları gönderen ve kâr/zarar analiz eden platform.",
      description: "Binance ve CoinGecko API entegrasyonu ile 500+ kripto para birimini anlık takip eden, Telegram üzerinden fiyat alarmları oluşturan web platformu.",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=900&q=80",
      technologies: ["Vue.js", "WebSocket", "Node.js", "Telegram Bot API"],
      liveUrl: "https://madtechstudio.github.io",
      githubUrl: "https://github.com/madtechstudio",
      featured: false
    }
  ],
  socialLinks: [
    { name: "GitHub", url: "https://github.com/madtechstudio", icon: "fa-brands fa-github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "fa-brands fa-linkedin-in" },
    { name: "WhatsApp", url: "https://wa.me/905551234567", icon: "fa-brands fa-whatsapp" },
    { name: "Instagram", url: "https://instagram.com", icon: "fa-brands fa-instagram" },
    { name: "E-Posta", url: "mailto:iletisim@madtech.dev", icon: "fa-solid fa-envelope" }
  ],
  seo: {
    siteTitle: "MadTech Studio | Modern Portfolyo & Proje Tanıtım Vitrini",
    metaDescription: "MadTech Studio kişisel portfolyo ve proje vitrini. Geliştirdiğim web siteleri, SaaS projeleri ve iletişim bilgileri.",
    keywords: "madtech, madtech studio, web geliştirici, portfolyo, web siteleri, yazılım geliştirici, frontend, backend"
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await loadApplicationData();
  renderApp();
  initTypingEffect();
  initNavbarScroll();
  initMobileMenu();
  initContactForm();
});

// Load Content from LocalStorage (if previewing from Admin) or data/content.json
async function loadApplicationData() {
  // Check if preview data exists in localStorage
  const localData = localStorage.getItem('madtech_site_data');
  if (localData) {
    try {
      window.appData = JSON.parse(localData);
      console.log('App loaded from local preview cache.');
      return;
    } catch (e) {
      console.warn('Could not parse local data:', e);
    }
  }

  // Fetch data/content.json
  try {
    const res = await fetch('data/content.json?v=' + Date.now());
    if (!res.ok) throw new Error('Data file fetch error: ' + res.status);
    window.appData = await res.json();
    console.log('App loaded from data/content.json');
  } catch (err) {
    console.warn('Falling back to default embedded data:', err);
    window.appData = DEFAULT_DATA;
  }
}

// Render all components
function renderApp() {
  const data = window.appData || DEFAULT_DATA;

  // SEO
  if (data.seo) {
    if (data.seo.siteTitle) document.title = data.seo.siteTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.seo.metaDescription) metaDesc.setAttribute('content', data.seo.metaDescription);
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && data.seo.keywords) metaKeywords.setAttribute('content', data.seo.keywords);
  }

  // Brand & Profile
  const profile = data.profile || {};
  setText('brand-name', profile.brandName || 'MadTech');
  setText('brand-name-footer', profile.brandName || 'MadTech');
  setText('hero-name', profile.name || 'Mehmet Ali');
  setText('hero-bio', profile.shortBio || '');
  setText('about-text', profile.aboutText || '');
  setText('profile-card-name', profile.name || '');
  setText('profile-card-title', profile.title || '');
  setText('status-text', profile.status || 'Yeni Projelere Açık');

  // Brand Logo
  const logoUrl = profile.logo || 'assets/logo.jpg';
  const logoImgs = document.querySelectorAll('.logo-img');
  logoImgs.forEach(img => {
    img.src = logoUrl;
  });

  // Favicon dynamic sync
  const favIcon = document.querySelector('link[rel="icon"]');
  if (favIcon && logoUrl) {
    favIcon.href = logoUrl;
  }

  // Avatar
  const avatarImg = document.getElementById('profile-avatar');
  if (avatarImg && profile.avatar) {
    avatarImg.src = profile.avatar;
    avatarImg.alt = profile.name || 'Profil Fotoğrafı';
    const wrapper = avatarImg.closest('.avatar-wrapper');
    if (wrapper) {
      if (profile.avatar.includes('logo')) {
        wrapper.classList.add('has-logo-avatar');
      } else {
        wrapper.classList.remove('has-logo-avatar');
      }
    }
  }

  // Contact Info
  setText('contact-phone-text', profile.phone || '');
  setHref('contact-phone-link', profile.phone ? `tel:${profile.phone.replace(/\s+/g, '')}` : '#');

  const cleanWa = (profile.whatsapp || '').replace(/[^0-9]/g, '');
  const waUrl = cleanWa ? `https://wa.me/${cleanWa}?text=Merhaba%2C%20web%20sitenizden%20ula%C5%9F%C4%B1yorum.` : '#';
  setText('contact-wa-text', profile.whatsapp ? `+${cleanWa}` : '');
  setHref('contact-wa-link', waUrl);
  setHref('floating-wa-btn', waUrl);

  setText('contact-email-text', profile.email || '');
  setHref('contact-email-link', profile.email ? `mailto:${profile.email}` : '#');
  setText('contact-location-text', profile.location || 'Türkiye');

  // Stats
  renderStats(data.stats || []);

  // Projects
  renderProjects(data.projects || [], 'all');
  initFilterTabs();

  // Skills
  renderSkills(data.skills || []);

  // Social Links
  renderSocialLinks(data.socialLinks || []);

  // Quick info
  setText('quick-phone', profile.phone || '');
  setText('quick-email', profile.email || '');
  setText('current-year', new Date().getFullYear());
}

// Helpers
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHref(id, url) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('href', url);
}

// Render Stats
function renderStats(stats) {
  const container = document.getElementById('stats-grid');
  if (!container) return;
  container.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-number">${escapeHtml(s.value)}</div>
      <div class="stat-label">${escapeHtml(s.label)}</div>
    </div>
  `).join('');
}

// Render Projects
function renderProjects(projects, activeCategory) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
        <h3>Bu kategoride henüz proje bulunmuyor.</h3>
        <p>Admin panelinden yeni proje ekleyebilirsiniz.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-category="${p.category}" id="card-${p.id}">
      <div class="project-img-box">
        <img src="${escapeHtml(p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80')}" alt="${escapeHtml(p.title)}" loading="lazy">
        <span class="project-category-tag">${getCategoryName(p.category)}</span>
        ${p.featured ? '<span class="project-badge-featured">Öne Çıkan</span>' : ''}
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-summary">${escapeHtml(p.summary || '')}</p>
        <div class="project-techs">
          ${(p.technologies || []).map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-actions">
          ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-primary"><i class="fa-solid fa-arrow-up-right-from-square"></i> Canlı Site</a>` : ''}
          <button class="btn-card-icon" title="Detayları İncele" onclick="openProjectModal('${p.id}')">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-icon" title="Kaynak Kod (GitHub)"><i class="fa-brands fa-github"></i></a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryName(cat) {
  const map = {
    web: 'Web Sitesi',
    ecommerce: 'E-Ticaret',
    corporate: 'Kurumsal',
    mobile: 'Mobil Uygulama',
    ai: 'Yapay Zeka',
    other: 'Diğer'
  };
  return map[cat] || cat;
}

// Project Filter Buttons
function initFilterTabs() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      const projects = (window.appData && window.appData.projects) ? window.appData.projects : DEFAULT_DATA.projects;
      renderProjects(projects, cat);
    });
  });
}

// Render Skills
function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.innerHTML = skills.map(s => `
    <div class="skill-card">
      <div class="skill-header">
        <div class="skill-icon-name">
          <div class="skill-icon">
            <i class="${escapeHtml(s.icon || 'fa-solid fa-code')}"></i>
          </div>
          <span class="skill-name">${escapeHtml(s.name)}</span>
        </div>
        <span class="skill-percentage">${s.level || 90}%</span>
      </div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" style="width: ${s.level || 90}%;"></div>
      </div>
    </div>
  `).join('');
}

// Render Social Links
function renderSocialLinks(links) {
  const container = document.getElementById('social-links-bar');
  const footerContainer = document.getElementById('footer-socials');
  
  const html = links.map(l => `
    <a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="social-btn" title="${escapeHtml(l.name)}">
      <i class="${escapeHtml(l.icon || 'fa-solid fa-link')}"></i>
    </a>
  `).join('');

  if (container) container.innerHTML = html;
  if (footerContainer) footerContainer.innerHTML = html;
}

// Typing Effect in Hero
function initTypingEffect() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const data = window.appData || DEFAULT_DATA;
  const words = (data.profile && data.profile.typedTitles && data.profile.typedTitles.length > 0)
    ? data.profile.typedTitles
    : ["Full Stack Geliştirici", "Modern Web Siteleri", "UI/UX & Kodlama"];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// Navbar Scroll Effect
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (navbar) navbar.classList.add('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.add('visible');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

// Project Details Modal
window.openProjectModal = function(id) {
  const data = window.appData || DEFAULT_DATA;
  const project = (data.projects || []).find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTechs = document.getElementById('modal-techs');
  const modalLive = document.getElementById('modal-live-link');
  const modalGithub = document.getElementById('modal-github-link');

  if (modalImg) modalImg.src = project.image;
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalDesc) modalDesc.textContent = project.description || project.summary;
  
  if (modalTechs) {
    modalTechs.innerHTML = (project.technologies || []).map(t => `
      <span class="tech-badge" style="font-size: 0.85rem; padding: 6px 12px;">${escapeHtml(t)}</span>
    `).join('');
  }

  if (modalLive) {
    if (project.liveUrl) {
      modalLive.style.display = 'inline-flex';
      modalLive.href = project.liveUrl;
    } else {
      modalLive.style.display = 'none';
    }
  }

  if (modalGithub) {
    if (project.githubUrl) {
      modalGithub.style.display = 'inline-flex';
      modalGithub.href = project.githubUrl;
    } else {
      modalGithub.style.display = 'none';
    }
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal on click outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (modal && e.target === modal) {
    closeProjectModal();
  }
});

// Contact Form Handler
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const subject = document.getElementById('form-subject')?.value.trim();
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !message) {
      showToast('Lütfen adınızı ve mesajınızı doldurun.', 'error');
      return;
    }

    const data = window.appData || DEFAULT_DATA;
    const cleanWa = (data.profile?.whatsapp || '905551234567').replace(/[^0-9]/g, '');

    const waText = `*MadTech İletişim Formu*%0A%0A*İsim:* ${encodeURIComponent(name)}%0A*E-posta:* ${encodeURIComponent(email || '-')}%0A*Konu:* ${encodeURIComponent(subject || 'Genel Proje Talebi')}%0A*Mesaj:* ${encodeURIComponent(message)}`;
    
    // Open WhatsApp directly with the filled message!
    const waUrl = `https://wa.me/${cleanWa}?text=${waText}`;
    window.open(waUrl, '_blank');

    showToast('Mesajınız hazırlandı! WhatsApp açılıyor...', 'success');
    form.reset();
  });
}

// Toast notification helper
function showToast(text, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}" style="color: ${type === 'success' ? '#10b981' : '#ef4444'};"></i>
    <span>${escapeHtml(text)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// HTML escape for safety
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Stealth Admin Access: Keyboard shortcut (Cmd+Shift+A or Ctrl+Shift+A) & Logo Triple Click
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    window.location.href = 'admin.html';
  }
});

let logoClickCount = 0;
let logoClickTimer = null;
const logoBadge = document.querySelector('.logo-badge');
if (logoBadge) {
  logoBadge.addEventListener('click', (e) => {
    e.preventDefault();
    logoClickCount++;
    clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) {
      window.location.href = 'admin.html';
      logoClickCount = 0;
    } else {
      logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 600);
    }
  });
}
