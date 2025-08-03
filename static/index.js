// Modern Password Generator JavaScript
const passphraseToggle = document.getElementById('passphraseToggle');
const saveSettingsCheckbox = document.getElementById('saveSettings');
const capitalizeWords = document.getElementById('capitalizeWords');
const wordCountSlider = document.getElementById('wordCountSlider');
const wordCountValue = document.getElementById('wordCountValue');
const separator = document.getElementById('separator');
const customSeparator = document.getElementById('customSeparator');
const maxWordLength = document.getElementById('maxWordLength');
const passwordInput = document.getElementById('password');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeDigits = document.getElementById('includeDigits');
const includeSpecial = document.getElementById('includeSpecial');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecialChars = document.getElementById('includeSpecialChars');
const excludeHomoglyphs = document.getElementById('excludeHomoglyphs');
const refreshpw = document.getElementById('refreshpw');
const languageSelect = document.getElementById('languageSelect');
const customLanguage = document.getElementById('customLanguage');
const BASE_PATH = window.BASE_PATH || '';

// Enhanced separator change handler
separator.onchange = () => {
  customSeparator.style.display = separator.value === 'custom' ? 'block' : 'none';
  generatePassword();
  saveSettings();
};

// Enhanced passphrase toggle handler
passphraseToggle.onchange = () => {
  togglePassphraseOptions();
  saveSettings();
  updateButtonText();
};

// Save settings checkbox handler
if (saveSettingsCheckbox) {
  saveSettingsCheckbox.addEventListener('change', saveSettings);
}

// Enhanced toggle passphrase options function
function togglePassphraseOptions() {
  const passwordOptions = document.getElementById('passwordOptions');
  const passphraseOptions = document.getElementById('passphraseOptions');
  
  if (passphraseToggle.checked) {
    passwordOptions.style.display = 'none';
    passphraseOptions.style.display = 'block';
    customSeparator.style.display = 'none';
  } else {
    passwordOptions.style.display = 'block';
    passphraseOptions.style.display = 'none';
  }
  
  generatePassword();
}

// Update button text based on mode
function updateButtonText() {
  const buttonText = document.querySelector('.button-text');
  if (buttonText) {
    buttonText.textContent = passphraseToggle.checked ? 'Generate Passphrase' : 'Generate Password';
  }
}

// Enhanced event listeners for all inputs
document.querySelectorAll('input, select').forEach(element => {
  if (element.id !== 'passphraseToggle' && element.id !== 'separator' && element.id !== 'saveSettings') {
    element.addEventListener('change', () => {
      generatePassword();
      saveSettings();
    });
  }
});

// Enhanced password generation with better error handling and loading states
async function generatePassword() {
  try {
    const formData = new FormData();
    formData.append('length', lengthSlider.value);
    formData.append('include_uppercase', includeUppercase.checked);
    formData.append('include_digits', includeDigits.checked);
    formData.append('include_special', includeSpecial.checked);
    formData.append('exclude_homoglyphs', excludeHomoglyphs.checked);
    formData.append('include_numbers', includeNumbers.checked);
    formData.append('include_special_chars', includeSpecialChars.checked);
    formData.append('capitalize', capitalizeWords.checked);
    formData.append('word_count', wordCountSlider.value);
    formData.append('separator_type', separator.value === 'custom' ? 'single_character' : separator.value);
    if (separator.value === 'custom') {
      formData.append('user_defined_separator', customSeparator.value);
    }
    formData.append('max_word_length', maxWordLength.value);
    formData.append('type', passphraseToggle.checked ? 'passphrase' : 'password');
    formData.append('language', languageSelect.value);
    if (languageSelect.value === 'custom') {
      formData.append('languageCustom', customLanguage.value);
    }

    // Show loading state
    refreshpw.classList.add('loading');

    const response = await fetch(`${BASE_PATH}generate-password`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.passwords && Array.isArray(data.passwords)) {
      // Multi-password mode
      data.passwords.forEach((pwd, index) => {
        if (index < 5) {
          const element = document.getElementById(`multipw${index}`);
          if (element) {
            element.value = pwd;
            // Add animation to the row
            const row = element.closest('.password-row');
            if (row) {
              row.classList.add('generated');
              setTimeout(() => row.classList.remove('generated'), 300);
            }
          }
        }
      });
    } else {
      // Single password mode
      if (passwordInput) {
        passwordInput.value = data.password;
        scrambleAnimation(data.password);
      }
    }

    // Show success feedback
    showFeedback('Password generated successfully!', 'success');

  } catch (error) {
    console.error('Error generating password:', error);
    showFeedback('Error generating password. Please try again.', 'error');
  } finally {
    // Remove loading state
    refreshpw.classList.remove('loading');
  }
}

