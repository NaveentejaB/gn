const express = require('express');
const AuthController = require("../controllers/auth-controller");


const router = express.Router();
const authController = new AuthController();

router.post('/login',(req,res)=>authController.login(req,res));
router.post('/verify/gmail',(req,res)=>authController.verifyGmailOTP(req,res));
router.post('/verify/phone',(req,res)=>authController.verifyPhoneOTP(req,res));
router.post('/otp/sms',(req,res) => authController.sendOTPToPhone(req,res));
router.post('/otp/gmail',(req,res) => authController.sendOTPToEmail(req,res));


module.exports = router;