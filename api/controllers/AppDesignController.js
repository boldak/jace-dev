let path = require('path')
let fs = require('fs')


	
module.exports = {

	getIndex (req,res) {
		if(req.isSocket) console.log("Connect via socket ", req.socket.id)
		// console.log(req)	
		let index =  path.resolve(sails.config.appPath, '.tmp/public/index.html')
		let portal
		fs.readFile(index, 
          function (err, data) {
          	let page = data.toString()
    		let defaultApp;
    
		    let cookie = (req.headers.cookie) 
		          ? _.object(
		            req.headers.cookie.split(";").map( d => {
		              let r = d.split("=")
		              return [r[0].trim(),r[1]]
		            })
		          )
		          : {}  
    

		    PortalConfig
		      .find({})
		      .then(config => {
		        // console.log(config[0].value.defaultApp)
		        portal = {
		        	config: config[0].value
		        }
		        defaultApp = config[0].value.defaultApp
		        return defaultApp
		      })
		      .then(defaultApp => {
		        // console.log("get config for ", req.params.appName || defaultApp)
		          return AppConfig
		                  .findOneByName(req.params.appName || defaultApp)
		                  .populate('owner')
		      })
		      .then( app => {
		        // console.log("get",JSON.stringify(app))
		        AppConfig.destringifyConfigs(app);

		        let userInfo = _.extend(
		            ( (req.user) ? _.clone(req.user) : {} ),
		            {
		              isLoggedIn: !_.isUndefined(req.user),
		              isOwner: AppConfig.isOwner(app, req.user),
		              isCollaborator: AppConfig.isCollaborator(app, req.user)
		            }) 

		        app.defaultApp =  defaultApp;

		        let requireWidgets = [];
		        
		        if(app.pages){
		          app.pages.forEach( p => {
		            let ht = []
		            _.values(p.holders).forEach( h => {
		              ht = ht.concat(h.widgets.map(w => w.type))
		            })
		            requireWidgets = requireWidgets.concat(ht)
		          })  
		        }  
		        
		          
		        

		        if(app.skin) {
		          _.values(app.skin.holders).forEach( h => {
		              requireWidgets = requireWidgets.concat(h.widgets.map(w => w.type))
		            })
		        }  

		        requireWidgets = _.uniq(requireWidgets)
		        // console.log(requireWidgets)


		       let config = {
		          app: app,


		          appMode: cookie[`${app.id}-mode`],
		          require_Mermaid: _.findIndex(requireWidgets, w => w.startsWith("flowchart-")) > -1,
		          require_Echarts: _.findIndex(requireWidgets, 
		              w => 
		                        /\-chart\-/gi.test(w) 
		                    ||  w.startsWith("ds-") 
		                    ||  w.startsWith("tree-")
		                    ||  w.startsWith("form-")
		                    ||  w.startsWith("question-")
		              ) > -1,
		          require_Ace: _.findIndex(requireWidgets, w => w == "ds-explorer-widget") > -1,
		          userInfo: userInfo,
		          ownerInfo: !app.owner ? {
		            exists: false
		          } : {
		            id: app.owner.id,
		            name: app.owner.name,
		            email: app.owner.email,
		            photo: app.owner.photo,
		            exists: true
		          },
		          publicAppConfig: {
		            id: app.id,
		            name: app.name,
		            devService: portal,

		            user: userInfo,
		          
			          author: !app.owner ? {
			            exists: false
			          } : {
			            id: app.owner.id,
			            name: app.owner.name,
			            email: app.owner.email,
			            photo: app.owner.photo,
			            exists: true
			          },
		            // skinName: app.skinName,
		            // appWidgets: app.appWidgets || [],
		            collaborations: app.collaborations || [],
		            
		            skin: app.skin || {
		                                holders:{
		                                    AppHeader:{widgets:[]},
		                                    AppFooter:{widgets:[]}
		                                  }
		                              },

		            pages: app.pages || [],
		            theme: app.theme,
		            icon: app.icon,
		            i18n: app.i18n,
		            title: app.title,
		            description: app.description,
		            keywords: app.keywords,
		            // dps: app.dps,
		            dpsURL: app.dpsURL || "",
		            // importedFromURL: app.importedFromURL,
		            // importedFromAuthor: app.importedFromAuthor,
		            isPublished: app.isPublished
		          }
		       }


		       



		       let script = `
		       			  var devService = 	${JSON.stringify(config.publicAppConfig.devService)}
		       		   	  var user = ${JSON.stringify(config.userInfo)};
					      var author = ${JSON.stringify(config.ownerInfo)};
					      var appName = "${config.app.name}";
					      var initialConfig = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(config.publicAppConfig))}"));
					      var dpsURL = initialConfig.dpsURL;
					      var __application_Config_Key =  "${config.publicAppConfig.id}-application-config";
						  var __application_Mode_Key =  "${config.publicAppConfig.id}-mode";
						  sessionStorage.setItem(__application_Config_Key, JSON.stringify(initialConfig))

		       `

		       // let script_ = _.template(script)(config)
		       // console.log("SCRIPT",script)

		       return res.send(
		       	page
		       		.replace("//__appconfig", script)
		       		.replace("//appTitle",config.app.title) //_.template(script)(config))
		       )




		      })
		      .catch(function (err) {
		        console.log("ERROR", err)
		        sails.log.silly(err);
		        return res.notFound();
		      })
          })	
	}
}	





