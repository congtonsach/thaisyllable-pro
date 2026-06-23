# 🇹🇭 ThaiSyllable Pro

**Ứng dụng tra cứu quy tắc âm tiết tiếng Thái** — bởi cộng đồng **THÁI DỄ HỌC**

Phân tích trực quan cấu trúc **Onset · Nucleus · Coda · Tone** của từng âm tiết tiếng Thái, với chế độ Learn và Quiz.

---

## 🗂 Cấu trúc thư mục

```
thaisyllable-pro/
├── index.html          ← Entry point, layout shell, CDN imports
├── src/
│   ├── data.js         ← Từ vựng, categories, search/filter, quiz helpers
│   ├── ui.js           ← Pure render functions (trả về HTML string)
│   └── app.js          ← State, event binding, điều phối render
├── assets/
│   └── favicon.svg     ← Logo (tuỳ chọn)
└── README.md
```

### Tại sao tách 3 file JS?

| File | Trách nhiệm | Thay đổi khi nào |
|------|------------|-----------------|
| `data.js` | Model — dữ liệu, types, queries | Thêm từ mới, tích hợp Supabase |
| `ui.js` | View — template literals → HTML | Thay đổi giao diện, thêm component |
| `app.js` | Controller — state, events | Thêm feature (bookmark, audio, v.v.) |

---

## 🚀 Deploy lên Vercel qua GitHub

### Bước 1 — Tạo repo GitHub

```bash
git init
git add .
git commit -m "feat: init ThaiSyllable Pro"
git branch -M main
git remote add origin https://github.com/<your-username>/thaisyllable-pro.git
git push -u origin main
```

### Bước 2 — Import vào Vercel

1. Truy cập [vercel.com](https://vercel.com) → **Add New Project**
2. Chọn repo `thaisyllable-pro` từ GitHub
3. **Framework Preset**: chọn **Other** (đây là static HTML, không cần build)
4. **Build Command**: *(để trống)*
5. **Output Directory**: *(để trống hoặc nhập `.`)*
6. Nhấn **Deploy** → Vercel tự phát hiện `index.html`

> ⚡ Vercel phục vụ file tĩnh tự động — không cần cấu hình thêm.

### Bước 3 — Tùy chỉnh domain

Vercel cấp domain miễn phí dạng `thaisyllable-pro.vercel.app`.  
Có thể thêm domain tùy chỉnh trong **Project Settings → Domains**.

### Bước 4 — Auto-deploy

Mỗi lần `git push origin main` → Vercel tự động re-deploy.  
Branch khác (vd: `dev`) → Vercel tạo preview URL riêng.

---

## 🔧 Chạy local

Vì dùng ES Modules (`type="module"`), cần serve qua HTTP (không mở file trực tiếp):

```bash
# Cách 1: VS Code → Live Server extension (click Go Live)

# Cách 2: Node.js
npx serve .

# Cách 3: Python
python -m http.server 3000
```

Mở trình duyệt → `http://localhost:3000`

---

## ➕ Thêm từ vựng mới

Mở `src/data.js`, thêm object vào mảng `VOCAB`:

```js
{
  id: "k999",                    // unique, format: <prefix><number>
  thai: "แมว",
  romanization: "mæw",
  meaning_vi: "Con mèo",
  audio_url: null,               // hoặc URL file .mp3
  syllable: {
    onset:   { char: "แม", ipa: "mɛː", class: "low",  name: "มอ ม้า" },
    nucleus: { char: "า",  ipa: "aː",  type: "long",  name: "สระ แอ" },
    coda:    { char: "ว",  ipa: "w",   name: "วอ แหวน" },
    tone:    { name: "สามัญ", vi: "Ngang", mark: "–" },
  },
  category: "consonant-low",    // phải là id trong CATEGORIES
  tags: ["สัตว์", "คำง่าย"],
  difficulty: 1,
  note_vi: "Ghi chú ngữ pháp hoặc mẹo nhớ cho người Việt.",
}
```

---

## 🗄 Roadmap tích hợp Supabase

Mỗi entry trong `VOCAB` được thiết kế để map trực tiếp với Supabase table:

```sql
CREATE TABLE syllables (
  id            TEXT PRIMARY KEY,
  thai          TEXT NOT NULL,
  romanization  TEXT,
  meaning_vi    TEXT,
  audio_url     TEXT,
  syllable      JSONB,          -- giữ nguyên object syllable{}
  category      TEXT,
  tags          TEXT[],
  difficulty    INT DEFAULT 1,
  note_vi       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**Khi migration:** Thay hàm `searchVocab()` và `filterByCategory()` trong `data.js`  
bằng Supabase queries — không cần thay đổi `ui.js` hay `app.js`.

---

## 🎨 Design Tokens

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| Onset | `#4F46E5` (Indigo) | Phụ âm đầu |
| Nucleus | `#0891B2` (Cyan) | Nguyên âm |
| Coda | `#D97706` (Amber) | Phụ âm cuối |
| Tone | `#7C3AED` (Violet) | Thanh điệu |
| Background | `#F0F4FF` | Nền trang |

---

## 📦 Dependencies (CDN, không cần npm)

- [Tailwind CSS](https://tailwindcss.com) — utility classes
- [Lucide Icons](https://lucide.dev) — icon set
- [Google Fonts](https://fonts.google.com) — Sarabun, Inter, JetBrains Mono

**Không có build step. Không có node_modules. Mở là chạy.**

---

*Made with ❤️ by THÁI DỄ HỌC *
