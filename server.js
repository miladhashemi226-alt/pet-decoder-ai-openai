import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
// Import your existing API routes here if you have them, e.g.:
// import apiRoutes from './server/routes.js'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Serve Static Frontend (The "Dist" folder)
// This is the key to running standalone!
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Your API Routes (Example)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'standalone-vultr' });
});

// Attach your imported routes
// app.use('/api', apiRoutes);

// 4. Catch-All Handler (For React Router)
// Any request not caught by API or Static files gets sent to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 5. Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ App running locally on http://localhost:${PORT}`);
});