/* Garagem Inteligente. JavaScript de interface, sem envio ou coleta de dados. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  function openTab(name) {
    $$('.tab').forEach(btn => {
      const active = btn.dataset.tab === name;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    $$('.panel').forEach(panel => {
      const active = panel.id === `panel-${name}`;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
    const tabs = $('.tabs');
    if (tabs) tabs.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  $$('.tab').forEach(btn => btn.addEventListener('click', () => openTab(btn.dataset.tab)));
  $$('[data-go]').forEach(btn => btn.addEventListener('click', () => openTab(btn.dataset.go)));

  $$('.lang-btn').forEach(btn => btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    $$('.lang-btn').forEach(item => {
      const active = item.dataset.lang === lang;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    $('#code-python').hidden = lang !== 'python';
    $('#code-java').hidden = lang !== 'java';
    $('#verify-lang').value = lang;
    $('#team-lang').value = lang === 'python' ? 'Python' : 'Java';
  }));
  $$('.tip-toggle').forEach(btn => btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    content.hidden = !content.hidden;
    btn.setAttribute('aria-expanded', String(!content.hidden));
    btn.querySelector('span').textContent = content.hidden ? '+' : '−';
  }));

  const checks = $$('[data-check]');
  const storageKey = 'senai-garagem-aula11-checks-v1';
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    checks.forEach((item, idx) => { item.checked = saved[idx] === true; });
  } catch (_) { /* armazenamento desabilitado ou dados antigos */ }
  function updateProgress() {
    const done = checks.filter(item => item.checked).length;
    const percent = Math.round((100 * done) / checks.length);
    $('#progress-percent').textContent = `${percent}%`;
    $('#progress-bar').style.width = `${percent}%`;
    try { localStorage.setItem(storageKey, JSON.stringify(checks.map(i => i.checked))); } catch (_) { /* ok */ }
  }
  checks.forEach(item => item.addEventListener('change', updateProgress));
  updateProgress();

  let secondsLeft = 40 * 60;
  let timerId = null;
  let finishAt = null;
  const formatTime = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  const timer = $('#timer');
  const timerToggle = $('#timer-toggle');
  const timerStatus = $('#timer-status');
  function renderTimer() { timer.textContent = formatTime(secondsLeft); }
  function stopTimer() {
    if (timerId !== null) clearInterval(timerId);
    timerId = null;
    finishAt = null;
    timerToggle.textContent = 'Continuar';
  }
  function tick() {
    if (!finishAt) return;
    secondsLeft = Math.max(0, Math.ceil((finishAt - Date.now()) / 1000));
    renderTimer();
    if (secondsLeft === 0) {
      stopTimer();
      timerToggle.textContent = 'Reiniciar';
      timerStatus.textContent = 'Os 40 minutos terminaram. Finalizem a entrega conforme a orientação do professor.';
      timer.setAttribute('aria-label', 'Tempo encerrado');
    }
  }
  timerToggle.addEventListener('click', () => {
    if (secondsLeft === 0) { secondsLeft = 40 * 60; renderTimer(); }
    if (timerId !== null) {
      tick(); stopTimer(); timerStatus.textContent = 'Cronômetro pausado.';
    } else {
      finishAt = Date.now() + secondsLeft * 1000;
      timerId = setInterval(tick, 250);
      timerToggle.textContent = 'Pausar';
      timerStatus.textContent = 'Tempo em andamento. Trabalhem juntos!';
      tick();
    }
  });
  $('#timer-reset').addEventListener('click', () => {
    if (timerId !== null) clearInterval(timerId);
    timerId = null;
    finishAt = null;
    secondsLeft = 40 * 60;
    timerToggle.textContent = 'Iniciar';
    timerStatus.textContent = 'Cronômetro reiniciado.';
    renderTimer();
  });
  renderTimer();

  function stripComments(code, lang) {
    return code.split('\n').map(line => lang === 'python' ? line.replace(/#.*$/, '') : line.replace(/\/\/.*$/, '')).join('\n');
  }
  function getChecks(raw, lang) {
    const code = stripComments(raw, lang);
    if (lang === 'python') {
      const created = (code.match(/\b\w+\s*=\s*Carro\s*\(/g) || []).length;
      const calls = (code.match(/\b\w+\.exibirInfo\s*\(/g) || []).length;
      const methodPart = code.split(/\bdef\s+exibirInfo\s*\(/)[1] || '';
      const methodBody = methodPart.split(/\n(?=\S)/)[0] || '';
      return [
        ['Classe Carro', /\bclass\s+Carro\s*:/.test(code)],
        ['Atributos marca, modelo e ano', ['marca', 'modelo', 'ano'].every(a => new RegExp(`self\\.${a}\\s*=`).test(code))],
        ['Método exibirInfo() com print()', /\bdef\s+exibirInfo\s*\(/.test(code) && /\bprint\s*\(/.test(methodBody)],
        ['Dois objetos criados', created >= 2],
        ['Duas chamadas de exibirInfo()', calls >= 2]
      ];
    }
    const withoutStrings = code; // Heurística textual, não compilador.
    const created = (withoutStrings.match(/\bnew\s+Carro\s*\(/g) || []).length;
    const calls = (withoutStrings.match(/\.exibirInfo\s*\(/g) || []).length;
    const methodPart = withoutStrings.split(/\bvoid\s+exibirInfo\s*\(\s*\)\s*\{/)[1] || '';
    const methodBody = methodPart.split('}')[0] || '';
    return [
      ['Classe Carro', /\bclass\s+Carro\s*\{/.test(code)],
      ['Atributos marca, modelo e ano', (/\bString\s+marca\b/.test(code) && (/\bString\s+modelo\b/.test(code) || /\bString\s+marca\s*,\s*modelo\b/.test(code))) && /\bint\s+ano\b/.test(code)],
      ['Método exibirInfo() com println()', /\bvoid\s+exibirInfo\s*\(\s*\)/.test(code) && /System\.out\.println\s*\(/.test(methodBody)],
      ['Dois objetos criados', created >= 2],
      ['Duas chamadas de exibirInfo()', calls >= 2]
    ];
  }
  $('#check-code').addEventListener('click', () => {
    const raw = $('#paste-code').value;
    const box = $('#check-results');
    box.textContent = '';
    if (!raw.trim()) { const p = document.createElement('p'); p.textContent = 'Cole o código completo antes de conferir.'; box.append(p); return; }
    const checks = getChecks(raw, $('#verify-lang').value);
    const found = checks.filter(([, ok]) => ok).length;
    const head = document.createElement('h3'); head.textContent = `Itens identificados: ${found} de ${checks.length}`;
    const summary = document.createElement('p'); summary.className = 'result-summary';
    summary.textContent = found === checks.length ? 'A estrutura parece completa. Agora testem o código em um compilador online.' : 'Revisem os itens abaixo. O verificador faz apenas uma busca aproximada no texto.';
    box.append(head, summary);
    checks.forEach(([label, ok]) => {
      const item = document.createElement('div'); item.className = `result-item ${ok ? 'ok' : 'miss'}`;
      const mark = document.createElement('span'); mark.textContent = ok ? '✓' : '!';
      const text = document.createElement('div'); text.textContent = label;
      item.append(mark, text); box.append(item);
    });
  });
  $('#clear-code').addEventListener('click', () => {
    $('#paste-code').value = '';
    $('#check-results').textContent = 'Cole o código completo para fazer uma nova conferência.';
  });

  $('#make-delivery').addEventListener('click', () => {
    const team = $('#team-name').value.trim();
    const members = $('#team-members').value.trim();
    const url = $('#fork-url').value.trim();
    if (!team || !members || !/^https:\/\/github\.com\/[^\s/]+\/[^\s/?#]+\/?$/i.test(url)) {
      $('#delivery-box').hidden = false;
      $('#delivery-text').value = 'Preencham o nome da equipe, os integrantes e uma URL válida do fork, como https://github.com/usuario/repositorio';
      return;
    }
    const msg = `Aula 11 - Desafio Garagem Inteligente\nEquipe: ${team}\nIntegrantes: ${members}\nLinguagem: ${$('#team-lang').value}\nResultado do teste: ${$('#test-result').value}\nFork: ${url}\nAlterações registradas no GitHub e REGISTRO_EQUIPE.md preenchido.`;
    $('#delivery-text').value = msg;
    $('#delivery-box').hidden = false;
    $('#copy-feedback').textContent = '';
  });
  $('#copy-delivery').addEventListener('click', async () => {
    const value = $('#delivery-text').value;
    try {
      await navigator.clipboard.writeText(value);
      $('#copy-feedback').textContent = 'Mensagem copiada. Envie no canal indicado pelo professor.';
    } catch (_) {
      $('#delivery-text').focus();
      $('#delivery-text').select();
      $('#copy-feedback').textContent = 'Selecione e copie manualmente a mensagem acima.';
    }
  });
})();
