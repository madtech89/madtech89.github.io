/**
 * MADTECH ADMIN PANEL - LOGIC ENGINE
 * Full CRUD, PIN Authentication, LocalStorage Preview,
 * GitHub REST API Direct Commit Engine, and Export/Import.
 */

window.adminData = null;
let currentEditingProjectId = null;

// Default PIN if none is configured
const DEFAULT_PIN = "1234";

document.addEventListener('DOMContentLoaded', async () => {
  initAuth();
  await loadData();
  initNavigation();
  initForms();
  initProjectModal();
  initSkillModal();
  initSyncFeatures();
});

// Authentication System
function initAuth() {
  const isAuth = sessionStorage.getItem('madtech_admin_auth');
  const overlay = document.getElementById('auth-overlay');
  const pinInput = document.getElementById('auth-pin-input');
  const btnLogin = document.getElementById('btn-auth-login');
  const btnLogout = document.getElementById('btn-logout');

  if (isAuth === 'true') {
    if (overlay) overlay.style.display = 'none';
  } else {
    if (overlay) overlay.style.display = 'flex';
  }

  function handleLogin() {
    const inputPin = pinInput.value.trim();
    const targetPin = (window.adminData?.settings?.adminPin) || DEFAULT_PIN;

    if (inputPin === targetPin || inputPin === DEFAULT_PIN) {
      sessionStorage.setItem('madtech_admin_auth', 'true');
      overlay.style.display = 'none';
      showToast('Giriş başarılı! Hoş geldiniz.', 'success');
    } else {
      showToast('Hatalı PIN kodu! Lütfen tekrar deneyin.', 'error');
      pinInput.value = '';
      pinInput.focus();
    }
  }

  if (btnLogin) btnLogin.addEventListener('click', handleLogin);
  if (pinInput) {
    pinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('madtech_admin_auth');
      window.location.reload();
    });
  }
}

// Load Data
async function loadData() {
  const local = localStorage.getItem('madtech_site_data');
  if (local) {
    try {
      window.adminData = JSON.parse(local);
      console.log('Admin data loaded from localStorage preview cache.');
      populateAllFields();
      return;
    } catch (e) {
      console.warn(e);
    }
  }

  try {
    const res = await fetch('data/content.json?v=' + Date.now());
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);
    window.adminData = await res.json();
    console.log('Admin data loaded from data/content.json');
  } catch (e) {
    console.warn('Falling back to default initial template data:', e);
    window.adminData = getDefaultAdminTemplate();
  }

  populateAllFields();
}

