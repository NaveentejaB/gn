const IntitiativeService = require("../services/initiative-services")
const bcrypt = require('bcrypt')

class IntitiativeController {
    constructor(){
        this.IntitiativeService =  new IntitiativeService(); 
    }

    // edit initiative yet to be done...

    async createInitiative(req,res){
        const {initiative_data,location_data,schedules_data} = req.body;
        const initiative = await this.IntitiativeService.createInitiative(initiative_data,location_data,schedules_data);
        res.status(200).json({
            message : `successfully created initiative.`,
            data : initiative,
            error : false
        })
    }

    async findAllInitiatives(req,res){
            const initiatives = await this.IntitiativeService.getAllInitiatives();
            res.status(200).json({
                message : `successfully created initiative.`,
                data : initiatives,
                error : false
            })
         
    };
    
    async findInitiativeById(req,res){
        const {initiative_id} = req.params;
        if(!initiative_id)
            re.status(400).json({
                message : `initiative id not provided.`,
                error : true
            })
        const initiative = await this.IntitiativeService.getInitiativeDataById(initiative_id);
        res.status(200).json({
            message : `Initiative successfully fetched.`,
            data : initiative,
            error : false
        })
    }

    async findAllInitiativesByLocation(req,res){
        const {location_town} = req.params
        if(!location_town)
            re.status(400).json({
                message : `location not provided.`,
                error : true
            })
        const initiatives = await this.IntitiativeService.getAllTheInitiativesByLocation(location_town)
        res.status(200).json({
            message : `Initiatives successfully fetched.`,
            data : initiatives,
            error : false
        })
    }

    async findInitiativesOfUser(req,res){
        const {user_id} = req.user
        const initiatives = await this.IntitiativeService.getAllInitiativesOrganizedByUser(user_id);
        res.status(200).json({
            message : `successfully created initiative.`,
            data : initiatives,
            error : false
        })
    }

    async deleteInitiative(req,res){
        const {initiative_id,user_id} = req.body;
        const Deletedinitiative = await this.IntitiativeService.deleteInitiative(initiative_id,user_id);
        res.status(200).json({
            message : `successfully created initiative.`,
            data : Deletedinitiative,
            error : false
        })
    }

    async joinInitiative(req,res){
            const {initiative_id,user_id} = req.body;  
            const initiativeMember = await this.IntitiativeService.joinInitiative(initiative_id,user_id);
            res.status(200).json({
                message : `successfully created initiative.`,
                data : initiativeMember,
                error : false
            })
         
    }

    async LeaveInitiative(req,res){
            const {initiative_id,user_id} = req.body;  
            const leftinitiativeMember = await this.IntitiativeService.leaveInitiative(initiative_id,user_id);
            res.status(200).json({
                message : `successfully left  initiative.`,
                error : false
            })
         
    }
}

module.exports = IntitiativeController