
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const InitiativeType = sequelize.define("InitiativeType", {
    // primary key
    initiative_type_id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    initiative_type : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    }

},{
     timestamps: true,

     createdAt: 'created_at',
     updatedAt: 'updated_at'
})

module.exports = InitiativeType;