const CACHE_NAME = 'storyapp-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/styles/styles.css',
  '/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});

self.addEventListener('push', (event) => {
  const data = event.data.json();

  const title = data.title || 'Story Baru';
  const options = {
    body: data.body || 'Ada cerita baru',
    icon: '/images/logo.png',
    data: {
      url: '/#/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/#/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const hadWindow = clientsArr.some((client) => {
        if (client.url.includes(url)) {
          client.focus();
          return true;
        }
        return false;
      });

      if (!hadWindow) {
        clients.openWindow(url);
      }
    })
  );
});