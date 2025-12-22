/**
 * Service Worker for TaxiBoy PWA
 * 
 * Minimal service worker for PWA installation and future push notifications.
 * No caching/offline mode - we want always fresh data from the API.
 * 
 * This service worker:
 * - Registers the app as installable (PWA requirement)
 * - Prepares for future push notifications
 * - Does NOT cache any data (we want live data always)
 * - Automatically updates when new version is deployed
 * 
 * UPDATE BEHAVIOR:
 * - Browser automatically checks for updates every time the app is opened
 * - When a new version is detected (sw.js file changed), it updates automatically
 * - No need to reinstall the app - updates are seamless
 * - Uses skipWaiting() to activate new version immediately
 */

// Install event - activate new version immediately
// This ensures users always get the latest version without manual intervention
self.addEventListener('install', () => {
  // Skip waiting phase - activate new service worker immediately
  // This means updates are applied as soon as they're detected
  self.skipWaiting();
});

// Activate event - take control of all pages immediately
// This ensures the new service worker controls all open tabs/pages
self.addEventListener('activate', (event) => {
  // Claim all clients (tabs/pages) immediately
  // This ensures the new version is active across all open instances
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Take control of all pages
      // Optional: Clear old caches if you add caching in the future
      // caches.keys().then(cacheNames => {
      //   return Promise.all(
      //     cacheNames.map(cacheName => caches.delete(cacheName))
      //   );
      // })
    ])
  );
});

// Push event - handle push notifications (future implementation)
// This is where we'll add push notification handling when ready
self.addEventListener('push', (_event) => {
  // TODO: Implement push notification handling
  // For now, the event is received but not processed
  
  // Example structure for future implementation:
  // const data = event.data?.json();
  // const title = data?.title || 'New Booking';
  // const options = {
  //   body: data?.body || 'You have a new booking',
  //   icon: '/icon-light-32x32.png',
  //   badge: '/icon-light-32x32.png',
  // };
  // event.waitUntil(
  //   self.registration.showNotification(title, options)
  // );
});

// Notification click event - handle when user clicks on notification
self.addEventListener('notificationclick', (event) => {
  // TODO: Implement notification click handling
  // For now, just close the notification
  event.notification.close();
  
  // Example structure for future implementation:
  // event.waitUntil(
  //   clients.openWindow('/admin')
  // );
});

