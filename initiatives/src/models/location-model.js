
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB');
const Initiative = require('./initiative-model');



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const Location = sequelize.define("Location", {
    // primary key
    location_id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    lattiude : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false 
    },
    longitude : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false 
    },
    location_town : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false 
    }
},{
    timestamps: true,
    createdAt: 'created_at',
})

module.exports = Location;