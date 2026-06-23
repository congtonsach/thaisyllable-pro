// ============================================================
// ThaiSyllable Pro — ui.js
// Pure render functions. No DOM queries, no event binds here.
// All functions return HTML strings or DOM element refs.
// app.js injects results into the DOM.
// ============================================================

import { CATEGORIES, DIFFICULTY_LABEL, TONES } from "./data.js";

// ── Color tokens aligned with design plan ──
export const COLOR = {
  onset:   { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE", label: "Onset" },
  nucleus: { bg: "#ECFEFF", text: "#0E7490", border: "#A5F3FC", label: "Nucleus" },
  coda:    { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", label: "Coda" },
  tone:    { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE", label: "Tone" },
};

// ── Syllable DNA Bar ── (signature element)
export function renderDNABar(syllable) {
  const parts = [];
  if (syllable.onset && syllable.onset.char !== "–")  parts.push({ color: "#4F46E5", flex: 2, label: "O" });
  if (syllable.nucleus) parts.push({ color: "#0891B2", flex: 3, label: "N" });
  if (syllable.coda)    parts.push({ color: "#D97706", flex: 2, label: "C" });
  parts.push({ color: "#7C3AED", flex: 1, label: "T" });

  const total = parts.reduce((s, p) => s + p.flex, 0);
  const segments = parts.map(p => `
    <div class="dna-segment" style="
      flex: ${p.flex};
      background: ${p.color};
      height: 6px;
      border-radius: 3px;
      position: relative;
    " title="${p.label}"></div>
  `).join('<div style="width:2px"></div>');

  return `
    <div class="dna-bar" style="display:flex; align-items:center; gap:2px; margin-top:10px;">
      ${segments}
    </div>
  `;
}

// ── Syllable part chips ──
function renderChip(type, char, ipa, extra = "") {
  if (!char || char === "–") return "";
  const c = COLOR[type];
  return `
    <div class="chip" style="
      background:${c.bg}; color:${c.text}; border:1px solid ${c.border};
      border-radius:8px; padding:6px 10px; text-align:center; min-width:52px;
      display:flex; flex-direction:column; gap:2px; flex:1;
    ">
      <span style="font-family:'Sarabun',sans-serif; font-size:20px; font-weight:700; line-height:1;">${char}</span>
      <span style="font-family:'JetBrains Mono',monospace; font-size:10px; opacity:0.75;">${ipa}</span>
      <span style="font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; opacity:0.6;">${c.label}</span>
      ${extra ? `<span style="font-size:9px; margin-top:1px;">${extra}</span>` : ""}
    </div>
  `;
}

function renderToneChip(tone) {
  const c = COLOR.tone;
  const toneInfo = TONES[tone.name] || {};
  return `
    <div class="chip" style="
      background:${c.bg}; color:${c.text}; border:1px solid ${c.border};
      border-radius:8px; padding:6px 10px; text-align:center; min-width:52px;
      display:flex; flex-direction:column; gap:2px; flex:1;
    ">
      <span style="font-size:20px; font-weight:700; line-height:1;">${tone.mark}</span>
      <span style="font-family:'Sarabun',sans-serif; font-size:11px; font-weight:600;">${tone.name}</span>
      <span style="font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; opacity:0.6;">Tone</span>
      <span style="font-size:9px; opacity:0.75;">${tone.vi}</span>
    </div>
  `;
}

// ── Syllable breakdown row ──
function renderSyllableBreakdown(syllable) {
  const onsetChar = syllable.onset?.char !== "–" ? syllable.onset?.char : null;
  const onsetIpa  = syllable.onset?.ipa !== "–"  ? syllable.onset?.ipa  : null;
  const onsetName = syllable.onset?.name || "";

  const chips = [
    onsetChar   ? renderChip("onset",   onsetChar,           onsetIpa,          onsetName)            : "",
    syllable.nucleus ? renderChip("nucleus", syllable.nucleus.char, syllable.nucleus.ipa, syllable.nucleus.name) : "",
    syllable.coda    ? renderChip("coda",    syllable.coda.char,    syllable.coda.ipa,    syllable.coda.name)    : "",
    syllable.tone    ? renderToneChip(syllable.tone) : "",
  ].filter(Boolean).join("");

  return `<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:12px;">${chips}</div>`;
}

// ── Single vocab card ──
export function renderCard(vocab, mode = "learn", revealed = false) {
  const diff = DIFFICULTY_LABEL[vocab.difficulty] || DIFFICULTY_LABEL[1];
  const isCompound = vocab.syllable.nucleus?.type === "compound";

  const answerSection = mode === "learn"
    ? `
      <div class="answer-zone" data-id="${vocab.id}" style="margin-top:14px;">
        ${revealed
          ? `
            <div class="reveal-content">
              ${renderSyllableBreakdown(vocab.syllable)}
              ${renderDNABar(vocab.syllable)}
              ${vocab.note_vi ? `
                <p style="margin-top:10px; font-size:12px; color:#64748b; line-height:1.5;
                  padding:8px 10px; background:#F8FAFC; border-radius:8px; border-left:3px solid #CBD5E1;">
                  💡 ${vocab.note_vi}
                </p>` : ""}
            </div>
          `
          : `
            <button class="btn-reveal" data-id="${vocab.id}" style="
              width:100%; padding:8px; border-radius:8px; border:1.5px dashed #CBD5E1;
              background:transparent; color:#94A3B8; font-size:13px; cursor:pointer;
              transition:all .15s; font-family:inherit;
            " onmouseover="this.style.borderColor='#4F46E5';this.style.color='#4F46E5'"
               onmouseout="this.style.borderColor='#CBD5E1';this.style.color='#94A3B8'">
              <i data-lucide="eye" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i>
              Xem phân tích
            </button>
          `
        }
      </div>`
    : `<!-- quiz mode injected by app.js -->
       <div class="quiz-zone" data-id="${vocab.id}" style="margin-top:14px;"></div>`;

  return `
    <article class="vocab-card" data-id="${vocab.id}" data-category="${vocab.category}" style="
      background:#fff; border-radius:16px; padding:18px;
      box-shadow:0 1px 4px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.04);
      transition:box-shadow .2s, transform .2s;
      display:flex; flex-direction:column;
    "
    onmouseover="this.style.boxShadow='0 4px 20px rgba(79,70,229,.13)'; this.style.transform='translateY(-2px)'"
    onmouseout="this.style.boxShadow='0 1px 4px rgba(0,0,0,.07),0 4px 16px rgba(0,0,0,.04)'; this.style.transform='none'">

      <!-- Top row: Thai word + difficulty badge -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
        <div>
          <div style="font-family:'Sarabun',sans-serif; font-size:42px; font-weight:700;
            color:#1A1A2E; line-height:1; letter-spacing:-.01em;">
            ${vocab.thai}
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:12px;
            color:#6B7280; margin-top:4px; letter-spacing:.04em;">
            /${vocab.romanization}/
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0;">
          <span style="
            font-size:10px; font-weight:700; padding:3px 8px; border-radius:20px;
            background:${diff.bg}; color:${diff.color}; text-transform:uppercase; letter-spacing:.05em;
          ">${diff.text}</span>
          ${isCompound ? `<span style="font-size:10px; color:#94A3B8;">đa âm tiết</span>` : ""}
        </div>
      </div>

      <!-- Meaning -->
      <div style="margin-top:10px; font-size:15px; font-weight:600; color:#374151;">
        ${vocab.meaning_vi}
      </div>

      <!-- Tags -->
      <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:4px;">
        ${vocab.tags.map(t => `
          <span style="font-size:10px; padding:2px 7px; border-radius:10px;
            background:#F1F5F9; color:#64748B; font-weight:500;">${t}</span>
        `).join("")}
      </div>

      <!-- Answer / Quiz zone -->
      ${answerSection}
    </article>
  `;
}

// ── Card grid wrapper ──
export function renderCardGrid(vocabs, mode, revealedSet) {
  if (!vocabs.length) {
    return `
      <div style="text-align:center; padding:60px 20px; color:#94A3B8;">
        <i data-lucide="search-x" style="width:48px;height:48px;margin:0 auto 12px;display:block;"></i>
        <p style="font-size:16px; font-weight:600;">Không tìm thấy từ nào</p>
        <p style="font-size:13px; margin-top:4px;">Thử tìm kiếm với từ khóa khác</p>
      </div>
    `;
  }
  return `
    <div class="card-grid" style="
      display:grid;
      grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));
      gap:16px;
    ">
      ${vocabs.map(v => renderCard(v, mode, revealedSet.has(v.id))).join("")}
    </div>
  `;
}

// ── Quiz options injector (called by app.js after card render) ──
export function renderQuizOptions(options, answered) {
  return `
    <div style="display:flex; flex-direction:column; gap:6px; margin-top:4px;">
      ${options.map((opt, i) => {
        let style = `
          width:100%; text-align:left; padding:9px 14px; border-radius:10px;
          border:1.5px solid #E2E8F0; background:#fff; font-size:13px;
          cursor:pointer; font-family:inherit; transition:all .15s; color:#374151;
        `;
        if (answered) {
          if (opt.correct)       style += "border-color:#10B981;background:#D1FAE5;color:#065F46;font-weight:600;";
          else if (opt.selected) style += "border-color:#EF4444;background:#FEE2E2;color:#991B1B;";
          else                   style += "opacity:0.5;cursor:default;";
        }
        return `
          <button class="quiz-option"
            data-correct="${opt.correct}"
            data-idx="${i}"
            style="${style}"
            ${answered ? "disabled" : ""}
            onmouseover="${answered ? "" : "this.style.borderColor='#4F46E5';this.style.background='#EEF2FF'"}"
            onmouseout="${answered ? "" : "this.style.borderColor='#E2E8F0';this.style.background='#fff'"}">
            <span style="display:inline-block;width:20px;height:20px;line-height:20px;
              border-radius:50%;background:#F1F5F9;font-size:10px;font-weight:700;
              text-align:center;margin-right:8px;vertical-align:middle;">
              ${"ABCD"[i]}
            </span>
            ${opt.value}
            ${answered && opt.correct ? ' <i data-lucide="check-circle-2" style="width:14px;height:14px;float:right;margin-top:2px;color:#10B981;"></i>' : ""}
            ${answered && opt.selected && !opt.correct ? ' <i data-lucide="x-circle" style="width:14px;height:14px;float:right;margin-top:2px;color:#EF4444;"></i>' : ""}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

// ── Sidebar ──
export function renderSidebar(activeCategory, counts) {
  const items = CATEGORIES.map(cat => {
    const count = counts[cat.id] ?? 0;
    const isActive = activeCategory === cat.id;
    return `
      <li>
        <button class="sidebar-item" data-category="${cat.id}" style="
          width:100%; display:flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:10px; border:none; text-align:left;
          background:${isActive ? "#EEF2FF" : "transparent"};
          color:${isActive ? "#4338CA" : "#4B5563"};
          font-weight:${isActive ? "700" : "500"};
          font-size:13px; cursor:pointer; transition:all .15s; font-family:inherit;
        "
        onmouseover="if(!this.dataset.active){this.style.background='#F8FAFC'}"
        onmouseout="if(!this.dataset.active){this.style.background='transparent'}"
        ${isActive ? 'data-active="true"' : ""}>
          <i data-lucide="${cat.icon}" style="width:16px;height:16px;color:${cat.color};flex-shrink:0;"></i>
          <span style="flex:1;">${cat.label}</span>
          <span style="
            font-size:11px; padding:1px 7px; border-radius:10px;
            background:${isActive ? "#C7D2FE" : "#F1F5F9"};
            color:${isActive ? "#3730A3" : "#9CA3AF"};
          ">${count}</span>
        </button>
      </li>
    `;
  }).join("");

  return `
    <nav style="padding:8px;">
      <p style="font-size:10px; font-weight:700; color:#9CA3AF; text-transform:uppercase;
        letter-spacing:.08em; padding:8px 14px 6px;">Danh mục</p>
      <ul style="list-style:none; margin:0; padding:0;">${items}</ul>

      <div style="margin-top:20px; padding:14px; border-radius:12px;
        background:linear-gradient(135deg,#EEF2FF,#F5F3FF);">
        <p style="font-size:11px; font-weight:700; color:#4338CA; margin:0 0 4px;">
          <i data-lucide="graduation-cap" style="width:12px;height:12px;vertical-align:-1px;margin-right:4px;"></i>
          THÁI DỄ HỌC
        </p>
        <p style="font-size:11px; color:#6B7280; margin:0; line-height:1.5;">
          Học tiếng Thái qua cấu trúc âm tiết — không chỉ học thuộc lòng.
        </p>
      </div>
    </nav>
  `;
}

// ── Header ──
export function renderHeader(searchQuery, mode, totalShown, totalAll) {
  return `
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
      <!-- Logo -->
      <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
        <div style="width:36px;height:36px;border-radius:10px;
          background:linear-gradient(135deg,#4F46E5,#7C3AED);
          display:flex;align-items:center;justify-content:center;">
          <span style="color:#fff;font-size:18px;font-family:'Sarabun',sans-serif;font-weight:700;">ก</span>
        </div>
        <div>
          <div style="font-size:16px;font-weight:800;color:#1A1A2E;letter-spacing:-.02em;">
            ThaiSyllable<span style="color:#4F46E5;">Pro</span>
          </div>
          <div style="font-size:10px;color:#9CA3AF;font-weight:500;">by THÁI DỄ HỌC</div>
        </div>
      </div>

      <!-- Search -->
      <div style="flex:1; min-width:200px; position:relative;">
        <i data-lucide="search" style="
          position:absolute; left:12px; top:50%; transform:translateY(-50%);
          width:16px;height:16px;color:#9CA3AF; pointer-events:none;
        "></i>
        <input id="search-input" type="text"
          placeholder="Tìm chữ Thái, phiên âm, nghĩa tiếng Việt..."
          value="${searchQuery}"
          style="
            width:100%; padding:9px 12px 9px 38px; border-radius:10px;
            border:1.5px solid #E2E8F0; font-size:13px; font-family:inherit;
            background:#F8FAFC; outline:none; box-sizing:border-box; color:#1A1A2E;
            transition:border-color .15s;
          "
          onfocus="this.style.borderColor='#4F46E5';this.style.background='#fff'"
          onblur="this.style.borderColor='#E2E8F0';this.style.background='#F8FAFC'"
        />
      </div>

      <!-- Mode toggle -->
      <div style="display:flex; border-radius:10px; border:1.5px solid #E2E8F0; overflow:hidden; flex-shrink:0;">
        ${["learn","quiz"].map(m => `
          <button id="mode-${m}" style="
            padding:8px 16px; border:none; font-size:12px; font-weight:600;
            cursor:pointer; font-family:inherit; transition:all .15s;
            background:${mode===m ? "#4F46E5" : "#fff"};
            color:${mode===m ? "#fff" : "#6B7280"};
          ">
            <i data-lucide="${m==="learn"?"book-open":"zap"}" style="width:12px;height:12px;vertical-align:-1px;margin-right:4px;"></i>
            ${m==="learn"?"Learn":"Quiz"}
          </button>
        `).join("")}
      </div>
    </div>

    <!-- Stats bar -->
    <div style="margin-top:12px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
      <span style="font-size:12px; color:#6B7280;">
        <span style="font-weight:700; color:#1A1A2E;">${totalShown}</span> / ${totalAll} từ
      </span>
      ${mode === "learn"
        ? `<span style="font-size:12px; color:#64748B;">
            <i data-lucide="info" style="width:12px;height:12px;vertical-align:-1px;margin-right:3px;"></i>
            Nhấn <strong>Xem phân tích</strong> để xem cấu trúc âm tiết
           </span>`
        : `<span style="font-size:12px; color:#7C3AED;">
            <i data-lucide="zap" style="width:12px;height:12px;vertical-align:-1px;margin-right:3px;"></i>
            Chọn đúng nghĩa tiếng Việt
           </span>`
      }
      ${searchQuery ? `
        <button id="clear-search" style="
          font-size:12px; color:#EF4444; background:none; border:none;
          cursor:pointer; font-family:inherit; padding:0;
        ">✕ Xóa tìm kiếm</button>
      ` : ""}
    </div>
  `;
}

// ── Mobile sidebar drawer toggle button ──
export function renderMenuToggle(open) {
  return `
    <button id="menu-toggle" style="
      display:none; align-items:center; justify-content:center;
      width:36px;height:36px;border-radius:8px;border:1.5px solid #E2E8F0;
      background:#fff; cursor:pointer; flex-shrink:0;
    ">
      <i data-lucide="${open ? "x" : "menu"}" style="width:18px;height:18px;color:#374151;"></i>
    </button>
  `;
}

// ── Quiz score pill (injected into header area) ──
export function renderScorePill(correct, total) {
  if (total === 0) return "";
  const pct = Math.round((correct / total) * 100);
  const color = pct >= 70 ? "#059669" : pct >= 40 ? "#D97706" : "#DC2626";
  return `
    <div style="
      padding:6px 12px; border-radius:20px; font-size:12px; font-weight:700;
      background:${color}15; color:${color}; flex-shrink:0;
    ">
      <i data-lucide="trophy" style="width:12px;height:12px;vertical-align:-1px;margin-right:4px;"></i>
      ${correct}/${total} · ${pct}%
    </div>
  `;
}
