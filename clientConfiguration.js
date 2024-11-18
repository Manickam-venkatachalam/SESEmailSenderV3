const { S3Client } = require("@aws-sdk/client-s3");
const { SESClient } = require("@aws-sdk/client-ses");

/**
 * Get an AWS Client dynamically configured with the specified region.
 * @param {string} service - AWS Service name ('s3' or 'ses').
 * @param {string} region - AWS Region.
 * @param {object} [credentials] - Optional AWS credentials.
 * @returns {object} - Configured AWS service client.
 */
const getAWSClient = (service, region, credentials) => {
    let config = {
        region :  region || '',
        credentials : credentials || null
    };
    switch (service.toLowerCase()) {
        case "s3":
            return new S3Client(config);
        case "ses":
            return new SESClient(config);
        default:
            throw new Error(`Unsupported AWS service: ${service}`);
    }
};

module.exports = { getAWSClient };