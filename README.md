# Library Management System

A web-based library management system for managing books and borrow records.

## About the Project
This is a group project developed in fulfillment of the requirements for the Web Development course. The system lets library staff manage a book catalog and keep track of borrowing and returning of books, with search and filtering to find records quickly.

## Features
- Add, edit, archive, and delete books
- Borrow and return book records
- Search and filter books by category
- Search and filter borrow records by status
- Input validation and error handling   

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Prerequisites 
- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) (for MySQL and phpMyAdmin)

## Installation

### 1. Clone the Repository and Go to the Folder
```bash
    git clone https://github.com/purplyjoy/Library_System.git
    cd Library_System
```

### 2. Install Dependencies
```bash
    npm install
```

### 3. Set Up the Database
Start **MySQL** in the XAMPP Control Panel first, then choose one option.

**Option A: phpMyAdmin GUI**
1. Go to http://localhost/phpmyadmin
2. Click **New**, enter `library_db`, and click **Create**
3. Select `library_db`, then open the **Import** tab
4. Choose `database/library_db.sql` and click **Go**

**Option B: Command Line**
```bash
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS library_db"
    mysql -u root library_db < database/library_db.sql
``` 
- If you set a MySQL password, add `-p` to both commands.
- If `mysql` is not recognized, use the full path: `C:\xampp\mysql\bin\mysql.exe`

### 4. Check the Database Settings
Open `backend/db.js` and make sure the settings match your MySQL setup.
Default XAMPP: user `root`, empty password, database `library_db`

### 5. Start the Server
```bash
   npm start    
```
Or, for development with auto-reload (uses nodemon):
```bash
   npm run dev  
```
The server runs on: http://localhost:5000

6.  Open the 
- Open `frontend/index.html` in your browser, **or**
- If you copied the project into `C:\xampp\htdocs`, go to http://localhost/Library_System/frontend

## Project Structure
```text
Library_System/
├── backend/
│   ├── routes/
│   │   ├── books.js
│   │   ├── borrows.js
│   │   ├── categories.js
│   ├── db.js
│   ├── server.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── logo.png
│   ├── app.js
├── database/
│   ├── library_db.sql
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Troubleshooting

**"Database connection failed"**
- Check if MySQL is running
- Verify credentials in `backend/db.js` match your MySQL setup
- Ensure `library_db` exists in MySQL
- Make sure to change password to your own MySQL password or leave it blank of your MSQL has no password

**"Port 5000 is already in use"**
- Find the process using the port: 
```bash
    netstat -ano | findstr :5000
```
- Kill it, replacing `<PID>` with the number from the last column (without the `<>`):
```bash
    taskkill /PID <PID> /F
```
For example: taskkill /PID 4240 /F
