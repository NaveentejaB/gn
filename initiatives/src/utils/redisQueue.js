const RedisConnection = require('./redisSetup')

class RedisQueue{
    constructor(){
        if(RedisQueue.instance)
            return RedisQueue.instance;
        this.redisConnection = new RedisConnection();
        this.isIntialised = false;
        this.instance = this;
    }
    async Intialise(){
        if(!this.isIntialised){
            await this.redisConnection.connect();
            console.log(`Redis service intialised successfully.`);
            this.isIntialised = true;
        }
        return this;
    }

    async pushToQueue(queueName,data){
        try{
            if(!this.isIntialised){
                await this.Intialise();
            }
            const client = await this.redisConnection.getClient();
            console.log(`user :`, data);
            
            await client.lpush(queueName,JSON.stringify(data));
            console.log(`Successfully pushed item to queue ${queueName}`);
            return true;
        }catch(error){
            console.error('Error pushing to queue:', error);
            throw error;
        }
    }
}

const redisQueue = new RedisQueue();

module.exports = redisQueue