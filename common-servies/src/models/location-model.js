
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB');
const Initiative = require('./initiative-model');



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const Location = sequelize.define("Location", {
    // primary key
    location_id:{
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    lattiude : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false 
    },
    initiative_id : {
        type:Sequelize.DataTypes.INTEGER,
        allowNull : false
    },
    longitude : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false 
    },
    location_town : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false 
    },
    Created_at : {
        type:Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue : Date.now()
    }, 
})

module.exports = Location;