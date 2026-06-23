// ============================================================
// ThaiSyllable Pro — app.js
// State container + event coordination.
// Imports data.js (model) and ui.js (view) — this is the controller.
// ============================================================

import {
  VOCAB, CATEGORIES, searchVocab, filterByCategory, getQuizOptions
} from "./data.js";
import {
  renderHeader, renderSidebar, renderCardGrid,
  renderQuizOptions, renderScorePill, renderMenuToggle,
} from "./ui.js";

// ── App State ─────────────────────────────────────────────────
const state = {
  mode:            "learn",       // "learn" | "quiz"
  activeCategory:  "all",
  searchQuery:     "",
  revealed:        new Set(),     // ids revealed in learn mode
  quizState:       new Map(),     // id → { options, answered, selectedIdx, correct }
  quizScore:       { correct: 0, total: 0 },
  sidebarOpen:     false,         // mobile drawer
};

// ── DOM refs (populated after DOMContentLoaded) ───────────────
let $ = {};

// ── Derived data ──────────────────────────────────────────────
function getFilteredVocab() {
  let result = filterByCategory(state.activeCategory);
  if (state.searchQuery) result = searchVocab(state.searchQuery).filter(v =>
    state.activeCategory === "all" || v.category === state.activeCategory
  );
  return result;
}

function getCategoryCounts() {
  const counts = {};
  CATEGORIES.forEach(cat => {
    counts[cat.id] = cat.id === "all" ? VOCAB.length : VOCAB.filter(v => v.category === cat.id).length;
  });
  return counts;
}

// ── Renderers ─────────────────────────────────────────────────
function renderAll() {
  const vocab = getFilteredVocab();

  // Header
  $.header.innerHTML = renderHeader(
    state.searchQuery, state.mode, vocab.length, VOCAB.length
  );
  // Insert score pill in quiz mode
  if (state.mode === "quiz" && state.quizScore.total > 0) {
    $.header.querySelector('[style*="Stats bar"]')?.insertAdjacentHTML(
      "beforeend", renderScorePill(state.quizScore.correct, state.quizScore.total)
    );
  }

  // Sidebar
  $.sidebar.innerHTML = renderSidebar(state.activeCategory, getCategoryCounts());

  // Cards
  $.main.innerHTML = renderCardGrid(vocab, state.mode, state.revealed);

  // If quiz mode: inject quiz options into each card
  if (state.mode === "quiz") {
    vocab.forEach(v => {
      const zone = $.main.querySelector(`.quiz-zone[data-id="${v.id}"]`);
      if (!zone) return;
      if (!state.quizState.has(v.id)) {
        state.quizState.set(v.id, {
          options:     getQuizOptions(v.id, "meaning_vi", 3),
          answered:    false,
          selectedIdx: null,
          correct:     false,
        });
      }
      const qs = state.quizState.get(v.id);
      zone.innerHTML = renderQuizOptions(qs.options, qs.answered);
    });
  }

  // Re-init Lucide icons
  if (window.lucide) window.lucide.createIcons();

  // Re-bind events
  bindEvents();
  applyMobileLayout();
}

