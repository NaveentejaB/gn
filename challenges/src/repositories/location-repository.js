const Location = require('../models/location-model')



class LocationRepository{
    async createLocationRow(location_data){
        const location = await Location.create(location_data);
        return location;
    }
    async getLocationRow(location_id){
        const location = await Location.findByPk(location_id);
        return location;
    }
    async updateLocationRow(location_data,location_id){
        console.log(location_data);
        console.log(location_id)
        let location = await Location.update(location_data,{
            where :{
                location_id
            }
        });
        return location;
    }
    async deleteLocationRow(location_id){
        const location = await Location.findByPk(location_id);
        await location.destroy();
        return location;
    }
}

module.exports = LocationRepository