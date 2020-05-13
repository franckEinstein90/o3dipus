/*****************************************************************************
 *
 *
 * ***************************************************************************/
"use strict"
/*****************************************************************************/
const express = require('express')

const mountRoutingSystem = function( app ){
    return new Promise((resolve, reject)=>{
        app.routers = [];
        return resolve( app );
    })
}


module.exports = {
    mountRoutingSystem
}


