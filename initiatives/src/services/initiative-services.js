const { error } = require("winston");
const axios = require('axios');
const IntitiativeRepository = require("../repositories/initiative-repository");
const LocationRespository = require("../repositories/location-repository");
const EventRepository = require("../repositories/schedules-repository");
const wrapWithTransaction = require("../utils/transaction");

class IntitiativeService {
    constructor(){
        this.IntitiativeRepository = new IntitiativeRepository();
        this.LocationRespository = new LocationRespository();    
        this.EventRepository = new EventRepository();   
    }

    async createInitiative(initiative_data,location_data,schedules_data){
        return await wrapWithTransaction( async(transaction) => {
            const newLocation = await this.LocationRespository.createLocationRow(location_data,transaction);
            const data = {...initiative_data,
                location_id : newLocation.location_id,
                no_of_memebers : 0,
                schedule_type : initiative_data.recurring_end_date ? 'recurring' : 'one_time'
            }
            const initiative = await this.IntitiativeRepository.createIntitiative(data,transaction);
            if(schedules_data){
                const newArr = schedules_data.reduce((res,cur) => {
                    res.push({...cur,initiative_id : initiative.initiative_id});
                    return res;
                },[]);
                await this.EventRepository.bulkCreateEvents(newArr,transaction);
            }
                
            return initiative;
        })
    }

    async getAllInitiatives(){
        return await wrapWithTransaction( async(transaction) => {
            const initiatives = await this.IntitiativeRepository.findAllIntitiatives(transaction);
            return initiatives;
        })
    }


    async getAllTheInitiativesByLocation(location_town){
        // return await wrapWithTransaction( async(transaction) => {
            const locationIds = await this.LocationRespository.getLocationDetailsFromTown(location_town);
            const initiatives = await this.IntitiativeRepository.findInitiativesByLocationIds(locationIds);
            return initiatives;
        // })
    }

    async getAllInitiativesOrganizedByUser(user_id){
        const initiatives = await this.IntitiativeRepository.findAllIntitiativesOfUser(user_id);
        return initiatives;
    }

    // get a specific Initiative data by id
    async getInitiativeDataById(initiative_id){
        // return await wrapWithTransaction( async(transaction) => {
            const initiative = await this.IntitiativeRepository.findIntitiativeById(initiative_id);
            const initiativeMembers = await this.IntitiativeRepository.findAllInitiativeMembers(initiative_id);
            const locationData = await this.LocationRespository.getLocationRow(initiative.location_id)
            const user_ids = initiativeMembers.reduce((result,user_data)=> {
                result.push(user_data.user_id);
                return result;
            } ,[]);
            let response;
            let initiativeData ={
                ...initiative,
                location : locationData, 
            };
            try{
                response = await axios.post('http://localhost:3001/users/data',{
                    user_ids : user_ids,
                    organizer_id : initiative.organizer_id
                }); 
                if(response.status !== 200){
                    return "Error fetching data of users";
                }
                const usersData = response.data;
        
                delete initiative.organizer_id;
                delete initiative.location_id;

                initiativeData ={
                    members : usersData.data.users, 
                    organizer : usersData.data.organizer
                };
            }catch(e){
                return "Error fetching data of users";
            }
            
            return initiativeData;
        // })
    }

    async joinInitiative(initiative_id,user_id){
        const intiative = await this.IntitiativeRepository.findIntitiativeById(initiative_id);
        
        if(intiative.no_of_memebers + 1 > intiative.max_people){
            throw new error("maximum number reached");
        }
        const updateIntiative = await this.IntitiativeRepository.updateIntitiativeMemberCount(initiative_id);
        const newMember = await this.IntitiativeRepository.createInitiativeMember(initiative_id,user_id);

        // mail or notification should be sent to the organizer and the user that joined the initiative 

        return newMember;
    }

    async leaveInitiative(user_id,initiative_id){
        const deletedInitiative = await this.IntitiativeRepository.leaveInitiative(user_id,initiative_id);
        
        // mail or notification should be sent to the organizer and the user that joined the initiative 

        return deletedInitiative;
    }

    async deleteInitiative(initiative_id,user_id){
        const initiative = await this.IntitiativeRepository.findIntitiativeById(initiative_id);

        if(!initiative)
            throw new error("initiative not found");

        if(initiative.organizer_id !==  user_id){
            throw new error("access not given");
        }
        const deletedInitiative = await this.IntitiativeRepository.deleteIntitiative(initiative_id);
        return initiative;
    }


}

module.exports =  IntitiativeService