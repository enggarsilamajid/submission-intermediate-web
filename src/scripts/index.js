import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';

import App from './pages/app';

let swRegistration = null;

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
      swRegistration = await navigator.serviceWorker.register('/service-worker.js');
    } catch (e) {
      alert('SW gagal: ' + e.message);
    }
  });
}

window.getPushSubscription = async function () {
  if (!swRegistration) return null;
  return await swRegistration.pushManager.getSubscription();
};

window.subscribePush = async function () {
  if (!swRegistration) {
    alert('SW belum siap');
    return null;
  }

  const existing = await swRegistration.pushManager.getSubscription();
  if (existing) {
    alert('Sudah aktif');
    return existing;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('izin ditolak');
    return null;
  }

  const vapidPublicKey = 'ISI_VAPID_KEY_DISINI';
  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await swRegistration.pushManager.subscribe({
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
};

window.unsubscribePush = async function () {
  const sub = await window.getPushSubscription();
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
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
