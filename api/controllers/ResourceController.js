var mime = require('mime');
var path = require('path');
var fs = require("fs");





module.exports = {

  getList: function (req,res){
    Resource.find({}).then(function(obj) {
      // console.log("LIST", obj)
      if(!obj || obj.length == 0){
        return res.send([]);
      } else {
        let result = obj.map( item => ({
          // size: (item.data) ? item.data.length() : "n/a",
          mime: mime.lookup(path.basename(item.path)),
          ext: path.parse(item.path).ext.substring(1),
          url: "./api/resource/"+item.path,
          path: item.path,
          owner: item.owner
        }))
        //   console.log(item.data.length)
        //   item.size = item.data.length;
        //   console.log(item.size)
        //   delete item.data;
        //   item.mime = mime.lookup(path.basename(item.path));
        //   var p = path.parse(item.path)
        //   item.ext = p.ext.substring(1);
        //   item.url = "./api/resource/"+item.path;

        // })
        return res.send(result)
      }  
    })
  },

  get: function (req, res) {
    var resourcePath = req.params.path;
    Resource.findOne({"path":resourcePath}).then(function(obj){
      if(!obj){
        return res.notFound();
      }
      // console.log("get resource: ", obj.path);
      // console.log("content-type: ", mime.lookup(path.basename(obj.path)));
      // console.log("buffer", obj.data.buffer);
      res.setHeader('Content-type', mime.lookup(path.basename(obj.path)));
      return res.send(obj.data);
      // return res.send(obj.data.buffer);
    })
  },

  delete: function (req, res) {
    resourcePath = req.params.path;
    Resource.destroy({"path":resourcePath}).then(function(obj){
      return res.ok();
    })
  },

  rename: function(req,res){
    var params = req.body;
    var oldPath = params.oldPath;
    var newPath = params.newPath;
    var app = params.app;
    Resource.findOne({"path":oldPath}).then(function(obj){
      if(!obj){
        return res.ok();
      }else{
        Resource.update({id:obj.id},{"path":newPath}).then(function(){
          return res.ok();
        })
      }
    })
    
  },

  update: function (req, res) {

    var app = req.param("app");
    
    req.file('file').upload({
        dirname: path.resolve(sails.config.appPath, '.tmp/uploads')
      },
      function (err, uploadedFiles) {
        
        if (err) {
          // console.log("!!!!!!!!!!!", err.toString())
          // return res.send(500,err.toString())
          return res.negotiate(err);
        }

        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        filePath = app+"-"+uploadedFiles[0].filename;
        // console.log("UPLOAD",uploadedFiles[0].fd)
    
        fs.readFile(uploadedFiles[0].fd, 
          function (err, data) {
            
            if (err) {
              sails.log.error('Error reading file: ' + filePath);
              sails.log.error(err.toString())
            }
            
            Resource
              .findOne({"path":filePath})
              .then(function(obj){
                if(obj){
                  Resource
                    .update({id:obj.id},{"path":filePath, "data":data, "owner":req.user.name})
                    .then(function(){
                          return res.ok()
                    })
                }else{
                  Resource
                    .create({"path":filePath, "data":data,"owner":req.user.name})
                    .then(function(obj){
                          return res.ok()
                  })
                }    
              });
            }); 
      });  
    }
};


