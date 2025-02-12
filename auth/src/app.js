const express = require("express");
const { connectDB, disconnectDB, sequelize } = require("../src/config/DB");
const winston = require('winston');
const authRoutes = require('./routes/auth-routes');
const redisQueue = require('./utils/redisQueue');
const cors = require('cors');
require('express-async-errors');
const BASE_PORT = 3003;


// Configure Winston
// const console = winston.createconsole({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(({ level, message, timestamp, stack }) => {
//       return `${timestamp} ${level}: ${message}${stack ? '\n' + stack : ''}`;
//     })
//   ),
//   transports: [
//     new winston.transports.Console(),
//   ]
// });
const corsOptions = {
  origin: '*', // Update with your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable CORS credentials (cookies, authorization headers, etc.)
  allowedHeaders: 'Content-Type,Authorization',
};

class App {
  constructor() {
    this.app = express();

  }

  async initialize() {
    try {
      await connectDB();
      await sequelize.sync();
      await redisQueue.Intialise();
      this.setMiddlewares();
      this.setRoutes();
      this.app.get("/test", (req, res) => {
        res.send("Hello, This is Auth service!");
      });

      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      process.exit(1);
    }
  }



  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors(corsOptions));
    this.app.use((err, req, res, next) => {
      console.log(err)
      return res.status(err.status || 500).json({
          message : `Internal server error!`,
          success : false
      })
    })
  }

  setRoutes() {
    this.app.use('/', authRoutes);
  }

  async start() {
      try {
        this.server = this.app.listen(BASE_PORT, () => {
          console.log(`Server successfully started on port ${BASE_PORT}`);
        });
      } catch (error) {
        console.warn(`Failed to start on port ${BASE_PORT}:`, error);
      }
    
  }

  async stop() {
    try {
      await disconnectDB();
      if (this.server) {
        this.server.close(() => {
          console.log('Server stopped');
          process.exit(0);
        });
      } else {
        console.log('Server was not running');
        process.exit(0);
      }
    } catch (error) {
      console.error('Error during server shutdown:', error);
      process.exit(1);
    }
  }
}

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully.');
  new App().stop();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully.');
  new App().stop();
});

module.exports = App;