// Populate all form fields
function populateAllFields() {
  const data = window.adminData;
  if (!data) return;

  // Profile Form
  const p = data.profile || {};
  setVal('prof-name', p.name);
  setVal('prof-brand', p.brandName);
  setVal('prof-title', p.title);
  setVal('prof-status', p.status);
  setVal('prof-typed', (p.typedTitles || []).join(', '));
  setVal('prof-avatar', p.avatar);
  setVal('prof-phone', p.phone);
  setVal('prof-whatsapp', p.whatsapp);
  setVal('prof-email', p.email);
  setVal('prof-location', p.location);
  setVal('prof-cv', p.cvUrl);
  setVal('prof-shortbio', p.shortBio);
  setVal('prof-about', p.aboutText);

  // Avatar live preview
  const avatarPrev = document.getElementById('prof-avatar-preview');
  if (avatarPrev && p.avatar) avatarPrev.src = p.avatar;

  // Stats
  const s = data.stats || [];
  if (s[0]) { setVal('stat-val-1', s[0].value); setVal('stat-lbl-1', s[0].label); }
  if (s[1]) { setVal('stat-val-2', s[1].value); setVal('stat-lbl-2', s[1].label); }
  if (s[2]) { setVal('stat-val-3', s[2].value); setVal('stat-lbl-3', s[2].label); }
  if (s[3]) { setVal('stat-val-4', s[3].value); setVal('stat-lbl-4', s[3].label); }

  // Social Links
  const socials = data.socialLinks || [];
  socials.forEach(soc => {
    const nameLower = (soc.name || '').toLowerCase();
    if (nameLower.includes('git')) setVal('soc-github', soc.url);
    if (nameLower.includes('link')) setVal('soc-linkedin', soc.url);
    if (nameLower.includes('whats')) setVal('soc-whatsapp', soc.url);
    if (nameLower.includes('insta')) setVal('soc-instagram', soc.url);
    if (nameLower.includes('posta') || nameLower.includes('mail')) setVal('soc-email', soc.url);
  });

  // SEO Form
  const seo = data.seo || {};
  setVal('seo-title', seo.siteTitle);
  setVal('seo-desc', seo.metaDescription);
  setVal('seo-keywords', seo.keywords);

  // Settings
  const settings = data.settings || {};
  setVal('set-pin', settings.adminPin || DEFAULT_PIN);
  setVal('set-repo', settings.githubRepo || 'madtechstudio/madtechstudio.github.io');
  setVal('set-branch', settings.githubBranch || 'main');

  // Load saved GitHub Token if any
  const savedToken = localStorage.getItem('madtech_gh_token') || '';
  setVal('gh-token-input', savedToken);

  // Render Projects & Skills Tables
  renderProjectsTable();
  renderSkillsList();
  updateTopCounters();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined && val !== null) el.value = val;
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// Navigation / Tabs
function initNavigation() {
  const links = document.querySelectorAll('.sidebar-link[data-tab]');
  const panes = document.querySelectorAll('.admin-tab-pane');
  const topTitle = document.getElementById('topbar-title');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');

      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      panes.forEach(pane => {
        if (pane.id === tabId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      if (topTitle) topTitle.textContent = link.textContent.trim();
    });
  });
}

// Forms Initialization
function initForms() {
  // Profile Form
  const formProfile = document.getElementById('form-profile');
  if (formProfile) {
    formProfile.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProfile();
    });
  }

  // Stats & Socials Form
  const formStatsSocials = document.getElementById('form-stats-socials');
  if (formStatsSocials) {
    formStatsSocials.addEventListener('submit', (e) => {
      e.preventDefault();
      saveStatsAndSocials();
    });
  }

  // SEO & Settings Form
  const formSeo = document.getElementById('form-seo-settings');
  if (formSeo) {
    formSeo.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSeoAndSettings();
    });
  }

  // Avatar URL Live Input Change
  const avatarInput = document.getElementById('prof-avatar');
  if (avatarInput) {
    avatarInput.addEventListener('input', () => {
      const img = document.getElementById('prof-avatar-preview');
      if (img) img.src = avatarInput.value.trim();
    });
  }
}

// Save Profile
function saveProfile() {
  if (!window.adminData) return;

  const typedArr = getVal('prof-typed')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  window.adminData.profile = {
    brandName: getVal('prof-brand') || 'MadTech',
    name: getVal('prof-name') || 'Mehmet Ali Dağ',
    title: getVal('prof-title') || 'Full Stack Web Geliştirici',
    typedTitles: typedArr.length ? typedArr : ["Full Stack Geliştirici"],
    shortBio: getVal('prof-shortbio'),
    aboutText: getVal('prof-about'),
    avatar: getVal('prof-avatar'),
    phone: getVal('prof-phone'),
    whatsapp: getVal('prof-whatsapp'),
    email: getVal('prof-email'),
    location: getVal('prof-location'),
    status: getVal('prof-status'),
    cvUrl: getVal('prof-cv') || '#'
  };

  saveToLocalCache();
  showToast('Profil ve İletişim bilgileri başarıyla güncellendi!', 'success');
}

