// Prefijo para evitar conflictos
const PREFIX = 'panel_empresarial_';

export function getCookie(name) {
  const key = PREFIX + name;
  const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name, value, days = 365) {
  const key = PREFIX + name;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Datos guardados en localStorage (más espacio que cookies)
const DATA_KEY = PREFIX + 'datos';
const WELCOME_KEY = PREFIX + 'welcome';

export function getWelcomeDismissed() {
  return getCookie(WELCOME_KEY) === '1' || localStorage.getItem(WELCOME_KEY) === '1';
}

export function setWelcomeDismissed(dontShowAgain) {
  if (dontShowAgain) {
    setCookie(WELCOME_KEY, '1');
    localStorage.setItem(WELCOME_KEY, '1');
  }
}

export function getStoredData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function setStoredData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}
