// ============================================================
// ThaiSyllable Pro — data.js
// Single source of truth: categories, vocabulary, quiz options
// Designed for easy Supabase migration: each VOCAB entry maps
// 1-to-1 with a "syllables" table row.
// ============================================================

export const CATEGORIES = [
  { id: "all",              label: "Tất cả",              icon: "grid-3x3",    color: "#4F46E5" },
  { id: "consonant-mid",    label: "Phụ âm hạng giữa",   icon: "circle-dot",  color: "#4F46E5" },
  { id: "consonant-high",   label: "Phụ âm hạng cao",    icon: "chevrons-up", color: "#7C3AED" },
  { id: "consonant-low",    label: "Phụ âm hạng thấp",   icon: "chevrons-down",color: "#0891B2" },
  { id: "vowel-short",      label: "Nguyên âm ngắn",     icon: "zap",         color: "#0891B2" },
  { id: "vowel-long",       label: "Nguyên âm dài",      icon: "waves",       color: "#0891B2" },
  { id: "tone-rule",        label: "Quy tắc thanh điệu", icon: "music",       color: "#D97706" },
  { id: "common-words",     label: "Từ thông dụng",      icon: "star",        color: "#059669" },
];

// Difficulty labels
export const DIFFICULTY_LABEL = {
  1: { text: "Cơ bản",    color: "#059669", bg: "#D1FAE5" },
  2: { text: "Trung cấp", color: "#D97706", bg: "#FEF3C7" },
  3: { text: "Nâng cao",  color: "#DC2626", bg: "#FEE2E2" },
};

// Tone metadata
export const TONES = {
  "สามัญ":  { vi: "Ngang",   number: 0, description: "Đọc bằng, không lên không xuống" },
  "เอก":    { vi: "Thấp",    number: 1, description: "Xuống thấp, hơi nặng" },
  "โท":     { vi: "Ngã",     number: 2, description: "Lên cao rồi xuống" },
  "ตรี":    { vi: "Sắc",     number: 3, description: "Lên cao dứt khoát" },
  "จัตวา":  { vi: "Hỏi",     number: 4, description: "Xuống rồi lên" },
};

