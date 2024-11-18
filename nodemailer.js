let nodemailer = require("nodemailer");
let aws = require("@aws-sdk/client-ses");
const {getAWSClient} = require('./clientConfiguration.js');

class nodeMailer{
    async  sendMailWithAttachment(emailOptions, sesRegion, credentials){
        let ses = getAWSClient('ses', sesRegion, credentials);
        let transporter = nodemailer.createTransport({
            SES: { ses, aws },
          });
        try{
            transporter.sendMail(
                emailOptions,
                (error) => {
                    if(error) throw error;
                }
            );
            return { statusCode: 200, message: "Success"}; 
        } catch(error){
            console.error(`[ERROR][NODEMAILER] Error while sending mail`, error)
            return { statusCode: 500, message: "Error occurred while sending email via nodeMailer", error };
        }
    }
}

module.exports = new nodeMailer();

