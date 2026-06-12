📰 News CMS Project

A full-stack News Content Management System (CMS) built using Node.js, Express.js, MongoDB, and EJS, designed to efficiently manage digital news publishing workflows including article creation, categorization, user authentication, and media handling. The system is structured for scalability, maintainability, and smooth content management across different user roles.

🚀 Features
👤 User Authentication (Admin / Author roles)
🗂️ Category Management (Create, Edit, Delete)
📰 Article Management
Create / Edit / Delete Articles
Draft & Publish System
SEO-friendly Slugs
Reading Time Calculation

View Counter
🖼️ Image Upload System (Multer Integration)
📊 Admin Dashboard
🔐 Role-based Access Control
⚡ MVC Architecture
🎨 EJS Templating Engine

🧠 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Frontend: EJS, HTML, CSS
Authentication: JWT / Session-based auth (as implemented)
File Uploads: Multer
Other Tools: dotenv, bcrypt

📁 Project Structure
news-cms/
├── config/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── views/
│   ├── admin/
│   ├── author/
│   ├── pages/
├── public/
├── uploads/
├── app.js
└── package.json

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/devansh-rajput-119/news-cms.git
cd news-cms
2. Install dependencies
npm install
3. Setup environment variables

Create a .env file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4. Run the project
npm start

📌 API / Modules

🔐 Auth
Register / Login
Role-based access

🗂️ Category
Create category
Edit category
Delete category

📰 Articles
Create article
Publish / Draft system

Image upload support
📈 Future Improvements
🔍 Search & filter system
📱 React frontend upgrade
☁️ Deployment (Render / AWS)
📊 Analytics dashboard
👨‍💻 Author

Devansh Rajput
GitHub: @devansh-rajput-119

⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
