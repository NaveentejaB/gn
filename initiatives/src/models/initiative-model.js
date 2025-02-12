
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const Initiative = sequelize.define("Initiative", {
    // primary key
    initiative_id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    organizer_id:{
        type:Sequelize.DataTypes.UUID,
        allowNull: false
    },
    initiative_name : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
        unique : true
    },
    max_people:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    no_of_memebers:{
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    location_id:{
        type:Sequelize.DataTypes.UUID,
        allowNull: false,
    },
    initiative_type_id:{
        type:Sequelize.DataTypes.UUID,
        allowNull: false,
    },
    event_start_date:{
        type:Sequelize.DataTypes.DATEONLY,
        allowNull: false,
    },
    schedule_type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'one_time',
        validate: {
            isIn: [['one_time', 'recurring']]
        }
    },
    recurring_end_date : {
        type : Sequelize.DataTypes.DATE,
        allowNull : true // only for recurring events
    }
},{
     timestamps: true,

     createdAt: 'created_at',
     updatedAt: 'updated_at'
})

module.exports = Initiative;