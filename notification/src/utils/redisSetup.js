const Redis = require('ioredis')

class RedisConnection{
    constructor(){
        this.client = null,
        this.subscriber = null,
        this.retryAttempts = 0,
        this.maxRetries = 5
    }

    async connect(){
        try{
            this.client = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                retryStrategy: (times) => {
                    if (times > this.maxRetries) {
                        console.error('Max Redis retry attempts reached');
                        return null;
                    }
                    const delay = Math.min(times * 1000, 30000);
                    return delay;
                }
            })

            this.client.on('error', (error) => {
                console.error('Redis client error:', error);
            });

            this.client.on('connect', () => {
                console.log('Successfully connected to Redis');
                this.retryAttempts = 0;
            });
        }catch(error){
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    getClient() {
        if (!this.client) {
            throw new Error('Redis client not initialized');
        }
        return this.client;
    }

    async closeConnection() {
        try {
            if (this.subscriber) {
                await this.subscriber.quit();
            }
            if (this.client) {
                await this.client.quit();
            }
        } catch (error) {
            console.error('Error closing Redis connections:', error);
            throw error;
        }
    }
}

module.exports = RedisConnection