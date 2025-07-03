# Expense Tracker

A simple, user-friendly web application to track your income and expenses.

## Features

- Add, edit, and delete transactions
- View balance, income, and expenses
- Persistent storage (localStorage / backend ready)
- Responsive and mobile-friendly design

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript (or React, if applicable)
- Backend (optional): Node.js, Express.js, MongoDB (if using a database)

---

## Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/aryasaan/Expense-Tracker.git
cd Expense-Tracker
```
### 2. Install Dependencies

If the project uses Node.js:
```bash
cd Expense-Tracker
cd backend
npm i
cd ..
cd frontend
npm install
```
### 3. Configure Environment Variables (if backend present)
Create a .env file in the root directory and add the following:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
### 4. Start the Server / App
```bash
node server.js
```
### 5. Start the frontend App
```bash
npm run dev
```
