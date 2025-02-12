
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB');
const Initiative = require('./initiative-model');



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const UserChallenge = sequelize.define("UserChallenge", {
    // primary key
    user_challenge_id : {
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.DataTypes.UUIDV4,
        primaryKey : true
    },
    user_id : {
        type : Sequelize.DataTypes.UUID,
        allowNull : false
    },
    challenge_id : {
        type : Sequelize.DataTypes.UUID,
        allowNull : false
    },
    status : {
        type:Sequelize.DataTypes.ENUM("completed","abandoned","taken"),
        allowNull: false 
    },
    completed_tasks : {
        type:Sequelize.DataTypes.INTEGER,
        allowNull : false
    },
    started_at : {
        type:Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue : Date.now()
    },
    abandoned_at : {
        type:Sequelize.DataTypes.DATE,
        allowNull: true 
    },
    completed_at : {
        type:Sequelize.DataTypes.DATE,
        allowNull: true 
    }
},{
    tableName :'UserChallenges',
    timestamps : false,
    underscored : true,
    indexes : [
        {
            // unique : true,
            fields : ["user_id","challenge_id","status"]
        }
    ]
})

module.exports = UserChallenge;