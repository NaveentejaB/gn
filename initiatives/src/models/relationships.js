
const Location = require("../models/location-model");
const EventSchedule = require("./event-schedule-model");
const InitiativeMember = require("./initiative-member-model");
const Initiative = require("./initiative-model");
const InitiativeType = require("./initiative-type-model");

const initializeRelations = () => {
    // schedules - initiatives relationship
    Initiative.hasMany(EventSchedule,{
        foreignKey : 'initiative_id',
        as : 'schedules',
        // onDelete : 'CASCADE'
    });
    EventSchedule.belongsTo(Initiative, {
        foreignKey: 'initiative_id',
        as: 'initiative'
    });

    // initiative type - initiatives relationship
    Initiative.belongsTo(InitiativeType, {
        foreignKey: 'initiative_type_id',
        as: 'initiativeType'
    });
    
    InitiativeType.hasMany(Initiative, {
        foreignKey: 'initiative_type_id'
    });

    // location - initiatives relationship
    Location.hasOne(Initiative, {
        foreignKey: 'location_id',
        as: 'initiative',
        hooks:true
    });

    Initiative.belongsTo(Location, {
        foreignKey: 'location_id',
        as: 'location'
    });

    // initiative - members relationship
    Initiative.hasMany(InitiativeMember,{
        foreignKey : 'initiative_id',
        as : 'members'
    });
    InitiativeMember.belongsTo(Initiative, {
        foreignKey: 'initiative_id',
        as: 'initiative'
    });


    // Then, before deleting an Initiative, you would need to delete its Location, EventSchedules, InitiativeMembers.
    Initiative.addHook('beforeDestroy', async (initiative, options) => {
        console.log('Before destroy hook triggered');
        try {
            if (initiative) {
                await Location.destroy({
                    where: {
                        location_id: initiative.location_id
                    },
                    transaction: options.transaction
                });
                await EventSchedule.destroy({
                    where: {
                        initiative_id: initiative.initiative_id
                    },
                    transaction: options.transaction
                });
                await InitiativeMember.destroy({
                    where: {
                        initiative_id: initiative.initiative_id
                    },
                    transaction: options.transaction
                });
                console.log('Other data deleted successfully');
            }
        } catch (error) {
            console.error('Error in beforeDestroy hook:', error);
            throw error;
        }
    });
    
}

module.exports = initializeRelations