# AgroPredict
Machine Learning-Based Crop Recommendation and Agricultural Yield Prediction System.

## Run backend
1. Install Java 17+ and Maven.
2. Open terminal in `backend`.
3. Run `mvn spring-boot:run`.
4. Backend runs at http://localhost:8080

## Run frontend
Open `frontend/index.html` using VS Code Live Server (or another static server).

## Notes
The crop recommendation and yield prediction endpoints currently contain demo Java prediction logic. Replace those methods with a trained ML model when the ML component is ready.
The project uses H2 file database by default so it runs without separate database installation.
