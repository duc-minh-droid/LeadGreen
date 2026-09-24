# LeadGreen

**A sustainability game for campus: scan a QR code where you did something green, post a photo, earn points, grow a plant.**

University group project (Feb to Mar 2025), built by a team of nine. This is a fork of [sirutisb/LeadGreen](https://github.com/sirutisb/LeadGreen) with a polished frontend and a demo mode.

![LeadGreen demo](docs/media/demo.gif)

| Game | Feed | Leaderboard |
|---|---|---|
| ![](docs/media/game.png) | ![](docs/media/feed.png) | ![](docs/media/leaderboard.png) |

## Team

[@sirutisb](https://github.com/sirutisb), [@tvtn24](https://github.com/tvtn24), [@duc-minh-droid](https://github.com/duc-minh-droid), [@Taha-Mukati](https://github.com/Taha-Mukati), [@bananaboy10](https://github.com/bananaboy10), [@surajnagpal](https://github.com/surajnagpal), [@pulse77](https://github.com/pulse77), Ralph and Benitas.

## My part

I (Thomas, @duc-minh-droid) worked mostly on the React frontend of the plant game ("OverLeaf"): the item bar and inventory, the pop-up shop, daily rewards and the reward spin, level-up sound and confetti, the mobile layout of the plant, and fixes to the game login flow, image upload and QR scanner steps.

## Demo mode

With no `VITE_BACKEND` set, the frontend runs without the Django server: any username and password log you in, and plants, items, posts and the leaderboard come from bundled sample data in the browser. A "Demo mode" badge is always shown. Set `VITE_BACKEND` to the Django API URL to use the real backend.

---

## About
Welcome to LeadGreen! A web application with a Django backend and React frontend designed to promote sustainable habits through gamification. Users can post their eco-friendly actions, such as recycling, reducing vehicle travel, and saving electricity, by scanning a QR code. Each post earns points that users can spend to grow their virtual plant by watering, fertilizing, and cleaning it. Help us create a carbon neutral environment.

When you complete a sustainable activity such as picking up litter or using public transport, you scan a QR code at that location and post a photo of what you have done. You will then be awarded points based on what the activity was and your photo will be uploaded to the feed where other users can see your activity.

You can then spend these points growing your plant. Using water, soil, etc. As your plant grows it will level up unlocking new appearances.  

---
The group members are:

1. Benitas
2. Henry
3. Jed
4. Ralph
5. Suraj
6. Thomas
7. Taha

---
## GETTING STARTED:

### 1. Ensure you have the following installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js (v18+)](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
---

### 2. **Clone the Repository**

```bash
git clone https://github.com/username/LeadGreen.git
cd LeadGreen
```

---

## Backend Setup

### 1. Go To The backend Directory

```bash
cd backend/
```

### 2. **Create a Virtual Environment**

#### Windows
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

#### macOS/Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Make Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Admin):

```bash
python manage.py createsuperuser
# Enter username and password when prompted
```

### 6. Run The Django Server:

```bash
python manage.py runserver
# The backend will be live at http://localhost:8000
```

---

## Frontend Setup

### 1. Go To The Frontend Directory

```bash
cd frontend
```

### 2. Install Node Dependencies

```bash
npm i
```

### 3. Run The App

```bash
npx vite
# The frontend will be live at http://localhost:5173/
```

---

## Running Tests

### Backend Tests

```bash
cd backend
python manage.py test
```

---

## Testing Basic Functionalities

### 1. Registration
![Alt Text](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2k0bmxvbDJ4bzZ3b3VmenlleGNkbHU3MXowdGw1OXB1MHl6anM0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4ya9mwfYOu37J9Bulg/giphy.gif)

### 2. Demo-Gameplay

#### Earn Points !
![Alt Text](https://media.giphy.com/media/sIYMASXNhFuP5ycBo2/giphy.gif)

#### Purchase Utilities !
![Alt Text](https://media.giphy.com/media/jEo6uvTS3ScyYXCsH9/giphy.gif)

#### Play Game !
![Alt Text](https://media.giphy.com/media/mYB4QNUUqlqkohrjVy/giphy.gif)

### 3. User Profile
![image](https://private-user-images.githubusercontent.com/160735849/426284455-d9856bb2-6ce4-4c01-9035-f684705cda41.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDI4NTcyMjIsIm5iZiI6MTc0Mjg1NjkyMiwicGF0aCI6Ii8xNjA3MzU4NDkvNDI2Mjg0NDU1LWQ5ODU2YmIyLTZjZTQtNGMwMS05MDM1LWY2ODQ3MDVjZGE0MS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMzI0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDMyNFQyMjU1MjJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hNzQ1NmQ5YjU5ZWM2MTM5OTRiMGZkYTY4YmU2ZDFjZDA1NTFkMjg0NzgxMGRiZjk2ZmNjYTNmMzUwMWZiNzU2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.b0YDWH2q9DYaUzyvNBnqMb75GbANEo4euunee1D2a9A)

### 3. Leaderboard
![Alt Text](https://media.giphy.com/media/6ESJHByMEeR7mulQwf/giphy.gif)

### 4. Feed
![Alt Text](https://media.giphy.com/media/6gcww76abRAG36Jb78/giphy.gif)

### 5. Reviewing Posts
Log into the admin panel using the superuser credentials created earlier. Then a list of posts will appear (example below) and a drop down menu will allow the Game Keepers to reject or approve these posts.
![image](https://github.com/user-attachments/assets/19672920-95f9-465c-8bff-d44aa7dce114)

---

## API Endpoints (For Testing)

### 1. Register

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
-H "Content-Type: application/json" \
-d '{"username":"newuser","email":"newuser@example.com","password":"password123"}'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
-H "Content-Type: application/json" \
-d '{"username":"newuser","password":"password123"}'
```

---

# Deployment
- [Deployed App Example](https://lead-green-tawny.vercel.app/)
- [Backend Guide](docs/deployment-backend.md)
- [Frontend Guide](docs/deployment-frontend.md)

---

## Project Structure
```
LeadGreen/
├── backend/                      # Django backend
│   ├── .env                      # Environment variables
│   ├── .gitignore                # Git ignore file
│   ├── .venv/                    # Python virtual environment
│   ├── README.md                 # Backend documentation
│   ├── authentication/           # Authentication app
│   ├── backend/                  # Main Django project settings
│   ├── db.sqlite3                # SQLite database (development), use PostgreSQL for deployment
│   ├── game/                     # Game app
│   ├── leaderboard/              # Leaderboard app
│   ├── manage.py                 # Django management script
│   ├── media/                    # Media files
│   ├── posts/                    # Posts app
│   ├── qrcodes/                  # QR codes app
│   ├── requirements.txt          # Python dependencies
│   └── users/                    # Users app
│
├── frontend/                     # React/Vite frontend
    ├── .env                      # Environment variables
    ├── .gitignore                # Git ignore file
    ├── README.md                 # Frontend documentation
    ├── eslint.config.js          # ESLint configuration
    ├── index.html                # Entry HTML file
    ├── node_modules/             # Node.js dependencies
    ├── package-lock.json         # Locked dependencies
    ├── package.json              # Project metadata and scripts
    ├── public/                   # Public assets
    ├── src/                      # Source code
    ├── tailwind.config.js        # Tailwind CSS configuration
    └── vite.config.js            # Vite configuration
```
---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
