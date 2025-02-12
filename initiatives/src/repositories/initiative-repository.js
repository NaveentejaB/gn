const Initiative = require('../models/initiative-model');
const InitiativeMember = require('../models/initiative-member-model');
const InitiativeType = require("../models/initiative-type-model");
const EventSchedule = require("../models/event-schedule-model")
const { Op,Sequelize } = require('sequelize');


class IntitiativeRepository {

    async createIntitiative(intitiative_data,transaction) {
        let initiativeType = await InitiativeType.findOne({
            where : {initiative_type : intitiative_data.initiative_type}
        },{transaction});
        if(!initiativeType){
            initiativeType = await InitiativeType.create({
                initiative_type : intitiative_data.initiative_type
            },{transaction});
        };
        delete intitiative_data.type;

        intitiative_data.initiative_type_id = initiativeType.initiative_type_id;
        const initative = await Initiative.create(
            intitiative_data
        ,{transaction});
        return initative;
    }

    async checkInitiative(intitiative_data,transaction){
        const initiative = await Initiative.findAll({
            where : {
                [Op.and] : [{
                    organizer_id : intitiative_data.organizer_id
                },{
                    initiative_name : intitiative_data.initiative_name
                }]               
            },
        },{transaction});
        if(initiative.length > 0){
            return true;
        }
        return false;
    }
    
    async deleteIntitiative(initiative_id){
        const deletedIntitiative = await Initiative.findByPk(initiative_id);
        await deletedIntitiative.destroy();
        return deletedIntitiative;
    }
    
    async findIntitiativeById (initiative_id) {
        const initiative = await Initiative.findByPk(initiative_id, {
            include: [{
                model: EventSchedule,
                as: 'schedules',
                attributes: { 
                    exclude: ['created_at', 'updated_at', 'initiative_id'] 
                }
            },{
                model: InitiativeType,
                as: 'initiativeType',
                attributes: { 
                    exclude: ['created_at', 'updated_at','initiative_type_id'] 
                }
            },{
                model : Location,
                as : 'location',
                attributes : {
                    exclude : ['created_at','updated_at','location_id']
                }
            }],
            attributes: {
                exclude: ['created_at', 'updated_at','initiative_type_id']
            }
        });
    
        // Convert to plain object while preserving arrays
        const plainInitiative = initiative.get({ plain: true });
        
        return plainInitiative;
    }

    async updateIntitiativeMemberCount (initiative_id) {
        const intitiative = await Initiative.findByPk(initiative_id);
        intitiative.no_of_memebers += 1;
        await intitiative.save();
        return intitiative;
    }

    async findAllIntitiatives(transaction) {
        const intitiatives = await Initiative.findAll({
            include :[{
                model : InitiativeType,
                as : 'initiativeTypes'
            }]
        });
        return intitiatives;
    }

    //All initiaves with given location ids
    async findInitiativesByLocationIds(location_ids){
        const initiatives = await Initiative.findAll({
            include : [
                {
                    model : InitiativeType,
                    as : 'initiativeType',
                    attributes : {
                        exclude : ['initiative_type_id','created_at','updated_at']
                    }
                }
            ],
            where : {location_id : location_ids},
            attributes : {exclude : ['created_at','updated_at','initiative_type_id','location_id']},
            raw : true,
            nest : true
        });

        return initiatives;
    }

    // get the events in next 24 hours for the user
    async findAllIntitiativesOfUser(user_id){
        const initiatives = await Initiative.findAll({
            include : [
                {
                    model : InitiativeType,
                    as : 'initiativeType',
                    attributes : {
                        exclude : ['initiative_type_id','created_at','updated_at']
                    }
                },
                {
                    model : EventSchedule,
                    as : 'schedules',
                    attributes: { 
                        exclude: ['created_at', 'updated_at', 'initiative_id'] 
                    }
                },
                {
                    model : Location,
                    as : 'location',
                    attributes : {
                        exclude : ['created_at','updated_at','location_id']
                    }
                }
            ],
            where:{
                organizer_id:user_id
            },
            attributes : ['initiative_type_id','created_at','updated_at']
        });
        return initiatives;
    }
    
    async findAllInitiativeMembers(initiative_id){
        const intitiativeMembers = await InitiativeMember.findAll({ 
            where : {initiative_id : initiative_id},
            attributes : ['initiative_member_id','user_id'] 
        });
        return intitiativeMembers;
    }

    async createInitiativeMember(initiative_id,user_id){
        const intitiativeMember = await InitiativeMember.create({initiative_id,user_id})
        return intitiativeMember;
    }
    
    async leaveInitiative(initiative_id,user_id){
        const member = await InitiativeMember.findOne({
            where: {
                [Op.and] : [{user_id},{initiative_id}]
            },
        });    
        if (!member) {
            throw new Error('Member not found in this initiative');
        }
    
        // Delete the record
        await member.destroy();
    
        return true;
    }
    
}

module.exports = IntitiativeRepository