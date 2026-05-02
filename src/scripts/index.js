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
      alert('SW registered');
    } catch (e) {
      alert('SW gagal: ' + e.message);
    }
  });
}

window.subscribePush = async function () {
  alert('klik tombol');

  if (!swRegistration) {
    alert('SW belum siap');
    return;
  }

  alert('service worker ready');

  const permission = await Notification.requestPermission();
  alert('permission: ' + permission);

  if (permission !== 'granted') {
    alert('izin ditolak');
    return;
  }

  const vapidPublicKey = 'ISI_VAPID_KEY_DISINI';
  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  alert('berhasil subscribe');

  await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(subscription),
  });

  alert('terkirim ke server');
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}