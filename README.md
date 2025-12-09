# GATE 2 - Monitoring Dashboard


## Repository Structure

```text
frontend/
├── public/                         # Public assets
├── src/                            # Source code
│   └── components/                 # VUE components
│   └── views/                      # VUE views
└── package.json                    # Dependencies
```

```text
backend/
├── manage.py                       # Django management script
├── gate2/                          # Django project settings
├── accounts/                       # Django app account creation
├── projects/                       # Django app for project management
└── requirements.txt                # Python dependencies
```


## Prerequisites

- Docker and Docker Compose (WSL2 needed for Windows Users)

## Docker Compose

The easiest way to get started is using the given Docker Compose file:

```bash
docker compose up -d
```

### Stopping Services

```bash
# Stop all services
docker compose down
```


# Local development setup Frontend

```bash
cd frontend <- change to frontend directory
npm install
npm run dev
```

# Local development setup Backend

```bash
cd backend <- change to backend directory
python -m venv venv <- create virtual environment to isolate dependencies
venv\Scripts\activate <- activate virtual environment (Windows)
# source venv/bin/activate <- activate virtual environment (Linux/MacOS
pip install -r requirements.txt <- install dependencies

# First time setup only
python manage.py migrate <- apply database migrations to local sqlite database
python manage.py createsuperuser <- create admin user
python manage.py runserver <- start development server
```

Useful Links:
- Frontend: http://localhost:5173 (or http://localhost if using Docker)
- Backend: http://localhost:8000/api/

# How does it work?
The frontend is built using Vue.js and communicates with the backend via RESTful API calls. The backend is built using Django and serves as the main application server, handling data storage, user authentication, and business logic. Docker Compose orchestrates both services, allowing them to run in isolated containers for easy deployment and management.

## I want to develop just the frontend, how do I connect it to a running backend?
1. Start the backend service using Docker Compose 
```bash
docker compose up -d backend
```
2. Follow the local development setup for the frontend above

## I want to develop just the backend, how do I connect it to a running frontend?
1. Start the frontend service using Docker Compose 
```bash
docker compose up -d frontend
```
2. Follow the local development setup for the backend above