// script.js
(function() {
  // --- Utility functions ---
  const storage = {
    get(key, def) {
      try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; }
      catch { return def; }
    },
    set(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    }
  };

  // --- Search engine config ---
  const searchEngines = {
    'google': { name: 'Google', url: 'https://www.google.com/search?q=' },
    'duckduckgo': { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    'bing': { name: 'Bing', url: 'https://www.bing.com/search?q=' },
    'yahoo': { name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
    'brave': { name: 'Brave Search', url: 'https://search.brave.com/search?q=' },
    'startpage': { name: 'Startpage', url: 'https://www.startpage.com/do/dsearch?query=' },
    'ecosia': { name: 'Ecosia', url: 'https://www.ecosia.org/search?q=' },
    'qwant': { name: 'Qwant', url: 'https://www.qwant.com/?q=' },
    'chatgpt': { name: 'ChatGPT', url: 'https://chat.openai.com/?q=' },
    'gemini': { name: 'Google Gemini', url: 'https://gemini.google.com/app?q=' },
    'copilot': { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/?q=' },
    'claude': { name: 'Claude', url: 'https://claude.ai/new?q=' },
    'perplexity': { name: 'Perplexity AI', url: 'https://www.perplexity.ai/?q=' },
    'meta': { name: 'Meta AI', url: 'https://www.meta.ai/?q=' },
    'grok': { name: 'Grok', url: 'https://grok.x.ai/?q=' },
    'poe': { name: 'Poe', url: 'https://poe.com/?q=' },
    'deepseek': { name: 'DeepSeek', url: 'https://chat.deepseek.com/?q=' },
    'etc': { name: 'Custom', url: '' }
  };

  // --- Theme definitions ---
  const themes = {
    'default-dark': { bg:'#0a0a0a', surface:'#121212', surface2:'#1e1e1e', text:'#e0e0e0', textSecondary:'#a0a0a0', accent:'#4a9eff', border:'#2a2a2a' },
    'pure-white': { bg:'#ffffff', surface:'#f7f7f7', surface2:'#eeeeee', text:'#111111', textSecondary:'#555555', accent:'#0066cc', border:'#dddddd' },
    'midnight-blue': { bg:'#0a1128', surface:'#111d3a', surface2:'#1a2b4a', text:'#d0d8e8', textSecondary:'#7a8aa8', accent:'#00b4d8', border:'#2a3a5a' },
    'forest-green': { bg:'#0b1f0b', surface:'#142814', surface2:'#1e331e', text:'#c8e6c8', textSecondary:'#6b8b6b', accent:'#2ecc71', border:'#2d4a2d' },
    'blood-red': { bg:'#1a0000', surface:'#2a1010', surface2:'#3a1a1a', text:'#f5c6c6', textSecondary:'#a36666', accent:'#ff4d4d', border:'#5a2a2a' },
    'purple-haze': { bg:'#1a0b2e', surface:'#2a153e', surface2:'#3a1f4e', text:'#d4bfff', textSecondary:'#9966cc', accent:'#b44dff', border:'#4a2a5e' },
    'arctic-ice': { bg:'#e8f0ff', surface:'#d4e0f0', surface2:'#c0d0e0', text:'#0a1a2a', textSecondary:'#4a5a6a', accent:'#0077ff', border:'#b0c4de' },
    'amber': { bg:'#1a1200', surface:'#2a1e0a', surface2:'#3a2a10', text:'#ffdead', textSecondary:'#bb9955', accent:'#ffaa00', border:'#5a4422' },
    'rose-gold': { bg:'#1a0a0f', surface:'#2a1520', surface2:'#3a2030', text:'#ffd1dc', textSecondary:'#cc8899', accent:'#e75480', border:'#5a3040' },
    'cyberpunk': { bg:'#0d0221', surface:'#1a0533', surface2:'#260744', text:'#ff00ff', textSecondary:'#cc00cc', accent:'#00ffff', border:'#4400aa' },
    'matrix': { bg:'#000000', surface:'#0a1a0a', surface2:'#142614', text:'#00ff41', textSecondary:'#008f11', accent:'#00ff41', border:'#1a3a1a' },
    'vaporwave': { bg:'#21054c', surface:'#36075a', surface2:'#4a0868', text:'#ff71ce', textSecondary:'#b967ff', accent:'#01cdfe', border:'#5a2a8a' },
    'monochrome': { bg:'#121212', surface:'#1e1e1e', surface2:'#2a2a2a', text:'#cccccc', textSecondary:'#888888', accent:'#ffffff', border:'#444444' },
    'ocean-deep': { bg:'#001a33', surface:'#00264d', surface2:'#003366', text:'#b3d9ff', textSecondary:'#6699cc', accent:'#0080ff', border:'#1a4d80' },
    'sunset': { bg:'#1a0c0c', surface:'#2a1414', surface2:'#3a1c1c', text:'#ffd9b3', textSecondary:'#cc9966', accent:'#ff6600', border:'#5a3a2a' },
    'neon-city': { bg:'#050510', surface:'#0f0f20', surface2:'#1a1a2e', text:'#f0f0ff', textSecondary:'#8888cc', accent:'#ff007f', border:'#333366' },
    'desert-sand': { bg:'#1a1500', surface:'#2a2400', surface2:'#3a3300', text:'#ffe8b0', textSecondary:'#aa9944', accent:'#ffbb33', border:'#5a5522' },
    'toxic-green': { bg:'#0a1a00', surface:'#142600', surface2:'#1e3300', text:'#aaffaa', textSecondary:'#55aa55', accent:'#33ff33', border:'#2a4a00' },
    'lavender': { bg:'#150a1a', surface:'#201428', surface2:'#2a1e36', text:'#e6ccff', textSecondary:'#9966cc', accent:'#cc99ff', border:'#3a2a4a' },
    'retro-orange': { bg:'#1a0a00', surface:'#2a1400', surface2:'#3a1e00', text:'#ffccaa', textSecondary:'#cc8844', accent:'#ff8800', border:'#5a2a00' },
    'chrome-steel': { bg:'#0c0c0c', surface:'#1a1a1a', surface2:'#262626', text:'#c0c0c0', textSecondary:'#707070', accent:'#a0a0a0', border:'#404040' },
    'deep-space': { bg:'#000011', surface:'#0a0a22', surface2:'#141433', text:'#ccccff', textSecondary:'#6666aa', accent:'#3355ff', border:'#222255' },
    'crimson': { bg:'#1a0005', surface:'#2a000a', surface2:'#3a0010', text:'#ffb3c6', textSecondary:'#cc6677', accent:'#ff1a1a', border:'#5a0020' },
    'teal-storm': { bg:'#001a1a', surface:'#002a2a', surface2:'#003a3a', text:'#b3ffff', textSecondary:'#66cccc', accent:'#00cccc', border:'#1a4a4a' },
    'gold-rush': { bg:'#1a1000', surface:'#2a1c00', surface2:'#3a2800', text:'#ffe6b3', textSecondary:'#ccaa44', accent:'#ffaa00', border:'#5a4411' }
  };

  function applyTheme(themeName) {
    const theme = themes[themeName] || themes['default-dark'];
    const root = document.documentElement;
    root.setAttribute('data-theme', themeName);
    for (const [key, val] of Object.entries(theme)) {
      root.style.setProperty(`--${key}`, val);
    }
    storage.set('selectedTheme', themeName);
  }

  // --- Tab management ---
  let tabs = storage.get('tabs', []);
  let activeTabId = storage.get('activeTabId', null);

  function saveTabs() {
    storage.set('tabs', tabs);
    storage.set('activeTabId', activeTabId);
  }

  function createTab(title, url, type = 'app') {
    const id = Date.now().toString();
    const tab = { id, title, url, type };
    tabs.push(tab);
    activeTabId = id;
    saveTabs();
    return tab;
  }

  function closeTab(id) {
    tabs = tabs.filter(t => t.id !== id);
    if (activeTabId === id) {
      activeTabId = tabs.length ? tabs[tabs.length-1].id : null;
    }
    saveTabs();
  }

  // --- Page-specific initialization ---
  const page = document.body.dataset.page || window.location.pathname.split('/').pop().split('.')[0];
  document.body.dataset.page = page;

  // Navbar active state
  const currentPage = page.toLowerCase() || 'index';
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href').replace('.html','').toLowerCase();
    if (currentPage === href || (currentPage === '' && href === 'index')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Apply saved theme
  const savedTheme = storage.get('selectedTheme', 'default-dark');
  applyTheme(savedTheme);

  // Search logic (Home page)
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    const engineSelect = storage.get('searchEngine', 'google');
    const engine = searchEngines[engineSelect] || searchEngines['google'];
    const engineDisplay = document.getElementById('currentEngineDisplay');
    if (engineDisplay) engineDisplay.textContent = engine.name;
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('searchInput').value.trim();
      if (!query) return;
      let url = engine.url + encodeURIComponent(query);
      if (engineSelect === 'etc') {
        const customUrl = storage.get('customSearchUrl', '');
        url = customUrl ? customUrl.replace('%s', encodeURIComponent(query)) : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
      window.location.href = url;
    });
  }

  // Apps / Games tab pages
  if (page === 'apps' || page === 'games') {
    const tabBar = document.getElementById('tabBar');
    const tabList = document.getElementById('tabList');
    const tabContent = document.getElementById('tabContent');
    const activeFrame = document.getElementById('activeFrame');
    const newTabBtn = document.getElementById('newTabBtn');

    function renderTabs() {
      if (!tabList) return;
      tabList.innerHTML = '';
      tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab-item ${tab.id === activeTabId ? 'active-tab' : ''}`;
        tabEl.innerHTML = `
          <span>${escapeHtml(tab.title)}</span>
          <span class="close-tab" data-id="${tab.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
        `;
        tabEl.addEventListener('click', (e) => {
          if (e.target.closest('.close-tab')) {
            closeTab(tab.id);
            renderTabs();
            loadActiveTab();
            return;
          }
          activeTabId = tab.id;
          saveTabs();
          renderTabs();
          loadActiveTab();
        });
        tabList.appendChild(tabEl);
      });
    }

    function loadActiveTab() {
      const activeTab = tabs.find(t => t.id === activeTabId);
      if (activeTab && activeFrame) {
        activeFrame.src = activeTab.url;
      } else if (activeFrame) {
        activeFrame.src = 'about:blank';
      }
    }

    newTabBtn?.addEventListener('click', () => {
      createTab('New Tab', 'about:blank', 'blank');
      renderTabs();
      loadActiveTab();
    });

    // App/game grid cards
    const cards = document.querySelectorAll('.app-card, .game-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.dataset.appTitle || card.dataset.gameTitle;
        const type = card.dataset.appType || card.dataset.gameType;
        // Placeholder content: internal blob page
        const html = `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#1a1a1a;color:#eee;"><h1>${title} (Placeholder)</h1></body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        createTab(title, url, type);
        renderTabs();
        loadActiveTab();
      });
    });

    renderTabs();
    loadActiveTab();
  }

  // Tabs manager page
  if (page === 'tabs') {
    const container = document.getElementById('tabsListContainer');
    const viewerFrame = document.getElementById('viewerFrame');

    function renderTabsList() {
      if (!container) return;
      container.innerHTML = '';
      tabs.forEach(tab => {
        const card = document.createElement('div');
        card.className = `tab-card ${tab.id === activeTabId ? 'active-tab' : ''}`;
        card.innerHTML = `<span>${escapeHtml(tab.title)}</span> <button class="close-tab-btn" data-id="${tab.id}">Close</button>`;
        card.addEventListener('click', (e) => {
          if (e.target.classList.contains('close-tab-btn')) {
            closeTab(tab.id);
            renderTabsList();
            loadViewer();
            return;
          }
          activeTabId = tab.id;
          saveTabs();
          renderTabsList();
          loadViewer();
        });
        container.appendChild(card);
      });
    }

    function loadViewer() {
      const active = tabs.find(t => t.id === activeTabId);
      if (active && viewerFrame) {
        viewerFrame.src = active.url;
      } else if (viewerFrame) {
        viewerFrame.src = 'about:blank';
      }
    }

    renderTabsList();
    loadViewer();
  }

  // Settings page
  if (page === 'settings') {
    const contentArea = document.querySelector('.settings-content');
    const tabs = document.querySelectorAll('.settings-tab');
    let activeSettingsTab = 'search';

    const settingsTemplates = {
      search: () => `
        <div class="setting-group">
          <h3>Search Engine</h3>
          <div class="engine-grid" id="engineGrid"></div>
        </div>
      `,
      'visual-themes': () => `
        <div class="setting-group">
          <h3>Select Theme</h3>
          <div class="theme-grid" id="themeGrid"></div>
        </div>
      `,
      'background-effects': () => `
        <div class="setting-group">
          <h3>Background Effect</h3>
          <select id="bgEffectSelect">
            <option value="none">None</option>
            <option value="matrix">Matrix Rain</option>
            <option value="snow">Snow</option>
            <option value="starfield">Starfield</option>
            <option value="galaxy">Galaxy Spiral</option>
            <option value="particles">Particles</option>
            <option value="glitch">Glitch</option>
            <option value="gradient">Animated Gradient</option>
            <option value="fireflies">Fireflies</option>
            <option value="geo">Geo Mesh</option>
            <option value="waves">Waves</option>
            <option value="bubbles">Bubbles</option>
            <option value="circuit">Circuit Board</option>
            <option value="nebula">Nebula</option>
            <option value="dna">DNA Helix</option>
          </select>
          <div style="margin-top:12px;">
            <label>Custom Background Image URL: <input type="text" id="customBgUrl" placeholder="https://..."></label>
            <button id="clearBgBtn">Clear Custom Background</button>
          </div>
          <div style="margin-top:12px;">
            <label>Background Blur (px): <input type="range" id="bgBlurSlider" min="0" max="20" value="0"></label>
          </div>
          <div style="margin-top:12px;">
            <label>Effect Speed: <input type="range" id="effectSpeedSlider" min="0.1" max="3" step="0.1" value="1"></label>
          </div>
        </div>
      `,
      appearance: () => `
        <div class="setting-group">
          <h3>Colors</h3>
          <label>Accent Color: <input type="color" id="accentColorPicker" value="#4a9eff"></label><br>
          <label>Text Color: <input type="color" id="textColorPicker" value="#e0e0e0"></label><br>
          <label>Glow Intensity: <input type="range" id="glowIntensitySlider" min="0" max="1" step="0.1" value="0.5"></label>
        </div>
        <div class="setting-group">
          <h3>Layout</h3>
          <label>UI Scale: <input type="range" id="uiScaleSlider" min="0.8" max="1.5" step="0.05" value="1"></label><br>
          <label>UI Transparency: <input type="range" id="uiTransparencySlider" min="0" max="1" step="0.05" value="0.15"></label><br>
          <label>Glass Blur Intensity: <input type="range" id="glassBlurSlider" min="0" max="20" step="1" value="12"></label><br>
          <label>Layout Density: 
            <select id="layoutDensitySelect">
              <option value="compact">Compact</option>
              <option value="normal" selected>Normal</option>
              <option value="spacious">Spacious</option>
            </select>
          </label><br>
          <label>Border Style: 
            <select id="borderStyleSelect">
              <option value="solid">Solid</option>
              <option value="dotted">Dotted</option>
              <option value="dashed">Dashed</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>
        <div class="setting-group">
          <h3>Cursor</h3>
          <label><input type="checkbox" id="customCursorToggle"> Custom Cursor Effect</label>
        </div>
        <div class="setting-group">
          <h3>Typography</h3>
          <label>UI Font: <input type="text" id="uiFontInput" placeholder="Inter, system-ui"></label><br>
          <label>Display Font: <input type="text" id="displayFontInput" placeholder="Inter, system-ui"></label>
        </div>
      `,
      behavior: () => `
        <div class="setting-group">
          <h3>Fullscreen</h3>
          <label><input type="checkbox" id="enforceFullscreenToggle"> Enforce Fullscreen</label><br>
          <small>Auto re-enter fullscreen every 5 seconds if exited.</small>
        </div>
        <div class="setting-group">
          <h3>Animation</h3>
          <label>Animation Speed: <input type="range" id="animSpeedSlider" min="0.2" max="3" step="0.1" value="1"></label><br>
          <label><input type="checkbox" id="reduceMotionToggle"> Reduce Motion</label>
        </div>
        <div class="setting-group">
          <h3>Sound Effects</h3>
          <label><input type="checkbox" id="soundToggle"> Click and interaction sounds</label>
        </div>
      `,
      'auto-theme': () => `
        <div class="setting-group">
          <h3>Time-Based Auto Theme</h3>
          <label><input type="checkbox" id="autoThemeToggle"> Auto Theme Switch</label>
          <div style="margin-top:12px;">
            <label>Day Theme (06:00 - 18:00): 
              <select id="dayThemeSelect">${Object.keys(themes).map(t => `<option value="${t}">${t}</option>`).join('')}</select>
            </label><br>
            <label>Night Theme (18:00 - 06:00): 
              <select id="nightThemeSelect">${Object.keys(themes).map(t => `<option value="${t}">${t}</option>`).join('')}</select>
            </label>
          </div>
        </div>
      `,
      stealth: () => `
        <div class="setting-group">
          <h3>Tab Disguise</h3>
          <label>Custom Tab Title: <input type="text" id="stealthTitleInput" placeholder="Google"></label>
          <button id="applyStealthTitle">Apply Title</button>
        </div>
        <div class="setting-group">
          <h3>Favicon Override</h3>
          <label>Favicon URL: <input type="text" id="faviconUrlInput" placeholder="https://..."></label>
          <button id="applyFavicon">Apply Favicon</button>
        </div>
        <div class="setting-group">
          <h3>Instant Decoy Page</h3>
          <label><input type="checkbox" id="decoyOverlayToggle"> Activate Decoy Overlay</label><br>
          <button id="previewDecoy">Preview Decoy Page</button><br>
          <label>Custom Decoy URL (override): <input type="text" id="decoyUrlInput" placeholder="https://..."></label>
        </div>
        <div class="setting-group">
          <h3>Stealth Behavior</h3>
          <label><input type="checkbox" id="blurOnTabSwitch"> Blur on Tab Switch</label><br>
          <label><input type="checkbox" id="tabCloseWarning"> Tab Close Warning</label>
        </div>
      `,
      panic: () => `
        <div class="setting-group">
          <h3>Panic Keys</h3>
          <label>Tab Cloak Panic Key: <input type="text" id="cloakKeyInput" maxlength="1" placeholder="C"></label><br>
          <label>Instant Safe Page Key: <input type="text" id="safePageKeyInput" maxlength="1" placeholder="S"></label><br>
          <label>Safe Page URL: <input type="text" id="safePageUrlInput" placeholder="https://..."></label>
          <button id="saveSafePage">Save Safe Page</button>
        </div>
        <div class="setting-group">
          <h3>Panic Redirect</h3>
          <label>Redirect URL: <input type="text" id="panicRedirectUrlInput" placeholder="https://..."></label>
          <button id="savePanicRedirect">Save Redirect URL</button>
        </div>
      `,
      labs: () => `
        <div class="setting-group" style="border:1px dashed var(--accent); padding:12px; border-radius:var(--radius);">
          <h3 style="color:var(--accent);">EXPERIMENTAL LABS</h3>
          <p>These features are unstable and may cause unexpected behavior. Use at your own risk.</p>
          <label><input type="checkbox" id="labFeature1"> Experimental Feature 1</label><br>
          <label><input type="checkbox" id="labFeature2"> Experimental Feature 2</label><br>
        </div>
      `
    };

    function renderSettingsTab(tab) {
      const template = settingsTemplates[tab];
      if (!template) return;
      contentArea.innerHTML = template();
      bindSettingsEvents(tab);
    }

    function bindSettingsEvents(tab) {
      if (tab === 'search') {
        const grid = document.getElementById('engineGrid');
        const savedEngine = storage.get('searchEngine', 'google');
        Object.keys(searchEngines).forEach(key => {
          const card = document.createElement('div');
          card.className = `theme-card ${key === savedEngine ? 'selected' : ''}`;
          card.style.background = 'var(--surface2)';
          card.innerHTML = `<span>${searchEngines[key].name}</span>`;
          card.addEventListener('click', () => {
            storage.set('searchEngine', key);
            document.querySelectorAll('#engineGrid .theme-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (key === 'etc') {
              const customUrl = prompt('Enter custom search URL (use %s for query):');
              if (customUrl) storage.set('customSearchUrl', customUrl);
            }
          });
          grid.appendChild(card);
        });
      } else if (tab === 'visual-themes') {
        const grid = document.getElementById('themeGrid');
        const current = storage.get('selectedTheme', 'default-dark');
        Object.keys(themes).forEach(name => {
          const card = document.createElement('div');
          card.className = `theme-card ${name === current ? 'selected' : ''}`;
          card.style.background = themes[name].bg;
          card.style.color = themes[name].text;
          card.textContent = name;
          card.addEventListener('click', () => {
            applyTheme(name);
            document.querySelectorAll('#themeGrid .theme-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
          });
          grid.appendChild(card);
        });
      } else if (tab === 'background-effects') {
        const effectSelect = document.getElementById('bgEffectSelect');
        const customBgUrl = document.getElementById('customBgUrl');
        const clearBgBtn = document.getElementById('clearBgBtn');
        const bgBlurSlider = document.getElementById('bgBlurSlider');
        const effectSpeedSlider = document.getElementById('effectSpeedSlider');
        effectSelect.value = storage.get('bgEffect', 'none');
        customBgUrl.value = storage.get('customBgImage', '');
        bgBlurSlider.value = storage.get('bgBlur', 0);
        effectSpeedSlider.value = storage.get('effectSpeed', 1);
        effectSelect.addEventListener('change', () => storage.set('bgEffect', effectSelect.value));
        customBgUrl.addEventListener('input', () => storage.set('customBgImage', customBgUrl.value));
        clearBgBtn.addEventListener('click', () => { customBgUrl.value = ''; storage.set('customBgImage', ''); });
        bgBlurSlider.addEventListener('input', () => { document.body.style.setProperty('--bg-blur', bgBlurSlider.value + 'px'); storage.set('bgBlur', bgBlurSlider.value); });
        effectSpeedSlider.addEventListener('input', () => storage.set('effectSpeed', effectSpeedSlider.value));
      } else if (tab === 'appearance') {
        const accentPicker = document.getElementById('accentColorPicker');
        const textPicker = document.getElementById('textColorPicker');
        const glowSlider = document.getElementById('glowIntensitySlider');
        const uiScaleSlider = document.getElementById('uiScaleSlider');
        const uiTransparencySlider = document.getElementById('uiTransparencySlider');
        const glassBlurSlider = document.getElementById('glassBlurSlider');
        const layoutDensitySelect = document.getElementById('layoutDensitySelect');
        const borderStyleSelect = document.getElementById('borderStyleSelect');
        const cursorToggle = document.getElementById('customCursorToggle');
        const uiFontInput = document.getElementById('uiFontInput');
        const displayFontInput = document.getElementById('displayFontInput');

        accentPicker.value = storage.get('accentOverride', '#4a9eff');
        textPicker.value = storage.get('textColorOverride', '#e0e0e0');
        glowSlider.value = storage.get('glowIntensity', 0.5);
        uiScaleSlider.value = storage.get('uiScale', 1);
        uiTransparencySlider.value = storage.get('glassOpacity', 0.15);
        glassBlurSlider.value = storage.get('glassBlur', 12);
        layoutDensitySelect.value = storage.get('layoutDensity', 'normal');
        borderStyleSelect.value = storage.get('borderStyle', 'solid');
        cursorToggle.checked = storage.get('customCursor', false);
        uiFontInput.value = storage.get('uiFont', 'Inter, system-ui, -apple-system, sans-serif');
        displayFontInput.value = storage.get('displayFont', 'Inter, system-ui, -apple-system, sans-serif');

        accentPicker.addEventListener('input', () => { document.documentElement.style.setProperty('--accent', accentPicker.value); storage.set('accentOverride', accentPicker.value); });
        textPicker.addEventListener('input', () => { document.documentElement.style.setProperty('--text', textPicker.value); storage.set('textColorOverride', textPicker.value); });
        glowSlider.addEventListener('input', () => { document.documentElement.style.setProperty('--glow-intensity', glowSlider.value); storage.set('glowIntensity', glowSlider.value); });
        uiScaleSlider.addEventListener('input', () => { document.documentElement.style.setProperty('--ui-scale', uiScaleSlider.value); document.documentElement.style.fontSize = (16 * uiScaleSlider.value) + 'px'; storage.set('uiScale', uiScaleSlider.value); });
        uiTransparencySlider.addEventListener('input', () => { document.documentElement.style.setProperty('--glass-opacity', uiTransparencySlider.value); storage.set('glassOpacity', uiTransparencySlider.value); });
        glassBlurSlider.addEventListener('input', () => { document.documentElement.style.setProperty('--glass-blur', glassBlurSlider.value + 'px'); storage.set('glassBlur', glassBlurSlider.value); });
        layoutDensitySelect.addEventListener('change', () => { document.documentElement.style.setProperty('--layout-density', layoutDensitySelect.value); storage.set('layoutDensity', layoutDensitySelect.value); });
        borderStyleSelect.addEventListener('change', () => { document.documentElement.style.setProperty('--border-style', borderStyleSelect.value); storage.set('borderStyle', borderStyleSelect.value); });
        cursorToggle.addEventListener('change', () => { 
          document.body.classList.toggle('cursor-custom', cursorToggle.checked);
          storage.set('customCursor', cursorToggle.checked);
        });
        uiFontInput.addEventListener('change', () => { document.documentElement.style.setProperty('--font-ui', uiFontInput.value); storage.set('uiFont', uiFontInput.value); });
        displayFontInput.addEventListener('change', () => { document.documentElement.style.setProperty('--font-display', displayFontInput.value); storage.set('displayFont', displayFontInput.value); });

        if (cursorToggle.checked) document.body.classList.add('cursor-custom');
      } else if (tab === 'behavior') {
        const fullscreenToggle = document.getElementById('enforceFullscreenToggle');
        const animSpeedSlider = document.getElementById('animSpeedSlider');
        const reduceMotionToggle = document.getElementById('reduceMotionToggle');
        const soundToggle = document.getElementById('soundToggle');
        fullscreenToggle.checked = storage.get('enforceFullscreen', false);
        animSpeedSlider.value = storage.get('animationSpeed', 1);
        reduceMotionToggle.checked = storage.get('reduceMotion', false);
        soundToggle.checked = storage.get('soundEnabled', false);
        fullscreenToggle.addEventListener('change', () => storage.set('enforceFullscreen', fullscreenToggle.checked));
        animSpeedSlider.addEventListener('input', () => { document.documentElement.style.setProperty('--animation-speed', animSpeedSlider.value); storage.set('animationSpeed', animSpeedSlider.value); });
        reduceMotionToggle.addEventListener('change', () => { document.body.classList.toggle('animation-reduced', reduceMotionToggle.checked); storage.set('reduceMotion', reduceMotionToggle.checked); });
        soundToggle.addEventListener('change', () => storage.set('soundEnabled', soundToggle.checked));
      } else if (tab === 'auto-theme') {
        const autoToggle = document.getElementById('autoThemeToggle');
        const daySelect = document.getElementById('dayThemeSelect');
        const nightSelect = document.getElementById('nightThemeSelect');
        autoToggle.checked = storage.get('autoThemeEnabled', false);
        daySelect.value = storage.get('dayTheme', 'default-dark');
        nightSelect.value = storage.get('nightTheme', 'default-dark');
        autoToggle.addEventListener('change', () => storage.set('autoThemeEnabled', autoToggle.checked));
        daySelect.addEventListener('change', () => storage.set('dayTheme', daySelect.value));
        nightSelect.addEventListener('change', () => storage.set('nightTheme', nightSelect.value));
      } else if (tab === 'stealth') {
        document.getElementById('stealthTitleInput').value = storage.get('stealthTitle', '');
        document.getElementById('faviconUrlInput').value = storage.get('faviconUrl', '');
        document.getElementById('decoyUrlInput').value = storage.get('decoyUrl', '');
        document.getElementById('decoyOverlayToggle').checked = storage.get('decoyActive', false);
        document.getElementById('blurOnTabSwitch').checked = storage.get('blurTabSwitch', false);
        document.getElementById('tabCloseWarning').checked = storage.get('tabCloseWarning', false);
        document.getElementById('applyStealthTitle').addEventListener('click', () => {
          const title = document.getElementById('stealthTitleInput').value;
          if (title) document.title = title;
          storage.set('stealthTitle', title);
        });
        document.getElementById('applyFavicon').addEventListener('click', () => {
          const url = document.getElementById('faviconUrlInput').value;
          if (url) {
            let link = document.querySelector('link[rel="icon"]');
            if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
            link.href = url;
          }
          storage.set('faviconUrl', url);
        });
        document.getElementById('previewDecoy').addEventListener('click', () => {
          const decoyUrl = document.getElementById('decoyUrlInput').value || 'https://example.org';
          alert(`Preview decoy page: ${decoyUrl} (in real implementation, overlay would appear).`);
        });
        document.getElementById('decoyOverlayToggle').addEventListener('change', (e) => storage.set('decoyActive', e.target.checked));
        document.getElementById('blurOnTabSwitch').addEventListener('change', (e) => storage.set('blurTabSwitch', e.target.checked));
        document.getElementById('tabCloseWarning').addEventListener('change', (e) => storage.set('tabCloseWarning', e.target.checked));
      } else if (tab === 'panic') {
        document.getElementById('cloakKeyInput').value = storage.get('cloakKey', '');
        document.getElementById('safePageKeyInput').value = storage.get('safePageKey', '');
        document.getElementById('safePageUrlInput').value = storage.get('safePageUrl', '');
        document.getElementById('panicRedirectUrlInput').value = storage.get('panicRedirectUrl', '');
        document.getElementById('saveSafePage').addEventListener('click', () => {
          storage.set('safePageUrl', document.getElementById('safePageUrlInput').value);
        });
        document.getElementById('savePanicRedirect').addEventListener('click', () => {
          storage.set('panicRedirectUrl', document.getElementById('panicRedirectUrlInput').value);
        });
        document.getElementById('cloakKeyInput').addEventListener('change', (e) => storage.set('cloakKey', e.target.value));
        document.getElementById('safePageKeyInput').addEventListener('change', (e) => storage.set('safePageKey', e.target.value));
      } else if (tab === 'labs') {
        document.getElementById('labFeature1').checked = storage.get('labFeature1', false);
        document.getElementById('labFeature2').checked = storage.get('labFeature2', false);
        document.getElementById('labFeature1').addEventListener('change', (e) => storage.set('labFeature1', e.target.checked));
        document.getElementById('labFeature2').addEventListener('change', (e) => storage.set('labFeature2', e.target.checked));
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeSettingsTab = tab.dataset.tab;
        renderSettingsTab(activeSettingsTab);
      });
    });

    renderSettingsTab(activeSettingsTab);
  }

  // Background Effects Engine (minimal implementations)
  let bgEffectInterval = null;
  function clearBgEffect() {
    if (bgEffectInterval) clearInterval(bgEffectInterval);
    const canvas = document.getElementById('shrimpyBgCanvas');
    if (canvas) canvas.remove();
  }
  function startBgEffect(effect, speed = 1) {
    clearBgEffect();
    if (effect === 'none') return;
    const canvas = document.createElement('canvas');
    canvas.id = 'shrimpyBgCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    const interval = 1000 / 30 / speed;
    bgEffectInterval = setInterval(() => {
      ctx.clearRect(0, 0, w, h);
      if (effect === 'matrix') {
        ctx.fillStyle = '#0f0';
        ctx.font = '14px monospace';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * w;
          const y = Math.random() * h;
          ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), x, y);
        }
      } else if (effect === 'snow') {
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 40; i++) {
          ctx.beginPath();
          ctx.arc(Math.random()*w, Math.random()*h, Math.random()*3, 0, Math.PI*2);
          ctx.fill();
        }
      } else if (effect === 'starfield') {
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 80; i++) {
          ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1);
        }
      } else if (effect === 'particles') {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 30; i++) {
          ctx.beginPath();
          ctx.arc(Math.random()*w, Math.random()*h, Math.random()*2, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }, interval);
  }
  // Apply background effect on load from settings
  const savedEffect = storage.get('bgEffect', 'none');
  const savedEffectSpeed = storage.get('effectSpeed', 1);
  startBgEffect(savedEffect, savedEffectSpeed);

  // Apply custom background image/blur
  function applyCustomBackground() {
    const imageUrl = storage.get('customBgImage', '');
    const blur = storage.get('bgBlur', 0);
    if (imageUrl) {
      document.body.style.backgroundImage = `url(${imageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backdropFilter = `blur(${blur}px)`;
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backdropFilter = '';
    }
  }
  applyCustomBackground();

  // Time-based auto theme
  function checkAutoTheme() {
    if (!storage.get('autoThemeEnabled', false)) return;
    const hour = new Date().getHours();
    const dayTheme = storage.get('dayTheme', 'default-dark');
    const nightTheme = storage.get('nightTheme', 'default-dark');
    if (hour >= 6 && hour < 18) {
      applyTheme(dayTheme);
    } else {
      applyTheme(nightTheme);
    }
  }
  setInterval(checkAutoTheme, 60000);
  checkAutoTheme();

  // Panic key listeners
  document.addEventListener('keydown', (e) => {
    const cloakKey = storage.get('cloakKey', '');
    const safePageKey = storage.get('safePageKey', '');
    if (cloakKey && e.key === cloakKey) {
      e.preventDefault();
      const stealthTitle = storage.get('stealthTitle', 'Google');
      if (stealthTitle) document.title = stealthTitle;
      // could also toggle decoy
    }
    if (safePageKey && e.key === safePageKey) {
      e.preventDefault();
      const safeUrl = storage.get('safePageUrl', '');
      if (safeUrl) window.location.href = safeUrl;
    }
  });

  // Enforce fullscreen logic
  if (storage.get('enforceFullscreen', false)) {
    function requestFullscreen() {
      if (document.fullscreenElement) return;
      document.documentElement.requestFullscreen().catch(()=>{});
    }
    requestFullscreen();
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        setTimeout(requestFullscreen, 5000);
      }
    });
  }

  // Cursor effect (move custom cursor)
  const customCursor = document.getElementById('customCursor');
  const customCursorRing = document.getElementById('customCursorRing');
  if (customCursor && customCursorRing) {
    document.addEventListener('mousemove', (e) => {
      if (!document.body.classList.contains('cursor-custom')) return;
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
      customCursorRing.style.left = e.clientX + 'px';
      customCursorRing.style.top = e.clientY + 'px';
    });
  }

  // Escape HTML helper
  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m];
    });
  }

  // Initialize completed
})();