// Enhanced scramble animation with better visual feedback
function scrambleAnimation(finalPassword) {
  if (!passwordInput) return;
  
  const originalValue = passwordInput.value;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{ }|;:\'",.<>/?';
  let scrambled = Array.from({ length: finalPassword.length }, () => characters.charAt(Math.floor(Math.random() * characters.length)));
  
  passwordInput.value = scrambled.join('');
  passwordInput.style.color = '#6366f1';
  
  const maxDelay = 200;
  let completed = 0;

  finalPassword.split('').forEach((char, index) => {
    const delay = Math.random() * maxDelay;
    setTimeout(() => {
      scrambled[index] = char;
      passwordInput.value = scrambled.join('');
      completed++;
      
      if (completed === finalPassword.length) {
        setTimeout(() => {
          passwordInput.style.color = '';
        }, 500);
      }
    }, delay);
  });
}

// Enhanced copy password function with better feedback
async function copyPassword(index) {
  let password;
  let button;
  
  if (index === 100) {
    password = passwordInput?.value || '';
    button = document.querySelector('.copy-button');
  } else {
    const element = document.getElementById(`multipw${index}`);
    password = element?.value || '';
    button = element?.nextElementSibling;
  }

  if (!password) {
    showFeedback('No password to copy!', 'error');
    return;
  }

  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(password);
      showCopySuccess(button);
    } else {
      // Fallback for older browsers
      fallbackCopy(password, button);
    }
  } catch (error) {
    console.error('Error copying password:', error);
    fallbackCopy(password, button);
  }
}

// Enhanced copy success feedback
function showCopySuccess(button) {
  if (!button) return;
  
  const originalText = button.textContent;
  button.textContent = 'Copied!';
  button.style.background = '#10b981';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
  }, 2000);
}

// Enhanced fallback copy method
function fallbackCopy(password, button) {
  const textArea = document.createElement('textarea');
  textArea.value = password;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess(button);
    } else {
      showFeedback('Failed to copy password', 'error');
    }
  } catch (error) {
    console.error('Fallback copy failed:', error);
    showFeedback('Failed to copy password', 'error');
  } finally {
    document.body.removeChild(textArea);
  }
}

// Enhanced generate button click handler
refreshpw.addEventListener('click', async function () {
  refreshpw.classList.add('loading');
  await generatePassword();
}, false);

// Enhanced slider input handlers
wordCountSlider.oninput = function () {
  wordCountValue.innerText = this.value;
};

lengthSlider.oninput = function () {
  lengthValue.innerText = this.value;
};

// Enhanced settings save function
function saveSettings() {
  if (!saveSettingsCheckbox) return;
  
  if (saveSettingsCheckbox.checked) {
    const settings = {
      includeUppercase: includeUppercase.checked,
      includeDigits: includeDigits.checked,
      includeSpecial: includeSpecial.checked,
      excludeHomoglyphs: excludeHomoglyphs.checked,
      length: lengthSlider.value,
      passphraseToggle: passphraseToggle.checked,
      capitalizeWords: capitalizeWords.checked,
      includeNumbers: includeNumbers.checked,
      includeSpecialChars: includeSpecialChars.checked,
      wordCount: wordCountSlider.value,
      separator: separator.value,
      customSeparator: customSeparator.value,
      maxWordLength: maxWordLength.value,
      language: languageSelect.value,
      customLanguage: customLanguage.value,
    };
    
    const cookieValue = `pwgen-settings=${JSON.stringify(settings)};path=/;max-age=31536000;samesite=strict`;
    document.cookie = cookieValue;
    
    showFeedback('Settings saved!', 'success');
  } else {
    document.cookie = 'pwgen-settings=;path=/;max-age=-1';
    showFeedback('Settings cleared!', 'info');
  }
}

