const express = require('express');
const initiativeController = require('../controllers/initiative-controllers')


const router = express.Router();
const InitiativeController = new initiativeController();

// for organizer
router.post('/new',(req,res)=>InitiativeController.createInitiative(req,res));
router.get('/user',(req,res)=>InitiativeController.findInitiativesOfUser(req,res));
router.get('/',(req,res)=>InitiativeController.findInitiatives(req,res));
router.post('/delete',(req,res)=>InitiativeController.deleteInitiative(req,res));

// for user
router.post('/join',(req,res)=>InitiativeController.deleteInitiative(req,res));
router.post('/leave',(req,res)=>InitiativeController.deleteInitiative(req,res));




module.exports = router;