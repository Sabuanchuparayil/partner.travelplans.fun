import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the root directory
// Set custom Content-Type for .ts and .tsx files to fix module loading error
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// For client-side routing with React Router, send index.html for any path
// that is not a static file.
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !path.extname(req.path)) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    next();
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});