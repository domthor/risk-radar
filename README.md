
# Flask React App

This is a simple full-stack web application with a **Flask** backend and a **React** frontend, using **SQLite** for the database. The app allows you to add and fetch items from the database.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Flask, SQLite, Flask-CORS, Flask-SQLAlchemy
- **Database**: SQLite (stored in the backend folder)

---

## Getting Started

### 1. Clone the Repository

Clone the repo to your local machine:

```sh
git clone https://github.com/yourusername/flask-react-app.git
cd flask-react-app
```

### 2. Set Up the Backend

#### 2.1 Install Python Dependencies

Navigate to the `backend` folder and create a virtual environment:

```sh
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scriptsctivate
```

Then, install the required packages:

```sh
pip install flask flask-cors flask-sqlalchemy
```

#### 2.2 Run the Flask Server

Start the Flask development server:

```sh
python app.py
```

Your Flask API should now be running at [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

### 3. Set Up the Frontend

#### 3.1 Install Node.js Dependencies

Navigate to the `frontend` folder:

```sh
cd ../frontend
```

Then, install the required Node.js packages:

```sh
npm install
```

#### 3.2 Start the React Development Server

Start the React development server:

```sh
npm run dev
```

Your React app should now be running at [http://localhost:5173](http://localhost:5173).

---


