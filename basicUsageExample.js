const { sendEmail } = require('aws-ses-email-senderV3');

const awsConfigParams = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'your-access-key',
    secretAccessKey: 'your-secret-key',
  },
};

const emailParams = {
  FromEmailAddress: 'sender@example.com',
  ToAddresses: ['recipient@example.com'],
  Subject: 'Hello from AWS Email Sender',
  BodyTemplate: 'email-template.html',
  BucketName: 'my-email-templates',
  BodyData: {
    name: 'John Doe',
  },
};

sendEmail(emailParams, awsConfigParams)
  .then((response) => console.log('Email sent successfully!', response))
  .catch((error) => console.error('Failed to send email:', error));