// Enhanced settings load function
function loadSettings() {
  try {
    const cookies = document.cookie.split('; ');
    const settingsCookie = cookies.find(row => row.startsWith('pwgen-settings='));
    
    if (settingsCookie) {
      const settings = JSON.parse(settingsCookie.substring(settingsCookie.indexOf('=') + 1));

      // Apply settings to form elements
      includeUppercase.checked = settings.includeUppercase ?? true;
      includeDigits.checked = settings.includeDigits ?? true;
      includeSpecial.checked = settings.includeSpecial ?? true;
      excludeHomoglyphs.checked = settings.excludeHomoglyphs ?? false;
      lengthSlider.value = settings.length ?? 12;
      lengthValue.innerText = settings.length ?? 12;
      passphraseToggle.checked = settings.passphraseToggle ?? false;
      capitalizeWords.checked = settings.capitalizeWords ?? false;
      includeNumbers.checked = settings.includeNumbers ?? false;
      includeSpecialChars.checked = settings.includeSpecialChars ?? false;
      wordCountSlider.value = settings.wordCount ?? 4;
      wordCountValue.innerText = settings.wordCount ?? 4;
      separator.value = settings.separator ?? 'dash';
      maxWordLength.value = settings.maxWordLength ?? 7;
      languageSelect.value = settings.language ?? 'en';
      
      // Handle custom separator
      if (separator.value === 'custom') {
        customSeparator.style.display = 'block';
        customSeparator.value = settings.customSeparator ?? '';
      }
      
      // Handle custom language
      if (languageSelect.value === 'custom') {
        customLanguage.style.display = 'block';
        customLanguage.value = settings.customLanguage ?? '';
      }
      
      // Set save settings checkbox
      if (saveSettingsCheckbox) {
        saveSettingsCheckbox.checked = true;
      }
      
      // Apply the settings
      togglePassphraseOptions();
      updateButtonText();
      
      console.log('Settings loaded successfully');
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    document.cookie = 'pwgen-settings=;path=/;max-age=-1';
  }
}

// Enhanced feedback system
function showFeedback(message, type = 'info') {
  // Remove existing feedback
  const existingFeedback = document.querySelector('.feedback-message');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create feedback element
  const feedback = document.createElement('div');
  feedback.className = `feedback-message feedback-${type}`;
  feedback.textContent = message;
  
  // Style the feedback
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      feedback.style.background = '#10b981';
      break;
    case 'error':
      feedback.style.background = '#ef4444';
      break;
    case 'warning':
      feedback.style.background = '#f59e0b';
      break;
    default:
      feedback.style.background = '#6366f1';
  }
  
  // Add to page
  document.body.appendChild(feedback);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => feedback.remove(), 300);
    }
  }, 3000);
}

// Add CSS animations for feedback
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Enhanced language select handler
if (languageSelect) {
  languageSelect.onchange = function () {
    customLanguage.style.display = this.value === 'custom' ? 'block' : 'none';
    generatePassword();
    saveSettings();
  };
}

// Initialize on page load
window.addEventListener('load', () => {
  loadSettings();
  updateButtonText();
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate password
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generatePassword();
    }
    
    // Ctrl/Cmd + C to copy password (when password input is focused)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement === passwordInput) {
      e.preventDefault();
      copyPassword(100);
    }
  });
  
  // Add password strength indicator
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const strength = calculatePasswordStrength(password);
      updatePasswordStrengthIndicator(strength);
    });
  }
});

// Password strength calculator
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  return Math.min(score, 5);
}

// Update password strength indicator
function updatePasswordStrengthIndicator(strength) {
  // Remove existing indicator
  const existingIndicator = document.querySelector('.password-strength');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  if (!passwordInput || !passwordInput.value) return;
  
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a', '#15803d'];
  
  const indicator = document.createElement('div');
  indicator.className = 'password-strength';
  indicator.textContent = strengthLabels[strength - 1] || 'Very Weak';
  indicator.style.cssText = `
    position: absolute;
    top: -25px;
    left: 0;
    font-size: 0.75rem;
    color: ${strengthColors[strength - 1] || '#ef4444'};
    font-weight: 600;
  `;
  
  passwordInput.parentElement.style.position = 'relative';
  passwordInput.parentElement.appendChild(indicator);
}
