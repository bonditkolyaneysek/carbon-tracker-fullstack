# 🌱 Smart Carbon Footprint Tracker

A full-stack web application that helps users log, calculate, predict, and
reduce their personal carbon footprint — built as a final project using a
decoupled 3-tier architecture with a REST API backend, a React frontend,
and a dedicated machine learning microservice.

**Live app:** https://appealing-analysis-production-3974.up.railway.app

---

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Running with Docker](#running-with-docker)
- [Deployment](#deployment)
- [Emission Calculation Methodology](#emission-calculation-methodology)
- [Machine Learning Pipeline](#machine-learning-pipeline)
- [API Reference](#api-reference)

---

## Overview

Individual daily choices such as transportation, electricity use, single-use plastic
consumption add up to a meaningful share of household emissions, but are
rarely translated into something concrete. This app converts everyday
activity logs into real, calculated CO₂ figures using emission factors
grounded in real regional data, and layers on prediction, recommendations,
and gamification to make the impact of small changes visible over time.

The system is built as a fully decoupled production application: a Laravel
REST API, a React single-page frontend, a standalone FastAPI machine
learning microservice, and a MySQL database — containerized with Docker
and deployed live on Railway.

## Architecture

```
┌──────────────────┐        ┌───────────────────────┐
│   REACT FRONTEND  │ HTTPS  │   LARAVEL BACKEND      │
│   (SPA, Router)   │ <────> │   REST API + Sanctum   │
│                    │  JSON  │   Auth, business logic │
└──────────────────┘        └───────────┬───────────┘
                                          │ HTTPS
                              ┌───────────┴───────────┐
                              │                        │
                    ┌─────────▼────────┐   ┌──────────▼─────────┐
                    │   MySQL Database  │   │  FastAPI ML Service │
                    │   (Railway)        │   │  Calibrated model    │
                    └───────────────────┘   └─────────────────────┘
```

Each of the four pieces (frontend, backend, ML service, database) runs as
its own container, deployed as its own Railway service, communicating over
HTTPS with no shared filesystem or process.

## Features

- **Authentication** — register/login/logout via Laravel Sanctum token auth
- **Activity Tracking** — log transport, electricity, and plastic usage
- **Automatic Carbon Calculation** — emission-factor formulas applied server-side on every logged activity
- **Executive Dashboard** - pie chart and bar chart, key metrics, ML-projected next-period emissions
- **Activity History** — full record of past entries with individual and bulk delete (with confirmation)
- **Machine Learning Prediction** — a calibrated Linear Regression pipeline forecasts near-term emissions
- **Recommendation Engine** — rule-based tips targeted at the user's single largest emission category
- **Leaderboard & Gamification** — eco-score points, automatically-awarded badges, community ranking
- **AI Chatbot** — rule-based assistant answering footprint/sustainability questions, no external API cost
- **Model Transparency Page** — documents the dataset, formulas, and prediction pipeline in plain terms
- **Light / Dark Mode** — theme toggle, persisted across sessions
- **Responsive Design** — usable across desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Recharts, lucide-react, Axios |
| Backend | Laravel 12, Laravel Sanctum |
| ML Service | Python, FastAPI, scikit-learn, joblib |
| Database | MySQL |
| Containerization | Docker, Docker Compose |
| Deployment | Railway |

## Project Structure

```
Final project/
├── carbon-tracker-frontend/    React SPA
│   └── src/
│       ├── pages/               Home, Login, Register, Dashboard,
│       │                        ActivityForm, History, Chatbot,
│       │                        Leaderboard, ModelTransparency
│       ├── components/          Layout (sidebar), charts, ConfirmDialog
│       ├── context/              ThemeContext (light/dark mode)
│       └── styles/theme.css      Design tokens, light/dark variables
│
├── carbon-tracker-backend/      Laravel REST API
│   └── app/
│       ├── Http/Controllers/Api/ Auth, Activity, Recommendation,
│       │                         Leaderboard, Chatbot, Stats
│       └── Services/              CarbonCalculator, RecommendationEngine,
│                                   BadgeChecker, ChatbotService
│
├── ml-service/                   FastAPI ML microservice
│   ├── main.py
│   ├── carbon_predictor_model.pkl
│   ├── carbon_calibrator.pkl
│   └── carbon_scaler.pkl
│
└── docker-compose.yml            Local multi-container orchestration
```

## Local Setup

### Prerequisites
- PHP 8.2+, Composer
- Node.js + npm
- Python 3.10+
- MySQL (or use Docker for this)

### 1. Backend
```bash
cd carbon-tracker-backend
composer install
cp .env.example .env
php artisan key:generate
# set DB_* values in .env to match your local MySQL
php artisan migrate
php artisan serve
```
Runs on `http://localhost:8000`.

### 2. ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
Runs on `http://localhost:8001`.

### 3. Frontend
```bash
cd carbon-tracker-frontend
npm install
npm start
```
Runs on `http://localhost:3000`. Update `src/api.js`'s `baseURL` to point at your local backend if needed.

## Running with Docker

From the project root:
```bash
docker-compose up --build
```
Brings up all four services (frontend, backend, ml-service, MySQL) together. Then, in a separate terminal:
```bash
docker-compose exec backend php artisan migrate
```

## Deployment

Deployed on [Railway](https://railway.app), with each service (frontend,
backend, ml-service, MySQL) as its own Railway service within one project.
Key deployment notes:
- Each service binds to Railway's dynamically-assigned `$PORT` at runtime
- The backend runs `php artisan migrate --force` automatically on container
  startup, since Railway's private database hostname is only reachable from
  inside its own network
- CORS on the backend is scoped to the deployed frontend's exact origin

## Emission Calculation Methodology

| Category | Formula |
|---|---|
| Electricity | (Monthly Bill in Riel ÷ 610 Riel/kWh) ÷ 30 days × 0.18708 kg CO₂/kWh |
| Transport | Distance (km) × mode/fuel-specific factor (e.g. Petrol Car: 0.308 kg CO₂/km, Bicycle: 0 kg CO₂/km) |
| Plastic | Item count × 0.141 kg/item × 6.0 kg CO₂/kg lifecycle factor |

Constants are regionally calibrated (local electricity tariff, national
grid emission factor) to reflect realistic day-to-day usage.

## Machine Learning Pipeline

The prediction service runs a two-stage model:
1. A **Linear Regression** model, trained on energy/transport/plastic usage data, produces a raw emissions estimate.
2. A **calibrator model** rescales that raw estimate against a real household survey dataset, correcting for the gap between the training data's source and real local usage patterns.

If the ML service is unreachable or returns an error, the backend
automatically falls back to summing the user's already-calculated,
formula-based emissions — so a result is always returned.

## API Reference

All endpoints are under `/api`. Protected routes require a Bearer token
from `/login` or `/register`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create an account |
| POST | `/login` | Authenticate, receive token |
| POST | `/logout` | Revoke current token |
| GET | `/user` | Current authenticated user |
| GET | `/activities` | List user's activities |
| POST | `/activities` | Log a new activity (calculates CO₂, awards points/badges) |
| DELETE | `/activities/{id}` | Delete a single activity |
| GET | `/predict-today` | ML-based emissions prediction |
| GET | `/recommendations` | Personalized reduction tips |
| GET | `/leaderboard` | Top users by eco score |
| GET | `/badges` | Current user's earned badges |
| POST | `/chatbot` | Send a message to the chatbot |
| GET | `/stats/breakdown` | User's emissions by category |
| GET | `/stats/averages` | Reference dataset averages |