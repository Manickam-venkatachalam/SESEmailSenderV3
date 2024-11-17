let nodemailer = require("nodemailer");
let aws = require("@aws-sdk/client-ses");

class nodeMailer{
    async  sendMailWithAttachment(emailOptions, awsConfig){
        let ses = new aws.SES(awsConfig);
        let transporter = nodemailer.createTransport({
            SES: { ses, aws },
          });
        try{
            transporter.sendMail(
                emailOptions,
                (error) => {
                    if(error) throw error
                    envelopeID = info.envelope;
                    messageID = info.messageId;
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

