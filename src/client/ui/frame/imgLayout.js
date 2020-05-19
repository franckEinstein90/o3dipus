/*****************************************************************************/
"use strict";

/*****************************************************************************/
const sizeToViewport = require('./sizeToViewport').sizeToViewport;
/*****************************************************************************/
const _drawBorders =  function( contentViewport, eltCss ) {        

    let odv = $([
                `<div class="gutter" style="left:${eltCss.left + eltCss.width}`,  
                `width:${contentViewport.width / 100}; top:${eltCss.top}`, 
                `height:${eltCss.height}"></div>`].join(';'));
        $("body").append(odv);

        if(eltCss.top + eltCss.height < contentViewport.height){
            let odh =  $([
                `<div class="gutter" style="top:${eltCss.top + eltCss.height}`,  
                `height:${contentViewport.height/ 100}; left:${eltCss.left}`, 
                `width:${eltCss.width}"></div>`].join(';'));
        
            $("body").append(odh);
        }
}


const layoutImages = function( contentViewport , viewportTemplate){
    $('.visual-elt').each( function(){
        let viewportClients = $(this).data('include-in-viewport');
        if( viewportClients ){ 
            if(viewportClients.split(',').includes(viewportTemplate.name)){
                let eltCss = sizeToViewport( $(this), contentViewport, viewportTemplate ); 
                _drawBorders(contentViewport, eltCss)
                $( this ).show(); 
            }
            else{
                $( this ).hide();
            }
        }
    })
    
}

module.exports = {
    layoutImages
}

