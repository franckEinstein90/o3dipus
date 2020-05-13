/*******************************************************************************
* -------------------------------------
 *  expressStack.js 
 *
 *  sets up and configures the express setup stack
 ******************************************************************************/
"use strict"

/*****************************************************************************/
const express = require('express')
const cookieParser = require('cookie-parser')
const favicon = require('express-favicon')
const path = require('path')
/*****************************************************************************/

const configExpress = function( app ) {
    

    app.express =  express()

    require('@server/viewSystem').viewSystem({
        app     : app.express,  
        root    : app.root,
        layoutsDir:  path.join(app.metadata.root,'views','layouts/'),
        partialsDir: path.join(app.metadata.root,'views','partials/')
    })

    app.express.use(cookieParser());
    app.express.use(express.json())
    app.express.use(express.urlencoded({
        extended: false
    }))

    app.express.use(express.static(app.metadata.staticFolder))
    app.express.use(favicon(app.metadata.faviconPath))

    return app
}

module.exports = {
   configExpress 
}
