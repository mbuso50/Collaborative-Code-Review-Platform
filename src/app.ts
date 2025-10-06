import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool, testConnection } from "./config/database";


import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

let isDatabaseConnected = false;


testConnection().then(connected => {
  isDatabaseConnected = connected;
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/health", async (req, res) => {
  try {
    if (isDatabaseConnected) {
      await pool.query("SELECT 1");
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        database: "connected",
        message: "API is running normally"
      });
    } else {
      res.status(200).json({
        status: "WARNING",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        message: "API is running but database is not connected"
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      database: "error",
      message: "Database connection error"
    });
  }
});

app.get("/api/demo", (req, res) => {
  res.json({
    message: "Collaborative Code Review Platform API is working! 🚀",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    sprint: "Sprint 2 - Authentication & Users",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login"
      },
      users: {
        list: "GET /api/users",
        profile: "GET /api/users/:id",
        update: "PUT /api/users/:id"
      }
    }
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.originalUrl} does not exist`
  });
});

app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` Demo endpoint: http://localhost:${PORT}/api/demo`);
  console.log(`\n Sprint 2 - Authentication & Users Endpoints:`);
  console.log(`POST /api/auth/register - User registration`);
  console.log(`POST /api/auth/login - User login`);
  console.log(`GET /api/users - List all users (authenticated)`);
  console.log(`GET /api/users/:id - Get user profile (authenticated)`);
  console.log(`PUT /api/users/:id - Update user profile (authenticated)`);

  if (!isDatabaseConnected) {
    console.log('\n  DATABASE SETUP REQUIRED:');
    console.log('Run: npm run db:setup');
  } else {
    console.log('\nDatabase is connected and ready!');
  }
});