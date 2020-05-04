/******************************************************************************
 * 
 ******************************************************************************/
"use strict"
/******************************************************************************/
/******************************************************************************/


const ui = function( app ){

    let _appUiFrame = require('./frame/main.js').uiFrameFeature( app )

    return {
        frame : _appUiFrame
    }
}

const addUiFeature = app => {
    app.ui = ui(app);
    return app; 
}

module.exports = {
    addUiFeature
}
