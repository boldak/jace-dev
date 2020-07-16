/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var fs = require('fs');

var addDefaultAppConfigs = function () {
  fs.readdir('apps', function (err, files) {
    if (!err) {
      files.forEach(function (filename) {
        var match = /^(.*)\.json$/i.exec(filename);
        if (match) {
          var appName = match[1];
          fs.readFile('apps/' + filename, function (err, data) {
            if (!err) {
              sails.log.info('Preexisting app configuration found: apps/' + filename);
              var app = JSON.parse(data);
              app.name = appName;
              AppConfig.findOrCreate({name: appName}, app, function (err) {
                if (err) {
                  sails.log.warn('Error in AppConfig.findOrCreate app config during sails bootstrap: ' + err);
                }
                sails.log.debug("Create or find default app "+ appName)
              });
            } else {
              sails.log.warn('Error loading file: apps/' + filename + ', error: ' + err);
            }
          });
        }
      });
    } else {
      sails.log.warn('Error reading apps directory!');
    }
  });
};

var addDefaultPortalConfig = function(){
  PortalConfig.find({})
    .then(function(config){
      if(config.length>0){
        sails.log.debug("Portal Config: "+JSON.stringify(config[0].value))
        if(!config[0].value.pubService){
          PortalConfig.update({}, {value:{"defaultApp":config[0].value.defaultApp, "pubService":"http://localhost:8081"}})
          .then(function(conf){
              sails.log.debug("Update portal config:"+JSON.stringify(conf[0].value))
          })
        }

      }else{
          PortalConfig.create({value:{"defaultApp":"JACE", "pubService":"http://localhost:8081"}})
            .then(function(conf){
              sails.log.debug("Create default portal config:"+JSON.stringify(conf.value))
          })
      }
    })
} 

module.exports.bootstrap = function (cb) {
  sails.services.passport.loadStrategies();
  
  // add default admins; you can add others later on using mongodb console
  // for (var i = 0; i < sails.config.admins.length; ++i) {
  //   var adminEmail = sails.config.admins[i];

    sails.config.admins.forEach( adminEmail => {
      User.find({email: adminEmail}).then( res => {
        if(res.length == 0) {
          sails.log.debug("User " + adminEmail + " not registered")
        } else {
          User.update({email: adminEmail}, {isAdmin: true}).then( () => {
            sails.log.debug("Update default admin info for " + adminEmail)
          });    
        }
      })  
    })
    // sails.log.debug("Update default admin info for "+ adminEmail)
  // }

  AppConfig.native(function (err, collection) {
    // replace with createIndex after updating to MongoDB 3.*
    collection.ensureIndex({name: 1}, {unique: true}, function (err) {
      if (err) {
        sails.log.error('Error happened while setting up mongo index on appconfig model: ' + err);
      }
    });
  });

  addDefaultAppConfigs(); // allow running async, even after bootstrap is finished
  addDefaultPortalConfig();
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)


  console.log("Process enviroment:");
  _.forIn(process.env, (value,key) => {console.log(key+" = "+ value)})//.proxyHost+":"+sails.config.proxyPort);
  cb();
};
