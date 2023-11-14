// const express = require('express');
// const httpProxy = require('http-proxy');

// const app = express();
// const proxy = httpProxy.createProxyServer();

// // Define the API server URL you want to access
// const apiServer = 'https://gtlslebs06-vm.gtls.com.au:2030';

// // Middleware to add CORS headers
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8000'); // Adjust to your frontend URL
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   next();
// });

// // Proxy requests to the API server
// app.all('/api/*', (req, res) => {
//   proxy.web(req, res, { target: apiServer });
// });

// // Start the server on port 3001 (or any other port of your choice)
// const port = 3001;
// app.listen(port, () => {
//   console.log(`Proxy server listening on port ${port}`);
// });
