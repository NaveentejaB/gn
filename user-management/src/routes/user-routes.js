const express = require('express');
const UserController = require("../controllers/user-controllers");


const router = express.Router();
const userController = new UserController();

router.post('/register',(req, res) => userController.registerUser(req, res));
router.get('/users',(req, res) => userController.getAllUser(req, res));
router.get('/user',(req, res) => userController.getSpecificUserById(req, res));
router.post('/userByEmail',(req,res)=> userController.getUserByEmail(req,res));
router.post('/setPassword',(req,res)=> userController.setNewPassword(req,res));

router.post('/users/data',(req,res) => userController.getUsersDataByIds(req,res));

router.get('/mailTest',(req,res) => userController.testMail(req,res));


module.exports = router;