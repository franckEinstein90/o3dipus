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
    require('./storyBoard/main.js').storyBoard( app );


  var body = $("body"),
      universe = $("#universe"),
      solarsys = $("#solar-system");

  var init = function() {
        body.removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
        $(this).dequeue();
    });
  };

  var setView = function(view) { universe.removeClass().addClass(view); };

 init();


    const runComic = function( storyBoard ){
        let currentPage = storyBoard[0];
        let drawCurrentPage = function(){
        };
        drawCurrentPage();
    }

    runComic(app.storyBoard);
})





