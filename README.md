# 🎬 CineMetrics

**Web Application:**

- **Discover, discuss, and review movies. 🍿**
- **Create, keep, and share your lists of movies. 🎞️**
- **Built with Django (API Backend) and React (Frontend). 🔥**


# 🚀 Project Installation Guide

This guide will help you set up the project (backend and React frontend) on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **🐍 Python 3.8+**  
  [Download Python](https://www.python.org/downloads/)

- **💻 Git**  
  [Download Git](https://git-scm.com/downloads/)

- **📦 pip**  
  (Usually comes with Python.)

- **🔌 Virtual Environment Tool**  
  (e.g., `venv`, which is included with Python 3.8+)

- **⚛️ Node.js & npm**  
  (Required for the React frontend. [Download Node.js](https://nodejs.org/))

---

## Step-by-Step Installation

### Backend Setup

1. ### 💾 Clone the Repository

   Open your terminal and run:

   ```bash
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository
   ```

2. ### 📦 Create a Virtual Environment

   Create and activate a virtual environment:

   - **On macOS/Linux:**

     ```bash
     python3 -m venv env
     source env/bin/activate
     ```

   - **On Windows:**

     ```bash
     python -m venv env
     env\Scripts\activate
     ```

3. ### 🔧 Install Python Dependencies

   Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

4. ### 🛠️ Configure Environment Variables

   Create a `.env` file in the project's root directory and add your environment variables. For example:

   ```ini
   SECRET_KEY=your-secret-key
   DEBUG=True
   ```

   > **Tip:** You can use [python-dotenv](https://pypi.org/project/python-dotenv/) to automatically load these variables.

5. ### 📂 Set Up the Database

   Run migrations to create the database:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. ### 👤 Create a Superuser

   Create an admin account to access the Django admin:

   ```bash
   python manage.py createsuperuser
   ```

   Follow the prompts to set up your admin username and password.

7. ### 🌐 Run the Backend Server

   Start the Django development server:

   ```bash
   python manage.py runserver
   ```

   Open your browser and navigate to [http://localhost:8000](http://localhost:8000).

---

### Frontend (React) Setup

1. ### 📂Navigate to the Frontend Directory

   The React frontend is located in a directory named `frontend`:

   ```bash
   cd frontend
   ```

2. ### 📦Install React Dependencies

   Install the required packages for the React app:

   ```bash
   npm install
   ```

3. ### 🚀Start the React Development Server

   Launch the React app:

   ```bash
   npm start
   ```

   Your browser should automatically open to the React application (typically at [http://localhost:3000](http://localhost:3000)). If not, navigate there manually.

---

You should now have both the backend and React frontend installed and running on your local machine.
