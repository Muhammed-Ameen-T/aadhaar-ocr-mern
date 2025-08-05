# Aadhaar OCR App

A web application that extracts structured data from Aadhaar card images using Google Vision API.

## Features

- OCR processing with Google Vision API
- Real-time updates via WebSocket
- Aadhaar number and personal data extraction
- MongoDB data storage with Redis caching

## Tech Stack

**Frontend:**
- React 18 + Vite + TypeScript
- Tailwind CSS
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB + Redis
- Google Vision API
- Repository pattern with Inversify
- Docker containerized

## Quick Setup

### Backend
```bash
cd server
npm install
docker-compose up
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Setup

Create `server/.env`:
```env
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://admin:password@localhost:27017/aadhaar_ocr?authSource=admin
REDIS_URI=redis://localhost:6379

GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json

JWT_SECRET=your-jwt-secret
```

## API Endpoints

- `POST /api/ocr/upload` - Upload Aadhaar image
- `GET /api/ocr/results/:id` - Get OCR result
- `GET /api/ocr/history` - Get processing history
- `POST /api/auth/login` - User authentication

## Project Structure

```
aadhaar-ocr-app/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Docker)
└── docker-compose.yml
```

## Access

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## License

MIT License

---

⚠️ **Disclaimer:** Ensure compliance with Aadhaar data protection laws and UIDAI guidelines when handling Aadhaar card data.