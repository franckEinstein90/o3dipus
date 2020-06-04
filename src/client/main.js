/******************************************************************************
 * 
 ******************************************************************************/
"use strict"
/******************************************************************************/
/******************************************************************************/

const addSceneSystem = function( app ){
    app.scenes = {};
    
    app.scenes.queue = $('#page').data('scenes');
    if(app.scenes.queue){
        app.scenes.queue = app.scenes.queue.split(',').map(Number) ;
    } else {
        app.scenes.queue = [1];
    }
    app.scenes.next =  function(){
        debugger
    }
}

const setContentFormat = function( app ){

    let _contentFormats = $('#page').data('formats');

    return {
        available : _contentFormats 

    }
}



$(document).ready(function() {

    const app = {};
    require('../common/features').mountFeatureSystem( app );
    addSceneSystem(app); 

    app.contentFormats = setContentFormat( app ); 
    require('./ui/main.js').addUiFeature( app );

    let metadata = $("#page").data("meta");
    $("#pageTitle").text( `${metadata.book.title} - ${metadata.book.page}`);

    require('./ui/jsEffects/main.js').addJsEffects(app); 
})





