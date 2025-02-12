const User = require("../models/user-model")
const { Op } = require('sequelize');


class UserRepository {
    async createUser(user_data) {
        const createdUser = await User.create(user_data);
        return createdUser;
    }
    async findById (userId) {
        const user = await User.findByPk(userId, { raw: true });
        return user;
    }

    async findAll() {
        const users = await User.findAll();
        return users;
    }
    async updatePassword(user_password,user_id){
        const user = await User.findByPk(user_id);
        user.user_password = user_password;
        await user.save();
        return user;
    }
    async findUserExists(user_email,user_phone){
        const user = await User.findOne({
            where : {
                [Op.and]: [{ user_email: user_email }, { user_phone: user_phone }],
            },
        });
        return user;
    }

    async findUserByEmail(user_email){
        const user = await User.findOne({
            where : { user_email: user_email }
        });
        return user;
    }

    async getUserDataByUserIds(user_ids,organizer_id){
        const users = await User.findAll({
            where : {
                user_id : user_ids
            },
            attributes : {
                exclude : ['user_password','createdAt','updatedAt']
            }
        })
        const organizer = await User.findByPk(organizer_id,{
            attributes : {
                exclude : ['user_password','createdAt','updatedAt']
            }
        })
        const result = { users : users, organizer : organizer}
        return result
    }
}

module.exports = UserRepository