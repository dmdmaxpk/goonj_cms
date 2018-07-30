var env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        url: 'http://localhost:3000',
        port: '3003',
    },
    staging: {
        url: 'http://10.11.1.16:3000', 
        port: '3000',
    },
    production: {
        url: 'http://10.11.1.27:3000', 
        port: '3000',
    }
};
console.log("---", env);
if (env === 'development') config = config.development;
else if (env === 'staging') config = config.staging;
else config = config.production;

// Common configs in both envs
config.voddspath = "public/uploads/";

module.exports = config;
