
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const InitiativeMember = sequelize.define("InitiativeMember", {
    // primary key
    initiative_member_id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    initiative_id:{
        type:Sequelize.DataTypes.UUID,
        allowNull : false
    },
    user_id:{
        type:Sequelize.DataTypes.UUID,
        allowNull: false
    }
},{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = InitiativeMember;