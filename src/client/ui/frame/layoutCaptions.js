"use strict"; 

const sizeToViewport = require('./sizeToViewport').sizeToViewport ; 

const layoutCaptions = function(contentViewport){

   $(".caption").each( function(){
        sizeToViewport( $(this), contentViewport);
        $(this).css({
            border : '3px solid white', 
            width: '300px', 
            height: '70px'
        })
   });
}


module.exports = {
    layoutCaptions
}
