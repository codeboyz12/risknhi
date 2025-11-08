# My Express + SQLite Web Application

This is a simple web application using **Node.js + Express + SQLite** for the backend and **pure JavaScript + CSS** for the frontend.

---

## 🗂 Project Structure
project/<br>
├── config/<br>
│ └──db.js # Setup file for database<br>
├── controllers/ # Main function and logic of project<br>
├── database/<br>
│ └── risknhiDB.sqlite # SQLite database (optional, created at runtime)<br>
├── frontend/ # HTML resource<br>
│ └── index.html # Main HTML page<br>
├── models/ # Function work directly with database<br>
├── routes/<br>
│ └── pages.js # Route pages<br>
├── package-lock.json<br>
├── package.json<br>
└── server.js # Entry point of the app<br>

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