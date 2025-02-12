const express = require("express");
const {connectDB,disconnectDB,sequelize} = require("../src/config/DB")
const winston = require('winston');
const BASE_PORT = 3002
const ConsumersSetup = require('../src/workers/index')

// Configure Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${message}${stack ? '\n' + stack : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
  ]
});

class App {
  constructor() {
    this.app = express();
    // this.ConsumersSetup = new ConsumersSetup();
  }
  async startConsumers(){
    const consumerSetup = new ConsumersSetup();
    await consumerSetup.startMessageBrokers();
  }

  async initialize(){
    try{
      await connectDB();
      await sequelize.sync();
      this.setMiddlewares();
      this.setRoutes();
      this.startConsumers();
      // await this.ConsumersSetup.startMessageBrokers();

      this.app.get("/test", (req, res) => {
        res.send("Hello, this is notification service");
      });
      logger.info('App initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize app:', error);
      process.exit(1);
    }
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    // this.app.use('/',userRoutes);
  }

  async start() {
    try {
      this.server = this.app.listen(BASE_PORT, () => {
        logger.info(`Server successfully started on port ${BASE_PORT}`);
      });
    } catch (error) {
      logger.warn(`Failed to start on port ${BASE_PORT}:`, error);
    }
  }

  async stop() {
    try {
      await disconnectDB();
      if (this.server) {
        this.server.close(() => {
          logger.info('Server stopped');
          process.exit(0);
        });
      } else {
        logger.info('Server was not running');
        process.exit(0);
      }
    } catch (error) {
      logger.error('Error during server shutdown:', error);
      process.exit(1);
    }
  }
}

process.on('SIGINT', () => {
  logger.info('Received SIGINT. Shutting down gracefully.');
  new App().stop();
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Shutting down gracefully.');
  new App().stop();
});

module.exports = App;
