const Challenge = require("../models/challenge-model")
const { Op } = require('sequelize');


class ChallengeRepository {
    async createChallenge(challenge_data){
        const createdChallenge = await Challenge.create(challenge_data);
        return createdChallenge;
    }

    async getChallenges(current_challenges_data){
        
    }
    
    async deleteChallenge(challenge_id){
        const challenge = await Challenge.destroy({where:{challenge_id}});
        return challenge;
    }
}

module.exports = IntitiativeRepository