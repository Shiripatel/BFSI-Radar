/**
 * BFSI Compliance Radar Application Controller
 * Handles SPA routes, state management, interactive SVG rendering, assessment, and local storage.
 */

import { sectors, impacts, regulations, assessmentQuestions, newsFeed } from './data.js';
import { exportToCSV, exportToJSON, formatDate, searchMatches } from './utils.js';

// --- State Variables ---
let state = {
    activeView: 'dashboard',
    searchQuery: '',
    filters: {
        sector: 'all',
        jurisdiction: 'all',
        impact: 'all',
        status: 'all'
    },
    sorting: {
        column: 'name',
        direction: 'asc'
    },
    bookmarks: JSON.parse(localStorage.getItem('bfsi-radar-bookmarks')) || [],
    regulationStatuses: JSON.parse(localStorage.getItem('bfsi-radar-statuses')) || {},
    regulationNotes: JSON.parse(localStorage.getItem('bfsi-radar-notes')) || {},
    frameworkSteps: JSON.parse(localStorage.getItem('bfsi-radar-framework-steps')) || {},
    assessmentStep: 0,
    assessmentAnswers: {},
    assessmentCompletions: JSON.parse(localStorage.getItem('bfsi-radar-assessment-completions')) || {},
    selectedPortfolioRegId: null
};

// --- DOM Selector Cache ---
const DOM = {
    body: document.body,
    navItems: document.querySelectorAll('.nav-item'),
    views: document.querySelectorAll('.viewport'),
    themeToggle: document.getElementById('theme-toggle'),
    globalSearch: document.getElementById('global-search'),
    newsBell: document.getElementById('news-bell'),

    // Dashboard view items
    statTotal: document.getElementById('stat-total'),
    statUpcoming: document.getElementById('stat-upcoming'),
    statCritical: document.getElementById('stat-critical'),
    statProgress: document.getElementById('stat-average-progress'),
    miniRadar: document.getElementById('dashboard-mini-radar'),
    subsectorBars: document.getElementById('subsector-bars'),
    impactBars: document.getElementById('impact-bars'),
    newsFeedList: document.getElementById('dashboard-news-feed'),
    dashboardToRadarLink: document.getElementById('dashboard-to-radar-link'),

    // Radar visualizer view items
    fullRadar: document.getElementById('full-radar-canvas'),
    radarTooltip: document.getElementById('radar-tooltip-el'),

    // Database table view items
    filterSector: document.getElementById('filter-sector'),
    filterJurisdiction: document.getElementById('filter-jurisdiction'),
    filterImpact: document.getElementById('filter-impact'),
    filterStatus: document.getElementById('filter-status'),
    btnResetFilters: document.getElementById('btn-reset-filters'),
    btnExportCSV: document.getElementById('btn-export-csv'),
    btnExportJSON: document.getElementById('btn-export-json'),
    tableHeaders: document.querySelectorAll('#regulations-table th[data-sort]'),
    tableBody: document.getElementById('table-body'),

    // Side details drawer
    drawer: document.getElementById('side-drawer'),
    drawerCloseBtn: document.getElementById('drawer-close-btn'),
    drawerBtnClose: document.getElementById('drawer-btn-close'),
    drawerBtnBookmark: document.getElementById('drawer-btn-bookmark'),
    drawerBadgeSector: document.getElementById('drawer-badge-sector'),
    drawerBadgeImpact: document.getElementById('drawer-badge-impact'),
    drawerBadgeStatus: document.getElementById('drawer-badge-status'),
    drawerRegTitle: document.getElementById('drawer-reg-title'),
    drawerRegFullName: document.getElementById('drawer-reg-fullname'),
    drawerRegSummary: document.getElementById('drawer-reg-summary'),
    drawerRegDesc: document.getElementById('drawer-reg-desc'),
    drawerReqList: document.getElementById('drawer-requirements-list'),

    // Self assessment wizard
    wizardSetupPanel: document.getElementById('wizard-setup-panel'),
    wizardResultsPanel: document.getElementById('wizard-results-panel'),
    wizardProgress: document.getElementById('wizard-progress'),
    wizardQuestions: document.getElementById('wizard-questions-container'),
    btnWizardPrev: document.getElementById('btn-wizard-prev'),
    btnWizardNext: document.getElementById('btn-wizard-next'),
    btnWizardRestart: document.getElementById('btn-wizard-restart'),
    wizardResultsSummary: document.getElementById('wizard-results-summary'),
    resultsChecklist: document.getElementById('results-checklist-container'),

    // Portfolio manager
    portfolioList: document.getElementById('portfolio-list'),
    portfolioEmptyState: document.getElementById('portfolio-empty-state'),
    portfolioEditorState: document.getElementById('portfolio-editor-state'),
    portfolioRegTitle: document.getElementById('portfolio-reg-title'),
    portfolioRegFullName: document.getElementById('portfolio-reg-fullname'),
    portfolioNotesText: document.getElementById('portfolio-notes-text'),
    portfolioSaveBtn: document.getElementById('portfolio-save-btn'),
    portfolioStatusButtons: document.querySelectorAll('.status-picker-option')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEventListeners();
    renderApp();
});

// --- Theme Logic ---
function initTheme() {
    const savedTheme = localStorage.getItem('bfsi-radar-theme') || 'dark';
    DOM.body.setAttribute('data-theme', savedTheme);
    updateThemeButtonLabel(savedTheme);
}

function toggleTheme() {
    const currentTheme = DOM.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    DOM.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('bfsi-radar-theme', newTheme);
    updateThemeButtonLabel(newTheme);

    // Re-render radars to pick up CSS-variable colors correctly if drawing paths dynamically
    renderRadar(DOM.fullRadar, 300, false);
}

