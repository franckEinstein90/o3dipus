/*****************************************************************************
 *
 *
 * ***************************************************************************/
"use strict"
/*****************************************************************************/
const express = require('express')
/*****************************************************************************/

const routingSystem = (function( ){

    let _router = express.Router()

    return{
        configure   : function( app ){
            app.express.use(_router)
        }
    }
})()

const addRouterFeature = function( app ){
    routingSystem.configure( app )
    
    return app
}

module.exports = {
    addRouterFeature
}


