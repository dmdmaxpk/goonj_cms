const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        videoServiceUrl: 'http://localhost:3000',
        port: '3003',
    },
    staging: {
        videoServiceUrl: 'http://localhost:3000',
        port: '3000',
    },
    production: {
        videoServiceUrl: 'http://localhost:3000',
        port: '3000',
    }
};

console.log("---", env);

if (env === 'development')  config = config.development;
if (env === 'staging')      config = config.staging;
if (env === 'production')   config = config.production;

// Common configs
// config.avatardir= path.join(__dirname, '/../../../../../qma/curated_content/transrated_content/images/');
config.avatardir= '/home/';
// config.videodir= path.join(__dirname, '/../../../../../qma/curated_content/raw_content/');
config.videodir= '/home/';

module.exports = config;