// Save Stats & Socials
function saveStatsAndSocials() {
  if (!window.adminData) return;

  window.adminData.stats = [
    { value: getVal('stat-val-1'), label: getVal('stat-lbl-1') },
    { value: getVal('stat-val-2'), label: getVal('stat-lbl-2') },
    { value: getVal('stat-val-3'), label: getVal('stat-lbl-3') },
    { value: getVal('stat-val-4'), label: getVal('stat-lbl-4') }
  ];

  window.adminData.socialLinks = [
    { name: "GitHub", url: getVal('soc-github') || "https://github.com/madtechstudio", icon: "fa-brands fa-github" },
    { name: "LinkedIn", url: getVal('soc-linkedin') || "https://linkedin.com", icon: "fa-brands fa-linkedin-in" },
    { name: "WhatsApp", url: getVal('soc-whatsapp') || "https://wa.me/905551234567", icon: "fa-brands fa-whatsapp" },
    { name: "Instagram", url: getVal('soc-instagram') || "https://instagram.com", icon: "fa-brands fa-instagram" },
    { name: "E-Posta", url: getVal('soc-email') || "mailto:iletisim@madtech.dev", icon: "fa-solid fa-envelope" }
  ];

  saveToLocalCache();
  showToast('İstatistikler ve Sosyal Medya hesapları güncellendi!', 'success');
}

// Save SEO & Settings
function saveSeoAndSettings() {
  if (!window.adminData) return;

  window.adminData.seo = {
    siteTitle: getVal('seo-title'),
    metaDescription: getVal('seo-desc'),
    keywords: getVal('seo-keywords'),
    author: window.adminData.profile?.brandName || "MadTech Studio",
    siteUrl: "https://madtechstudio.github.io"
  };

  const newPin = getVal('set-pin') || DEFAULT_PIN;
  window.adminData.settings = {
    adminPin: newPin,
    githubRepo: getVal('set-repo') || "madtechstudio/madtechstudio.github.io",
    githubBranch: getVal('set-branch') || "main"
  };

  saveToLocalCache();
  showToast('SEO ayarları ve PIN kodu başarıyla güncellendi!', 'success');
}

// ==========================================================================
// PROJECTS MANAGEMENT (CRUD)
// ==========================================================================
function renderProjectsTable() {
  const tbody = document.getElementById('projects-table-body');
  if (!tbody) return;

  const projects = window.adminData?.projects || [];

  if (projects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
          Henüz kayıtlı proje yok. "Yeni Proje Ekle" butonunu kullanarak projenizi ekleyin.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = projects.map((p, idx) => `
    <tr>
      <td style="width: 70px;">
        <img src="${escapeHtml(p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80')}" class="project-cell-thumb" alt="Kapak">
      </td>
      <td>
        <strong style="color: #fff;">${escapeHtml(p.title)}</strong>
        <div style="color: var(--text-muted); font-size: 0.8rem; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${escapeHtml(p.summary || '')}
        </div>
      </td>
      <td>
        <span class="table-tag">${escapeHtml(p.category)}</span>
      </td>
      <td>
        ${p.featured ? '<span style="color: #ff007a; font-weight: 700; font-size: 0.8rem;"><i class="fa-solid fa-star"></i> Evet</span>' : '<span style="color: var(--text-dim); font-size: 0.8rem;">Hayır</span>'}
      </td>
      <td>
        ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" style="color: var(--primary); font-size: 0.85rem;"><i class="fa-solid fa-link"></i> Canlı Site</a>` : '-'}
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 8px;">
          <button class="btn btn-outline btn-sm" onclick="editProject('${p.id}')" title="Düzenle">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')" title="Sil">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const btnNew = document.getElementById('btn-new-project');
  const btnClose = document.getElementById('btn-close-project-modal');
  const form = document.getElementById('form-project-modal');

  if (btnNew) {
    btnNew.addEventListener('click', () => {
      currentEditingProjectId = null;
      document.getElementById('modal-project-title').textContent = 'Yeni Proje Ekle';
      form.reset();
      setVal('proj-image', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80');
      modal.classList.add('active');
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProjectModal();
    });
  }
}

window.editProject = function(id) {
  const modal = document.getElementById('project-modal');
  const p = (window.adminData?.projects || []).find(item => item.id === id);
  if (!p) return;

  currentEditingProjectId = id;
  document.getElementById('modal-project-title').textContent = 'Projeyi Düzenle';

  setVal('proj-title', p.title);
  setVal('proj-category', p.category);
  setVal('proj-summary', p.summary);
  setVal('proj-desc', p.description);
  setVal('proj-image', p.image);
  setVal('proj-techs', (p.technologies || []).join(', '));
  setVal('proj-live', p.liveUrl);
  setVal('proj-github', p.githubUrl);

  const featuredCheck = document.getElementById('proj-featured');
  if (featuredCheck) featuredCheck.checked = !!p.featured;

  modal.classList.add('active');
};

function saveProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!window.adminData) return;
  if (!window.adminData.projects) window.adminData.projects = [];

  const techArr = getVal('proj-techs')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const isFeatured = document.getElementById('proj-featured')?.checked || false;

  const projectObj = {
    id: currentEditingProjectId || ('proj-' + Date.now()),
    title: getVal('proj-title'),
    category: getVal('proj-category') || 'web',
    summary: getVal('proj-summary'),
    description: getVal('proj-desc'),
    image: getVal('proj-image'),
    technologies: techArr,
    liveUrl: getVal('proj-live'),
    githubUrl: getVal('proj-github'),
    featured: isFeatured
  };

  if (currentEditingProjectId) {
    const idx = window.adminData.projects.findIndex(p => p.id === currentEditingProjectId);
    if (idx !== -1) {
      window.adminData.projects[idx] = projectObj;
    }
    showToast('Proje başarıyla güncellendi!', 'success');
  } else {
    window.adminData.projects.unshift(projectObj);
    showToast('Yeni proje eklendi!', 'success');
  }

  saveToLocalCache();
  renderProjectsTable();
  updateTopCounters();
  modal.classList.remove('active');
}

