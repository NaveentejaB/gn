const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB');

if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
}

const EventSchedule = sequelize.define("EventSchedule",{
    schedule_id : {
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    initiative_id : {
        type : Sequelize.DataTypes.UUID,
        allowNull : false
    },
    days_of_week : {
        type : Sequelize.DataTypes.INTEGER,
        allowNull : false,
        validate : {
            min : 0,
            max : 6
        }
    },
    start_time : {
        type : Sequelize.DataTypes.DATE,
        allowNull : false
    },
    end_time : {
        type : Sequelize.DataTypes.DATE,
        allowNull : false
    },
    is_active : {
        type : Sequelize.DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : true
    }
},{
    timestamps: true,

    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = EventSchedule;