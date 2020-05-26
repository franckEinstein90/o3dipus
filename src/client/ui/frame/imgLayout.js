/*****************************************************************************/
"use strict";

/*****************************************************************************/
const sizeToViewport = require('./sizeToViewport').sizeToViewport;
/*****************************************************************************/


const _drawBorders =  function( elt, contentViewport, viewportTemplate, eltCss, rowColInfo ) {        

    let borderSpecs = elt.data('borders');

    let topBorder = rowColInfo.row > 0 ; 
    let leftBorder = rowColInfo.col > 0 ;
    let bottomBorder =  (rowColInfo.row + rowColInfo.vertSpan) < (viewportTemplate.format.rows);
    let rightBorder = (rowColInfo.col + rowColInfo.horSpan) < (viewportTemplate.format.cols);

    if(borderSpecs && viewportTemplate.name in borderSpecs){
        let borderInstructions = borderSpecs[viewportTemplate.name];
        if (borderInstructions === "none"){
            leftBorder = false;
            bottomBorder = false;  
            topBorder = false; 
            rightBorder = false; 
        }
    }       
    let gutterWidth = contentViewport.width / 100; 
    if( rightBorder) {
        let odv = $([       //right border
            `<div class="gutter" style="left:${eltCss.left + eltCss.width}`,  
            `width:${gutterWidth}; top:${eltCss.top}`, 
            `height:${eltCss.height}"></div>`].join(';'));
        $("body").append(odv);
    }
    if( leftBorder ) {
        let odv = $([       //right border
            `<div class="gutter" style="left:${eltCss.left}`,  
            `width:${gutterWidth}; top:${eltCss.top}`, 
            `height:${eltCss.height}"></div>`].join(';'));
        $("body").append(odv);
    }

    if( topBorder ){
        let odh =  $([
            `<div class="gutter" style="top:${eltCss.top}`,  
                `height:${contentViewport.height/ 100}; left:${eltCss.left}`, 
                `width:${eltCss.width}"></div>`].join(';'));
            $("body").append(odh);
    } 
    
    if( bottomBorder ){
        let odh =  $([
            `<div class="gutter" style="top:${eltCss.top + eltCss.height}`,  
            `height:${contentViewport.height/ 100}; left:${eltCss.left}`, 
            `width:${eltCss.width + gutterWidth}"></div>`].join(';'));
        $("body").append(odh);
   }
}


let getRowColInfo  = function(elt, viewportTemplate){
    let pageLayoutName = viewportTemplate.name; 
    let rowColInfo = {};  
    let getValue = (info, defaultVal) => (info !== undefined && pageLayoutName in info) ? info[pageLayoutName] : defaultVal; 
    let rowInfo = elt.data('row'); 
    rowColInfo.row = getValue(rowInfo, 1) - 1; 

    let colInfo = elt.data('col'); 
    rowColInfo.col = getValue(colInfo, 1) - 1; 

    let vertSpanInfo = elt.data('vert-span');   //multiple cols? 
    rowColInfo.vertSpan = getValue(vertSpanInfo, 1)

    let horSpanInfo = elt.data('hor-span') ;
    rowColInfo.horSpan = getValue(horSpanInfo, 1); 

    return rowColInfo
}

const layoutImages = function( contentViewport , viewportTemplate, scenes){

    $('.visual-elt').each( function(){
        let eltId = $(this).attr('id');
        console.log(`placing element ${eltId}`);
        let viewportClients = $(this).data('include-in-viewport');
        let sceneInclude = $(this).data('scenes');
        let showInScene = false; 
        if( sceneInclude === undefined ) showInScene = true; 
        if( viewportClients && showInScene ){ 
            if(viewportClients.split(',').includes(viewportTemplate.name)){ //if this viewport includes this elt
                let rowColInfo =  getRowColInfo( $(this), viewportTemplate) 
                let eltCss = sizeToViewport( $(this), contentViewport, viewportTemplate ); 
                _drawBorders($(this), contentViewport, viewportTemplate, eltCss, rowColInfo)
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

