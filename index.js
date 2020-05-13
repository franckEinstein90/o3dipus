/*****************************************************************************
 *
 *
 * ***************************************************************************/
"use strict"
/*****************************************************************************/
require('module-alias/register');
const path = require('path')
/*****************************************************************************/



const app = { 
   metadata : {
      name        :  'O3dipus', 
      root        :  __dirname, 
      staticFolder:  path.join(__dirname, 'public'),
      faviconPath : __dirname + '/public/LOGO139x139.png'
   }
}

require('@common/features').mountFeatureSystem( app )
require('@server/expressStack').configExpress( app )
require('@server/routingSystem').mountRoutingSystem( app )
.then( require('@server/server').httpServer )
.then( app => {

   app.routers.forEach( path => {
       app.tools.say(`setting path: ${path.route}`);
       app.express.use( path.route, path.router );
   })

   app.server.start()

}) 


