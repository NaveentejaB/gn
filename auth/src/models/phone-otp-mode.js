
const Sequelize = require('sequelize-cockroachdb')

const {sequelize} = require('../config/DB')



if (!sequelize) {
    throw new Error('Sequelize instance is not initialized. Make sure to call connectDB first.');
  }

const PhoneOtp = sequelize.define("PhoneOtp", {
    phone_otp_id:{
        type : Sequelize.DataTypes.UUID,
        defaultValue :Sequelize.UUIDV4,
        primaryKey : true
    },
    user_phone:{
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    otp:{
        type : Sequelize.DataTypes.STRING,
        allowNull : false
    } 
    },{
        hooks: {
            afterCreate: (instance) => {
                // Set a timeout to delete the specific instance after 60 seconds
                const deletionTimeout = setTimeout(async () => {
                    try {
                    await instance.destroy();
                    console.log(`OTP for ${instance.user_phone} automatically deleted after 60 seconds.`);
                    } catch (error) {
                    console.error(`Error deleting OTP for ${instance.user_phone}:`, error);
                    }
                }, 60000); // 60000 milliseconds = 60 seconds
        
                // Attach the timeout to the instance for potential later cleanup
                instance.deletionTimeout = deletionTimeout;
            },
                // Add a beforeDestroy hook to clear the timeout if the instance is manually destroyed
                beforeDestroy: (instance) => {
                if (instance.deletionTimeout) {
                    clearTimeout(instance.deletionTimeout);
                }
            }
        }
})

module.exports = PhoneOtp;