
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const Challenge = sequelize.define("Challenge", {
    // primary key
    challenge_id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.DataTypes.UUIDV4,
        primaryKey : true
    },
    title:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    },
    description:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    },
    // copper, silver, gold
    tier:{
        type:Sequelize.DataTypes.STRING,
        allowNull : false
    },
    required_tasks:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    coins:{
        type:Sequelize.DataTypes.INTEGER,
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
    
},{
    tableName : "Challenge",
    timestamps : false,
    underscored : true,
    // indexes : [
    //     {
    //         // unique : true,
    //         fields : ["user_id","challenge_id","status"]
    //     }
    // ]
})

module.exports = Challenge;