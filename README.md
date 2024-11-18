# AWS Email SES Sender

AWS Email Sender is a versatile library for sending emails using AWS SES (Simple Email Service) and optionally attaching files from S3. It also supports sending emails using Nodemailer for attachments.

## Features

- Send emails with or without attachments.
- Fetch email templates and attachments from S3.
- Supports both AWS SES SDK v3 and Nodemailer for email delivery.
- Easy-to-configure AWS region and credentials.

---

## Installation

Install the package using npm:

```bash
npm install SESEmailSenderV3
```

---

## Usage Example

### Import and Initialize

#### Basic Usage Without attachements

```javascript
const { sendEmail } = require('SESEmailSenderV3');

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

```

#### Advanced Usage Without attachements

```javascript
const { sendEmail } = require('sesemailsenderv3');


async function triggerEmail() {
    try {
        let params = {
            FromEmailAddress: 'your-sender-email@example.com', // Verified email in SES
            ToAddresses: ['recipient-email@example.com'], // List of recipient emails
            Subject: 'Hello from SES Email Sender',
            BucketName: 'your-s3-bucket-name', // (Optional) S3 bucket for email template
            BodyTemplate: 'your-email-template.html', // (Optional) S3 object key for the email template
            CcAddresses: ['cc-email@example.com'], // (Optional) List of CC emails
            AttachmentBucketName: 'your-s3-bucket-for-attachments', // (Optional) S3 bucket for attachments
            BodyData: {
                name: 'John Doe',
                orderNumber: '123456',
                product: 'Awesome Product'
            }, // (Optional) Placeholder data for the email template
            attachmentKeys: ['attachment1.pdf', 'attachment2.png'] // (Optional) Keys for attachments in S3
        };

        let awsConfig = {
            region: 'ap-south-1', // AWS region for S3 and SES
            credentials: {
                accessKeyId: 'your-access-key-id', // Your AWS Access Key ID
                secretAccessKey: 'your-secret-access-key' // Your AWS Secret Access Key
            },
            sesRegion: 'ap-southeast-1', // (Optional) Specific region for SES
            s3TemplateRegion: 'ap-south-1', // (Optional) Specific region for S3 templates
            s3AttachementsRegion: 'ap-south-1' // (Optional) Specific region for S3 attachments
        };

        // Send the email
        await sendEmail(params, awsConfig);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Trigger the email
triggerEmail();
```

### Parameters

#### **Email Parameters**
| Parameter              | Type       | Description                                                                                   | Required |
|------------------------|------------|-----------------------------------------------------------------------------------------------|----------|
| `FromEmailAddress`     | `string`   | Sender's email address. Must be verified in SES.                                              | Yes      |
| `ToAddresses`          | `string[]` | Array of recipient email addresses.                                                          | Yes      |
| `Subject`              | `string`   | Email subject.                                                                                | Yes      |
| `CcAddresses`          | `string[]` | (Optional) Array of CC email addresses.                                                      | No       |
| `BucketName`           | `string`   | (Optional) Name of the S3 bucket containing the email body template.                         | No       |
| `BodyTemplate`         | `string`   | (Optional) Key of the S3 object for the email body template.                                  | No       |
| `BodyData`             | `object`   | (Optional) Key-value pairs to replace placeholders in the email template.                    | No       |
| `AttachmentBucketName` | `string`   | (Optional) Name of the S3 bucket containing email attachments.                                | No       |
| `attachmentKeys`       | `string[]` | (Optional) Keys of attachments in S3 to include in the email.                                | No       |

#### **AWS Config Parameters**
| Parameter                  | Type       | Description                                                       | Required |
|----------------------------|------------|-------------------------------------------------------------------|----------|
| `region`                   | `string`   | AWS region for the default configuration.                        | Yes      |
| `credentials`              | `object`   | AWS credentials (accessKeyId and secretAccessKey).               | No       |
| `sesRegion`                | `string`   | (Optional) Specific region for SES service.                      | No       |
| `s3TemplateRegion`         | `string`   | (Optional) Specific region for S3 templates.                     | No       |
| `s3AttachementsRegion`     | `string`   | (Optional) Specific region for S3 attachments.                   | No       |

---

### Example Email Template in S3

An example HTML template file in your S3 bucket:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Email Template</title>
</head>
<body>
    <h1>Hello, {{name}}</h1>
    <p>Your order number is {{orderNumber}} for {{product}}.</p>
</body>
</html>
```

### Notes
- Ensure that the `FromEmailAddress` is verified in SES, especially in the sandbox environment.
- The `ToAddresses` and `CcAddresses` must also be verified in the SES sandbox environment or you need production access to send mails.
- Attachments must be accessible in the specified S3 bucket.