function updateThemeButtonLabel(theme) {
    if (DOM.themeToggle) {
        if (theme === 'dark') {
            DOM.themeToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        Toggle Light Mode
      `;
        } else {
            DOM.themeToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        Toggle Dark Mode
      `;
        }
    }
}

// --- Navigation ---
function switchView(viewName) {
    if (viewName === 'database') {
        viewName = 'dashboard';
    }
    state.activeView = viewName;

    // Update sidebar active link UI
    DOM.navItems.forEach(item => {
        if (item.getAttribute('data-target') === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Display targeted view panel
    DOM.views.forEach(view => {
        if (view.id === `view-${viewName}`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    // Close drawer on change view
    closeDrawer();

    // Render sub-elements specific to loading views
    if (viewName === 'dashboard') {
        renderTable();
        renderSubsectorsExplorer();
    } else if (viewName === 'radar') {
        renderRadar(DOM.fullRadar, 300, false);
    } else if (viewName === 'portfolio') {
        renderPortfolio();
    } else if (viewName === 'framework') {
        renderFramework();
    }
}

// --- Dynamic Rendering: Dashboard ---
function renderApp() {
    updateHeaderNotification();
    updateGlobalStats();
    renderNewsTimeline();

    // Render active view defaults
    switchView(state.activeView);
}

function updateHeaderNotification() {
    if (DOM.newsBell) {
        const alertCount = newsFeed.length;
        DOM.newsBell.title = `${alertCount} new financial regulatory bulletins logged today.`;
    }
}

function updateGlobalStats() {
    const totalCount = regulations.length;
    const upcomingCount = regulations.filter(r => r.status === 'Upcoming' || r.status === 'Proposed').length;
    const criticalCount = regulations.filter(r => r.impact === 'Critical').length;

    // Calculate average compliance progress
    let progressPct = 0;
    if (state.bookmarks.length > 0) {
        let scores = 0;
        state.bookmarks.forEach(id => {
            const status = state.regulationStatuses[id] || 'Non-Compliant';
            if (status === 'Compliant') scores += 100;
            else if (status === 'In-Progress') scores += 50;
        });
        progressPct = Math.round(scores / state.bookmarks.length);
    }

    DOM.statTotal.textContent = totalCount;
    DOM.statUpcoming.textContent = upcomingCount;
    DOM.statCritical.textContent = criticalCount;
    DOM.statProgress.textContent = `${progressPct}%`;
}

function renderNewsTimeline() {
    if (!DOM.newsFeedList) return;
    DOM.newsFeedList.innerHTML = newsFeed.map(feed => `
    <div class="feed-item">
      <div class="feed-meta">
        <span>${feed.sector}</span>
        <span>${formatDate(feed.date)}</span>
      </div>
      <p class="feed-desc">${feed.item}</p>
    </div>
  `).join('');
}

function renderDashboardCharts() {
    if (!DOM.subsectorBars || !DOM.impactBars) return;

    // 1. Sector distributions
    const sectorCounts = {};
    sectors.forEach(s => sectorCounts[s.name] = 0);
    regulations.forEach(r => {
        if (sectorCounts[r.sector] !== undefined) {
            sectorCounts[r.sector]++;
        }
    });

    const maxSectorVal = Math.max(...Object.values(sectorCounts)) || 1;
    DOM.subsectorBars.innerHTML = sectors.map(sec => {
        const count = sectorCounts[sec.name] || 0;
        const widthPct = (count / maxSectorVal) * 100;
        return `
      <div class="chart-bar-row">
        <span class="chart-bar-label" title="${sec.name}">${sec.name}</span>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width: ${widthPct}%; background-color: ${sec.color};"></div>
        </div>
        <span class="chart-bar-val">${count}</span>
      </div>
    `;
    }).join('');

    // 2. Impact distributions
    const impactCounts = { 'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0 };
    regulations.forEach(r => {
        if (impactCounts[r.impact] !== undefined) {
            impactCounts[r.impact]++;
        }
    });

    const maxImpactVal = Math.max(...Object.values(impactCounts)) || 1;
    DOM.impactBars.innerHTML = Object.keys(impactCounts).map(impactName => {
        const count = impactCounts[impactName];
        const widthPct = (count / maxImpactVal) * 100;
        const color = impacts[impactName].color;
        return `
      <div class="chart-bar-row">
        <span class="chart-bar-label">${impactName} Impact</span>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width: ${widthPct}%; background-color: ${color};"></div>
        </div>
        <span class="chart-bar-val">${count}</span>
      </div>
    `;
    }).join('');
}

// --- Dynamic Rendering: SVG Compliance Radar ---
function renderRadar(svgElement, radius = 300, isMini = false) {
    if (!svgElement) return;
    svgElement.innerHTML = ''; // Clear SVG contents

    // Namespace constant
    const svgNS = "http://www.w3.org/2000/svg";

    // 1. Definition patterns (Gradient sweep filters)
    const defs = document.createElementNS(svgNS, "defs");
    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", "radar-gradient");
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("x2", "100%");
    linearGradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "var(--radar-sweep-edge)");
    stop1.setAttribute("stop-opacity", "0.7");

    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "var(--radar-sweep)");
    stop2.setAttribute("stop-opacity", "0");

    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);
    svgElement.appendChild(defs);

    // Center point
    const cx = 300;
    const cy = 300;
    const maxRadius = 260; // Max plot bounds

    // 2. Render radial grids of impacts
    const rings = Object.keys(impacts); // ['Critical', 'High', 'Medium', 'Low']
    rings.forEach((ringName, index) => {
        const ringPercent = impacts[ringName].radiusPercent;
        const r = maxRadius * ringPercent;

        // Draw grid circle
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("class", ringName === 'Low' ? "radar-solid-line" : "radar-grid-line");
        svgElement.appendChild(circle);

        // Draw ring text indicators (only on full radar)
        if (!isMini) {
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", cx + 5);
            text.setAttribute("y", cy - r + 13);
            text.setAttribute("class", "radar-ring-label");
            text.textContent = ringName.toUpperCase();
            svgElement.appendChild(text);
        }
    });

    // 3. Render sectors boundaries
    const totalSectors = sectors.length;
    sectors.forEach((sec, idx) => {
        const startAngle = sec.angleRange[0];
        const angleRad = (startAngle - 90) * Math.PI / 180;

        // Sector divider line
        const x = cx + maxRadius * Math.cos(angleRad);
        const y = cy + maxRadius * Math.sin(angleRad);

        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", cx);
        line.setAttribute("y1", cy);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("class", "sector-divider");
        svgElement.appendChild(line);

        // Render Sector domain text headers (only on full radar)
        if (!isMini) {
            const midAngle = (startAngle + sec.angleRange[1]) / 2;
            const midAngleRad = (midAngle - 90) * Math.PI / 180;
            const textX = cx + (maxRadius + 22) * Math.cos(midAngleRad);
            const textY = cy + (maxRadius + 22) * Math.sin(midAngleRad);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", textX);
            text.setAttribute("y", textY);
            text.setAttribute("class", "radar-sector-label");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.textContent = sec.name;

            // Pivot adjustments for clean visibility
            if (midAngle > 90 && midAngle < 270) {
                // Under rotation flips
            }
            svgElement.appendChild(text);
        }
    });

    // 4. Render rotating radar sweep cone (animated under dots, disabled in mini/performance triggers if needed)
    if (!isMini) {
        const sweep = document.createElementNS(svgNS, "path");
        // Draw 45 degree cone
        const sweepAngle = 45;
        const rStartRad = -90 * Math.PI / 180;
        const rEndRad = (-90 + sweepAngle) * Math.PI / 180;
        const sx = cx + maxRadius * Math.cos(rStartRad);
        const sy = cy + maxRadius * Math.sin(rStartRad);
        const ex = cx + maxRadius * Math.cos(rEndRad);
        const ey = cy + maxRadius * Math.sin(rEndRad);

        const pathD = `M ${cx} ${cy} L ${sx} ${sy} A ${maxRadius} ${maxRadius} 0 0 1 ${ex} ${ey} Z`;

        sweep.setAttribute("d", pathD);
        sweep.setAttribute("class", "radar-sweep-path");
        svgElement.appendChild(sweep);
    }

    // 5. Render regulations nodes
    // Plot positions mapping sectors and impact rings
    regulations.forEach((reg, regIdx) => {
        // Find sector details
        const secDetails = sectors.find(s => s.id === reg.sectorId);
        if (!secDetails) return;

        // Bounds parameters
        const [minAngle, maxAngle] = secDetails.angleRange;
        const sectorSweep = maxAngle - minAngle;

        // Deterministic dot placement index to prevent direct stack-overlapping
        const jitterIndex = regIdx % 4;
        const anglePadding = 12; // Stay away from divider splits
        const targetAngle = minAngle + anglePadding + ((sectorSweep - (anglePadding * 2)) / 3) * jitterIndex;

        // Radii boundaries
        const ringPercent = impacts[reg.impact].radiusPercent;
        const ringScaleRadius = maxRadius * ringPercent;

        // Jitter radial distance +/- 10px inside ring zones
        const distanceJitter = ((regIdx % 3) - 1) * 8;
        const finalRadialDistance = ringScaleRadius + distanceJitter;

        // Polar to Cartesian coordinate mappings
        const finalAngleRad = (targetAngle - 90) * Math.PI / 180;
        const dotX = cx + finalRadialDistance * Math.cos(finalAngleRad);
        const dotY = cy + finalRadialDistance * Math.sin(finalAngleRad);

        // Render Node Circles
        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("class", "radar-interactive-dot");
        if (reg.impact === 'Critical') {
            g.classList.add('pulse');
        }

        // Outer glow pulse circle (Critical items)
        const outC = document.createElementNS(svgNS, "circle");
        outC.setAttribute("cx", dotX);
        outC.setAttribute("cy", dotY);
        outC.setAttribute("r", isMini ? 6 : 8);
        outC.setAttribute("fill", impacts[reg.impact].color);
        outC.setAttribute("opacity", "0.4");
        g.appendChild(outC);

        // Inner solid core circle
        const coreC = document.createElementNS(svgNS, "circle");
        coreC.setAttribute("cx", dotX);
        coreC.setAttribute("cy", dotY);
        coreC.setAttribute("r", isMini ? 4 : 5);
        coreC.setAttribute("fill", impacts[reg.impact].color);
        coreC.setAttribute("stroke", "#ffffff");
        coreC.setAttribute("stroke-width", "1");
        g.appendChild(coreC);

        // Attach Event Listeners to dot groups
        g.addEventListener('mouseenter', (e) => {
            showRadarTooltip(e, reg, isMini);
        });
        g.addEventListener('mouseleave', () => {
            hideRadarTooltip();
        });
        g.addEventListener('click', () => {
            openDrawer(reg);
        });

        svgElement.appendChild(g);
    });
}

function showRadarTooltip(event, reg, isMini) {
    if (isMini) return; // Disable tooltip text overlays on small dashboards
    const tooltip = DOM.radarTooltip;
    if (!tooltip) return;

    tooltip.innerHTML = `
    <div class="radar-tooltip-title">${reg.name}</div>
    <div class="radar-tooltip-meta">
      <span>Sector: ${reg.sector}</span>
      <span style="color: ${impacts[reg.impact].color}; font-weight: 700;">${reg.impact}</span>
    </div>
    <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Region: ${reg.jurisdiction} | Status: ${reg.status}</div>
  `;
    tooltip.style.opacity = '1';

    // Dynamic positioning relative to viewport
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = DOM.fullRadar.getBoundingClientRect();
    tooltip.style.left = `${(rect.left - containerRect.left) + 15}px`;
    tooltip.style.top = `${(rect.top - containerRect.top) - 15}px`;
}

function hideRadarTooltip() {
    if (DOM.radarTooltip) {
        DOM.radarTooltip.style.opacity = '0';
    }
}

// --- Dynamic Rendering: Regulatory Grid (Table View) ---
function renderTable() {
    if (!DOM.tableBody) return;
    DOM.tableBody.innerHTML = '';

    const query = state.searchQuery.toLowerCase();

    // Apply filtering rules
    let filtered = regulations.filter(reg => {
        // 1. Text Search matching
        const nameMatch = searchMatches(reg.name, query) ||
            searchMatches(reg.fullName, query) ||
            searchMatches(reg.summary, query) ||
            searchMatches(reg.description, query);

        // 2. Select filter matchings
        const sectorMatch = state.filters.sector === 'all' || reg.sectorId === state.filters.sector;
        const jurisdictionMatch = state.filters.jurisdiction === 'all' || reg.jurisdiction === state.filters.jurisdiction;
        const impactMatch = state.filters.impact === 'all' || reg.impact === state.filters.impact;
        const statusMatch = state.filters.status === 'all' || reg.status === state.filters.status;

        return nameMatch && sectorMatch && jurisdictionMatch && impactMatch && statusMatch;
    });

    // Calculate sorting rules
    filtered.sort((a, b) => {
        let valA = a[state.sorting.column];
        let valB = b[state.sorting.column];

        // Sub-properties adjustments
        if (state.sorting.column === 'effectiveDate') {
            valA = new Date(valA || '1970-01-01');
            valB = new Date(valB || '1970-01-01');
        }

        if (valA < valB) return state.sorting.direction === 'asc' ? -1 : 1;
        if (valA > valB) return state.sorting.direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (filtered.length === 0) {
        DOM.tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
          No regulations match your active query. Check filters or type a new search word.
        </td>
      </tr>
    `;
        return;
    }

    DOM.tableBody.innerHTML = filtered.map(reg => {
        const isBookmarked = state.bookmarks.includes(reg.id);
        const compStatus = state.regulationStatuses[reg.id] || 'Non-Compliant';

        let statusClass = 'badge-status-proposed';
        if (compStatus === 'Compliant') statusClass = 'badge-impact-low';
        else if (compStatus === 'In-Progress') statusClass = 'badge-impact-high';
        else if (compStatus === 'Non-Compliant') statusClass = 'badge-impact-critical';

        const impactClass = `badge-impact-${reg.impact.toLowerCase()}`;
        const statusBadgeClass = `badge-status-${reg.status.toLowerCase()}`;

        return `
      <tr class="click-row" data-id="${reg.id}">
        <td style="font-weight: 700;">
          ${reg.name}
          <div style="font-size: 11px; font-weight: 400; color: var(--text-muted); margin-top: 2px;">${reg.fullName}</div>
        </td>
        <td>${reg.sector}</td>
        <td>${reg.jurisdiction}</td>
        <td>
          <span class="badge ${statusClass}">${compStatus}</span>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px; font-weight: 500;">Direct Status: ${reg.status}</div>
        </td>
        <td><span class="badge ${impactClass}">${reg.impact}</span></td>
        <td>${formatDate(reg.effectiveDate)}</td>
        <td class="action-cell" style="padding-left: 10px; width: 60px;">
          <button class="table-action-icon ${isBookmarked ? 'bookmarked' : ''}" data-id="${reg.id}">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke-width="2"><polyline points="19 21 12 16 5 21 5 3 19 3"/></svg>
          </button>
        </td>
      </tr>
    `;
    }).join('');

    // Attach dynamic event handlers for rows and bookmarks
    DOM.tableBody.querySelectorAll('.click-row').forEach(row => {
        row.addEventListener('click', (e) => {
            // Don't open drawer if they clicked the bookmark button cell
            if (e.target.closest('.action-cell') || e.target.closest('.table-action-icon')) {
                return;
            }
            const regId = row.getAttribute('data-id');
            const reg = regulations.find(r => r.id === regId);
            if (reg) openDrawer(reg);
        });
    });

    DOM.tableBody.querySelectorAll('.table-action-icon').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const regId = btn.getAttribute('data-id');
            toggleBookmark(regId);
        });
    });
}

function handleSort(column) {
    if (state.sorting.column === column) {
        state.sorting.direction = state.sorting.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.sorting.column = column;
        state.sorting.direction = 'asc';
    }

    // Update Sorting headers indicators
    DOM.tableHeaders.forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.getAttribute('data-sort') === column) {
            th.classList.add(state.sorting.direction === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    });

    renderTable();
}

function triggerResetFilters() {
    state.filters = { sector: 'all', jurisdiction: 'all', impact: 'all', status: 'all' };
    DOM.filterSector.value = 'all';
    DOM.filterJurisdiction.value = 'all';
    DOM.filterImpact.value = 'all';
    DOM.filterStatus.value = 'all';
    state.searchQuery = '';
    DOM.globalSearch.value = '';
    renderTable();
}

function getFilteredData() {
    const query = state.searchQuery.toLowerCase();
    return regulations.filter(reg => {
        const nameMatch = searchMatches(reg.name, query) ||
            searchMatches(reg.fullName, query) ||
            searchMatches(reg.summary, query);
        const sectorMatch = state.filters.sector === 'all' || reg.sectorId === state.filters.sector;
        const jurisdictionMatch = state.filters.jurisdiction === 'all' || reg.jurisdiction === state.filters.jurisdiction;
        const impactMatch = state.filters.impact === 'all' || reg.impact === state.filters.impact;
        const statusMatch = state.filters.status === 'all' || reg.status === state.filters.status;
        return nameMatch && sectorMatch && jurisdictionMatch && impactMatch && statusMatch;
    });
}

// --- Side Drawer Detail Pane Controller ---
function openDrawer(reg) {
    if (!reg) return;
    state.selectedDrawerReg = reg;

    // Set meta Badges classes
    DOM.drawerBadgeSector.textContent = reg.sector;

    DOM.drawerBadgeImpact.textContent = reg.impact;
    DOM.drawerBadgeImpact.className = `badge badge-impact-${reg.impact.toLowerCase()}`;

    DOM.drawerBadgeStatus.textContent = reg.status;
    DOM.drawerBadgeStatus.className = `badge badge-status-${reg.status.toLowerCase()}`;

    DOM.drawerRegTitle.textContent = reg.name;
    DOM.drawerRegFullName.textContent = reg.fullName;
    DOM.drawerRegSummary.textContent = reg.summary;
    DOM.drawerRegDesc.textContent = reg.description;

    // Render Requirement checklist logs
    DOM.drawerReqList.innerHTML = reg.keyRequirements.map(req => `<li>${req}</li>`).join('');

    // Setup bookmark button state
    const isBookmarked = state.bookmarks.includes(reg.id);
    updateDrawerBookmarkButton(isBookmarked);

    // Trigger drawer sliding transition
    DOM.drawer.classList.add('open');
}

function closeDrawer() {
    if (DOM.drawer) {
        DOM.drawer.classList.remove('open');
    }
}

function updateDrawerBookmarkButton(isBookmarked) {
    if (isBookmarked) {
        DOM.drawerBtnBookmark.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="currentColor" stroke-width="2"><polyline points="19 21 12 16 5 21 5 3 19 3"/></svg>
      Remove Portfolio Book
    `;
        DOM.drawerBtnBookmark.classList.remove('btn-primary');
        DOM.drawerBtnBookmark.classList.add('btn-secondary');
    } else {
        DOM.drawerBtnBookmark.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="19 21 12 16 5 21 5 3 19 3"/></svg>
      Bookmark to Portfolio
    `;
        DOM.drawerBtnBookmark.classList.add('btn-primary');
        DOM.drawerBtnBookmark.classList.remove('btn-secondary');
    }
}

function handleDrawerBookmarkClick() {
    if (!state.selectedDrawerReg) return;
    const regId = state.selectedDrawerReg.id;
    const isCurrentlyBookmarked = state.bookmarks.includes(regId);
    toggleBookmark(regId);
    updateDrawerBookmarkButton(!isCurrentlyBookmarked);
}

// --- State Persistences: Bookmarking ---
function toggleBookmark(regId) {
    const index = state.bookmarks.indexOf(regId);
    if (index > -1) {
        state.bookmarks.splice(index, 1);
        // clean up specific status entries if removed from portfolio
        delete state.regulationStatuses[regId];
        delete state.regulationNotes[regId];
    } else {
        state.bookmarks.push(regId);
        state.regulationStatuses[regId] = 'In-Progress'; // Default assignment
    }

    // Write to Storage
    localStorage.setItem('bfsi-radar-bookmarks', JSON.stringify(state.bookmarks));
    localStorage.setItem('bfsi-radar-statuses', JSON.stringify(state.regulationStatuses));
    localStorage.setItem('bfsi-radar-notes', JSON.stringify(state.regulationNotes));

    // Globally update stats counts
    updateGlobalStats();

    // Re-sync active view renders
    if (state.activeView === 'dashboard' || state.activeView === 'database') {
        renderTable();
        renderSubsectorsExplorer();
    }
    if (state.activeView === 'portfolio') renderPortfolio();
}

// --- Interactive Wizard: Self Assessment Tool ---
function renderWizardStep() {
    if (!DOM.wizardQuestions) return;
    DOM.wizardQuestions.innerHTML = '';

    const question = assessmentQuestions[state.assessmentStep];
    if (!question) return;

    // Make progress bar update
    const progressPercent = ((state.assessmentStep + 1) / assessmentQuestions.length) * 100;
    DOM.wizardProgress.style.width = `${progressPercent}%`;

    // Render question html
    const container = document.createElement('div');
    container.className = 'wizard-step-card active';
    container.innerHTML = `<h3 class="wizard-question">${question.text}</h3>`;

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'wizard-options-grid';

    question.options.forEach(opt => {
        const isSelected = state.assessmentAnswers[question.id] === opt.value;
        const card = document.createElement('div');
        card.className = `wizard-option-card ${isSelected ? 'selected' : ''}`;
        card.setAttribute('data-value', opt.value);
        card.innerHTML = `
      <span class="wizard-radio-circle"></span>
      <span>${opt.text}</span>
    `;

        card.addEventListener('click', () => {
            // Set value state
            state.assessmentAnswers[question.id] = opt.value;
            optionsGrid.querySelectorAll('.wizard-option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });

        optionsGrid.appendChild(card);
    });

    container.appendChild(optionsGrid);
    DOM.wizardQuestions.appendChild(container);

    // Navigation button visibilities
    DOM.btnWizardPrev.style.visibility = state.assessmentStep === 0 ? 'hidden' : 'visible';
    if (state.assessmentStep === assessmentQuestions.length - 1) {
        DOM.btnWizardNext.textContent = 'Compile Checklist';
    } else {
        DOM.btnWizardNext.textContent = 'Next Step';
    }
}

function processWizardNext() {
    const currentQuestion = assessmentQuestions[state.assessmentStep];
    if (!state.assessmentAnswers[currentQuestion.id]) {
        alert("Please select one of the security options to continue.");
        return;
    }

    if (state.assessmentStep < assessmentQuestions.length - 1) {
        state.assessmentStep++;
        renderWizardStep();
    } else {
        compileAssessmentResults();
    }
}

function processWizardPrev() {
    if (state.assessmentStep > 0) {
        state.assessmentStep--;
        renderWizardStep();
    }
}

function compileAssessmentResults() {
    DOM.wizardSetupPanel.style.display = 'none';
    DOM.wizardResultsPanel.style.display = 'block';

    // Extract core answers values
    const sectorAns = state.assessmentAnswers['q_subsector'];
    const jurAns = state.assessmentAnswers['q_jurisdiction'];
    const sizeAns = state.assessmentAnswers['q_assets'];
    const secAns = state.assessmentAnswers['q_security'];

    // Filter regulations matching answers
    let matchedRegulations = regulations.filter(reg => {
        // 1. Matches targeted Subsector
        if (reg.sectorId === sectorAns) return true;

        // 2. Matches targeted Jurisdiction (Global is always applicable)
        if (reg.jurisdiction === 'Global') return true;
        if (jurAns !== 'Global' && reg.jurisdiction === jurAns) return true;

        // 3. Security specific triggers (PCI/AI)
        if ((secAns === 'both' || secAns === 'cards') && reg.id === 'pcidss4') return true;
        if ((secAns === 'both' || secAns === 'ai') && reg.id === 'eu_ai_finance') return true;

        // 4. Overlap rules (GDPR/Compliance items that overlap on security)
        if (reg.sectorId === 'security' && (jurAns === 'EU' || jurAns === 'Global')) return true;

        return false;
    });

    const matchedNames = matchedRegulations.map(r => r.name).join(', ');
    DOM.wizardResultsSummary.innerHTML = `
    Based on your subsector (<strong>${sectorAns.toUpperCase()}</strong>) operating in <strong>${jurAns}</strong>, our compliance analyzer maps <strong>${matchedRegulations.length} relevant regulatory requirements</strong>. Key targets include: <em>${matchedNames || 'None'}</em>.
  `;

    // Render actionable requirement items
    DOM.resultsChecklist.innerHTML = '';

    if (matchedRegulations.length === 0) {
        DOM.resultsChecklist.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 32px 0;">
        No regulatory actions mapped. Try adjusting search answers.
      </div>
    `;
        return;
    }

    matchedRegulations.forEach(reg => {
        reg.actionItems.forEach((actionText, actIdx) => {
            const completionId = `${reg.id}-action-${actIdx}`;
            const isCompleted = !!state.assessmentCompletions[completionId];

            const itemEl = document.createElement('div');
            itemEl.className = `results-checklist-item ${isCompleted ? 'done' : ''}`;
            itemEl.setAttribute('data-id', completionId);
            itemEl.innerHTML = `
        <div class="checklist-checkbox"></div>
        <div class="checklist-detail">
          <div class="checklist-req-title">${reg.name} Directive Requirement</div>
          <div class="checklist-req-desc">${actionText}</div>
        </div>
      `;

            itemEl.addEventListener('click', () => {
                toggleChecklistItem(completionId, itemEl);
            });

            DOM.resultsChecklist.appendChild(itemEl);
        });
    });
}

function toggleChecklistItem(completionId, element) {
    const isDone = !state.assessmentCompletions[completionId];
    if (isDone) {
        state.assessmentCompletions[completionId] = true;
        element.classList.add('done');
    } else {
        delete state.assessmentCompletions[completionId];
        element.classList.remove('done');
    }
    localStorage.setItem('bfsi-radar-assessment-completions', JSON.stringify(state.assessmentCompletions));
}

function restartWizard() {
    state.assessmentStep = 0;
    state.assessmentAnswers = {};
    DOM.wizardSetupPanel.style.display = 'block';
    DOM.wizardResultsPanel.style.display = 'none';
    renderWizardStep();
}

// --- Portfolio Binder Controller ---
function renderPortfolio() {
    if (!DOM.portfolioList) return;
    DOM.portfolioList.innerHTML = '';

    // Get only details for bookmarked items
    const bookmarkedRegs = regulations.filter(r => state.bookmarks.includes(r.id));

    if (bookmarkedRegs.length === 0) {
        DOM.portfolioEmptyState.style.display = 'flex';
        DOM.portfolioEditorState.style.display = 'none';
        return;
    }

    DOM.portfolioEmptyState.style.display = 'none';
    DOM.portfolioEditorState.style.display = 'flex';

    // Build left selector list
    DOM.portfolioList.innerHTML = bookmarkedRegs.map(reg => {
        const status = state.regulationStatuses[reg.id] || 'Non-Compliant';
        const isSelected = state.selectedPortfolioRegId === reg.id || (!state.selectedPortfolioRegId && bookmarkedRegs[0].id === reg.id);

        // Update selected ID if initial/none selected
        if (isSelected && !state.selectedPortfolioRegId) {
            state.selectedPortfolioRegId = reg.id;
        }

        let indicatorColor = 'var(--color-critical)';
        if (status === 'Compliant') indicatorColor = 'var(--color-low)';
        else if (status === 'In-Progress') indicatorColor = 'var(--color-high)';

        return `
      <div class="portfolio-list-item ${isSelected ? 'selected' : ''}" data-id="${reg.id}">
        <span>${reg.name}</span>
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${indicatorColor}; display: block;" title="Status: ${status}"></span>
      </div>
    `;
    }).join('');

    // Attach list event hooks
    DOM.portfolioList.querySelectorAll('.portfolio-list-item').forEach(item => {
        item.addEventListener('click', () => {
            const regId = item.getAttribute('data-id');
            state.selectedPortfolioRegId = regId;
            renderPortfolio(); // Refreshes styling markers and editor pane inputs
        });
    });

    // Render editor content
    const activeReg = regulations.find(r => r.id === state.selectedPortfolioRegId);
    if (activeReg) {
        DOM.portfolioRegTitle.textContent = activeReg.name;
        DOM.portfolioRegFullName.textContent = activeReg.fullName;

        // Status selectors
        const savedStatus = state.regulationStatuses[activeReg.id] || 'In-Progress';
        DOM.portfolioStatusButtons.forEach(btn => {
            if (btn.getAttribute('data-status') === savedStatus) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Notes area
        DOM.portfolioNotesText.value = state.regulationNotes[activeReg.id] || '';
    }
}

function savePortfolioDetails() {
    const activeRegId = state.selectedPortfolioRegId;
    if (!activeRegId) return;

    const notesText = DOM.portfolioNotesText.value;
    state.regulationNotes[activeRegId] = notesText;
    localStorage.setItem('bfsi-radar-notes', JSON.stringify(state.regulationNotes));

    // Visual success feedback
    const originalLabel = DOM.portfolioSaveBtn.textContent;
    DOM.portfolioSaveBtn.textContent = 'Notepad Saved ✓';
    DOM.portfolioSaveBtn.style.backgroundColor = 'var(--color-low)';

    setTimeout(() => {
        DOM.portfolioSaveBtn.textContent = originalLabel;
        DOM.portfolioSaveBtn.style.backgroundColor = 'var(--accent-banking)';
    }, 1200);

    updateGlobalStats();
    renderPortfolio();
}

function selectPortfolioStatusOption(status) {
    const activeRegId = state.selectedPortfolioRegId;
    if (!activeRegId) return;

    state.regulationStatuses[activeRegId] = status;
    localStorage.setItem('bfsi-radar-statuses', JSON.stringify(state.regulationStatuses));

    updateGlobalStats();
    renderPortfolio();
}

// --- Subsector Compliance Explorer ---
function renderSubsectorsExplorer() {
    const explorerContainer = document.getElementById('subsectors-explorer-cards');
    if (!explorerContainer) return;

    explorerContainer.innerHTML = sectors.map(sec => {
        const secRegs = regulations.filter(r => r.sectorId === sec.id);
        const bookmarkedInSec = secRegs.filter(r => state.bookmarks.includes(r.id));

        let progressPct = 0;
        if (bookmarkedInSec.length > 0) {
            let scores = 0;
            bookmarkedInSec.forEach(r => {
                const status = state.regulationStatuses[r.id] || 'Non-Compliant';
                if (status === 'Compliant') scores += 100;
                else if (status === 'In-Progress') scores += 50;
            });
            progressPct = Math.round(scores / bookmarkedInSec.length);
        }

        const regTags = secRegs.slice(0, 3).map(r => `<span class="subsector-card-reg-tag">${r.name}</span>`).join('');

        let monitorMetricLabel = "Daily Transaction Audit";
        let monitorMetricVal = "100% OK";

        if (sec.id === 'banking') {
            monitorMetricLabel = "CET1 Capital Ratio";
            monitorMetricVal = "14.2% (Req: 11.5%)";
        } else if (sec.id === 'payments') {
            monitorMetricLabel = "Active Frauds Spotter";
            monitorMetricVal = "0.01% (Safe <1%)";
        } else if (sec.id === 'wealth') {
            monitorMetricLabel = "Suitability Audits Checks";
            monitorMetricVal = "Compliant";
        } else if (sec.id === 'insurance') {
            monitorMetricLabel = "Solvency Ratio (SCR)";
            monitorMetricVal = "215% (Req: 200%)";
        } else if (sec.id === 'security') {
            monitorMetricLabel = "DORA Vulnerability Scans";
            monitorMetricVal = "Done (Daily)";
        }

        return `
            <div class="subsector-explorer-card" data-sector="${sec.id}">
                <div>
                    <div class="subsector-card-header">
                        <span class="subsector-card-name">${sec.name}</span>
                        <span class="subsector-card-progress">${progressPct}% Comp</span>
                    </div>
                    <div class="subsector-card-regs">
                        ${regTags}
                    </div>
                </div>
                <div class="subsector-card-monitor">
                    <div class="subsector-card-monitor-meta">
                        <div class="subsector-monitor-title">Telemetry Stream</div>
                        <div class="subsector-monitor-metric">
                            <span>${monitorMetricLabel}</span>
                            <span class="subsector-monitor-val subsector-monitor-status-ok">${monitorMetricVal}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    explorerContainer.querySelectorAll('.subsector-explorer-card').forEach(card => {
        card.addEventListener('click', () => {
            const sectorId = card.getAttribute('data-sector');
            state.filters.sector = sectorId;
            if (DOM.filterSector) {
                DOM.filterSector.value = sectorId;
            }
            switchView('database');
        });
    });
}

// --- 5-Stage Compliance Framework Stepper ---
function renderFramework() {
    autoCalculateFrameworkSteps();

    const checkboxes = document.querySelectorAll('.stage-action-checkbox');
    checkboxes.forEach(cb => {
        const id = cb.id;
        cb.checked = !!state.frameworkSteps[id];

        cb.onchange = (e) => {
            if (e.target.checked) {
                state.frameworkSteps[id] = true;
            } else {
                delete state.frameworkSteps[id];
            }
            localStorage.setItem('bfsi-radar-framework-steps', JSON.stringify(state.frameworkSteps));
            renderFramework();
        };
    });

    const stages = [1, 2, 3, 4, 5];
    stages.forEach(stageNum => {
        const card = document.getElementById(`stage-${stageNum}-card`);
        const statusEl = document.getElementById(`stage-${stageNum}-status`);
        if (!card || !statusEl) return;

        const stageCheckboxes = Array.from(document.querySelectorAll(`.stage-action-checkbox[data-stage="${stageNum}"]`));
        const total = stageCheckboxes.length;
        const checkedCount = stageCheckboxes.filter(cb => cb.checked).length;

        card.classList.remove('completed', 'in-progress');
        if (checkedCount === 0) {
            statusEl.textContent = "NOT STARTED";
            statusEl.className = "badge badge-status-proposed";
        } else if (checkedCount < total) {
            statusEl.textContent = `IN PROGRESS (${checkedCount}/${total})`;
            statusEl.className = "badge badge-status-upcoming";
            card.classList.add('in-progress');
        } else {
            statusEl.textContent = "COMPLETED";
            statusEl.className = "badge badge-status-active";
            card.classList.add('completed');
        }
    });
}

function autoCalculateFrameworkSteps() {
    const hasAnswers = Object.keys(state.assessmentAnswers).length > 0;
    if (hasAnswers) {
        state.frameworkSteps['fw-step-1'] = true;
    }

    if (state.filters.jurisdiction !== 'all' || hasAnswers) {
        state.frameworkSteps['fw-step-2'] = true;
    }

    if (state.bookmarks.length > 0) {
        state.frameworkSteps['fw-step-3'] = true;
    }

    if (state.selectedPortfolioRegId) {
        state.frameworkSteps['fw-step-4'] = true;
    }

    localStorage.setItem('bfsi-radar-framework-steps', JSON.stringify(state.frameworkSteps));
}

// --- Core Event Listeners Bindings ---
function setupEventListeners() {
    // Sidebar router links
    DOM.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            switchView(target);
        });
    });

    // Dashboard specific page direct links
    if (DOM.dashboardToRadarLink) {
        DOM.dashboardToRadarLink.addEventListener('click', () => {
            switchView('radar');
        });
    }

    // Theme switch btn
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', toggleTheme);
    }

    // Global search input triggers
    if (DOM.globalSearch) {
        DOM.globalSearch.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            if (state.activeView !== 'database' && state.searchQuery.trim().length > 0) {
                switchView('database');
            }
            renderTable();
        });
    }

    // Database filtering options selection changing
    if (DOM.filterSector) {
        DOM.filterSector.addEventListener('change', (e) => {
            state.filters.sector = e.target.value;
            renderTable();
        });
    }

    if (DOM.filterJurisdiction) {
        DOM.filterJurisdiction.addEventListener('change', (e) => {
            state.filters.jurisdiction = e.target.value;
            renderTable();
        });
    }

    if (DOM.filterImpact) {
        DOM.filterImpact.addEventListener('change', (e) => {
            state.filters.impact = e.target.value;
            renderTable();
        });
    }

    if (DOM.filterStatus) {
        DOM.filterStatus.addEventListener('change', (e) => {
            state.filters.status = e.target.value;
            renderTable();
        });
    }

    // Grid Reset & exports hooks
    if (DOM.btnResetFilters) {
        DOM.btnResetFilters.addEventListener('click', triggerResetFilters);
    }

    if (DOM.btnExportCSV) {
        DOM.btnExportCSV.addEventListener('click', () => {
            exportToCSV(getFilteredData(), 'bfsi-regulatory-records.csv');
        });
    }

    if (DOM.btnExportJSON) {
        DOM.btnExportJSON.addEventListener('click', () => {
            exportToJSON(getFilteredData(), 'bfsi-regulatory-records.json');
        });
    }

    // Table header tags click sorting
    DOM.tableHeaders.forEach(th => {
        th.addEventListener('click', () => {
            handleSort(th.getAttribute('data-sort'));
        });
    });

    // Drawer buttons hooks
    if (DOM.drawerCloseBtn) DOM.drawerCloseBtn.addEventListener('click', closeDrawer);
    if (DOM.drawerBtnClose) DOM.drawerBtnClose.addEventListener('click', closeDrawer);
    if (DOM.drawerBtnBookmark) {
        DOM.drawerBtnBookmark.addEventListener('click', handleDrawerBookmarkClick);
    }

    // Self assessment controls
    if (DOM.btnWizardNext) DOM.btnWizardNext.addEventListener('click', processWizardNext);
    if (DOM.btnWizardPrev) DOM.btnWizardPrev.addEventListener('click', processWizardPrev);
    if (DOM.btnWizardRestart) DOM.btnWizardRestart.addEventListener('click', restartWizard);

    // Portfolio items editing details
    if (DOM.portfolioSaveBtn) {
        DOM.portfolioSaveBtn.addEventListener('click', savePortfolioDetails);
    }

    DOM.portfolioStatusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute('data-status');
            selectPortfolioStatusOption(status);
        });
    });

    // Framework links and actions listeners
    document.querySelectorAll('.fwd-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            if (target) {
                switchView(target);
            }
        });
    });

    const certifyBtn = document.getElementById('certify-sign-btn');
    if (certifyBtn) {
        certifyBtn.addEventListener('click', () => {
            state.frameworkSteps['fw-step-10'] = true;
            state.frameworkSteps['fw-step-11'] = true;
            localStorage.setItem('bfsi-radar-framework-steps', JSON.stringify(state.frameworkSteps));
            switchView('portfolio');
        });
    }

    // Set initial wizard steps loading
    renderWizardStep();
}
