/* eslint-disable no-restricted-globals */
// Service Worker for Push Notifications

// Install event - cache resources if needed
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting(); // Activate worker immediately
});

// Activate event - clean up old caches if needed
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

// Push event - receive and display push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');

  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/logo192.png',
    badge: '/logo192.png',
    url: '/',
  };

  // Parse notification data if provided
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      console.error('Error parsing push data:', e);
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || '/logo192.png',
    badge: notificationData.badge || '/logo192.png',
    data: {
      url: notificationData.url || '/',
      timestamp: notificationData.timestamp || Date.now(),
    },
    vibrate: [200, 100, 200],
    tag: 'neuronotes-notification',
    requireInteraction: true, // Keep notification visible until user interacts
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click event - handle when user clicks notification
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync could be added here for offline support
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
});

console.log('Service Worker: Loaded');
