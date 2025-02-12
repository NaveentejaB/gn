const Initiative = require('../models/initiative-model')
const InitiativeMember = require('../models/initiative-member-model')
const { Op } = require('sequelize');


class IntitiativeRepository {

    async createIntitiative(intitiative_data) {
        const createdInitiative = await Initiative.create(intitiative_data);
        return createdInitiative;
    }
    async deleteIntitiative(initiative_id){
        const deletedIntitiative = await Initiative.destroy({where:{initiative_id : initiative_id}});
        const deleteMembers = await InitiativeMember.destroy({where:{initiative_id:initiative_id}})
        return deletedIntitiative;
    }
    
    async findIntitiativeById (initiative_id) {
        const intitiative = await Initiative.findByPk(initiative_id, { raw: true });
        return intitiative;
    }

    async updateIntitiativeMemberCount (initiative_id) {
        const intitiative = await Initiative.findByPk(initiative_id, { raw: true });
        intitiative.no_of_memebers += 1;
        await intitiative.save();
        return intitiative;
    }

    async findAllIntitiatives() {
        const intitiatives = await Initiative.findAll();
        return intitiatives;
    }

    async findAllIntitiativesOfUser(user_id){
        const initiatives = await Initiative.findAll({where:{organizer_id:user_id}});
        return initiatives;
    }
    
    async findAllInitiativeMembers(initiative_id){
        const intitiativeMembers = await InitiativeMember.findAll({ 
            where : {initiative_id : initiative_id},
            attributes : ['initiative_member_id','user_id'] 
        });
        return intitiativeMembers;
    }

    async createInitiativeMember(initiative_member_data){
        const intitiativeMember = await InitiativeMember.create(initiative_member_data)
        return intitiativeMember;
    }
    
    async leaveInitiative(user_id,initiative_id){
        const deleteMember = await InitiativeMember.findOne({
            where:{
                [Op.and] : [{user_id:user_id},{initiative_id:initiative_id}]
            }
        });
        deleteMember.destroy();
        await deleteMember.save();
        return deleteMember;
    }
    
}

module.exports = IntitiativeRepository