// ============================================================
// VOCABULARY DATA
// Supabase migration hint:
//   - Top level fields → columns
//   - syllable{} → jsonb column OR related table
//   - tags[] → tags table + junction
// ============================================================
export const VOCAB = [
  // ── CONSONANT MID CLASS ──
  {
    id: "k001",
    thai: "กา",
    romanization: "gaa",
    meaning_vi: "Con quạ",
    audio_url: null,
    syllable: {
      onset:   { char: "ก", ipa: "k",  class: "mid",  name: "กอ ไก่" },
      nucleus: { char: "า", ipa: "aː", type: "long",  name: "สระ อา" },
      coda:    null,
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "consonant-mid",
    tags: ["กอ-ไก่", "สระ-อา"],
    difficulty: 1,
    note_vi: "Âm tiết mở. ก ở hạng giữa + สระ อา dài → thanh ngang tự nhiên.",
  },
  {
    id: "k002",
    thai: "จาน",
    romanization: "jaan",
    meaning_vi: "Cái đĩa",
    audio_url: null,
    syllable: {
      onset:   { char: "จ", ipa: "tɕ", class: "mid",  name: "จอ จาน" },
      nucleus: { char: "า", ipa: "aː", type: "long",  name: "สระ อา" },
      coda:    { char: "น", ipa: "n",  name: "นอ หนู" },
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "consonant-mid",
    tags: ["จอ-จาน", "สระ-อา", "คำง่าย"],
    difficulty: 1,
    note_vi: "Âm tiết đóng với coda น. Lớp giữa + สระยาว → thanh ngang.",
  },
  {
    id: "k003",
    thai: "ใบ",
    romanization: "bai",
    meaning_vi: "Cái lá / tờ",
    audio_url: null,
    syllable: {
      onset:   { char: "บ", ipa: "b",  class: "mid",  name: "บอ ใบไม้" },
      nucleus: { char: "ไ", ipa: "aj", type: "long",  name: "สระ ไ–" },
      coda:    null,
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "consonant-mid",
    tags: ["บอ-ใบไม้", "สระ-ไ"],
    difficulty: 1,
    note_vi: "สระ ไ– là nguyên âm ghép, luôn đứng trước phụ âm onset.",
  },
  {
    id: "k004",
    thai: "ดี",
    romanization: "dii",
    meaning_vi: "Tốt / giỏi",
    audio_url: null,
    syllable: {
      onset:   { char: "ด", ipa: "d",  class: "mid",  name: "ดอ เด็ก" },
      nucleus: { char: "ี", ipa: "iː", type: "long",  name: "สระ อี" },
      coda:    null,
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "consonant-mid",
    tags: ["ดอ-เด็ก", "สระ-อี", "คำทั่วไป"],
    difficulty: 1,
    note_vi: "Từ cơ bản nhất. ด hạng giữa + สระ อี dài = thanh ngang.",
  },

  // ── CONSONANT HIGH CLASS ──
  {
    id: "h001",
    thai: "ขา",
    romanization: "khaa",
    meaning_vi: "Cái chân",
    audio_url: null,
    syllable: {
      onset:   { char: "ข", ipa: "kʰ", class: "high", name: "ขอ ไข่" },
      nucleus: { char: "า", ipa: "aː", type: "long",  name: "สระ อา" },
      coda:    null,
      tone:    { name: "จัตวา", vi: "Hỏi", mark: "↓↑" },
    },
    category: "consonant-high",
    tags: ["ขอ-ไข่", "สระ-อา", "ร่างกาย"],
    difficulty: 1,
    note_vi: "Hạng cao + สระยาว không có ไม้เอก/โท → thanh จัตวา (hỏi). Khác กา!",
  },
  {
    id: "h002",
    thai: "หัว",
    romanization: "hǔa",
    meaning_vi: "Cái đầu",
    audio_url: null,
    syllable: {
      onset:   { char: "ห", ipa: "h",  class: "high", name: "หอ หีบ" },
      nucleus: { char: "ัว", ipa: "ua", type: "short", name: "สระ อัว" },
      coda:    null,
      tone:    { name: "จัตวา", vi: "Hỏi", mark: "↓↑" },
    },
    category: "consonant-high",
    tags: ["หอ-หีบ", "สระ-อัว", "ร่างกาย"],
    difficulty: 2,
    note_vi: "สระ อัว là nguyên âm đôi. หัว = đầu — từ rất thông dụng.",
  },
  {
    id: "h003",
    thai: "ฉัน",
    romanization: "chǎn",
    meaning_vi: "Tôi (nữ, thân thiết)",
    audio_url: null,
    syllable: {
      onset:   { char: "ฉ", ipa: "tɕʰ", class: "high", name: "ฉอ ฉิ่ง" },
      nucleus: { char: "ั", ipa: "a",   type: "short", name: "สระ อั–" },
      coda:    { char: "น", ipa: "n",   name: "นอ หนู" },
      tone:    { name: "จัตวา", vi: "Hỏi", mark: "↓↑" },
    },
    category: "consonant-high",
    tags: ["ฉอ-ฉิ่ง", "สรรพนาม", "คำสำคัญ"],
    difficulty: 1,
    note_vi: "Đại từ ngôi 1 phổ biến cho nữ. Hạng cao + coda น + สระสั้น.",
  },

  // ── CONSONANT LOW CLASS ──
  {
    id: "l001",
    thai: "งาน",
    romanization: "ngaan",
    meaning_vi: "Công việc / lễ",
    audio_url: null,
    syllable: {
      onset:   { char: "ง", ipa: "ŋ",  class: "low",  name: "งอ งู" },
      nucleus: { char: "า", ipa: "aː", type: "long",  name: "สระ อา" },
      coda:    { char: "น", ipa: "n",  name: "นอ หนู" },
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "consonant-low",
    tags: ["งอ-งู", "สระ-อา", "คำทั่วไป"],
    difficulty: 1,
    note_vi: "Hạng thấp + สระยาว + coda → thanh ngang. Chú ý: ง đọc như 'ng' trong 'ngon'.",
  },
  {
    id: "l002",
    thai: "นม",
    romanization: "nom",
    meaning_vi: "Sữa",
    audio_url: null,
    syllable: {
      onset:   { char: "น", ipa: "n",  class: "low",  name: "นอ หนู" },
      nucleus: { char: "โ–ะ", ipa: "o", type: "short", name: "สระ โ–ะ" },
      coda:    { char: "ม", ipa: "m",  name: "มอ ม้า" },
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "consonant-low",
    tags: ["นอ-หนู", "อาหาร", "คำง่าย"],
    difficulty: 1,
    note_vi: "สระ โ–ะ ngắn ẩn trong chữ viết — khi có coda, สระ o ngắn không hiện ký hiệu.",
  },
  {
    id: "l003",
    thai: "ยาย",
    romanization: "yaai",
    meaning_vi: "Bà ngoại",
    audio_url: null,
    syllable: {
      onset:   { char: "ย", ipa: "j",  class: "low",  name: "ยอ ยักษ์" },
      nucleus: { char: "า", ipa: "aː", type: "long",  name: "สระ อา" },
      coda:    { char: "ย", ipa: "j",  name: "ยอ ยักษ์" },
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "consonant-low",
    tags: ["ยอ-ยักษ์", "ครอบครัว"],
    difficulty: 2,
    note_vi: "ย vừa là onset vừa là coda — tạo ra diphthong อาย.",
  },

  // ── VOWELS SHORT ──
  {
    id: "vs001",
    thai: "คะ",
    romanization: "kha",
    meaning_vi: "Tiểu từ lịch sự (nữ)",
    audio_url: null,
    syllable: {
      onset:   { char: "ค", ipa: "kʰ", class: "low",  name: "คอ ควาย" },
      nucleus: { char: "ะ", ipa: "a",  type: "short", name: "สระ อะ" },
      coda:    null,
      tone:    { name: "ตรี", vi: "Sắc", mark: "↑" },
    },
    category: "vowel-short",
    tags: ["มารยาท", "สระ-อะ", "คำสำคัญ"],
    difficulty: 1,
    note_vi: "Tiểu từ lịch sự CỰC quan trọng. ค hạng thấp + สระอะ ngắn → thanh ตรี.",
  },
  {
    id: "vs002",
    thai: "กิน",
    romanization: "gin",
    meaning_vi: "Ăn",
    audio_url: null,
    syllable: {
      onset:   { char: "ก", ipa: "k",  class: "mid",  name: "กอ ไก่" },
      nucleus: { char: "ิ", ipa: "i",  type: "short", name: "สระ อิ" },
      coda:    { char: "น", ipa: "n",  name: "นอ หนู" },
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "vowel-short",
    tags: ["กอ-ไก่", "สระ-อิ", "กริยาสำคัญ"],
    difficulty: 1,
    note_vi: "Động từ ăn — dùng nhiều nhất. สระ อิ ngắn viết trên phụ âm.",
  },

  // ── VOWELS LONG ──
  {
    id: "vl001",
    thai: "มี",
    romanization: "mii",
    meaning_vi: "Có (sở hữu)",
    audio_url: null,
    syllable: {
      onset:   { char: "ม", ipa: "m",  class: "low",  name: "มอ ม้า" },
      nucleus: { char: "ี", ipa: "iː", type: "long",  name: "สระ อี" },
      coda:    null,
      tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
    },
    category: "vowel-long",
    tags: ["มอ-ม้า", "สระ-อี", "กริยาสำคัญ"],
    difficulty: 1,
    note_vi: "Động từ có — cực kỳ thông dụng. มี + คน = มีคน (có người).",
  },
  {
    id: "vl002",
    thai: "ดูก",
    romanization: "dùuk",
    meaning_vi: "กระดูก = Xương",
    audio_url: null,
    syllable: {
      onset:   { char: "ด", ipa: "d",  class: "mid",  name: "ดอ เด็ก" },
      nucleus: { char: "ู", ipa: "uː", type: "long",  name: "สระ อู" },
      coda:    { char: "ก", ipa: "k̚", name: "กอ ไก่ (stop)" },
      tone:    { name: "เอก", vi: "Thấp", mark: "↓" },
    },
    category: "vowel-long",
    tags: ["ดอ-เด็ก", "สระ-อู", "coda-stop"],
    difficulty: 2,
    note_vi: "Coda ก tạo âm dừng (stop). สระยาว + coda stop → tone เปลี่ยน.",
  },

  // ── TONE RULES ──
  {
    id: "t001",
    thai: "ไม้เอก",
    romanization: "máai èek",
    meaning_vi: "Dấu thấp ( ่ )",
    audio_url: null,
    syllable: {
      onset:   { char: "–", ipa: "–",  class: "mid",  name: "Bất kỳ" },
      nucleus: { char: "่", ipa: "–",  type: "mark",  name: "วรรณยุกต์ เอก" },
      coda:    null,
      tone:    { name: "เอก", vi: "Thấp", mark: "↓" },
    },
    category: "tone-rule",
    tags: ["วรรณยุกต์", "quy-tắc"],
    difficulty: 2,
    note_vi: "ไม้เอก đặt trên onset. Hạng giữa → เอก (thấp). Hạng สูง → เอก (thấp). Hạng ต่ำ → โท (ngã).",
  },
  {
    id: "t002",
    thai: "ไม้โท",
    romanization: "máai thoo",
    meaning_vi: "Dấu ngã ( ้ )",
    audio_url: null,
    syllable: {
      onset:   { char: "–", ipa: "–",  class: "mid",  name: "Bất kỳ" },
      nucleus: { char: "้", ipa: "–",  type: "mark",  name: "วรรณยุกต์ โท" },
      coda:    null,
      tone:    { name: "โท", vi: "Ngã", mark: "↓↑" },
    },
    category: "tone-rule",
    tags: ["วรรณยุกต์", "quy-tắc"],
    difficulty: 2,
    note_vi: "ไม้โท → hạng giữa & สูง cho thanh โท (ngã). Hạng ต่ำ → ตรี (sắc).",
  },

  // ── COMMON WORDS ──
  {
    id: "cw001",
    thai: "สวัสดี",
    romanization: "sà-wàt-dii",
    meaning_vi: "Xin chào",
    audio_url: null,
    syllable: {
      onset:   { char: "ส", ipa: "s",  class: "high", name: "สอ เสือ" },
      nucleus: { char: "หลายพยางค์", ipa: "3 âm tiết", type: "compound", name: "สวัสดี" },
      coda:    null,
      tone:    { name: "หลายเสียง", vi: "sà · wàt · dii", mark: "↓↓–" },
    },
    category: "common-words",
    tags: ["ทักทาย", "คำสำคัญ", "3-syllable"],
    difficulty: 1,
    note_vi: "Lời chào quan trọng nhất! 3 âm tiết: สะ(↓) – หวัด(↓) – ดี(–). Kèm wai (chắp tay) khi gặp lần đầu.",
  },
  {
    id: "cw002",
    thai: "ขอบคุณ",
    romanization: "khòop-khun",
    meaning_vi: "Cảm ơn",
    audio_url: null,
    syllable: {
      onset:   { char: "ข", ipa: "kʰ", class: "high", name: "ขอ ไข่" },
      nucleus: { char: "หลายพยางค์", ipa: "2 âm tiết", type: "compound", name: "ขอบคุณ" },
      coda:    { char: "บ+น", ipa: "p̚+n", name: "stop + nasal" },
      tone:    { name: "หลายเสียง", vi: "khòop · khun", mark: "↓–" },
    },
    category: "common-words",
    tags: ["มารยาท", "คำสำคัญ", "2-syllable"],
    difficulty: 1,
    note_vi: "Cảm ơn — ขอบ (↓) + คุณ (–). Thêm ครับ/ค่ะ ở cuối để lịch sự hơn.",
  },
  {
    id: "cw003",
    thai: "ไม่เป็นไร",
    romanization: "mâi-pen-rai",
    meaning_vi: "Không sao / Không có gì",
    audio_url: null,
    syllable: {
      onset:   { char: "ม+ป+ร", ipa: "m+p+r", class: "low+mid+low", name: "3 onset" },
      nucleus: { char: "หลายพยางค์", ipa: "3 âm tiết", type: "compound", name: "ไม่เป็นไร" },
      coda:    null,
      tone:    { name: "หลายเสียง", vi: "mâi · pen · rai", mark: "↓––" },
    },
    category: "common-words",
    tags: ["วัฒนธรรม", "คำสำคัญ", "3-syllable"],
    difficulty: 1,
    note_vi: "Câu cửa miệng người Thái — thể hiện tinh thần mai pen rai (thư thái, không câu nệ).",
  },
  {
    id: "cw004",
    thai: "อร่อย",
    romanization: "à-ròi",
    meaning_vi: "Ngon (đồ ăn)",
    audio_url: null,
    syllable: {
      onset:   { char: "อ", ipa: "ʔ",  class: "mid",  name: "อ อ่าง (silent onset)" },
      nucleus: { char: "หลายพยางค์", ipa: "2 âm tiết", type: "compound", name: "อร่อย" },
      coda:    { char: "ย", ipa: "j",  name: "ยอ ยักษ์" },
      tone:    { name: "หลายเสียง", vi: "à · ròi", mark: "↓↓" },
    },
    category: "common-words",
    tags: ["อาหาร", "คำสำคัญ", "2-syllable"],
    difficulty: 1,
    note_vi: "Từ hay dùng nhất khi ăn Thái! อ ở đầu là 'silent onset' — phát âm bắt đầu bằng chắn họng.",
  },
];

// ============================================================
// QUIZ HELPER — Generate wrong answer options
// ============================================================
export function getQuizOptions(targetId, field = "meaning_vi", count = 3) {
  const target = VOCAB.find(v => v.id === targetId);
  if (!target) return [];

  const pool = VOCAB.filter(v => v.id !== targetId && v[field]);
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);

  const options = [
    { value: target[field], correct: true },
    ...shuffled.map(v => ({ value: v[field], correct: false })),
  ].sort(() => Math.random() - 0.5);

  return options;
}

// ============================================================
// SEARCH — fuzzy match across thai, romanization, meaning_vi, tags
// ============================================================
export function searchVocab(query) {
  const q = query.toLowerCase().trim();
  if (!q) return VOCAB;
  return VOCAB.filter(v =>
    v.thai.includes(q) ||
    v.romanization.toLowerCase().includes(q) ||
    v.meaning_vi.toLowerCase().includes(q) ||
    v.tags.some(t => t.toLowerCase().includes(q)) ||
    (v.note_vi && v.note_vi.toLowerCase().includes(q))
  );
}

export function filterByCategory(categoryId) {
  if (categoryId === "all") return VOCAB;
  return VOCAB.filter(v => v.category === categoryId);
}
