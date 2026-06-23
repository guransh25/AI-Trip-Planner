# ✈️ WanderAI — Full Stack AI Trip Planner

A full-stack travel planning app that uses Claude AI to generate personalized day-by-day itineraries.

## 🛠️ Tech Stack

| Layer      | Technology                  | Why                          |
|------------|----------------------------|-------------------------------|
| Frontend   | React + Vite + Tailwind CSS | Fast, modern, industry standard |
| Backend    | Node.js + Express           | JavaScript everywhere, simple REST API |
| Database   | PostgreSQL + Prisma ORM     | Relational DB, Prisma avoids raw SQL |
| Auth       | JWT (JSON Web Tokens)       | Stateless, scalable authentication |
| AI         | Anthropic Claude API        | Generates itinerary text     |
| Hosting    | Vercel (FE) + Railway (BE+DB) | Free tiers, easy deployment  |

---

## 📁 Project Structure

```
trip-planner/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        ← Database schema (tables)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js ← Register/Login logic
│   │   │   └── tripController.js ← AI generation + CRUD
│   │   ├── middleware/
│   │   │   └── authMiddleware.js ← JWT verification
│   │   ├── routes/
│   │   │   ├── authRoutes.js    ← /api/auth endpoints
│   │   │   └── tripRoutes.js    ← /api/trips endpoints
│   │   └── index.js             ← Server entry point
│   └── .env.example
└── frontend/
    └── src/
        ├── api/axios.js         ← Axios with JWT interceptor
        ├── context/AuthContext  ← Global auth state
        ├── components/          ← Reusable UI components
        └── pages/               ← Route-level pages
```

---

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Backend Environment Variables

```bash
cp .env.example .env
# Fill in: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
```

### 3. Set Up Database (Railway)

1. Go to [railway.app](https://railway.app) → New Project → PostgreSQL
2. Copy the `DATABASE_URL` connection string to your `.env`
3. Run migrations:
```bash
cd backend
npx prisma db push
```

### 4. Get Your Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key → paste into `.env` as `ANTHROPIC_API_KEY`

### 5. Run Both Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev     # runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev     # runs on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint               | Auth? | Description              |
|--------|------------------------|-------|--------------------------|
| POST   | /api/auth/register     | No    | Create account           |
| POST   | /api/auth/login        | No    | Login, returns JWT       |
| POST   | /api/trips/generate    | Yes   | Generate AI itinerary    |
| GET    | /api/trips             | Yes   | Get all user's trips     |
| GET    | /api/trips/:id         | Yes   | Get single trip          |
| DELETE | /api/trips/:id         | Yes   | Delete a trip            |

---

## 🚢 Deployment

### Backend → Railway

1. Push code to GitHub
2. Railway → New Project → Deploy from GitHub
3. Select `backend` folder
4. Add environment variables in Railway dashboard
5. Railway gives you a URL like `https://your-app.railway.app`

### Frontend → Vercel

1. Push code to GitHub
2. Vercel → New Project → select `frontend` folder
3. Add env variable: `VITE_API_URL=https://your-app.railway.app/api`
4. Deploy → Vercel gives you a live URL

---

## 💬 Interview Q&A

**Q: Why did you put the AI API call in the backend?**
> To protect the API key. If I called the Claude API from the frontend, my secret key would be visible in browser dev tools. On the backend, it stays private.

**Q: How does JWT authentication work?**
> When a user logs in, the server creates a signed token containing their user ID. On every subsequent request, the client sends this token in the Authorization header. The server verifies it with the secret key before allowing access. No session is stored server-side — the token itself proves identity.

**Q: What is Prisma and why use it instead of raw SQL?**
> Prisma is an ORM (Object-Relational Mapper). I define my schema in schema.prisma and Prisma generates type-safe database queries. Instead of `SELECT * FROM users WHERE id = 1`, I write `prisma.user.findUnique({ where: { id: 1 } })`. It also handles migrations.

**Q: What is CORS and why do you need it?**
> CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks requests from a different origin (domain/port). My frontend runs on port 5173 and backend on 5000 — different origins. I configure the Express CORS middleware to whitelist the frontend URL.

**Q: How do you handle passwords securely?**
> I never store plain text passwords. I use bcrypt to hash them before saving. bcrypt adds a random "salt" so identical passwords produce different hashes — protecting against rainbow table attacks.

**Q: What is the React Context API?**
> Context is a way to share global state without passing props through every component. My AuthContext holds the logged-in user and token, and any component can access it with the `useAuth()` hook.

**Q: What does the axios interceptor do?**
> It automatically attaches the JWT token to every outgoing request. Without it, I'd have to manually add the Authorization header to every API call.

**Q: Why use useEffect to fetch data?**
> useEffect with an empty dependency array `[]` runs after the first render, like componentDidMount in class components. It's the right place to fetch data because you don't want to call an API during rendering.
