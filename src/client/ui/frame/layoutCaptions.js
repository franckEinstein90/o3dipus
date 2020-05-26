"use strict"; 

//return the left and top on the screen, 
//given row,col coordinates
//and the contentFrame
//row and col are indexed at 1
const rowColToTopLeft = function( rowColPos, contentViewport, contentFrame ){
 
        let row_Zero_indexed = rowColPos.row - 1; 
        let col_Zero_indexed = rowColPos.col - 1;
        let pxLeft = contentViewport.left + 
                    ((contentViewport.width / contentFrame.format.cols) * col_Zero_indexed);
        let pxTop = contentViewport.top + 
                    ((contentViewport.height / contentFrame.format.rows ) * row_Zero_indexed);  

        let pxWidth  = contentViewport.width / contentFrame.format.cols 
        let pxHeight = contentViewport.height / contentFrame.format.rows
 
        return {
            top : pxTop,
            left: pxLeft, 
            bottom: pxTop + pxHeight, 
            right: pxLeft + pxWidth
        };  
}




const placeCaption = function ( jqueryElt, contentViewport, viewportTemplate ){
    let positionDescription = jqueryElt.data('position-description')[viewportTemplate.name];
    let pxOrigin = rowColToTopLeft(positionDescription.origin, contentViewport, viewportTemplate); 
    let pxDest = rowColToTopLeft(positionDescription.destination, contentViewport, viewportTemplate); 
    let captionArea = {
        left : (pxOrigin.left < pxDest.left ? pxOrigin.left : pxDest.left), 
        top: (pxOrigin.top < pxDest.top ? pxOrigin.top : pxDest.top), 
        right: (pxOrigin.right > pxDest.right ? pxOrigin.right : pxDest.right), 
        bottom : (pxOrigin.bottom > pxDest.bottom ? pxOrigin.bottom : pxDest.bottom )
    }
    debugger
}

const layoutCaptions = function( contentViewport , viewportTemplate, scenes){
    $(".caption").each( function(){
        let eltId = $(this).attr('id');
        let showInScene = false; 
        let viewportClients = $(this).data('include-in-viewport');
        let sceneInclude = $(this).data('scenes');
 
        console.log(`placing element ${eltId}`);
        if( sceneInclude === undefined ) showInScene = true; 
        if( viewportClients && showInScene ){ 
            if(viewportClients.split(',').includes(viewportTemplate.name)){ //if this viewport includes this elt
                return placeCaption( $( this ), contentViewport, viewportTemplate);  
            }
            $( this ).hide();
        }
    })
}


module.exports = {
    layoutCaptions
}
