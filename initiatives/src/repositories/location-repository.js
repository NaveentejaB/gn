const Location = require('../models/location-model')



class LocationRepository{
    async createLocationRow(location_data){
        const location = await Location.create(
            location_data
        );
        return location;
    }
    async getLocationRow(location_id){
        const location = await Location.findByPk(
            location_id
        );
        return location;
    }

    async updateLocationRow(location_data,location_id){
        let location = await Location.update(location_data,{
            where :{
                location_id
            }
        });
        return location;
    }
    async deleteLocationRow(location_id){
        const location = await Location.findByPk(
            location_id
        );
        await location.destroy({transaction});
        return location;
    }

    // get location data based on location_town
    async getLocationDetailsFromTown(location_town){
        const locations = await Location.findAll({
            raw : true,
            where : {location_town : location_town},
            attributes :  ['location_id']
        });
        return locations.map((location) => location.location_id);
    }
}

module.exports = LocationRepository