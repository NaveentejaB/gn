const express = require('express');
const initiativeController = require('../controllers/initiative-controllers')


const router = express.Router();
const InitiativeController = new initiativeController();

// for organizer
router.post('/delete',(req,res)=>InitiativeController.deleteInitiative(req,res));


// for user
router.post('/join',(req,res)=>InitiativeController.joinInitiative(req,res));
router.post('/leave',(req,res)=>InitiativeController.LeaveInitiative(req,res));

// common
router.get('/:initiative_id',(req,res) => InitiativeController.findInitiativeById(req,res)); //checked
router.get('/location/:location_town',(req,res)=> InitiativeController.findAllInitiativesByLocation(req,res)); //checked
router.get('/',(req,res)=>InitiativeController.findAllInitiatives(req,res));
// router.get('/user',(req,res)=>InitiativeController.findInitiativesOfUser(req,res));
router.post('/new',(req,res)=>InitiativeController.createInitiative(req,res));  //checked






module.exports = router;