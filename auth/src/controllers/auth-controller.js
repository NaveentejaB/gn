const AuthService = require("../services/auth-services");
const redisQueue = require("../utils/redisQueue")
const axios = require('axios')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function generateOTP() {
    return crypto.randomInt(100000, 999999);
}

class AuthController {
    constructor(){
        this.AuthService =  new AuthService(); 
    }
    async login(req,res){
        const {user_email,user_password} = req.body;
        const exisitingUser = await axios.post('http://localhost:3001/userByEmail',{
            user_email : user_email,
        })
        
        if(exisitingUser.data.error){
            console.log(exisitingUser.data.message);
            res.status(400).json({
                error : true,
                message : 'user not found'
            })
        }
        const user = exisitingUser.data.user;
        const verifiedPassword = await bcrypt.compare(
            user_password,
            user.user_password
        )
        if(!verifiedPassword){
            res.status(400).json({
                error : true,
                message : `invalid login credientials.`
            })
        }
        const payload = { id:user.user_id ,email:user.user_email}

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "10080m" }
        )	
        res.status(200).json({
            error : true,
            data : accessToken,
            message : `login success.`
        })
    }

    async sendOTPToEmail(req,res){
        console.log('email : ',req.body);
        const {user_email} = req.body
        const otp = generateOTP()
        console.log('sending otp :',otp,"-",user_email)
        const gmailData = {
            receipient : user_email,
            content : `Your OTP for verification is ${otp} at GreenNexus`,
            rabbitMQQueue : 'email_notifications',
            metadata : {
                subject : `${otp} is the OTP for verification of gmail at GreenNexus`
            }
        }
        const ress = await redisQueue.pushToQueue('notifications:list',gmailData)
        if(ress.error){
            res.status(400).json({
                error : true,
                message : `Failed to send OTP`
            })
        }
        // const result = await this.AuthService.createGmailOtpDoc(user_email,otp)

        res.status(200).json({
            error : false,
            message : 'OTP is sent to the given Gmail.'
        })
    }
    
    async sendOTPToPhone(req,res){
        const {user_phone} = req.body
        console.log('phone',req.body);
        const otp = generateOTP()
        console.log('sending otp :',otp,"-",user_phone)
        const smsData = {
            receipient : user_phone,
            content : `Your OTP for verification is ${otp} at GreenNexus`,
            metadata : {
                subject : `${otp} is the OTP for verification of gmail`
            },
            rabbitMQQueue : 'sms_notifications'
        }
        console.log(smsData)
        const ress = await redisQueue.pushToQueue('notifications:list',smsData)
        console.log(ress)
        if(ress.error){
            res.status(400).json({
                error : true,
                message : `Failed to send OTP`
            })
        }
        // const result = await this.AuthService.createSMSOtpDoc(user_phone,otp)
        res.status(200).json({
            error : false,
            message : 'OTP is sent to phone successfully.'
        })
    }

    async verifyGmailOTP(req,res){
        const {user_email,otp} = req.body;
        console.log(req.body)
        let result = await this.AuthService.findEmailDoc(user_email,otp);
        if(!result){
            res.status(400).json({
                error : true,
                message : `invalid OTP. Please Try Again.`
            })
        }
        res.status(200).json({
            error : false,
            message : 'OTP verified successfully.'
        })
    }
    async verifyPhoneOTP(req,res){
        const {user_phone,otp} = req.body;
        let result = await this.AuthService.findPhoneDoc(user_phone,otp);
        if(!result){
            res.status(400).json({
                error : true,
                message : `invalid OTP.`
            })
        }
        res.status(200).json({
            error : false,
            message : 'OTP verified successfully.'
        })
    }
   
    
}

module.exports = AuthController