const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const User = sequelize.define("User", {
    // primary key
    user_id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    user_name:{
        type:Sequelize.DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    user_phone:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    user_email:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    user_password:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    user_location:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    user_age:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull:false
    },
    user_image:{
        type:Sequelize.DataTypes.STRING,
        allowNull : true
    }
})

module.exports = User;