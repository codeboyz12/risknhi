# My Express + SQLite Web Application

This is a simple web application using **Node.js + Express + SQLite** for the backend and **pure JavaScript + CSS** for the frontend.

---

## 🗂 Project Structure
```
project/
├── config/
│ └──db.js # Setup file for database
├── controllers/ # Main function and logic of project
├── database/
│ └── risknhiDB.sqlite # SQLite database (optional, created at runtime)
├── frontend/ # HTML resource
│ └── index.html # Main HTML page
├── models/ # Function work directly with database
├── routes/
│ └── pages.js # Route pages
├── package-lock.json
├── package.json
└── server.js # Entry point of the app
```
---

## ⚡ Installation and Running

### 1. Clone or download the project

```bash
git clone https://github.com/codeboyz12/risknhi.git
cd risknhi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the application
```bash
node server.js
```