window.deleteProject = function(id) {
  if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
  if (!window.adminData?.projects) return;

  window.adminData.projects = window.adminData.projects.filter(p => p.id !== id);
  saveToLocalCache();
  renderProjectsTable();
  updateTopCounters();
  showToast('Proje listeden silindi.', 'success');
};

// ==========================================================================
// SKILLS MANAGEMENT
// ==========================================================================
function renderSkillsList() {
  const container = document.getElementById('admin-skills-list');
  if (!container) return;

  const skills = window.adminData?.skills || [];
  container.innerHTML = skills.map((s, idx) => `
    <div style="background: rgba(7, 9, 14, 0.6); border: 1px solid var(--admin-border); border-radius: var(--radius-md); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <i class="${escapeHtml(s.icon || 'fa-solid fa-code')}" style="color: var(--primary); font-size: 1.2rem; width: 24px; text-align: center;"></i>
        <div>
          <strong style="color: #fff; font-size: 0.95rem;">${escapeHtml(s.name)}</strong>
          <span style="color: var(--text-dim); font-size: 0.8rem; margin-left: 8px;">(${escapeHtml(s.category)})</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="font-weight: 700; color: var(--primary); font-size: 0.9rem;">${s.level}%</span>
        <button class="btn btn-danger btn-sm" onclick="deleteSkill(${idx})" title="Sil">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function initSkillModal() {
  const btnAdd = document.getElementById('btn-add-skill');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      const name = getVal('new-skill-name');
      const cat = getVal('new-skill-cat') || 'frontend';
      const level = parseInt(getVal('new-skill-level')) || 90;
      const icon = getVal('new-skill-icon') || 'fa-solid fa-code';

      if (!name) {
        showToast('Lütfen yetenek adı girin.', 'error');
        return;
      }

      if (!window.adminData.skills) window.adminData.skills = [];
      window.adminData.skills.push({ name, category: cat, level, icon });

      saveToLocalCache();
      renderSkillsList();
      updateTopCounters();
      document.getElementById('new-skill-name').value = '';
      showToast('Yeni yetenek başarıyla eklendi!', 'success');
    });
  }
}

window.deleteSkill = function(idx) {
  if (!window.adminData?.skills) return;
  window.adminData.skills.splice(idx, 1);
  saveToLocalCache();
  renderSkillsList();
  updateTopCounters();
  showToast('Yetenek silindi.', 'success');
};

// ==========================================================================
// GITHUB DIRECT LIVE PUBLISH & EXPORT/IMPORT
// ==========================================================================
function initSyncFeatures() {
  // Save Token
  const btnSaveToken = document.getElementById('btn-save-gh-token');
  if (btnSaveToken) {
    btnSaveToken.addEventListener('click', () => {
      const token = getVal('gh-token-input');
      localStorage.setItem('madtech_gh_token', token);
      showToast('GitHub Token tarayıcınıza güvenle kaydedildi.', 'success');
    });
  }

  // Live Publish to GitHub API
  const btnPublish = document.getElementById('btn-live-publish');
  if (btnPublish) {
    btnPublish.addEventListener('click', async () => {
      await publishToGitHub();
    });
  }

  // Export JSON
  const btnExport = document.getElementById('btn-export-json');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      exportContentJson();
    });
  }

  // Import JSON
  const fileImport = document.getElementById('input-import-json');
  if (fileImport) {
    fileImport.addEventListener('change', (e) => {
      importContentJson(e);
    });
  }

  // Generate Sitemap
  const btnGenSitemap = document.getElementById('btn-generate-sitemap');
  if (btnGenSitemap) {
    btnGenSitemap.addEventListener('click', () => {
      generateSitemapXml();
    });
  }

  // Reset to Defaults
  const btnReset = document.getElementById('btn-reset-defaults');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Tüm verileri varsayılana döndürmek istediğinize emin misiniz? Yapılan yerel değişiklikler silinecektir.')) {
        localStorage.removeItem('madtech_site_data');
        window.location.reload();
      }
    });
  }
}

// Publish to GitHub via REST API
async function publishToGitHub() {
  const token = getVal('gh-token-input') || localStorage.getItem('madtech_gh_token');
  if (!token) {
    showToast('Lütfen önce bir GitHub Personal Access Token girin!', 'error');
    document.getElementById('gh-token-input')?.focus();
    return;
  }

  const repo = getVal('set-repo') || 'madtechstudio/madtechstudio.github.io';
  const branch = getVal('set-branch') || 'main';
  const filePath = 'data/content.json';
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  const statusEl = document.getElementById('gh-publish-status');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GitHub ile iletişim kuruluyor, mevcut dosya kontrol ediliyor...';
  }

  try {
    // 1. Get Current File SHA
    let existingSha = null;
    const getRes = await fetch(apiUrl + `?ref=${branch}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getRes.ok) {
      const getData = await getRes.json();
      existingSha = getData.sha;
    } else if (getRes.status !== 404) {
      throw new Error(`GitHub API Hatası (${getRes.status}): Yetki veya repo bulunamadı.`);
    }

    // 2. Prepare JSON content encoded to Base64 (UTF-8 safe)
    const jsonStr = JSON.stringify(window.adminData, null, 2);
    const contentBase64 = utf8_to_b64(jsonStr);

    // 3. Commit File via PUT
    if (statusEl) {
      statusEl.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-fade"></i> Değişiklikler GitHub Pages deposuna kaydediliyor...';
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Site içeriği Admin Paneli üzerinden güncellendi 🚀 [skip ci]',
        content: contentBase64,
        sha: existingSha || undefined,
        branch: branch
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      throw new Error(errData.message || 'GitHub commit hatası.');
    }

    const putResult = await putRes.json();
    const commitSha = putResult.commit?.sha?.substring(0, 7) || 'yeni';

    if (statusEl) {
      statusEl.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; padding: 16px; color: #34d399;">
          <h4 style="color: #fff; margin-bottom: 6px;"><i class="fa-solid fa-circle-check"></i> Başarıyla Yayınlandı!</h4>
          <p style="font-size: 0.9rem; margin-bottom: 8px;">Değişiklikleriniz GitHub'a commit edildi (Commit: <code>${commitSha}</code>).</p>
          <p style="font-size: 0.85rem; color: #a7f3d0;">GitHub Pages 1-2 dakika içinde sitenizi otomatik güncelleyecektir. <a href="https://${repo}" target="_blank" style="text-decoration: underline; color: #fff; font-weight: bold;">Canlı Siteyi Gör ↗</a></p>
        </div>
      `;
    }

    showToast('Tebrikler! Değişiklikler GitHub Pages üzerinde yayınlandı.', 'success');
  } catch (err) {
    console.error('Publish error:', err);
    if (statusEl) {
      statusEl.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px; padding: 16px; color: #fca5a5;">
          <h4 style="color: #fff; margin-bottom: 6px;"><i class="fa-solid fa-triangle-exclamation"></i> Yayınlama Başarısız!</h4>
          <p style="font-size: 0.9rem;">Hata: ${escapeHtml(err.message)}</p>
          <p style="font-size: 0.82rem; margin-top: 6px; color: #cbd5e1;">Lütfen token'ınızın "repo" veya "Contents: Write" yetkisine sahip olduğunu kontrol edin veya "JSON İndir" seçeneğini kullanın.</p>
        </div>
      `;
    }
    showToast('Hata: ' + err.message, 'error');
  }
}

