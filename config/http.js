/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

console.log(`NODE_ENV=${process.env.NODE_ENV}`)
module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {
   order: [
     'startRequestTimer',
     'cookieParser',
     'session',
     'myRequestLogger',

     'bodyParser',
     'handleBodyParserError',
     'compress',
     'methodOverride',
     'poweredBy',
     '$custom',
     'router',
     'cache',
     
     'www',
     'favicon',
     '404',
     '500'
   ],

   bodyParser: (function () {
       var opts = {limit:"10mb", parameterLimit:10000};
       var fn;

       // Default to built-in bodyParser:
       try {
        fn = require(`${(process.env.NODE_ENV == "production") ? "" : "sails/node_modules/"}skipper`);
        return fn(opts); 
       } catch (e){
        fn = require("skipper");
        return fn(opts); 
       }
       
     })()
  }
}  

//   middleware: {

//   **************************************************************************
//   *                                                                          *
//   * The order in which middleware should be run for HTTP request. (the Sails *
//   * router is invoked by the "router" middleware below.)                     *
//   *                                                                          *
//   **************************************************************************

//     order: [
//      'startRequestTimer',
//      'cookieParser',
//      'session',
//      'myRequestLogger',
//      'bodyParser',
//      'handleBodyParserError',
//      'compress',
//      'methodOverride',
//      'poweredBy',
//      'router',
//      'cache',
//      'www', // custom www handler in env/production.js
//      'favicon',
//      '404',
//      '500'
//     ]
//   }
// };