// ── Event Binding ─────────────────────────────────────────────
function bindEvents() {
  // Search input
  const searchEl = document.getElementById("search-input");
  if (searchEl) {
    searchEl.addEventListener("input", e => {
      state.searchQuery = e.target.value;
      state.revealed.clear();
      renderAll();
      searchEl.focus();
    });
  }

  // Clear search
  const clearBtn = document.getElementById("clear-search");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      state.searchQuery = "";
      renderAll();
    });
  }

  // Mode toggle
  ["learn","quiz"].forEach(m => {
    const btn = document.getElementById(`mode-${m}`);
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (state.mode === m) return;
      state.mode = m;
      state.revealed.clear();
      // Reset quiz scores when switching
      if (m === "quiz") {
        state.quizState.clear();
        state.quizScore = { correct: 0, total: 0 };
      }
      renderAll();
    });
  });

  // Sidebar category
  $.sidebar.querySelectorAll(".sidebar-item").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.category;
      state.searchQuery    = "";
      state.revealed.clear();
      state.quizState.clear();
      if (state.mode === "quiz") state.quizScore = { correct: 0, total: 0 };
      // Close mobile drawer
      if (state.sidebarOpen) toggleSidebar(false);
      renderAll();
    });
  });

  // Learn: reveal buttons
  $.main.querySelectorAll(".btn-reveal").forEach(btn => {
    btn.addEventListener("click", () => {
      state.revealed.add(btn.dataset.id);
      renderAll();
    });
  });

  // Quiz: option buttons
  $.main.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", function() {
      const zone    = this.closest(".quiz-zone");
      if (!zone) return;
      const id      = zone.dataset.id;
      const qs      = state.quizState.get(id);
      if (!qs || qs.answered) return;

      const idx     = parseInt(this.dataset.idx, 10);
      const correct = this.dataset.correct === "true";

      // Mark each option as selected
      qs.options[idx].selected = true;
      qs.answered  = true;
      qs.correct   = correct;

      state.quizScore.total++;
      if (correct) state.quizScore.correct++;

      // Partial re-render: just the quiz zone
      zone.innerHTML = renderQuizOptions(qs.options, true);
      if (window.lucide) window.lucide.createIcons();

      // Update score pill
      updateScorePill();

      // Re-bind the now-disabled buttons (no-op needed)
    });
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => toggleSidebar(!state.sidebarOpen));
  }
}

function updateScorePill() {
  // Find or create score pill after stats bar
  const statsBar = $.header.querySelector('[id="stats-bar"]');
  // Simple approach: re-render header stats section only
  // (score pill is appended to stats bar)
  const existing = $.header.querySelector(".score-pill");
  if (existing) existing.remove();
  const { correct, total } = state.quizScore;
  if (total === 0) return;

  const pct   = Math.round((correct / total) * 100);
  const color = pct >= 70 ? "#059669" : pct >= 40 ? "#D97706" : "#DC2626";
  const pill  = document.createElement("div");
  pill.className = "score-pill";
  pill.style.cssText = `
    padding:6px 12px; border-radius:20px; font-size:12px; font-weight:700;
    background:${color}15; color:${color}; flex-shrink:0; display:inline-flex;
    align-items:center; gap:4px;
  `;
  pill.innerHTML = `
    <i data-lucide="trophy" style="width:12px;height:12px;"></i>
    ${correct}/${total} · ${pct}%
  `;
  $.header.querySelector('[style*="Stats bar"]')?.appendChild(pill);
  if (window.lucide) window.lucide.createIcons();
}

// ── Mobile Layout ─────────────────────────────────────────────
function applyMobileLayout() {
  const isMobile = window.innerWidth < 768;
  const menuToggle = document.getElementById("menu-toggle");

  if (isMobile) {
    if (menuToggle) menuToggle.style.display = "flex";
    $.sidebarWrapper.style.cssText = `
      position:fixed; top:0; left:0; height:100%; width:260px;
      background:#fff; z-index:50; box-shadow:4px 0 20px rgba(0,0,0,.1);
      transform:translateX(${state.sidebarOpen ? "0" : "-100%"});
      transition:transform .25s ease; overflow-y:auto;
    `;
    $.overlay.style.display = state.sidebarOpen ? "block" : "none";
  } else {
    if (menuToggle) menuToggle.style.display = "none";
    $.sidebarWrapper.style.cssText = `
      position:static; transform:none; box-shadow:none;
      width:220px; flex-shrink:0; overflow-y:auto;
    `;
    $.overlay.style.display = "none";
    state.sidebarOpen = false;
  }
}

function toggleSidebar(open) {
  state.sidebarOpen = open;
  applyMobileLayout();
  // Update menu icon
  const toggle = document.getElementById("menu-toggle");
  if (toggle) {
    toggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}" style="width:18px;height:18px;color:#374151;"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }
}

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  $ = {
    header:         document.getElementById("app-header"),
    sidebar:        document.getElementById("app-sidebar"),
    sidebarWrapper: document.getElementById("sidebar-wrapper"),
    main:           document.getElementById("app-main"),
    overlay:        document.getElementById("mobile-overlay"),
  };

  // Mobile overlay click closes sidebar
  $.overlay.addEventListener("click", () => toggleSidebar(false));

  // Responsive listener
  window.addEventListener("resize", () => applyMobileLayout());

  // Initial render
  renderAll();
});