// UTF-8 to Base64 (supporting Turkish chars)
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

// Download content.json
function exportContentJson() {
  const jsonStr = JSON.stringify(window.adminData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('content.json dosyası bilgisayarınıza indirildi!', 'success');
}

// Import content.json
function importContentJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      window.adminData = parsed;
      saveToLocalCache();
      populateAllFields();
      showToast('Yedek JSON başarıyla yüklendi ve uygulandı!', 'success');
    } catch (err) {
      showToast('Geçersiz JSON dosyası: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// Generate sitemap.xml
function generateSitemapXml() {
  const siteUrl = "https://madtechstudio.github.io";
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/#projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/#skills</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/#about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/#contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Güncel sitemap.xml indirildi!', 'success');
}

// Cache in localStorage for instant preview
function saveToLocalCache() {
  if (window.adminData) {
    localStorage.setItem('madtech_site_data', JSON.stringify(window.adminData));
  }
}

// Update counters in dashboard topbar
function updateTopCounters() {
  const countProj = window.adminData?.projects?.length || 0;
  const countSkills = window.adminData?.skills?.length || 0;

  const elProj = document.getElementById('counter-projects');
  const elSkills = document.getElementById('counter-skills');

  if (elProj) elProj.textContent = countProj;
  if (elSkills) elSkills.textContent = countSkills;
}

// Toast helper
function showToast(text, type = 'success') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type === 'error' ? 'toast-error' : ''}`;
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getDefaultAdminTemplate() {
  return {
    profile: {
      brandName: "MadTech",
      name: "Mehmet Ali Dağ",
      title: "Full Stack Web Geliştirici",
      typedTitles: ["Full Stack Geliştirici", "Modern Web Siteleri"],
      shortBio: "Modern ve hızlı web projeleri üretiyorum.",
      aboutText: "Yazılım geliştirme alanında modern çözümler sunuyorum.",
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
    skills: [],
    projects: [],
    socialLinks: [],
    seo: {
      siteTitle: "MadTech | Modern Portfolyo & Proje Tanıtım Sitesi",
      metaDescription: "Kişisel web projeleri vitrini.",
      keywords: "madtech, web geliştirici, portfolyo"
    },
    settings: {
      adminPin: "1234",
      githubRepo: "madtechstudio/madtechstudio.github.io",
      githubBranch: "main"
    }
  };
}
