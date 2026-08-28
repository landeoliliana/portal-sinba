/**
 * Sinba - Portal Interno de Logística
 * Interactive JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarDropdown();
  initSearch();
  initKeyboardShortcuts();
  recalculateImpact();
});

/* ==========================================================================
   CONTROL DE GOOGLE APPS SCRIPT IFRAME
   ========================================================================== */
function hideIframeLoader(loaderId) {
  const loader = document.getElementById(loaderId);
  if (loader) {
    loader.classList.add('hidden');
  }
}

function reloadAppScriptFrame(frameId) {
  const frame = document.getElementById(frameId);
  const loader = document.getElementById('iframe-loader');
  if (frame) {
    if (loader) loader.classList.remove('hidden');
    frame.src = frame.src; // Trigger refresh
    showToast('🔄 Recargando herramienta de Google Apps Script...');
  }
}
function initNavbarDropdown() {
  const dropdownContainer = document.getElementById('page-dropdown-container');
  const dropdownBtn = document.getElementById('dropdown-nav-btn');

  if (dropdownBtn && dropdownContainer) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownContainer.classList.toggle('open');
      const isExpanded = dropdownContainer.classList.contains('open');
      dropdownBtn.setAttribute('aria-expanded', isExpanded);
    });

    document.addEventListener('click', (e) => {
      if (!dropdownContainer.contains(e.target)) {
        dropdownContainer.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   GESTIÓN DE MODALES
   ========================================================================== */
function openOperationModal() {
  closeModals();
  const modal = document.getElementById('modal-operacion');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function openGestionModal() {
  closeModals();
  const modal = document.getElementById('modal-gestion');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    recalculateImpact();
  }
}

function openSearchModal() {
  closeModals();
  const modal = document.getElementById('modal-search');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('search-input');
    if (input) setTimeout(() => input.focus(), 100);
  }
}

function closeModals() {
  const openModals = document.querySelectorAll('.modal-backdrop.open');
  openModals.forEach(modal => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

// Cierre al presionar fuera del diálogo o con tecla ESC
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    closeModals();
  }
});

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModals();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
  });

  const searchBtn = document.getElementById('btn-search-toggle');
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearchModal);
  }
}

/* ==========================================================================
   PESTAÑAS DE MODALES
   ========================================================================== */
function switchOpTab(tabId) {
  const modal = document.getElementById('modal-operacion');
  if (!modal) return;

  const tabs = modal.querySelectorAll('.tab-btn');
  const panes = modal.querySelectorAll('.tab-pane');

  tabs.forEach(btn => btn.classList.remove('active'));
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.add('active');

  const activeBtn = Array.from(tabs).find(btn => btn.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');
}

function switchGesTab(tabId) {
  const modal = document.getElementById('modal-gestion');
  if (!modal) return;

  const tabs = modal.querySelectorAll('.tab-btn');
  const panes = modal.querySelectorAll('.tab-pane');

  tabs.forEach(btn => btn.classList.remove('active'));
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.add('active');

  const activeBtn = Array.from(tabs).find(btn => btn.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');
}

/* ==========================================================================
   CALCULADORA DE IMPACTO AMBIENTAL
   ========================================================================== */
function recalculateImpact() {
  const organicosInput = document.getElementById('calc-organicos');
  const inorganicosInput = document.getElementById('calc-inorganicos');

  const organicos = parseFloat(organicosInput?.value) || 0;
  const inorganicos = parseFloat(inorganicosInput?.value) || 0;

  // Factores oficiales de conversión ecológica estimada
  // 1 kg orgánico = 1.25 kg CO2e evitado
  // 1 kg inorgánico reciclado = 1.65 kg CO2e evitado
  const co2Total = Math.round((organicos * 1.25) + (inorganicos * 1.65));
  
  // 1 árbol absorbe aprox 22 kg CO2 al año
  const arbolesTotal = Math.round(co2Total / 22);

  // Ahorro hídrico en reciclaje
  const aguaTotal = Math.round((organicos * 4.2) + (inorganicos * 16.5));

  const elCo2 = document.getElementById('res-co2');
  const elArboles = document.getElementById('res-arboles');
  const elAgua = document.getElementById('res-agua');

  if (elCo2) elCo2.textContent = `${co2Total.toLocaleString('es-PE')} kg`;
  if (elArboles) elArboles.textContent = `${arbolesTotal.toLocaleString('es-PE')}`;
  if (elAgua) elAgua.textContent = `${aguaTotal.toLocaleString('es-PE')} L`;
}

/* ==========================================================================
   FORMULARIOS Y ACCIONES
   ========================================================================== */
function handleChecklistSubmit(event) {
  event.preventDefault();
  showToast('✓ Checklist Pre-Ruta validado con éxito. Unidad autorizada para despacho.');
  setTimeout(() => {
    closeModals();
  }, 1200);
}

function handleIncidentSubmit(event) {
  event.preventDefault();
  showToast('⚠️ Incidencia registrada y despachada a la mesa de control.');
  event.target.reset();
  setTimeout(() => {
    closeModals();
  }, 1400);
}

function notifyClient(clientName) {
  showToast(`📲 Aviso de llegada enviado a ${clientName} vía WhatsApp.`);
}

function downloadMockDoc(filename) {
  showToast(`📥 Descargando documento: ${filename}`);
}

/* ==========================================================================
   BÚSQUEDA INTERACTIVA
   ========================================================================== */
const searchableItems = [
  { title: 'Monitoreo de Rutas del día', category: 'Herramientas de Operación', icon: '🗺️', action: () => { window.location.href = 'operacion.html'; } },
  { title: 'Checklist Pre-Operacional', category: 'Herramientas de Operación', icon: '📋', action: () => { window.location.href = 'operacion.html'; } },
  { title: 'Reporte de Incidencias en Ruta', category: 'Herramientas de Operación', icon: '⚠️', action: () => { window.location.href = 'operacion.html'; } },
  { title: 'Control de Pesaje de Recolección', category: 'Herramientas de Operación', icon: '⚖️', action: () => { window.location.href = 'operacion.html'; } },
  { title: 'Contacto y Aviso a Clientes', category: 'Herramientas de Operación', icon: '📱', action: () => { window.location.href = 'operacion.html'; } },
  { title: 'Calculadora de Huella de Carbono', category: 'Herramientas de Gestión', icon: '🌱', action: () => { window.location.href = 'gestion.html'; } },
  { title: 'Indicadores de Flota y KPIs', category: 'Herramientas de Gestión', icon: '📊', action: () => { window.location.href = 'gestion.html'; } },
  { title: 'Manifiestos y Formatos MINAM', category: 'Herramientas de Gestión', icon: '📑', action: () => { window.location.href = 'gestion.html'; } },
  { title: 'Estado y Mantenimiento de Flota', category: 'Herramientas de Gestión', icon: '🚚', action: () => { window.location.href = 'gestion.html'; } },
  { title: 'Certificados de Sostenibilidad', category: 'Herramientas de Gestión', icon: '🏆', action: () => { window.location.href = 'gestion.html'; } },
];

function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }
}

