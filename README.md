# Aadhaar OCR App

A modern web application that extracts structured data from Aadhaar card images using Google Vision API. Built with React (Vite) frontend and containerized Node.js backend for seamless OCR processing and real-time updates.

![Aadhaar OCR App](https://images.pexels.com/photos/6804067/pexels-photo-6804067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop)

## 📋 Project Overview

The Aadhaar OCR App streamlines the process of extracting and digitizing information from Aadhaar cards. Users can upload images of their Aadhaar cards, and the application automatically extracts key information such as:

- Aadhaar number
- Personal details (Name, DOB, Gender)
- Address information
- QR code data

The application provides real-time processing updates through WebSocket connections and stores extracted data for future reference.

## ✨ Features

- **🔍 Advanced OCR Processing**: Leverages Google Vision API for accurate text extraction
- **🆔 Aadhaar Number Detection**: Intelligent pattern recognition for Aadhaar number identification
- **⚡ Real-time Updates**: Live processing status updates via Socket.IO
- **📋 Form Data Extraction**: Structured extraction of personal and address information
- **💾 Data Persistence**: MongoDB integration for storing OCR results
- **⚡ Redis Caching**: Fast retrieval of frequently accessed data
- **🐳 Containerized Backend**: Docker support for easy deployment
- **📱 Responsive Design**: Mobile-friendly interface built with React

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Redis** - In-memory caching
- **Google Vision API** - OCR processing
- **Socket.IO** - WebSocket communication
- **Docker** - Containerization

## 📁 Project Structure

```
aadhaar-ocr-app/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript definitions
│   ├── public/                # Static assets
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Custom middleware
│   │   └── utils/             # Utility functions
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- Google Cloud Platform account with Vision API enabled

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to server directory
cd server

# Build Docker image
docker build -t aadhaar-ocr-backend .

# Or use Docker Compose (recommended)
docker-compose up --build
```

The backend API will be available at `http://localhost:3000`

## 🐳 Docker Setup

### Sample docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - ./server/.env
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./server/uploads:/app/uploads

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

### Quick Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://admin:password@localhost:27017/aadhaar_ocr?authSource=admin

# Redis
REDIS_URI=redis://localhost:6379

# Google Cloud Vision API
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
# OR use base64 encoded key
GOOGLE_CLOUD_CREDENTIALS_BASE64=your-base64-encoded-credentials

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Required Google Cloud Setup

1. Create a new project in Google Cloud Console
2. Enable the Vision API
3. Create a service account with Vision API permissions
4. Download the JSON key file
5. Set the `GOOGLE_CLOUD_KEY_FILE` path or encode the JSON as base64 for `GOOGLE_CLOUD_CREDENTIALS_BASE64`

## ▶️ Running the Project

### Development Mode

1. **Start Backend Services**
   ```bash
   # Start MongoDB and Redis with Docker
   docker-compose up mongodb redis -d
   
   # Or start the full backend
   docker-compose up backend -d
   ```

2. **Start Frontend**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/docs (if Swagger is configured)

### Production Mode

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps
```

## 🛣 API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### OCR Processing
- `POST /api/ocr/upload` - Upload Aadhaar image for processing
- `GET /api/ocr/results/:id` - Get OCR result by ID
- `GET /api/ocr/history` - Get user's OCR history
- `DELETE /api/ocr/results/:id` - Delete OCR result

### WebSocket Events
- `connection` - Client connects to server
- `ocr:start` - Begin OCR processing
- `ocr:progress` - Processing progress updates
- `ocr:complete` - Processing completed
- `ocr:error` - Processing error occurred

### Sample API Response

```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "aadhaarNumber": "1234 5678 9012",
    "personalInfo": {
      "name": "John Doe",
      "dateOfBirth": "01/01/1990",
      "gender": "Male"
    },
    "address": {
      "line1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "confidence": 0.95,
    "processedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🚀 Deployment Notes

### Backend Deployment (AWS EC2)

1. **Server Setup**
   ```bash
   # Install Docker and Docker Compose
   sudo yum update -y
   sudo yum install -y docker
   sudo service docker start
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd aadhaar-ocr-app
   
   # Set environment variables
   cp server/.env.example server/.env
   # Edit .env with production values
   
   # Start services
   docker-compose up -d
   ```

### Nginx Reverse Proxy (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Frontend Deployment

For production frontend deployment, build the React app and serve it via a web server:

```bash
cd client
npm run build
# Deploy dist/ folder to your hosting service (Netlify, Vercel, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Credits

- **Google Vision API** - OCR processing capabilities
- **React Team** - Frontend framework
- **Express.js Team** - Backend framework
- **MongoDB Team** - Database solution

## ⚠️ Disclaimer

This application is designed for educational and development purposes. When handling Aadhaar card data, ensure compliance with:
- Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016
- Data Protection and Privacy laws
- UIDAI guidelines for Aadhaar data handling

Always implement proper security measures and data encryption when deploying to production environments.

---

**Made with ❤️ for the developer community**