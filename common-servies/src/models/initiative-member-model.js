
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const InitiativeMember = sequelize.define("InitiativeMember", {
    // primary key
    initiative_member_id:{
        type:Sequelize.DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    initiative_id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull : false
    },
    user_id:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
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

module.exports = InitiativeMember;