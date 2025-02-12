const UserRepository = require("../repositories/user-repositories")

class UserService {
    constructor(){
        this.UserRepository = new UserRepository()       
    }
    async createUser(userData) {
        const createdUser = await this.UserRepository.createUser(userData);
        return createdUser;
    }
    async getUserById(userId) {
        const user = await this.UserRepository.findById(userId);
        return user;
    }
    async getAllUsers(){
        const users = await this.UserRepository.findAll();
        return users;
    }
    // For auth
    async setUserNewPassword(user_password,user_id){
        const user = await this.UserRepository.updatePassword(user_password,user_id);
        return user;
    }
    async findUserByEmailAndPhone(user_email,user_phone) {
        const user = await this.UserRepository.findUserExists(user_email,user_phone);
        return user;
    }
    async findUserByEmail(user_email) {
        const user = await this.UserRepository.findUserByEmail(user_email);
        return user;
    }
    // common uses
    async findUsersByIds(user_ids,organizer_id){
        const result = await this.UserRepository.getUserDataByUserIds(user_ids,organizer_id)
        return result
    }
}

module.exports =  UserService