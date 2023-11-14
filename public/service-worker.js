// // public/service-worker.js

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open('your-app-cache').then((cache) => {
//             return cache.addAll([
//                 // List the URLs of static assets you want to cache
//                 '/',
//                 '/css/app.css',
//                 '/js/app.js',
//                 // Add other static files like images, fonts, etc.
//             ]);
//         })
//     );
// });

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             return response || fetch(event.request);
//         })
//     );
// });
