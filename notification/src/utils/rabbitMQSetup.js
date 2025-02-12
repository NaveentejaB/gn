const amqp = require('amqplib');
const winston = require('winston');

class RabbitMQClient {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.retryAttemps = 0;
    this.maxRetries = 5;
  }

  async connect() {
    try {
      const url = 'amqp://localhost';
      this.connection = await amqp.connect(url);

      this.connection.on('error',(error)=>{
        console.error('RabbitMQ connection error: ',error);
        this.reconnect()
      });

      this.connection.on('close',()=>{
        console.error('RabbitMQ connection closed');
        this.reconnect()
      });

      await this.createChannel();
      this.retryAttemps = 0;
      console.log('Successfully connected to RabbitMQ');
    } catch (error) {
      winston.error('RabbitMQ connection error:', error);
      await this.reconnect();
    }
  }

  async reconnect(){
    if(this.retryAttemps >= this.maxRetries){
      console.error('Max retry attempts reached. Stopping reconnection attempts.');
      return;
    }
    this.retryAttemps++;
    const backoff = Math.min(1000 * Math.pow(2, this.retryAttemps), 30000);
    console.log(`Attempting to reconnect in ${backoff}ms... (Attempt ${this.retryAttemps}/${this.maxRetries})`);
    setTimeout(async()=>{
      try{
        await this.connect()
      }catch(error){
        console.log('Reconnection failed: ',error);
        
      }
    },backoff)
  }

  async createChannel(){
    try{
      this.channel = await this.connection.createChannel();
      const exchange = 'notification'
      // exchange_name, method, options
      await this.channel.assertExchange(exchange,'direct',{durable : true});
  
      const queues = ['email_notifications','sms_notifications','in_app_notifications'];
  
      queues.map(async(queue) => {
        // queue_name, options
        await this.channel.assertQueue(queue,{durable : true});
        // queue_name, exchange_name, routing_key
        await this.channel.bindQueue(queue, exchange ,queue);
      });
  
      this.channel.on('error',(error)=>{
        console.log('channel error :', error);
      });
  
      this.channel.on('close',()=>{
          console.log('channel closed.');
      })
    }catch(error){
      console.error('Error creating channel:', error);
      throw error;
    }
  }
  
  async publicMessage(queue,message){
    try{
      console.log('rmq : setup',message," ",queue);
      // return true;
      const data = JSON.stringify(message);
      console.log(data);
      if(this.channel)
        this.channel.publish('notification',queue,Buffer.from(data));
      else
        this.createChannel();
        
      // console.log('suc:',success);
      
      return true;
    }catch(error){
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  getChannel(){
    if(!this.channel){
      throw new Error('Channel not Intialised');
    }
    return this.channel
  }


  async closeConnection(){
    try{
      if(this.channel){
        this.channel.close();
      }
      if(this.connection){
        this.connection.close()
      }
    }catch(error){
      console.log('Error in closing connections :',error);
      throw error;
    }
  }
}

module.exports = RabbitMQClient;