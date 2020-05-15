"use strict";
const sizeToViewport = require('./sizeToViewport').sizeToViewport;

const layoutImages = function( contentViewport , viewportTemplate){

    $('img').each( function(){
        let viewportClients = $(this).data('include-in-viewport');
        if( viewportClients ){ 
            if(viewportClients.split(',').includes(viewportTemplate.name)){
                sizeToViewport( $(this), contentViewport, viewportTemplate ); 
            }
        }
    })
    
}

module.exports = {
    layoutImages
}

