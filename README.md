SMART CARBON FOOTPRINT TRACKER — FULL PROJECT SUMMARY
========================================================

ORIGINAL PROJECT SCOPE:
- Authentication (Register/Login/Logout)
- Activity Tracking (Transport, Electricity, Plastic)
- Carbon Calculation (automatic calculations)
- Dashboard (charts, summaries)
- REST APIs (Laravel backend)
- Database Integration (MySQL)
- Deployment (Docker + Cloud)
- Machine Learning (emission prediction)
- Recommendation Engine
- Leaderboard / Eco Score / Gamification
- Small AI Chatbot

STATUS: ALL 11 SCOPE ITEMS FULLY IMPLEMENTED AND DEPLOYED LIVE.

========================================================
ARCHITECTURE (3-tier, decoupled)
========================================================

1. FRONTEND — React (carbon-tracker-frontend/)
   - React Router for navigation (Login, Register, Dashboard, Log Activity,
     Chatbot, Leaderboard pages)
   - Axios API client (src/api.js) with auto-attached Bearer token
   - Recharts for pie/bar charts (donut breakdown by category,
     daily accumulation bar chart)
   - Custom dark theme (src/styles/theme.css) matching the original
     Streamlit app's visual style: dark background, sidebar nav with
     active-dot indicators, emoji-prefixed headers, colored status tags,
     tabbed activity forms, stepper number inputs, full-page chatbot
   - Responsive design added via CSS media queries (sidebar collapses
     to a horizontal bar on tablet/mobile, charts use ResponsiveContainer,
     grid/table layouts adapt to small screens)
   - Deployed on Railway, served via a two-stage Docker build
     (npm build -> static "serve")

2. BACKEND — Laravel (carbon-tracker-backend/)
   - Laravel Sanctum token-based authentication (register/login/logout,
     protected routes via auth:sanctum middleware)
   - Eloquent models: User (+ eco_score column), Activity, Badge
   - Services (app/Services/):
     - CarbonCalculator.php — exact emission-factor formulas ported from
       the original Streamlit app (EDC electricity rate, Cambodia grid
       factor, per-mode/fuel transport factors, plastic lifecycle factor)
     - RecommendationEngine.php — rule-based tips keyed to whichever
       category (electricity/transport/plastic) has the highest emissions,
       plus footprint-level classification (Low/Moderate/High)
     - BadgeChecker.php — awards badges on eco-score milestones and
       3-day logging streaks
     - ChatbotService.php — rule-based keyword-matching chatbot (no paid
       API, fully offline/free as requested)
   - Controllers (app/Http/Controllers/Api/):
     - AuthController — register, login, logout
     - ActivityController — index, store (calculates CO2 + awards points
       + checks badges), destroy, predictToday (calls ML service)
     - RecommendationController — aggregates user's activity totals,
       returns tips + footprint level
     - LeaderboardController — top 20 users by eco_score + current user's
       rank
     - ChatbotController — chat endpoint using ChatbotService
     - StatsController — breakdown by category, averages vs. reference
       dataset (primary_data_CO2.csv)
   - Full REST API under /api/... (register, login, logout, user,
     activities CRUD, recommendations, predict-today, leaderboard,
     badges, chatbot, stats/breakdown, stats/averages)
   - Deployed on Railway via Docker, auto-runs migrations on container
     startup (php artisan migrate --force && php artisan serve)

3. ML SERVICE — Python/FastAPI (ml-service/)
   - Reuses the ORIGINAL trained model files from the Streamlit repo:
     carbon_predictor_model.pkl, carbon_scaler.pkl, carbon_calibrator.pkl
   - Two-stage prediction pipeline preserved exactly: raw IoT-trained
     LinearRegression model -> calibrator model rescales to match real
     Cambodian survey data
   - /predict endpoint takes energy_usage_kwh_day, transportation_distance_km,
     plastic_usage_kg -> returns calibrated CO2 prediction
   - Defensive fallback: if the ML service fails/unreachable, Laravel
     falls back to summing already-calculated carbon_emitted values
   - Deployed on Railway via its own Docker container

4. DATABASE — MySQL
   - Tables: users (+ eco_score), activities (type, electricity_bill_riel,
     transport_mode/fuel/distance, plastic_items, carbon_emitted,
     activity_date), badges, personal_access_tokens (Sanctum), plus
     Laravel defaults (cache, jobs, sessions, migrations)
   - Local dev: MySQL via MySQL Workbench
   - Production: Railway-hosted MySQL, connected via internal Railway
     networking (mysql.railway.internal)

========================================================
DEPLOYMENT
========================================================
- All 3 services + MySQL fully Dockerized (individual Dockerfiles +
  a docker-compose.yml for local multi-container development)
- Deployed live on Railway (4 services: frontend, backend, ml-service,
  MySQL), each with its own public domain and environment variables
- Solved along the way: PHP/Python Docker base image version mismatches,
  Railway's dynamic $PORT binding, CORS origin configuration, APP_KEY
  format, and running migrations inside Railway's private network
  (since local machine can't resolve Railway's internal DB hostname)
- Live app fully functional end-to-end: register/login, log activities,
  view dashboard, get ML predictions, see recommendations, check
  leaderboard, use chatbot — all confirmed working in production

========================================================
DESIGN
========================================================
- Redesigned from generic default styling to match the exact visual
  identity of the original Streamlit prototype (based on real screenshots
  provided): dark theme, sidebar navigation with radio-dot active states,
  green "logged in as" tag, colored metric pill tags, donut + bar chart
  dashboard layout, tabbed activity logging with stepper inputs,
  full-page chatbot, leaderboard with recommendation banner
- Fully responsive across desktop, tablet, and mobile via CSS media
  queries — verified in Chrome DevTools device emulation on the live
  deployed site

========================================================
SCOPE COVERAGE CHECK
========================================================
[x] Authentication (Register/Login/Logout)         -> Laravel Sanctum
[x] Activity Tracking (Transport/Electricity/Plastic) -> Activity model + API
[x] Carbon Calculation (automatic)                  -> CarbonCalculator.php
[x] Dashboard (charts, summaries)                    -> React + Recharts
[x] REST APIs (Laravel)                              -> full /api routes
[x] Database Integration (MySQL)                     -> Eloquent + Railway MySQL
[x] Deployment (Docker + Cloud)                       -> Railway, 4 containers
[x] Machine Learning (emission prediction)            -> FastAPI + calibrated model
[x] Recommendation Engine                             -> RecommendationEngine.php
[x] Leaderboard / Eco Score / Gamification            -> LeaderboardController + Badges
[x] Small AI Chatbot                                  -> rule-based ChatbotService

ALL SCOPE ITEMS: COMPLETE.

========================================================
Link
========================================================
https://appealing-analysis-production-3974.up.railway.app/