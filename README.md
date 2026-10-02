# ✏️ ResumeCraft — Professional Resume Builder

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A sleek, interactive, single-page resume builder — zero frameworks, zero dependencies.**

[Live Demo](#-getting-started) · [Features](#-features) · [Screenshots](#-screenshots) · [Contributing](#-contributing)

</div>

---

## 📖 About

ResumeCraft is a fully functional, production-ready web application that lets you create professional resumes directly in your browser. Built entirely with **vanilla HTML, CSS, and JavaScript** — no React, no Bootstrap, no Tailwind, no CDNs. Just three clean files that work out of the box.

Fill in your details through a guided 6-step form, watch your resume come to life in real-time, customize the look, and download it as a PDF. It's that simple.

---

## ✨ Features

| Feature | Description |
|:---|:---|
| 📝 **6-Step Form Wizard** | Guided flow — Personal Info → Experience → Education → Skills → Projects → Extras |
| 👁️ **Live Preview** | Resume updates instantly as you type — no refresh needed |
| 🎨 **3 Resume Templates** | **Classic** (bold header), **Modern** (sidebar layout), **Minimal** (clean & centered) |
| 🎯 **7 Accent Colors** | Blue, Purple, Green, Red, Amber, Cyan, Slate — one click to switch |
| 🌙 **Dark Mode** | Toggle between light and dark editing environments |
| 📸 **Photo Upload** | Optional profile picture with preview and remove functionality |
| 🏷️ **Tag Inputs** | Add Skills, Languages, Certifications & Interests by pressing Enter |
| ➕ **Dynamic Sections** | Add/remove multiple Experience, Education, and Project entries |
| 💾 **Auto-Save** | Data persists in localStorage — survives page refresh |
| 📄 **PDF Download** | Print-optimized CSS hides all editor UI — exports clean resume |
| 📱 **Fully Responsive** | Works flawlessly on desktop, tablet, and mobile |
| ⚡ **Zero Dependencies** | No frameworks, no libraries, no build tools required |

---

## 📁 Project Structure

```
ResumeBuilder/
├── index.html      # Main HTML structure
├── style.css       # Complete styling with dark mode, templates & print CSS
├── script.js       # All interactivity, state management & rendering
└── README.md       # You're reading this
```

**That's it.** Three files. No `node_modules`, no `package.json`, no build step.

---

## 🚀 Getting Started

### Option 1: Direct Open
Simply double-click `index.html` — it opens in any modern browser.

### Option 2: Command Line
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 3: Local Server (optional)
```bash
# Python
python -m http.server 3000

# Node.js
npx serve .
```
Then visit `http://localhost:3000`

---

## 🖥️ Screenshots

### Hero Section
> A clean landing page with animated floating cards and a clear call-to-action.

### Builder — Form Panel + Live Preview
> Side-by-side layout: fill details on the left, see the resume update on the right in real-time.

### Template Variants

| Classic | Modern | Minimal |
|:---:|:---:|:---:|
| Bold colored header | Sidebar two-column | Clean centered layout |
| Traditional structure | Modern professional | Minimalist elegance |

### Dark Mode
> Full dark theme support for comfortable editing in low-light environments.

---

## 🛠️ How It Works

1. **Fill the Form** — Navigate through 6 steps covering all resume sections
2. **Real-Time Render** — Every keystroke triggers an instant re-render of the preview
3. **Customize** — Pick a template, choose an accent color, toggle dark mode
4. **Download** — Hit "Download PDF" which triggers `window.print()` with print-optimized CSS that strips all UI controls

### Technical Highlights

- **State Management** — Single centralized `state` object drives all rendering
- **XSS Protection** — All user input is escaped via `textContent`-based sanitization before injection
- **Debounced Auto-Save** — Saves to `localStorage` 2 seconds after the last input change
- **CSS Custom Properties** — Dynamic accent color switching via `--accent` variable
- **Print Stylesheet** — `@media print` rules hide the editor and present only the resume document

---

## 🎨 Templates

### Classic
- Full-width colored header with gradient background
- Name, title, and contact info prominently displayed
- Traditional section-based layout with underlined headings
- Best for: Corporate, traditional industries

### Modern
- Two-column layout with a colored sidebar
- Skills, languages, and interests in the sidebar
- Main content area for experience, education, and projects
- Best for: Tech, design, creative fields

### Minimal
- Centered header with subtle styling
- Left-border accented entries for visual hierarchy
- Maximum whitespace, zero clutter
- Best for: Academic, research, minimalist preference

---

## 🌈 Customization

### Accent Colors
Choose from 7 pre-defined colors that update the entire resume theme:

| Color | Hex Code |
|:---|:---|
| 🔵 Blue | `#2563eb` |
| 🟣 Purple | `#7c3aed` |
| 🟢 Green | `#059669` |
| 🔴 Red | `#dc2626` |
| 🟡 Amber | `#d97706` |
| 🔵 Cyan | `#0891b2` |
| ⚫ Slate | `#374151` |

### Dark Mode
Toggle via the moon/sun icon in the navbar. Preference is saved to `localStorage`.

---

## 📱 Responsive Breakpoints

| Breakpoint | Behavior |
|:---|:---|
| `> 1024px` | Side-by-side form + preview layout |
| `768px – 1024px` | Stacked layout, full-width panels |
| `480px – 768px` | Compact form, simplified stepper |
| `< 480px` | Mobile-optimized with reduced padding |

---

## 🔧 Browser Support

| Browser | Supported |
|:---|:---:|
| Chrome 80+ | ✅ |
| Firefox 78+ | ✅ |
| Safari 14+ | ✅ |
| Edge 80+ | ✅ |
| Opera 67+ | ✅ |
| IE 11 | ❌ |

---

## 📄 Data & Privacy

- **All data stays local.** Nothing is sent to any server.
- Data is stored in your browser's `localStorage`.
- Clearing browser data or using incognito mode will reset saved information.
- Photo uploads are converted to base64 and stored locally — no external uploads.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Guidelines
- Vanilla HTML/CSS/JS only — no frameworks or libraries
- Maintain the three-file structure
- Test across multiple browsers and screen sizes
- Follow existing code style and naming conventions

---

## 💡 Roadmap

- [ ] Additional resume templates (Creative, Executive, ATS-Optimized)
- [ ] Drag-and-drop section reordering
- [ ] Multiple resume profiles
- [ ] JSON import/export for resume data
- [ ] Custom font selection
- [ ] QR code generation for contact info
- [ ] ATS compatibility score checker

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

```
MIT License

Copyright (c) 2026 Yash Pal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**Built with ❤️ by Yash Pal**

⭐ Star this repo if you found it useful!

</div>