function handleSearch(query) {
  const container = document.getElementById('search-results-list');
  if (!container) return;

  const cleanQuery = query.toLowerCase().trim();

  if (!cleanQuery) {
    container.innerHTML = `
      <div class="search-category-title">Sugerencias rápidas</div>
      ${searchableItems.slice(0, 4).map(item => `
        <div class="search-result-item" onclick="executeSearchResult('${item.title}')">
          <span class="sr-icon">${item.icon}</span>
          <div class="sr-text">
            <strong>${item.title}</strong>
            <span>${item.category}</span>
          </div>
        </div>
      `).join('')}
    `;
    return;
  }

  const matches = searchableItems.filter(item => 
    item.title.toLowerCase().includes(cleanQuery) || 
    item.category.toLowerCase().includes(cleanQuery)
  );

  if (matches.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
        No se encontraron herramientas con "<strong>${escapeHtml(query)}</strong>"
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="search-category-title">Resultados encontrados (${matches.length})</div>
    ${matches.map(item => `
      <div class="search-result-item" onclick="executeSearchResult('${item.title}')">
        <span class="sr-icon">${item.icon}</span>
        <div class="sr-text">
          <strong>${item.title}</strong>
          <span>${item.category}</span>
        </div>
      </div>
    `).join('')}
  `;
}

function executeSearchResult(title) {
  const item = searchableItems.find(i => i.title === title);
  if (item && item.action) {
    item.action();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   INTERACCIÓN PARA PÁGINAS DEDICADAS (operacion.html & gestion.html)
   ========================================================================== */

function activateSection(sectionId) {
  const allSections = document.querySelectorAll('.tool-section-card');
  const allNavBtns = document.querySelectorAll('.tool-nav-item');

  allSections.forEach(sec => sec.classList.remove('active'));
  allNavBtns.forEach(btn => btn.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  const activeBtn = Array.from(allNavBtns).find(btn => 
    btn.getAttribute('onclick')?.includes(sectionId)
  );
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Filtros de Rutas en operacion.html
function filterRoutes(filterType) {
  const filterBtns = document.querySelectorAll('.filter-pill');
  filterBtns.forEach(btn => btn.classList.remove('active'));

  const clickedBtn = Array.from(filterBtns).find(b => b.getAttribute('onclick')?.includes(filterType));
  if (clickedBtn) clickedBtn.classList.add('active');

  const cards = document.querySelectorAll('.route-detail-card');
  cards.forEach(card => {
    if (filterType === 'all') {
      card.style.display = 'flex';
    } else if (filterType === 'en-ruta') {
      card.style.display = card.classList.contains('status-en-ruta') ? 'flex' : 'none';
    } else if (filterType === 'completada') {
      card.style.display = card.classList.contains('status-completada') ? 'flex' : 'none';
    }
  });
}

// Registro Dinámico de Incidencias en operacion.html
function handleNewIncident(event) {
  event.preventDefault();
  const unit = document.getElementById('inc-unit')?.value || 'Unidad';
  const type = document.getElementById('inc-type')?.value || 'Incidencia';
  const client = document.getElementById('inc-client')?.value || 'Punto';
  const priority = document.getElementById('inc-priority')?.value || 'Media';
  const desc = document.getElementById('inc-desc')?.value || '';

  const list = document.getElementById('incident-items-list');
  if (list) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    
    const newCard = document.createElement('div');
    newCard.className = 'incident-item-card';
    newCard.style.borderLeft = '4px solid #E85025';
    newCard.innerHTML = `
      <div class="inc-header">
        <span class="inc-type-tag">${escapeHtml(type)} · ${escapeHtml(priority)}</span>
        <span class="inc-time">${timeStr}</span>
      </div>
      <strong>${escapeHtml(client)} · ${escapeHtml(unit)}</strong>
      <p>${escapeHtml(desc)}</p>
      <span class="inc-status-resolved">⚠️ Despachada a Central</span>
    `;
    list.prepend(newCard);
  }

  showToast('⚠️ Incidencia registrada exitosamente y enviada a monitoreo.');
  event.target.reset();
}

// Cálculo de Peso en operacion.html
function calculateTotalWeight() {
  const org = parseFloat(document.getElementById('w-org')?.value) || 0;
  const inorg = parseFloat(document.getElementById('w-inorg')?.value) || 0;
  const total = (org + inorg).toFixed(2);

  const display = document.getElementById('w-total');
  if (display) {
    display.textContent = `${total} kg`;
  }
}

function handleWeighingSubmit(event) {
  event.preventDefault();
  const client = document.getElementById('w-client')?.value || '';
  const org = parseFloat(document.getElementById('w-org')?.value) || 0;
  const inorg = parseFloat(document.getElementById('w-inorg')?.value) || 0;
  const total = (org + inorg).toFixed(1);

  const tbody = document.getElementById('weighing-table-body');
  if (tbody) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const randomCode = Math.floor(1050 + Math.random() * 50);

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${timeStr}</td>
      <td>${escapeHtml(client)}</td>
      <td>${org.toFixed(1)} kg</td>
      <td>${inorg.toFixed(1)} kg</td>
      <td><strong>${total} kg</strong></td>
      <td><button class="btn-xs btn-outline" onclick="showToast('Descargando Guía #G-${randomCode}')">Ver #G-${randomCode}</button></td>
    `;
    tbody.prepend(newRow);
  }

  showToast(`✓ Guía digital generada para ${client} (${total} kg).`);
  event.target.reset();
  calculateTotalWeight();
}

