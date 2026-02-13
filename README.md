# QR-P Backend - Xpress Inn Feedback System

Backend API for Xpress Inn Marshall feedback and review management system.

## 🚀 Features

- ✅ Customer feedback submission
- ✅ Email notifications (customer + business)
- ✅ MongoDB database storage
- ✅ RESTful API endpoints
- ✅ CORS enabled for frontend
- ✅ Feedback status management
- ✅ Rating system

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Aryankaushik541/qr-p-backend.git
cd qr-p-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skk

# Email Configuration
EMAIL_USER=xpressinnmarshall@gmail.com
EMAIL_PASS=zkbw virh mpkw tyrw
EMAIL_PORT=587
EMAIL_FROM=xpressinnmarshall@gmail.com
BUSINESS_EMAIL=xpressinnmarshall@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Setup MongoDB Locally:**

   **Option 1: MongoDB Compass (Recommended - Easiest)**
   - Download: https://www.mongodb.com/try/download/compass
   - Install and open MongoDB Compass
   - Connect using: `mongodb://localhost:27017`
   - Database `skk` will be created automatically

   **Option 2: MongoDB Community Server**
   - Download: https://www.mongodb.com/try/download/community
   - Install MongoDB
   - Start MongoDB service:
     ```bash
     # Windows
     net start MongoDB
     
     # Mac
     brew services start mongodb-community
     
     # Linux
     sudo systemctl start mongod
     ```

5. Run the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Create Feedback
```http
POST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "contact": "1234567890",
  "message": "Great experience!",
  "rating": 5,
  "feedbackType": "happy"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "contact": "1234567890",
    "message": "Great experience!",
    "rating": 5,
    "feedbackType": "happy",
    "status": "pending",
    "createdAt": "2024-02-13T...",
    "updatedAt": "2024-02-13T..."
  }
}
```

### 2. Get All Feedbacks
```http
GET /api/feedbacks
```

### 3. Get Single Feedback
```http
GET /api/feedback/:id
```

### 4. Update Feedback Status
```http
PUT /api/feedback/:id/status
Content-Type: application/json

{
  "status": "reviewed"
}
```

### 5. Delete Feedback
```http
DELETE /api/feedback/:id
```

## 📧 Email Configuration

Gmail App Password setup:

1. Go to Google Account: https://myaccount.google.com
2. Security → 2-Step Verification (enable it)
3. Security → App passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Add to `.env` file (with spaces): `zkbw virh mpkw tyrw`

## 🗂️ Project Structure

```
qr-p-backend/
├── src/
│   ├── Controller/
│   │   └── feedback.Controllers.js    # Business logic
│   ├── Models/
│   │   └── feedback.Models.js         # Database schema
│   ├── Routes/
│   │   └── feedback.Routes.js         # API routes
│   ├── utils/
│   │   └── mailer.js                  # Email utility
│   └── server.js                      # Main server file
├── .env                               # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔗 Frontend Integration

Update your frontend `PrivateFeedback.jsx`:

```javascript
const handleSubmit = async () => {
  // Validation
  if (!formData.name.trim()) {
    alert('Please enter your name');
    return;
  }
  if (!formData.email.trim()) {
    alert('Please enter your email');
    return;
  }
  if (!formData.contact.trim()) {
    alert('Please enter your contact number');
    return;
  }
  if (!formData.message.trim()) {
    alert('Please enter your message');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        message: formData.message,
        rating: formData.rating || 0,
        feedbackType: 'sad'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Thank you for your feedback! We will work on improving.');
      navigate('/thank-you');
    } else {
      alert('Failed to submit feedback. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error. Please check your connection.');
  }
};
```

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Nodemailer** - Email sending
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🧪 Testing

Test the API using:
- **Postman**: Import endpoints and test
- **Thunder Client** (VS Code extension)
- **cURL**:
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "contact": "1234567890",
    "message": "Test feedback",
    "rating": 5,
    "feedbackType": "happy"
  }'
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# Mac
brew services list

# Linux
sudo systemctl status mongod
```

### Email Not Sending
- Verify Gmail App Password is correct
- Check if 2-Step Verification is enabled
- Remove spaces from password in code (keep in .env with spaces)

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

## 📝 License

ISC

## 👨‍💻 Author

Aryan Kaushik

---

**Xpress Inn Marshall**  
📍 300 I-20, Marshall, TX  
📞 +1 923-471-8277  
🌐 https://xpressinnmarshall.com
