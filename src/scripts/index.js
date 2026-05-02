import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';

import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
    } catch (e) {
      alert('SW ERROR: ' + e.message);
    }
  });
}

async function waitForSW() {
  if (navigator.serviceWorker.controller) return;

  await new Promise((resolve) => {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      resolve();
    });
  });
}

async function getRegistration() {
  let reg = await navigator.serviceWorker.getRegistration();

  if (!reg) {
    await new Promise((r) => setTimeout(r, 1000));
    reg = await navigator.serviceWorker.getRegistration();
  }

  if (!navigator.serviceWorker.controller) {
    await waitForSW();
  }

  return reg;
}

window.getPushSubscription = async function () {
  try {
    const reg = await getRegistration();
    if (!reg) return null;

    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
};

window.subscribePush = async function () {
  try {
    const reg = await getRegistration();
    if (!reg) {
      alert('Service Worker belum siap');
      return null;
    }

    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const vapidPublicKey = 'BEl62iUYgUivh9z8m0vG0pN7qk1m6v0ZC4m9o6K5R9lF0n1rF2Q3pW8sV5bY7xT8k2zM3aB4cD5eF6gH7iJ8kL';
    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey,
    });

    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (err) {
    alert('ERROR: ' + err.message);
    return null;
  }
};

window.unsubscribePush = async function () {
  try {
    const reg = await getRegistration();
    if (!reg) return;

    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;

    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(sub),
    });

    await sub.unsubscribe();
  } catch (err) {
    alert('ERROR unsubscribe: ' + err.message);
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
