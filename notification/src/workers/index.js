const RedisConnection = require("../utils/redisSetup")
const EmailWorker = require("./emailWorker")
const RedisNotificationWorker = require("./notificationWorkerRedis")
const rabbitMQQueue = require("../utils/rabbitMQQueue")
const SMSWorker = require("../workers/smsWorker")

class consumersSetup{
    constructor(){
        this.RedisConnection = new RedisConnection();
        this.EmailWorker = null;
        this.SMSWorker = null;
        this.RedisNotificationWorker = null;
    }

    //  by calling this function at the index.js in par will setup the connections
    async startMessageBrokers(){
        try{
            await rabbitMQQueue.Intialize();
            await this.RedisConnection.connect();
            this.EmailWorker = new EmailWorker();
            this.SMSWorker = new SMSWorker();
            await this.startConsumers();
        }catch(err){
            console.log('Error connection message brokers : ', err);
            throw err;
        }
    }

    async startConsumers(){
        try{
            const RabbitMQchannel = rabbitMQQueue.channel;
            const redisClient = this.RedisConnection.getClient();
    
            this.RedisNotificationWorker = new RedisNotificationWorker(RabbitMQchannel,redisClient);
            await this.EmailWorker.start();
            await this.SMSWorker.start();
            await this.RedisNotificationWorker.consumeNotifications();
        }catch(err){
            console.log('Error starting consumers : ', err);
            throw err;
        }
    }
}

module.exports = consumersSetup