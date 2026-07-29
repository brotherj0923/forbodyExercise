# forbodyExercise

Forbody 팀 프로젝트에서 운동(Exercise) 기능 성능 측정과 개선 전후 비교를 하기 위한 개인 레포지토리 복사본입니다.

## Structure

- `wannabe_front`: React frontend
- `wannabe_back`: Express, Sequelize, MySQL backend

## Local Run

### Backend

```bash
cd wannabe_back
npm install
cp .env.example .env
npm start
```

MySQL database name is `wannabe`. The original SQL dump is intentionally not committed because it can contain local/test user data.

### Frontend

```bash
cd wannabe_front
npm install
cp .env.example .env
npm start
```

## Frontend Deployment

The frontend is configured for GitHub Pages through `.github/workflows/deploy-frontend.yml`.

Deployment URL:

```text
https://brotherj0923.github.io/forbodyExercise/
```

The deployed frontend currently points API calls to `http://localhost:8000/v1`, so authenticated Exercise functionality still requires running the backend locally or deploying the backend separately.
