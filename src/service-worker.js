const CACHE_NAME = 'storyapp-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/styles/styles.css',
  '/images/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'Story Baru',
    options: {
      body: 'Ada cerita baru ditambahkan',
      icon: '/images/logo.png',
    },
  };

  if (event.data) {
    const json = event.data.json();

    data.title = json.title || data.title;
    data.options.body = json.body || data.options.body;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/#/')
  );
});