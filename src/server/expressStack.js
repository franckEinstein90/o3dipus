/*******************************************************************************
* -------------------------------------
 *  expressStack.js 
 *
 *  sets up and configures the express setup stack
 ******************************************************************************/
"use strict"

/*****************************************************************************/
const expressPackage	= require('express')
/*****************************************************************************/
const express = (function( app ){

    let _app = require('express')()
    _app.use(expressPackage.json())
    _app.use(expressPackage.urlencoded({
        extended: false
    }))

    return {

        use: x => _app.use(x)

    }

})()

const addExpressStackFeature =  app => {

    app.express = express 
    app.addFeature({
        label: 'expressStack',
        state: 'implemented'
    })
    return app

}

module.exports = {
   addExpressStackFeature
}
