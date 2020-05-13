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

   

    const runComic = function( storyBoard ){
        let currentPage = storyBoard[0];
        let drawCurrentPage = function(){
        };
        drawCurrentPage();
    }

    runComic(app.storyBoard);
})





