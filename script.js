document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const passwordForm = document.getElementById('passwordForm');
  const siteInput = document.getElementById('site');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const toggleInputVis = document.getElementById('toggleInputVis');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');

  // Generator Elements
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthVal = document.getElementById('lengthVal');
  const incUpper = document.getElementById('incUpper');
  const incLower = document.getElementById('incLower');
  const incNumbers = document.getElementById('incNumbers');
  const incSymbols = document.getElementById('incSymbols');
  const generateBtn = document.getElementById('generateBtn');

  // Vault Elements
  const passwordList = document.getElementById('passwordList');
  const vaultCount = document.getElementById('vaultCount');
  const searchInput = document.getElementById('searchInput');
  const toast = document.getElementById('toast');

  // State
  let credentials = JSON.parse(localStorage.getItem('vaultKey_data')) || [];

  // Initialize
  renderVault();

  // Toggle Form Password Visibility
  toggleInputVis.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleInputVis.textContent = type === 'password' ? '👁️' : '🙈';
  });

  // Update Length Label
  lengthSlider.addEventListener('input', (e) => {
    lengthVal.textContent = `${e.target.value} chars`;
  });

  // Evaluate Password Strength
  passwordInput.addEventListener('input', () => {
    updateStrengthMeter(passwordInput.value);
  });

  function updateStrengthMeter(pwd) {
    let score = 0;
    if (!pwd) {
      strengthBar.style.width = '0%';
      strengthText.textContent = 'Strength: None';
      return;
    }

    if (pwd.length >= 8) score++;
    if (pwd.length >= 14) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const levels = [
      { width: '20%', color: '#ef4444', label: 'Very Weak' },
      { width: '40%', color: '#f97316', label: 'Weak' },
      { width: '60%', color: '#f59e0b', label: 'Fair' },
      { width: '80%', color: '#3b82f6', label: 'Strong' },
      { width: '100%', color: '#10b981', label: 'Very Strong' }
    ];

    const level = levels[Math.min(score, levels.length) - 1] || levels[0];
    strengthBar.style.width = level.width;
    strengthBar.style.backgroundColor = level.color;
    strengthText.textContent = `Strength: ${level.label}`;
  }

  // Cryptographically Secure Password Generator
  generateBtn.addEventListener('click', () => {
    const length = parseInt(lengthSlider.value, 10);
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charPool = '';
    if (incUpper.checked) charPool += upper;
    if (incLower.checked) charPool += lower;
    if (incNumbers.checked) charPool += numbers;
    if (incSymbols.checked) charPool += symbols;

    if (!charPool) {
      showToast('Select at least one character type!', true);
      return;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += charPool[randomValues[i] % charPool.length];
    }

    passwordInput.value = generated;
    passwordInput.type = 'text';
    toggleInputVis.textContent = '🙈';
    updateStrengthMeter(generated);
  });

  // Save Credential
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newEntry = {
      id: Date.now().toString(),
      site: siteInput.value.trim(),
      username: usernameInput.value.trim(),
      password: passwordInput.value
    };

    credentials.unshift(newEntry);
    saveToLocalStorage();
    renderVault(searchInput.value);

    // Reset Form
    passwordForm.reset();
    passwordInput.type = 'password';
    toggleInputVis.textContent = '👁️';
    updateStrengthMeter('');
    showToast('Credential saved!');
  });

  // Search Filter
  searchInput.addEventListener('input', (e) => {
    renderVault(e.target.value);
  });

  // Render Vault Items
  function renderVault(filter = '') {
    passwordList.innerHTML = '';
    const query = filter.toLowerCase();

    const filtered = credentials.filter(
      item =>
        item.site.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query)
    );

    vaultCount.textContent = credentials.length;

    if (filtered.length === 0) {
      passwordList.innerHTML = `<div class="empty-state">No credentials found.</div>`;
      return;
    }

    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'vault-item';

      div.innerHTML = `
        <div class="item-info">
          <h3>${escapeHTML(item.site)}</h3>
          <p>${escapeHTML(item.username)}</p>
          <div class="item-password" data-id="${item.id}" data-visible="false">••••••••••••</div>
        </div>
        <div class="item-actions">
          <button class="action-btn toggle-btn" data-id="${item.id}" title="Show/Hide">Show</button>
          <button class="action-btn copy-btn" data-pwd="${escapeHTML(item.password)}" title="Copy Password">Copy</button>
          <button class="action-btn delete-btn" data-id="${item.id}" title="Delete">Delete</button>
        </div>
      `;

      passwordList.appendChild(div);
    });
  }

  // Event Delegation for Vault Actions (Show, Copy, Delete)
  passwordList.addEventListener('click', (e) => {
    const target = e.target;

    // Toggle Visibility
    if (target.classList.contains('toggle-btn')) {
      const id = target.getAttribute('data-id');
      const pwdDisplay = passwordList.querySelector(`.item-password[data-id="${id}"]`);
      const entry = credentials.find(c => c.id === id);

      if (pwdDisplay.getAttribute('data-visible') === 'false') {
        pwdDisplay.textContent = entry.password;
        pwdDisplay.setAttribute('data-visible', 'true');
        target.textContent = 'Hide';
      } else {
        pwdDisplay.textContent = '••••••••••••';
        pwdDisplay.setAttribute('data-visible', 'false');
        target.textContent = 'Show';
      }
    }

    // Copy to Clipboard
    if (target.classList.contains('copy-btn')) {
      const pwd = target.getAttribute('data-pwd');
      navigator.clipboard.writeText(pwd).then(() => {
        showToast('Password copied to clipboard!');
      });
    }

    // Delete Credential
    if (target.classList.contains('delete-btn')) {
      const id = target.getAttribute('data-id');
      credentials = credentials.filter(c => c.id !== id);
      saveToLocalStorage();
      renderVault(searchInput.value);
      showToast('Credential deleted.', true);
    }
  });

  // Helpers
  function saveToLocalStorage() {
    localStorage.setItem('vaultKey_data', JSON.stringify(credentials));
  }

  function showToast(message, isWarning = false) {
    toast.textContent = message;
    toast.style.backgroundColor = isWarning ? '#ef4444' : '#10b981';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
