# Aadhaar OCR App

A web application that extracts structured data from Aadhaar card images using Google Vision API.

## Features

- OCR processing with Google Vision API
- Validate Aadhaar Number
- Aadhaar number and personal data extraction

## Tech Stack

**Frontend:**
- React 18 + Vite + TypeScript
- Tailwind CSS

**Backend:**
- Node.js + Express
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
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json

```

## API Endpoints

- `POST /api/aadhaar/extract` - Upload Aadhaar image


## Project Structure

```
aadhaar-ocr-app/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Docker)
├── LICENSE          # MIT License
└── README.md        
```

## Access

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## License

MIT License

---

⚠️ **Disclaimer:** Ensure compliance with Aadhaar data protection laws and UIDAI guidelines when handling Aadhaar card data.