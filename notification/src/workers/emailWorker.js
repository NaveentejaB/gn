const nodemailer = require('nodemailer')
const rabbitMQQueue = require('../utils/rabbitMQQueue');

console.log('in the email worker currently');

class EmailWorker{
    constructor(){
        this.channel = rabbitMQQueue.channel;
        this.transporter = nodemailer.createTransport({
            service : process.env.MAIL_HOST,
            auth: {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS,
            }
        });
    }

    async start(){
        const channel = this.channel;
        channel.assertQueue('email_notifications',{durable : true});
        console.log('in the email worker currently');
        
        channel.consume('email_notifications',async(msg)=>{
            console.log('msg in worker:', msg)
            if(msg){
                const emailNotificationData = JSON.parse(msg.content.toString())
                console.log('rmq-ew : ',emailNotificationData);
                
                try{
                    const {receipient , content, metadata} = emailNotificationData
                    await this.processMail(receipient,content,metadata)
                    channel.ack(msg)
                    console.log('mail sent')
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

    async processMail(receipient, content, metadata){
        await this.transporter.sendMail({
            from:process.env.MAIL_FROM,
            to : receipient,
            subject :  metadata.subject || 'notification',
            text : content,
            // ...metadata.emailOptions
        })
    }
}

module.exports = EmailWorker