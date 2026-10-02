/* ═══════════════════════════════════════════════════════
   ResumeForge — script.js
   Vanilla JS — Zero dependencies
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ───────────────────────────────────────────
  const state = {
    currentStep: 1,
    totalSteps: 6,
    template: 'classic',
    accent: '#2563eb',
    photo: null,
    skills: [],
    languages: [],
    certifications: [],
    interests: [],
    experiences: [],
    educations: [],
    projects: [],
  };

  // ── Helpers ─────────────────────────────────────────
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const esc = (s) => {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  };

  // ── Dark Mode ───────────────────────────────────────
  const btnTheme = $('#btnThemeToggle');
  function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    btnTheme.innerHTML = dark ? '&#9788;' : '&#9790;';
    localStorage.setItem('rf-dark', dark ? '1' : '0');
  }
  btnTheme.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));
  if (localStorage.getItem('rf-dark') === '1') applyTheme(true);

  // ── Accent Color ────────────────────────────────────
  function setAccent(color) {
    state.accent = color;
    document.documentElement.style.setProperty('--accent', color);
    // compute dark & light
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const darkR = Math.max(0, r - 30), darkG = Math.max(0, g - 30), darkB = Math.max(0, b - 30);
    document.documentElement.style.setProperty('--accent-dark', `rgb(${darkR},${darkG},${darkB})`);
    document.documentElement.style.setProperty('--accent-light', `rgba(${r},${g},${b},0.12)`);
    $$('.color-dot').forEach((d) => d.classList.toggle('active', d.dataset.color === color));
    renderResume();
  }
  $$('.color-dot').forEach((dot) =>
    dot.addEventListener('click', () => setAccent(dot.dataset.color))
  );

  // ── Stepper ─────────────────────────────────────────
  const stepBtns = $$('.step-btn');
  const stepContents = $$('.step-content');
  const btnPrev = $('#btnPrev');
  const btnNext = $('#btnNext');

  function goToStep(n) {
    state.currentStep = Math.max(1, Math.min(state.totalSteps, n));
    stepBtns.forEach((b) => b.classList.toggle('active', +b.dataset.step === state.currentStep));
    stepContents.forEach((c) => c.classList.toggle('active', +c.dataset.step === state.currentStep));
    btnPrev.disabled = state.currentStep === 1;
    btnNext.textContent = state.currentStep === state.totalSteps ? 'Done ✓' : 'Next →';
  }
  stepBtns.forEach((b) => b.addEventListener('click', () => goToStep(+b.dataset.step)));
  btnPrev.addEventListener('click', () => goToStep(state.currentStep - 1));
  btnNext.addEventListener('click', () => {
    if (state.currentStep < state.totalSteps) goToStep(state.currentStep + 1);
  });

  // ── Template Picker ─────────────────────────────────
  $$('.tmpl-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      $$('.tmpl-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.template = btn.dataset.template;
      activateTemplate();
    })
  );

  function activateTemplate() {
    $$('.resume-tpl').forEach((t) => t.classList.remove('active'));
    const map = {
      classic: 'tplClassic',
      modern: 'tplModern',
      minimal: 'tplMinimal',
      bold: 'tplBold',
      executive: 'tplExecutive',
      creative: 'tplCreative',
      compact: 'tplCompact',
      timeline: 'tplTimeline'
    };
    const el = $('#' + map[state.template]);
    if (el) el.classList.add('active');
    renderResume();
  }

  // ── Photo Upload ────────────────────────────────────
  const photoInput = $('#photoUpload');
  const photoPreviewWrap = $('#photoPreviewWrap');
  const photoPreview = $('#photoPreview');
  const removePhoto = $('#removePhoto');

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.photo = ev.target.result;
      photoPreview.src = state.photo;
      photoPreviewWrap.style.display = 'inline-block';
      renderResume();
    };
    reader.readAsDataURL(file);
  });
  removePhoto.addEventListener('click', () => {
    state.photo = null;
    photoInput.value = '';
    photoPreviewWrap.style.display = 'none';
    renderResume();
  });

  // ── Tag Inputs ──────────────────────────────────────
  function setupTagInput(inputId, containerId, stateKey) {
    const input = $('#' + inputId);
    const container = $('#' + containerId);

    function renderTags() {
      container.innerHTML = state[stateKey]
        .map(
          (t, i) =>
            `<span class="tag">${esc(t)}<span class="tag-remove" data-idx="${i}">&times;</span></span>`
        )
        .join('');
      container.querySelectorAll('.tag-remove').forEach((r) =>
        r.addEventListener('click', () => {
          state[stateKey].splice(+r.dataset.idx, 1);
          renderTags();
          renderResume();
        })
      );
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, '');
        if (val && !state[stateKey].includes(val)) {
          state[stateKey].push(val);
          renderTags();
          renderResume();
        }
        input.value = '';
      }
      if (e.key === 'Backspace' && !input.value && state[stateKey].length) {
        state[stateKey].pop();
        renderTags();
        renderResume();
      }
    });

    // Click on wrapper focuses input
    input.closest('.tag-input-wrap').addEventListener('click', () => input.focus());
  }

  setupTagInput('skillInput', 'skillTags', 'skills');
  setupTagInput('languageInput', 'languageTags', 'languages');
  setupTagInput('certInput', 'certTags', 'certifications');
  setupTagInput('interestInput', 'interestTags', 'interests');

  // ── Repeater: Experience ────────────────────────────
  let expCounter = 0;
  $('#addExperience').addEventListener('click', () => {
    const id = expCounter++;
    state.experiences.push({ id, title: '', company: '', startDate: '', endDate: '', description: '' });
    renderExperienceForm();
    renderResume();
  });

  function renderExperienceForm() {
    const list = $('#experienceList');
    list.innerHTML = state.experiences
      .map(
        (exp, idx) => `
      <div class="repeater-card" data-idx="${idx}">
        <button type="button" class="btn-remove-card" data-idx="${idx}">&times;</button>
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" data-field="title" data-idx="${idx}" value="${esc(exp.title)}" placeholder="e.g. Frontend Developer" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Company</label>
            <input type="text" data-field="company" data-idx="${idx}" value="${esc(exp.company)}" placeholder="e.g. Google" />
          </div>
          <div class="form-group">
            <label>Duration</label>
            <div class="form-row">
              <input type="text" data-field="startDate" data-idx="${idx}" value="${esc(exp.startDate)}" placeholder="Jan 2022" />
              <input type="text" data-field="endDate" data-idx="${idx}" value="${esc(exp.endDate)}" placeholder="Present" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea data-field="description" data-idx="${idx}" rows="3" placeholder="Key responsibilities and achievements...">${esc(exp.description)}</textarea>
        </div>
      </div>`
      )
      .join('');

    // Bind events
    list.querySelectorAll('.btn-remove-card').forEach((btn) =>
      btn.addEventListener('click', () => {
        state.experiences.splice(+btn.dataset.idx, 1);
        renderExperienceForm();
        renderResume();
      })
    );
    list.querySelectorAll('input, textarea').forEach((el) =>
      el.addEventListener('input', () => {
        const idx = +el.dataset.idx;
        const field = el.dataset.field;
        state.experiences[idx][field] = el.value;
        renderResume();
      })
    );
  }

  // ── Repeater: Education ─────────────────────────────
  let eduCounter = 0;
  $('#addEducation').addEventListener('click', () => {
    const id = eduCounter++;
    state.educations.push({ id, degree: '', school: '', startDate: '', endDate: '', description: '' });
    renderEducationForm();
    renderResume();
  });

  function renderEducationForm() {
    const list = $('#educationList');
    list.innerHTML = state.educations
      .map(
        (edu, idx) => `
      <div class="repeater-card" data-idx="${idx}">
        <button type="button" class="btn-remove-card" data-idx="${idx}">&times;</button>
        <div class="form-group">
          <label>Degree / Course</label>
          <input type="text" data-field="degree" data-idx="${idx}" value="${esc(edu.degree)}" placeholder="e.g. B.Tech in Computer Science" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>School / University</label>
            <input type="text" data-field="school" data-idx="${idx}" value="${esc(edu.school)}" placeholder="e.g. IIT Delhi" />
          </div>
          <div class="form-group">
            <label>Duration</label>
            <div class="form-row">
              <input type="text" data-field="startDate" data-idx="${idx}" value="${esc(edu.startDate)}" placeholder="2018" />
              <input type="text" data-field="endDate" data-idx="${idx}" value="${esc(edu.endDate)}" placeholder="2022" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Details (optional)</label>
          <textarea data-field="description" data-idx="${idx}" rows="2" placeholder="GPA, honors, relevant coursework...">${esc(edu.description)}</textarea>
        </div>
      </div>`
      )
      .join('');

    list.querySelectorAll('.btn-remove-card').forEach((btn) =>
      btn.addEventListener('click', () => {
        state.educations.splice(+btn.dataset.idx, 1);
        renderEducationForm();
        renderResume();
      })
    );
    list.querySelectorAll('input, textarea').forEach((el) =>
      el.addEventListener('input', () => {
        state.educations[+el.dataset.idx][el.dataset.field] = el.value;
        renderResume();
      })
    );
  }

  // ── Repeater: Projects ──────────────────────────────
  let projCounter = 0;
  $('#addProject').addEventListener('click', () => {
    const id = projCounter++;
    state.projects.push({ id, name: '', tech: '', link: '', description: '' });
    renderProjectForm();
    renderResume();
  });

  function renderProjectForm() {
    const list = $('#projectList');
    list.innerHTML = state.projects
      .map(
        (proj, idx) => `
      <div class="repeater-card" data-idx="${idx}">
        <button type="button" class="btn-remove-card" data-idx="${idx}">&times;</button>
        <div class="form-group">
          <label>Project Name</label>
          <input type="text" data-field="name" data-idx="${idx}" value="${esc(proj.name)}" placeholder="e.g. Portfolio Website" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Technologies</label>
            <input type="text" data-field="tech" data-idx="${idx}" value="${esc(proj.tech)}" placeholder="e.g. React, Node.js, MongoDB" />
          </div>
          <div class="form-group">
            <label>Link (optional)</label>
            <input type="url" data-field="link" data-idx="${idx}" value="${esc(proj.link)}" placeholder="https://github.com/..." />
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea data-field="description" data-idx="${idx}" rows="3" placeholder="What it does, your role, key achievements...">${esc(proj.description)}</textarea>
        </div>
      </div>`
      )
      .join('');

    list.querySelectorAll('.btn-remove-card').forEach((btn) =>
      btn.addEventListener('click', () => {
        state.projects.splice(+btn.dataset.idx, 1);
        renderProjectForm();
        renderResume();
      })
    );
    list.querySelectorAll('input, textarea').forEach((el) =>
      el.addEventListener('input', () => {
        state.projects[+el.dataset.idx][el.dataset.field] = el.value;
        renderResume();
      })
    );
  }

  // ── Live Input Binding ──────────────────────────────
  const liveFields = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'summary'];
  liveFields.forEach((id) => {
    const el = $('#' + id);
    if (el) el.addEventListener('input', () => renderResume());
  });

  // ── Build Contact HTML ──────────────────────────────
  function buildContactItems() {
    const items = [];
    const email = $('#email').value.trim();
    const phone = $('#phone').value.trim();
    const location = $('#location').value.trim();
    const website = $('#website').value.trim();
    const linkedin = $('#linkedin').value.trim();
    const github = $('#github').value.trim();
    if (email) items.push({ icon: '✉', text: email, href: 'mailto:' + email });
    if (phone) items.push({ icon: '☎', text: phone, href: 'tel:' + phone.replace(/\s/g, '') });
    if (location) items.push({ icon: '📍', text: location });
    if (website) items.push({ icon: '🌐', text: website.replace(/^https?:\/\//, ''), href: website });
    if (linkedin) items.push({ icon: '💼', text: 'LinkedIn', href: linkedin });
    if (github) items.push({ icon: '💻', text: 'GitHub', href: github });
    return items;
  }

  // ── Build Entry HTML ────────────────────────────────
  function buildEntryHTML(entry, prefix, isProject) {
    const title = isProject ? entry.name : entry.title || entry.degree;
    const sub = isProject ? '' : entry.company || entry.school || '';
    const date = isProject ? '' : [entry.startDate, entry.endDate].filter(Boolean).join(' – ');
    const desc = entry.description || '';
    const tech = isProject ? entry.tech || '' : '';
    const link = isProject ? entry.link || '' : '';

    if (!title && !sub && !desc) return '';
    return `
      <div class="${prefix}-entry">
        <div class="${prefix}-entry-header">
          <div>
            <div class="${prefix}-entry-title">${esc(title)}</div>
            ${sub ? `<div class="${prefix}-entry-sub">${esc(sub)}</div>` : ''}
          </div>
          ${date ? `<div class="${prefix}-entry-date">${esc(date)}</div>` : ''}
        </div>
        ${desc ? `<div class="${prefix}-entry-desc">${esc(desc)}</div>` : ''}
        ${tech ? `<div class="${prefix}-entry-tech">Tech: ${esc(tech)}</div>` : ''}
        ${link ? `<div class="${prefix}-entry-link"><a href="${esc(link)}" target="_blank">${esc(link.replace(/^https?:\/\//, ''))}</a></div>` : ''}
      </div>`;
  }

  // ── Render Resume ───────────────────────────────────
  function renderResume() {
    const name = $('#fullName').value.trim() || 'Your Name';
    const title = $('#jobTitle').value.trim() || 'Your Job Title';
    const summary = $('#summary').value.trim();
    const contacts = buildContactItems();

    // Render each template
    renderClassic(name, title, summary, contacts);
    renderModern(name, title, summary, contacts);
    renderMinimal(name, title, summary, contacts);
    renderBold(name, title, summary, contacts);
    renderExecutive(name, title, summary, contacts);
    renderCreative(name, title, summary, contacts);
    renderCompact(name, title, summary, contacts);
    renderTimeline(name, title, summary, contacts);
  }

  function showSection(id, show) {
    const el = $('#' + id);
    if (el) el.style.display = show ? '' : 'none';
  }

  // ── Classic Render ──────────────────────────────────
  function renderClassic(name, title, summary, contacts) {
    $('#rc-name').textContent = name;
    $('#rc-title').textContent = title;

    // photo
    const photo = $('#rc-photo');
    if (state.photo) { photo.src = state.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }

    // contact
    $('#rc-contact').innerHTML = contacts
      .map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`)
      .join('');

    // summary
    showSection('rc-summary-sec', summary);
    $('#rc-summary').textContent = summary;

    // experience
    showSection('rc-exp-sec', state.experiences.length);
    $('#rc-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rc', false)).join('');

    // education
    showSection('rc-edu-sec', state.educations.length);
    $('#rc-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rc', false)).join('');

    // skills
    showSection('rc-skills-sec', state.skills.length);
    $('#rc-skills').innerHTML = state.skills.map((s) => `<span class="rc-tag">${esc(s)}</span>`).join('');

    // projects
    showSection('rc-projects-sec', state.projects.length);
    $('#rc-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rc', true)).join('');

    // certs
    showSection('rc-certs-sec', state.certifications.length);
    $('#rc-certs').innerHTML = state.certifications.map((c) => `<span class="rc-tag">${esc(c)}</span>`).join('');

    // languages
    showSection('rc-langs-sec', state.languages.length);
    $('#rc-langs').innerHTML = state.languages.map((l) => `<span class="rc-tag">${esc(l)}</span>`).join('');

    // interests
    showSection('rc-interests-sec', state.interests.length);
    $('#rc-interests').innerHTML = state.interests.map((i) => `<span class="rc-tag">${esc(i)}</span>`).join('');
  }

  // ── Modern Render ───────────────────────────────────
  function renderModern(name, title, summary, contacts) {
    $('#rm-name').textContent = name;
    $('#rm-title').textContent = title;

    const photo = $('#rm-photo');
    if (state.photo) { photo.src = state.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }

    $('#rm-contact').innerHTML = contacts
      .map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`)
      .join('');

    showSection('rm-summary-sec', summary);
    $('#rm-summary').textContent = summary;

    showSection('rm-exp-sec', state.experiences.length);
    $('#rm-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rm', false)).join('');

    showSection('rm-edu-sec', state.educations.length);
    $('#rm-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rm', false)).join('');

    showSection('rm-skills-sec', state.skills.length);
    $('#rm-skills').innerHTML = state.skills.map((s) => `<span class="rm-tag">${esc(s)}</span>`).join('');

    showSection('rm-projects-sec', state.projects.length);
    $('#rm-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rm', true)).join('');

    showSection('rm-certs-sec', state.certifications.length);
    $('#rm-certs').innerHTML = state.certifications.map((c) => `<span class="rm-tag">${esc(c)}</span>`).join('');

    showSection('rm-langs-sec', state.languages.length);
    $('#rm-langs').innerHTML = state.languages.map((l) => `<span class="rm-tag">${esc(l)}</span>`).join('');

    showSection('rm-interests-sec', state.interests.length);
    $('#rm-interests').innerHTML = state.interests.map((i) => `<span class="rm-tag">${esc(i)}</span>`).join('');
  }

  // ── Minimal Render ──────────────────────────────────
  function renderMinimal(name, title, summary, contacts) {
    $('#rmin-name').textContent = name;
    $('#rmin-title').textContent = title;

    const photo = $('#rmin-photo');
    if (state.photo) { photo.src = state.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }

    $('#rmin-contact').innerHTML = contacts
      .map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`)
      .join('');

    showSection('rmin-summary-sec', summary);
    $('#rmin-summary').textContent = summary;

    showSection('rmin-exp-sec', state.experiences.length);
    $('#rmin-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rmin', false)).join('');

    showSection('rmin-edu-sec', state.educations.length);
    $('#rmin-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rmin', false)).join('');

    showSection('rmin-skills-sec', state.skills.length);
    $('#rmin-skills').innerHTML = state.skills.map((s) => `<span class="rmin-tag">${esc(s)}</span>`).join('');

    showSection('rmin-projects-sec', state.projects.length);
    $('#rmin-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rmin', true)).join('');

    showSection('rmin-certs-sec', state.certifications.length);
    $('#rmin-certs').innerHTML = state.certifications.map((c) => `<span class="rmin-tag">${esc(c)}</span>`).join('');

    showSection('rmin-langs-sec', state.languages.length);
    $('#rmin-langs').innerHTML = state.languages.map((l) => `<span class="rmin-tag">${esc(l)}</span>`).join('');

    showSection('rmin-interests-sec', state.interests.length);
    $('#rmin-interests').innerHTML = state.interests.map((i) => `<span class="rmin-tag">${esc(i)}</span>`).join('');
  }

  // ── Bold Render ──────────────────────────────────────
  function renderBold(name, title, summary, contacts) {
    $('#rb-name').textContent = name;
    $('#rb-title').textContent = title;
    const photo = $('#rb-photo');
    if (state.photo) { photo.src = state.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }
    $('#rb-contact').innerHTML = contacts.map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`).join('');
    showSection('rb-summary-sec', summary);
    $('#rb-summary').textContent = summary;
    showSection('rb-exp-sec', state.experiences.length);
    $('#rb-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rb', false)).join('');
    showSection('rb-edu-sec', state.educations.length);
    $('#rb-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rb', false)).join('');
    showSection('rb-skills-sec', state.skills.length);
    $('#rb-skills').innerHTML = state.skills.map((s) => `<span class="rb-tag">${esc(s)}</span>`).join('');
    showSection('rb-projects-sec', state.projects.length);
    $('#rb-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rb', true)).join('');
    showSection('rb-certs-sec', state.certifications.length);
    $('#rb-certs').innerHTML = state.certifications.map((c) => `<span class="rb-tag">${esc(c)}</span>`).join('');
    showSection('rb-langs-sec', state.languages.length);
    $('#rb-langs').innerHTML = state.languages.map((l) => `<span class="rb-tag">${esc(l)}</span>`).join('');
    showSection('rb-interests-sec', state.interests.length);
    $('#rb-interests').innerHTML = state.interests.map((i) => `<span class="rb-tag">${esc(i)}</span>`).join('');
  }

  // ── Executive Render ────────────────────────────────
  function renderExecutive(name, title, summary, contacts) {
    $('#rex-name').textContent = name;
    $('#rex-title').textContent = title;
    const photo = $('#rex-photo');
    if (state.photo) { photo.src = state.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }
    $('#rex-contact').innerHTML = contacts.map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`).join('');
    showSection('rex-summary-sec', summary);
    $('#rex-summary').textContent = summary;
    showSection('rex-exp-sec', state.experiences.length);
    $('#rex-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rex', false)).join('');
    showSection('rex-edu-sec', state.educations.length);
    $('#rex-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rex', false)).join('');
    showSection('rex-skills-sec', state.skills.length);
    $('#rex-skills').innerHTML = state.skills.map((s) => `<span class="rex-tag">${esc(s)}</span>`).join('');
    showSection('rex-projects-sec', state.projects.length);
    $('#rex-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rex', true)).join('');
    showSection('rex-certs-sec', state.certifications.length);
    $('#rex-certs').innerHTML = state.certifications.map((c) => `<span class="rex-tag">${esc(c)}</span>`).join('');
    showSection('rex-langs-sec', state.languages.length);
    $('#rex-langs').innerHTML = state.languages.map((l) => `<span class="rex-tag">${esc(l)}</span>`).join('');
  }

  // ── Creative Render ────────────────────────────────
  function renderCreative(name, title, summary, contacts) {
    $('#rcr-name').textContent = name;
    $('#rcr-title').textContent = title;
    const photo = $('#rcr-photo');
    if (state.photo) { photo.src = state.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }
    $('#rcr-contact').innerHTML = contacts.map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`).join('');
    showSection('rcr-summary-sec', summary);
    $('#rcr-summary').textContent = summary;
    showSection('rcr-exp-sec', state.experiences.length);
    $('#rcr-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rcr', false)).join('');
    showSection('rcr-edu-sec', state.educations.length);
    $('#rcr-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rcr', false)).join('');
    showSection('rcr-skills-sec', state.skills.length);
    $('#rcr-skills').innerHTML = state.skills.map((s) => `<span class="rcr-tag">${esc(s)}</span>`).join('');
    showSection('rcr-projects-sec', state.projects.length);
    $('#rcr-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rcr', true)).join('');
    showSection('rcr-certs-sec', state.certifications.length);
    $('#rcr-certs').innerHTML = state.certifications.map((c) => `<span class="rcr-tag">${esc(c)}</span>`).join('');
    showSection('rcr-langs-sec', state.languages.length);
    $('#rcr-langs').innerHTML = state.languages.map((l) => `<span class="rcr-tag">${esc(l)}</span>`).join('');
    showSection('rcr-interests-sec', state.interests.length);
    $('#rcr-interests').innerHTML = state.interests.map((i) => `<span class="rcr-tag">${esc(i)}</span>`).join('');
  }

  // ── Compact Render ─────────────────────────────────
  function renderCompact(name, title, summary, contacts) {
    $('#rcp-name').textContent = name;
    $('#rcp-title').textContent = title;
    $('#rcp-contact').innerHTML = contacts.map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`).join('');
    showSection('rcp-summary-sec', summary);
    $('#rcp-summary').textContent = summary;
    showSection('rcp-exp-sec', state.experiences.length);
    $('#rcp-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rcp', false)).join('');
    showSection('rcp-edu-sec', state.educations.length);
    $('#rcp-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rcp', false)).join('');
    showSection('rcp-skills-sec', state.skills.length);
    $('#rcp-skills').innerHTML = state.skills.map((s) => `<span class="rcp-tag">${esc(s)}</span>`).join('');
    showSection('rcp-projects-sec', state.projects.length);
    $('#rcp-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rcp', true)).join('');
    showSection('rcp-certs-sec', state.certifications.length);
    $('#rcp-certs').innerHTML = state.certifications.map((c) => `<span class="rcp-tag">${esc(c)}</span>`).join('');
    showSection('rcp-langs-sec', state.languages.length);
    $('#rcp-langs').innerHTML = state.languages.map((l) => `<span class="rcp-tag">${esc(l)}</span>`).join('');
  }

  // ── Timeline Render ────────────────────────────────
  function renderTimeline(name, title, summary, contacts) {
    $('#rtl-name').textContent = name;
    $('#rtl-title').textContent = title;
    const photo = $('#rtl-photo');
    if (state.photo) { photo.src = state.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }
    $('#rtl-contact').innerHTML = contacts.map((c) => c.href ? `<span>${c.icon} <a href="${esc(c.href)}" target="_blank">${esc(c.text)}</a></span>` : `<span>${c.icon} ${esc(c.text)}</span>`).join('');
    showSection('rtl-summary-sec', summary);
    $('#rtl-summary').textContent = summary;
    showSection('rtl-exp-sec', state.experiences.length);
    $('#rtl-exp').innerHTML = state.experiences.map((e) => buildEntryHTML(e, 'rtl', false)).join('');
    showSection('rtl-edu-sec', state.educations.length);
    $('#rtl-edu').innerHTML = state.educations.map((e) => buildEntryHTML(e, 'rtl', false)).join('');
    showSection('rtl-skills-sec', state.skills.length);
    $('#rtl-skills').innerHTML = state.skills.map((s) => `<span class="rtl-tag">${esc(s)}</span>`).join('');
    showSection('rtl-projects-sec', state.projects.length);
    $('#rtl-projects').innerHTML = state.projects.map((p) => buildEntryHTML(p, 'rtl', true)).join('');
    showSection('rtl-certs-sec', state.certifications.length);
    $('#rtl-certs').innerHTML = state.certifications.map((c) => `<span class="rtl-tag">${esc(c)}</span>`).join('');
    showSection('rtl-langs-sec', state.languages.length);
    $('#rtl-langs').innerHTML = state.languages.map((l) => `<span class="rtl-tag">${esc(l)}</span>`).join('');
  }

  // ── Print / Download PDF ────────────────────────────
  function printResume() {
    window.print();
  }
  $('#btnPrint').addEventListener('click', printResume);
  $('#btnPrint2').addEventListener('click', printResume);

  // ── Save & Restore from localStorage ────────────────
  function saveState() {
    const data = {
      fullName: $('#fullName').value,
      jobTitle: $('#jobTitle').value,
      email: $('#email').value,
      phone: $('#phone').value,
      location: $('#location').value,
      website: $('#website').value,
      linkedin: $('#linkedin').value,
      github: $('#github').value,
      summary: $('#summary').value,
      photo: state.photo,
      skills: state.skills,
      languages: state.languages,
      certifications: state.certifications,
      interests: state.interests,
      experiences: state.experiences,
      educations: state.educations,
      projects: state.projects,
      template: state.template,
      accent: state.accent,
    };
    try {
      localStorage.setItem('rf-state', JSON.stringify(data));
    } catch (e) {
      /* storage full, ignore */
    }
  }

  function restoreState() {
    let data;
    try {
      data = JSON.parse(localStorage.getItem('rf-state'));
    } catch (e) {
      return;
    }
    if (!data) return;

    $('#fullName').value = data.fullName || '';
    $('#jobTitle').value = data.jobTitle || '';
    $('#email').value = data.email || '';
    $('#phone').value = data.phone || '';
    $('#location').value = data.location || '';
    $('#website').value = data.website || '';
    $('#linkedin').value = data.linkedin || '';
    $('#github').value = data.github || '';
    $('#summary').value = data.summary || '';

    if (data.photo) {
      state.photo = data.photo;
      $('#photoPreview').src = data.photo;
      $('#photoPreviewWrap').style.display = 'inline-block';
    }

    state.skills = data.skills || [];
    state.languages = data.languages || [];
    state.certifications = data.certifications || [];
    state.interests = data.interests || [];
    state.experiences = data.experiences || [];
    state.educations = data.educations || [];
    state.projects = data.projects || [];

    // re-render tag UIs
    rerenderTags('skillTags', state.skills, 'skills');
    rerenderTags('languageTags', state.languages, 'languages');
    rerenderTags('certTags', state.certifications, 'certifications');
    rerenderTags('interestTags', state.interests, 'interests');

    renderExperienceForm();
    renderEducationForm();
    renderProjectForm();

    // template & accent
    if (data.template) {
      state.template = data.template;
      $$('.tmpl-btn').forEach((b) => b.classList.toggle('active', b.dataset.template === data.template));
      activateTemplate();
    }
    if (data.accent) setAccent(data.accent);

    renderResume();
  }

  function rerenderTags(containerId, arr, stateKey) {
    const container = $('#' + containerId);
    container.innerHTML = arr
      .map(
        (t, i) =>
          `<span class="tag">${esc(t)}<span class="tag-remove" data-idx="${i}">&times;</span></span>`
      )
      .join('');
    container.querySelectorAll('.tag-remove').forEach((r) =>
      r.addEventListener('click', () => {
        state[stateKey].splice(+r.dataset.idx, 1);
        rerenderTags(containerId, state[stateKey], stateKey);
        renderResume();
      })
    );
  }

  // Auto-save every 2 seconds after change
  let saveTimeout;
  function debouncedSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveState, 2000);
  }
  document.addEventListener('input', debouncedSave);

  // ── Smooth scroll for hero CTA ──────────────────────
  const heroBtn = $('.btn-hero');
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(heroBtn.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── Init ────────────────────────────────────────────
  restoreState();
  renderResume();
})();
