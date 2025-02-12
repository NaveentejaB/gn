// database.js
require('dotenv').config()
const { Sequelize } = require('sequelize-cockroachdb');
const winston = require('winston');

let sequelize = new Sequelize(process.env.cockroachDBURL, { logging: false });


async function connectDB() {
  try {
    await sequelize.authenticate();
    winston.info('CockroachDB connected');
  } catch (error) {
    winston.error('CockroachDB connection error:', error);
    throw error; // Propagate error to handle in the main application logic
  }
}

async function disconnectDB() {
  try {
    if (sequelize) {
      await sequelize.close();
      winston.info('CockroachDB disconnected');
    }
  } catch (error) {
    winston.error('CockroachDB disconnection error:', error);
  }
}

module.exports = { connectDB, disconnectDB, sequelize };
