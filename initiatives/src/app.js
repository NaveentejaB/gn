const express = require("express");
const {connectDB,disconnectDB,sequelize} = require("../src/config/DB");
const winston = require('winston');
const initiativeRoutes = require("./routes/initiative-routes")
const redisQueue = require("./utils/redisQueue");
const initializeRelations = require("./models/relationships")
const cors = require('cors');
require('express-async-errors');
const BASE_PORT = 3004;

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
//     // new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     // new winston.transports.File({ filename: 'combined.log' })
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
      initializeRelations();
      this.app.get("/test", (req, res) => {
        res.send("Hello, This is Initiative service!");
      });

      console.info('App initialized successfully');
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
      return res.status(err.status || 500).json({
          message : err.message || `Internal server error!`,
          success : false,
          status: 'error'
      })
    });
  }

  setRoutes() {
    this.app.use('/',initiativeRoutes);
  }

  async start() {
      try {
        this.server = this.app.listen(BASE_PORT, () => {
          console.info(`Server successfully started on port ${BASE_PORT}`);
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
          console.info('Server stopped');
          process.exit(0);
        });
      } else {
        console.info('Server was not running');
        process.exit(0);
      }
    } catch (error) {
      console.error('Error during server shutdown:', error);
      process.exit(1);
    }
  }
}

process.on('SIGINT', () => {
  console.info('Received SIGINT. Shutting down gracefully.');
  new App().stop();
});

process.on('SIGTERM', () => {
  console.info('Received SIGTERM. Shutting down gracefully.');
  new App().stop();
});

module.exports = App;