// Calculadora Avanzada en gestion.html
function recalculateGestionImpact() {
  const org = parseFloat(document.getElementById('ges-calc-org')?.value) || 0;
  const plast = parseFloat(document.getElementById('ges-calc-plast')?.value) || 0;
  const carton = parseFloat(document.getElementById('ges-calc-carton')?.value) || 0;
  const vidrio = parseFloat(document.getElementById('ges-calc-vidrio')?.value) || 0;

  // CO2e factors
  const co2 = Math.round((org * 1.25) + (plast * 1.8) + (carton * 1.4) + (vidrio * 0.6));
  const arboles = Math.round(co2 / 22);
  const agua = Math.round((org * 4.2) + (plast * 22) + (carton * 18) + (vidrio * 2.5));
  const energia = Math.round((plast * 5.6) + (carton * 4.2) + (vidrio * 1.2) + (org * 0.8));

  const elCo2 = document.getElementById('ges-res-co2');
  const elArboles = document.getElementById('ges-res-arboles');
  const elAgua = document.getElementById('ges-res-agua');
  const elEnergia = document.getElementById('ges-res-energia');

  if (elCo2) elCo2.textContent = `${co2.toLocaleString('es-PE')} kg`;
  if (elArboles) elArboles.textContent = `${arboles.toLocaleString('es-PE')}`;
  if (elAgua) elAgua.textContent = `${agua.toLocaleString('es-PE')} L`;
  if (elEnergia) elEnergia.textContent = `${energia.toLocaleString('es-PE')} kWh`;
}

// Filtro de Documentos en gestion.html
function filterDocs(query) {
  const cards = document.querySelectorAll('.doc-archive-card');
  const cleanQ = query.toLowerCase().trim();

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(cleanQ) ? 'flex' : 'none';
  });
}

// Generador de Certificados en gestion.html
function generateCertificate(event) {
  event.preventDefault();
  const client = document.getElementById('cert-client')?.value || 'Cliente Sinba';
  const period = document.getElementById('cert-period')?.value || 'Mes en Curso';
  const kg = parseFloat(document.getElementById('cert-kg')?.value) || 0;

  const card = document.getElementById('cert-preview-card');
  const outClient = document.getElementById('cert-out-client');
  const outKg = document.getElementById('cert-out-kg');
  const outCode = document.getElementById('cert-out-code');

  if (card && outClient && outKg && outCode) {
    outClient.textContent = client;
    outKg.textContent = `${kg.toLocaleString('es-PE')} kg (${period})`;
    outCode.textContent = `SNB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    card.style.display = 'flex';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  showToast(`🏆 Certificado oficial generado para ${client}.`);
}

/* ==========================================================================
   NOTIFICACIONES TOAST
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-msg');

  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

