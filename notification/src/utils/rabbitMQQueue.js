const RabbitMQClient = require('./rabbitMQSetup');

class RabbitMQQueue {
    constructor(){
        if(RabbitMQQueue.instance){
            return RabbitMQQueue.instance;
        }
        this.RabbitMQClient = new RabbitMQClient();
        this.isIntialized = false;
        this.instance = this;
        this.channel = null;
    }

    async Intialize(){
        if(!this.isIntialized){
            await this.RabbitMQClient.connect();
            console.log(`RabbitMQ service intialised successfully.`);
            this.isIntialised = true;
            this.channel = this.RabbitMQClient.getChannel();
        }
        return this;
    }

    async publicMessageToQueue(queue,message){
        try{
            if(!this.isIntialised){
                await this.Intialize();
            }
            console.log('rmq : setup',message," ",queue);
            const channel = await this.RabbitMQClient.getChannel();

            const data = JSON.stringify(message);

            const success = await channel.publish('notification',queue,Buffer.from(data));
            return success ? true : false;

        }catch(error){
          console.error('Error publishing message:', error);
          throw error;
        }
    }
}

const rabbitMQQueue = new RabbitMQQueue();

module.exports = rabbitMQQueue;
