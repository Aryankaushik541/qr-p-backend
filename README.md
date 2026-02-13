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
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/xpress-inn-feedback

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BUSINESS_EMAIL=xpressinn@example.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. Start MongoDB (make sure MongoDB is installed and running)

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔌 API Endpoints

### Create Feedback
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

### Get All Feedbacks
```http
GET /api/feedbacks
```

### Get Single Feedback
```http
GET /api/feedback/:id
```

### Update Feedback Status
```http
PUT /api/feedback/:id/status
Content-Type: application/json

{
  "status": "reviewed"
}
```

### Delete Feedback
```http
DELETE /api/feedback/:id
```

## 📧 Email Configuration

To enable email notifications:

1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Add credentials to `.env` file

## 🗂️ Project Structure

```
qr-p-backend/
├── src/
│   ├── Controller/
│   │   └── feedback.Controllers.js
│   ├── Models/
│   │   └── feedback.Models.js
│   ├── Routes/
│   │   └── feedback.Routes.js
│   ├── utils/
│   │   └── mailer.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔗 Frontend Integration

Update your frontend `PrivateFeedback.jsx` to connect with this API:

```javascript
const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Thank you for your feedback!');
      navigate('/thank-you');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit feedback');
  }
};
```

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- Nodemailer
- CORS
- dotenv

## 📝 License

ISC

## 👨‍💻 Author

Aryan Kaushik

---

**Xpress Inn Marshall** - 300 I-20, Marshall, TX | +1 923-471-8277
