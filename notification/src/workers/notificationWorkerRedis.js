const rabbitMQQueue = require('../utils/rabbitMQQueue')

class RedisNotificationWorker{
    constructor(RabbitMQClient,RedisClient,config = {}){
        this.RedisClient = RedisClient;
        this.RabbitMQClient = RabbitMQClient;
        this.isProcessing = false;
        
        this.config = {
            redisListName : 'notifications:list',
            rabbitMQQueueNames : ['email_notifications','sms_notifications','in_app_notifications'],
            batchSize : 10,
            processInterval :5000,
            ...config
        }
    }

    async consumeNotifications(){
        if(this.isProcessing) return;

        this.isProcessing = true;
        console.log(`Starting to consume notifications from Redis list: ${this.config.redisListName}`);
        
        try{
            while(this.isProcessing){
                const messages =await this.fetchMessagesFromRedis();
                if (messages.length === 0) {
                    console.log(`No messages found, waiting for ${this.config.processInterval}ms`);
                    await new Promise(resolve => setTimeout(resolve, this.config.processInterval));
                    continue;
                }

                console.log(`Processing batch of ${messages.length} messages`);
                await this.processMessages(messages);
            }
        }catch(error){
            console.error('Error in notification consumption:', error);
            this.isProcessing = false;
            throw error;
        }
    }

    async fetchMessagesFromRedis(){
        try{
            const messages = [];
            // for (let i = 0; i < this.config.batchSize; i++) {
            const message = await this.RedisClient.rpop(this.config.redisListName);
            //     if (!message) break;
            //     messages.push(message);
            // }
            console.log('notificationService',message);
            if(message)
                messages.push(message)
            return messages;
        }catch(error){
            console.error('Error fetching messages from Redis:', error);
            this.stop();
            throw error;
        }
    }

    async processMessages(messages){
        const processPromises = messages.map( async(message) => {
            try{
                const parsedMessage = JSON.parse(message)
                const enrichedMessage = {
                    ...parsedMessage,
                    metadata : {
                        processedAt: new Date().toISOString(),
                    }
                }
                const rmqQueueName = enrichedMessage.rabbitMQQueue
                delete enrichedMessage.rabbitMQQueue
                console.log('queue Name :', rmqQueueName)
                const success = await rabbitMQQueue.publicMessageToQueue(rmqQueueName,enrichedMessage)
                
                console.log('rmq:',success);
                
                return success ? true : false;
            }catch (error) {
                console.error('Error processing message:', message, error);
                // await this.handleFailedMessage(message, error);
                return false;
            }
        })
        await Promise.all(processPromises);
    }


    stop() {
        this.isProcessing = false;
        console.log('Stopping notification worker...');
    }

    async handleFailedMessage(message, error){
        try{
            await this.RedisClient.lpush(this.config.redisListName,message);
        }catch(error){
            console.log('Error pushing message into redis queue : ',error);
        }
    }
}


module.exports =  RedisNotificationWorker;