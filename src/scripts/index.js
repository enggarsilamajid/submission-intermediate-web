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
    await navigator.serviceWorker.register('/service-worker.js');
  });
}

window.subscribePush = async function () {
  alert('klik tombol');

  const registration = await navigator.serviceWorker.ready;
  alert('service worker ready');

  const permission = await Notification.requestPermission();
  alert('permission: ' + permission);

  if (permission !== 'granted') {
    alert('izin ditolak');
    return;
  }

  const vapidPublicKey = 'ISI_VAPID_KEY_DISINI';
  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
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