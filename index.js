const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const {sendMailWithAttachment} = require('./nodemailer.js')
/**
 * Initializes the EmailService with AWS configuration.
 * @param {object} awsConfigParams AWS configuration with region and credentials
 * @param {string} awsConfigParams.region AWS region (mandatory)
 * @param {object} awsConfigParams.credentials AWS credentials object containing `accessKeyId` and `secretAccessKey` (or) `defaultProvider`
 */

/**
 * Sends an email with or without attachments using AWS SDK v3 and nodemailer.
 * 
 * @param {object} params Object containing all parameters
 * @param {string} params.FromEmailAddress Sender's email address (mandatory)
 * @param {string[]} params.ToAddresses Array of recipient email addresses (mandatory)
 * @param {string} params.Subject Email subject (mandatory)
 * @param {string[]} [params.CcAddresses] Array of CC email addresses (optional)
 * @param {string} [params.BucketName] S3 bucket name containing email body template (optional)
 * @param {string} [params.BodyTemplate] S3 key for email body template (optional)
 * @param {object} [params.BodyData] Data object for replacing placeholders in email template (optional)
 * @param {string} [params.AttachmentBucketName] S3 bucket name containing email attachments (optional)
 * @param {string[]} [params.attachmentKeys] Array of S3 keys for attachments (optional)
 * @returns {Promise<object>} Promise resolving to an object indicating success or failure
 */


exports.sendEmail = async function (params, awsConfigParams) {

  const {
    FromEmailAddress,
    ToAddresses,
    Subject,
    CcAddresses = [],
    BucketName = '',
    BodyTemplate = '',
    BodyData = {},
    AttachmentBucketName = '',
    attachmentKeys = [],
  } = params;

  let awsConfig =  {
    region :  awsConfigParams?.region || '',
    credentials : awsConfigParams?.credentials || null
  }
  
  if (awsConfig.region === '') throw new Error("Region is not defined in SESEmailSenderV2 is mandatory.");
  if (!params.FromEmailAddress) throw new Error("Sender email address (FromEmailAddress) is mandatory.");
  if (!params.ToAddresses || params.ToAddresses.length === 0) throw new Error("At least one recipient email address (ToAddresses) is mandatory.");
  if (!params.Subject) throw new Error("Email subject (Subject) is mandatory.");
  if (params.BucketName !== '' && params.BodyTemplate === '') throw new Error("BodyTemplate Template key is requried");
  if (params.AttachmentBucketName !== '' && ( !params?.attachmentKeys || params?.attachmentKeys?.length === 0)) throw new Error("AttachmentKeys are required to send attachments but are missing. Remove AttachmentBucketName if no attachments are intended.");
  return new Promise(async (resolve, reject)=>{
    try {
      let emailBody = "No email body template provided.";
      let s3Client = new S3Client(awsConfig);

      let streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        });
      
      if (BucketName && BodyTemplate) {
        try {
          let s3Response = await s3Client.send(new GetObjectCommand({ Bucket: BucketName, Key: BodyTemplate }));
          let template = await streamToString(s3Response.Body);
          emailBody = template.replace(/{{(.*?)}}/g, (match, key) => BodyData[key] || "");
        } catch (error) {
          console.error('Error while Processing S3 Email Template Error:', error);
          throw error;
        }
      }


      if (attachmentKeys.length > 0 && AttachmentBucketName) {
        let fileAttachments = [];
        for (let key of attachmentKeys) {
          let fileData = await s3Client.send(new GetObjectCommand({ Bucket: AttachmentBucketName, Key: key }));
          let fileContent = fileData.Body;
          fileAttachments.push({ filename: key, content: fileContent });
        }
        let mailOptions = {
          from: FromEmailAddress,
          to: ToAddresses,
          cc: CcAddresses,
          subject: Subject,
          html: emailBody,
          attachments: fileAttachments,
        };
        try{
          await sendMailWithAttachment(mailOptions, awsConfig);
          resolve ({ statusCode: 200, message: "Success" });
        } catch(error){
          throw error;
        }
      }
      else {
        const SES = new SESClient(awsConfig);
        const sesParams = {
          Source: params.FromEmailAddress,
          Destination: {
            ToAddresses: params.ToAddresses,
            CcAddresses: params.CcAddresses || []
          },
          Message: {
            Subject: {
              Data: params.Subject
            },
            Body: {
              Html: {
                Data: emailBody
              }
            }
          }
        };
        await SES.send(new SendEmailCommand(sesParams));
        resolve ({ statusCode: 200, message: "Success" });
      }
      
    } catch (error) {
      reject ({ statusCode: 400, message: "Error occurred while sending email", error });
    }
  })
};
