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

$(document).ready(function() {

    const app = {};
    require('../common/features').mountFeatureSystem( app );
    require('./ui/main.js').addUiFeature( app );
//    require('./storyBoard/main.js').storyBoard( app );

    app.storyBoard = ['A']
    app.run = function( storyBoard ){

        let metadata = $("#page").data("meta");
        $("#pageTitle").text( `${metadata.book.title} - ${metadata.book.page}`);

        let body = $("body");
        let universe = $("#universe");
        let solarsys = $("#solar-system");

        body.removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
            let setView = function(view) { universe.removeClass().addClass(view); };
            $(this).dequeue();
        })

   }

    app.run(app.storyBoard);
})





