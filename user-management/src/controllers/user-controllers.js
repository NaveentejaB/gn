const UserService = require("../services/user-services")
const redisQueue = require("../utils/redisQueue")
const bcrypt = require('bcrypt')

class UserController {
    constructor(){
        this.service =  new UserService(); 
    }
    async testMail(req,res){
        try{
            console.log();
            
            const notiData = {
                receipient  :  'naveentejasd@gmail.com',
                content : "Welcome to GreenNexus. Let's save earth together.",
                rabbitMQQueue : 'email_notifications',
                metadata : {
                    subject : "Welcome Text."
                }
            }

            await redisQueue.pushToQueue('notifications:list',notiData);
            res.return(200).json({
                message : 'done btch'
            })
        }catch (error) {
            console.log(error.message);
            
            return res.status(400).json({
                error : true,
                message : error.message
            })
        }
    }
    async registerUser(req,res) {
        // user = {user_name,user_phone,user_age,user_location,user_email,user_password}
        const user = req.body;
        console.log(user)
        const existingUser = await this.service.findUserByEmailAndPhone(user.user_email,user.user_phone);
        console.log('hai')
        if(existingUser){
            res.status(400).json({
                error : true,
                message : `user already exist with given gmail or phone. Try using different gmail or phone.`
            })  
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.user_password, salt);
        user.user_password = hashPassword;
        console.log(user)
        const result = await this.service.createUser(user);
        console.log(result)
        res.status(201).json({
            error : false,
            user_id : result.user_id,
            message : `user created succesfully.`
        })
    }
    
    async getAllUser(req,res){
        const users = await this.service.getAllUsers();
        res.status(200).json({
            error : false,
            message : `users fetched.`,
            data : users
        })

    }
    async getSpecificUserById(req,res){
        const {user_id} = req.body
        const user = await this.service.getUserById(user_id);
        res.status(200).json({
            error : false,
            message : `users fetched.`,
            user : user
        })
    }
    async getUserByEmail(req,res){
        const {user_email} = req.body;
        
        const existingUser = await this.service.findUserByEmail(user_email);
        if(!existingUser){
            res.status(400).json({
                error : true,
                message : `user not found`
            })
        }
        res.status(200).json({
            error : false,
            user : existingUser,
            message :`user details fetched.`
        })
    }

    async setNewPassword(req,res){
        const {user_password,user_id} = req.body;
            
        const existingUser = await this.service.getUserById(user_id)
        if(!existingUser){
            res.status(400).json({
                error : true,
                message : `user not found`
            })
        }
        console.log('old data', existingUser)
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user_password, salt);

        const updatePassword = await this.service.setUserNewPassword(hashPassword,user_id)
        if(!updatePassword)
            res.status(400).json({
                error : true,
                message :`issue in updating password.`
            })
        console.log('new data', updatePassword)
        res.status(200).json({
            error : false,
            user : existingUser,
            message :`user password updated successfully.`
        })
    }

    async getUsersDataByIds(req,res){
        const {user_ids, organizer_id} = req.body;
        if(!user_ids || !organizer_id)
            res.status(400).json({
                error : true,
                message :`user ids or organizer id is missing.`
            });
        const result = await this.service.findUsersByIds(user_ids,organizer_id);
        res.status(200).json({
            error : false,
            data : result,
            message :`users data fetched successfully.`
        })

    }
}

module.exports = UserController