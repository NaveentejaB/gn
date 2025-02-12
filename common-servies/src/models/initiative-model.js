
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const Initiative = sequelize.define("Initiative", {
    // primary key
    initiative_id:{
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    organizer_id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    max_people:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    no_of_memebers:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    initiative_town:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    // foreign key
    location_id:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    date:{
        type:Sequelize.DataTypes.DATEONLY,
        allowNull: false,
    },
    Created_at : {
        type:Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue : Date.now()
    },
    Updated_at : {
        type:Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue : Date.now()
    }
    
})

module.exports = Initiative;