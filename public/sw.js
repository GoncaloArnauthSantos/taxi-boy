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
 */

// Install event - just activate immediately
// No caching needed since we want always fresh data
self.addEventListener('install', (_event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
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

