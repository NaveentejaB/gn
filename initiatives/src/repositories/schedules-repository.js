const EventSchedule = require("../models/event-schedule-model")

class EventRepository{
    async bulkCreateEvents(schedules_data,transaction){
        await EventSchedule.bulkCreate(
            schedules_data
        ,{transaction});
        return true;
    }
}
module.exports = EventRepository;