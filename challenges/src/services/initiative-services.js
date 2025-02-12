const { error } = require("winston");
const axios = require('axios')
const IntitiativeRepository = require("../repositories/initiative-repository")
const LocationRespository = require("../repositories/location-repository")

class IntitiativeService {
    constructor(){
        this.IntitiativeRepository = new IntitiativeRepository()
        this.LocationRespository = new LocationRespository()       
    }

    async createInitiative(intitiative_data,location_data){
        console.log(location_data);
        const newLocation = await this.LocationRespository.createLocationRow(location_data);
        intitiative_data.location_id = newLocation.location_id;
        const initiative = await this.IntitiativeRepository.createIntitiative(intitiative_data);
        const updateLocationRow = await this.LocationRespository.updateLocationRow(
            { initiative_id : initiative.initiative_id },newLocation.location_id
        )
        return initiative;
    }

    async getAllInitiatives(){
        const initiatives = await this.IntitiativeRepository.findAllIntitiatives();
        return initiatives;
    }

    async getAllInitiativesOfUser(user_id){
        const initiatives = await this.IntitiativeRepository.findAllIntitiativesOfUser(user_id);
        return initiatives;
    }

    async getInitiativeById(initiative_id){
        const initiative = await this.IntitiativeRepository.findIntitiativeById(initiative_id);
        const initiativeMembers = await this.IntitiativeRepository.findAllInitiativeMembers(initiative_id);
        // here we have a request to user service to get all the details of the users.
        initiative.members = initiativeMembers;
        return initiative;
    }

    async joinInitiative(initiative_id,user_id){
        const intiative = await this.IntitiativeRepository.findIntitiativeById(initiative_id);
        if(intiative.no_of_memebers + 1 > intiative.max_people){
            throw new error("maximum number reached");
        }
        const updateIntiative = await this.IntitiativeRepository.updateIntitiativeMemberCount(initiative_id);
        const memberData = {
            initiative_id : initiative_id,
            user_id : user_id
        }
        const newMember = await this.IntitiativeRepository.createInitiativeMember(memberData);
        return newMember;
    }

    async leaveInitiative(user_id,initiative_id){
        const deletedInitiative = await this.IntitiativeRepository.leaveInitiative(user_id,initiative_id);
        return deletedInitiative;
    }

    async deleteInitiative(initiative_id,user_id){
        const initiative = await this.IntitiativeRepository.findIntitiativeById(initiative_id)
        if(initiative.organizer_id !==  user_id){
            throw new error("access not given");
        }
        const deletedInitiative = await this.IntitiativeRepository.deleteIntitiative(initiative.location_id);
        return deletedInitiative;
    }


}

module.exports =  IntitiativeService