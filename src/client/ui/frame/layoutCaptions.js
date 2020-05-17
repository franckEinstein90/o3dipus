"use strict"; 

const sizeToViewport = require('./sizeToViewport').sizeToViewport ; 

const layoutCaptions = function( contentViewport, contentFrame ){

   $(".caption").each( function(){
        sizeToViewport( $(this), contentViewport, contentFrame);
   });
}


module.exports = {
    layoutCaptions
}
