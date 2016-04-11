var config_dev = {};
config_dev.mongo_url = 'mongodb://localhost:27017/jira_test';
config_dev.server_port = 3000;
config_dev.environment = 'debug'

var config_prod = {};
config_prod.mongo_url = 'mongodb://localhost:27017/jira';
config_prod.server_port = 3000;
config_prod.environment = 'debug'

module.exports = function() {

  console.log('env: ' + process.env.NODE_ENV);

  if(!process.env.NODE_ENV){
    console.log("NODE_ENV not set. Use it with 'production' or 'development'. Example:");
    console.log("export NODE_ENV='production'");
    console.log("NODE_ENV will be set to 'production'");
    //process.exit(1);
    process.env.NODE_ENV = 'production';
  }
  switch (process.env.NODE_ENV) {
  case 'development':
    return config_dev;

  case 'production':
    return config_prod;

  default:
    return config_dev;
  }
};
