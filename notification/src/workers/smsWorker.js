const { Vonage } = require('@vonage/server-sdk')
const rabbitMQQueue = require('../utils/rabbitMQQueue');

class SMSWorker{
    constructor(){
        this.channel = rabbitMQQueue.channel
        this.vonage = new Vonage({
            apiKey : process.env.VONAGE_APIKEY,
            apiSecret : process.env.VONAGE_APISECRET
        })
    }
    async start(){
        const channel = this.channel;
        channel.assertQueue('sms_notifications',{durable : true});
        console.log('in the sms worker currently');
        
        channel.consume('sms_notifications',async(msg)=>{
            if(msg){
                const smsNotificationData = JSON.parse(msg.content.toString())
                console.log('rmq-ew : ',smsNotificationData);
                
                try{
                    const {receipient , content, metadata} = smsNotificationData
                    await this.processSMS(receipient,content,metadata)
                    channel.ack(msg)
                }catch(err){
                    console.error('Failed to process email:', err);
                    if(err.temporary){
                        channel.nack(msg)
                    }
                    channel.nack(msg, false, false);
                }
            }
        })
        console.log('Email worker started');
    }

    async processSMS(recipient, content, metadata) {
        try {
            const from = "Vonage APIs";
            const resp = await this.vonage.sms.send({
                to: `+91${recipient}`,  // Changed from 'recipient'
                from: from,
                text: content   // Vonage typically uses 'text' instead of 'content'
            });
            console.log('Message sent successfully');
            console.log(resp);
        } catch(err) {
            console.log('There was an error sending the messages.');
            console.error(err);
            throw err;  // Re-throw to allow error handling in the caller
        }
    }
}

module.exports = SMSWorker