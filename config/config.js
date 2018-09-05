const env = process.env.NODE_ENV || 'development';

let config = {
    development: {
        // videoServiceUrl: 'http://localhost:3000',
        videoServiceUrl: 'http://10.3.7.101:3000',
        port: '3003',
        transcodeServiceUrl: 'http://10.3.7.12:3011/v1/api/transcode'
    },
    staging: {
        videoServiceUrl: 'http://localhost:3000',
        port: '3000',
        transcodeServiceUrl: 'http://10.3.7.12:3011/v1/api/transcode'
    },
    production: {
        videoServiceUrl: 'http://10.3.7.101:3000',
        port: '4000',
        transcodeServiceUrl: 'http://10.3.7.12:3011/v1/api/transcode'
    },
    // TODO: Remove this after removing old CMS/API and changing NODE_ENV to production
    productionlocal: {
        videoServiceUrl: 'http://10.3.7.101:3000',
        port: '4000',
        transcodeServiceUrl: 'http://10.3.7.12:3011/v1/api/transcode'
    }
};

console.log("---", env);

if (env === 'development')  config = config.development;
if (env === 'staging')      config = config.staging;
if (env === 'production')   config = config.production;
// TODO: Same removal
if (env === 'productionlocal')   config = config.productionlocal;

// Common configs
// Dir for Videos Upload
config.video_dir= '/qma/telenor/videos/';

// Dir for Thumbnails Upload
config.thumb_dir= '/qma/telenor/thumbs';

module.exports = config;
