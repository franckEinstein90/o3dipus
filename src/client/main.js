/******************************************************************************
 * 
 ******************************************************************************/
"use strict"
/******************************************************************************/
/******************************************************************************/

/******************************************************************************
 * The page is bordered at the top with a 4 rows widget and 
 * at the bottom with a  2 rows widget. 
 * ****************************************************************************/



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


$(document).ready(function() {

    const app = {};
    require('../common/features').mountFeatureSystem( app );
    addSceneSystem(app); 
    require('./ui/main.js').addUiFeature( app );

    let metadata = $("#page").data("meta");
    $("#pageTitle").text( `${metadata.book.title} - ${metadata.book.page}`);

    let body = $("body");
    let universe = $("#universe");
    let solarsys = $("#solar-system");

    body.removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
        let setView = function(view) { universe.removeClass().addClass(view); };
            $(this).dequeue();
        })


})





