// server.js

// 1. Setup Express dan HTTP Server
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// 2. Setup Socket.IO
// Cors configuration di bawah ini diperlukan jika frontend dan backend berbeda domain/port
// Karena kita menggunakan file index.html di folder yang sama, ini aman.
const io = new Server(server);

// 3. Serve File Static (index.html)
// Saat user mengakses root URL (localhost:3000), ia akan menampilkan index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Logika Socket.IO (Real-time)
io.on('connection', (socket) => {
  console.log('A user connected'); // Log saat ada client terhubung

  // 4a. Menerima pesan dari client
  socket.on('chat message', (msg) => {
    // Menampilkan pesan di console server
    console.log('message: ' + msg);
    
    // 4b. Mengirim pesan kembali ke SEMUA client yang terhubung (broadcast)
    io.emit('chat message', msg);
  });

  // Log saat user terputus
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 5. Menjalankan Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
