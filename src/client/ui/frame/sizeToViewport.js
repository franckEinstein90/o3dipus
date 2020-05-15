"use strict";

const defaultCols = 3; 
const defaultRows = 3; 

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

const sizeToViewport = function( elt, contentViewport, contentFrame ){

        let rowInfo = elt.data('row')
        let colInfo = elt.data('col')
       /* 
        let vertSpan = elt.data('vert-span') || 1 ;     //multiple rows 
        let horSpan = elt.data('hor-span')   || 1 ;      //multiple column
        let defaultWidth = elt.data('width') || 600 ;   //default width a single frame 

        let borders = true;  
        et position = elt.position(); 
        

        let eltCss ={
            width: contentViewport.width / defaultCols * horSpan,  
            left: contentViewport.left + (contentViewport.width / defaultCols ) * col, 
            height: contentViewport.height / defaultRows * vertSpan, 
            top : contentViewport.top + (contentViewport.height / defaultRows) * row
        };  

        elt.css(eltCss);
        if( borders ) {
            _drawBorders(contentViewport, eltCss)
        }*/
}


module.exports = {
    sizeToViewport
}
