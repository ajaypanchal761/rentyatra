#!/usr/bin/env node

// Simple start script to run the backend from root directory
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting RentYatra Backend...');
console.log('📁 Changing to Backend directory...');

// Change to Backend directory and start the server
const backendPath = path.join(__dirname, 'Backend');
process.chdir(backendPath);

console.log('📂 Current directory:', process.cwd());

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: backendPath
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`🔌 Server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});
