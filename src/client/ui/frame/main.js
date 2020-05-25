
/*****************************************************************************/
"use strict";
/*****************************************************************************/
const cssDef         = require('../utils/cssDef').cssDef ;
const divPerimeter   = require('../utils/divPerimeter').divPerimeter ; 
const layoutImages   = require('./imgLayout').layoutImages ;
const layoutCaptions = require('./layoutCaptions').layoutCaptions ; 
const sizeToViewport = require('./sizeToViewport').sizeToViewport ; 
/*****************************************************************************/

let bottomNavCss = cssDef({ 
   width: s => s.width, 
   height: s => s.orientation === 'portrait' ? 55 : 30 
});

let topNavCss    = cssDef({
   width: s => s.width,
   height:55
});


const _configureOuterLayout = function( app ){
    let screen = divPerimeter( window ); 
    //figure out which type of viewPort fits this best 
    //let layoutType = figureOutLayout()
    //render surrounding ui 
    
    let contentViewport = {
        top: 0,
        left: 0,  
        height: screen.height, 
        width: screen.width, 
        bottom: screen.height
    };

    if(app.ui.visualElements.topNav){
        let topNav = app.ui.visualElements.topNav( screen ); 
        contentViewport.top += topNav.height; 
        contentViewport.height -= topNav.height; 
        $('#topNav').css(topNav);
    }

    return contentViewport; 
}
const _layoutGraphs = function(contentViewport){

    $(".diagram").each( function(){

        sizeToViewport( $(this), contentViewport );
        let diagramData = $(this).data("diagram");
        let edgeData = $(this).data("edges"); 

        let nodes = new vis.DataSet(diagramData.nodes); 
        let edges = new vis.DataSet(edgeData.edges); 

    let container = document.getElementById('apolloSystemMap')

    let data = {
        nodes, 
        edges
    }

    let options = {
        nodes   : {
            shadow:true, 
            font: '15px yellow'
        }, 
        edges   : {
            arrows  : {
                to:true 
            }
        }
    }

    let trip = new vis.Network(container, data, options)
    })
}

const _configureMargins = function(contentViewport){

    $('#marginLeft').css({
        top: contentViewport.top, 
        width: contentViewport.left, 
        height:contentViewport.height
    })
     $('#marginRight').css({
        top: contentViewport.top, 
        width: contentViewport.left, 
        height:contentViewport.height, 
        left: contentViewport.left + contentViewport.width
    })

}

   
  
const fitToTemplate = function(contentMaxHeight, contentMaxWidth) {
    debugger
    let contentFormats = $('#page').data('formats');
    let contentArea = contentMaxHeight * contentMaxWidth;
    let wastedSpace = (width, height) => contentArea - (width * height)
    let best = { wasted: contentArea };  
    Object.entries(contentFormats).forEach( format => {
           let desc = format[1]; 
           let contentWidth = contentMaxWidth; 
           let contentHeight = contentMaxWidth / desc.width * desc.height; //only handling landscape for now
           if(contentHeight > contentMaxHeight){
                contentWidth = contentMaxHeight * desc.width / desc.height; 
                contentHeight = contentMaxHeight;   
           }
           let w = wastedSpace(contentWidth, contentHeight); 
            if (w < best.wasted){
                best.name = format[0]
                best.format = format[1]
                best.wasted = w; 
                best.dimensions = {contentWidth, contentHeight}
            }

       })

    return best;  
}

const _configureLayout = function( app ){
    $(".gutter").remove();
    let contentViewport = _configureOuterLayout( app  );
    let maxHeight = contentViewport.height;
    let maxWidth = contentViewport.width;
    /* now we know how much real estate we have */

    let contentFrame     = fitToTemplate( maxHeight, maxWidth );  
    let marginTotalWidth = contentViewport.width - contentFrame.dimensions.contentWidth; 
    contentViewport.left = marginTotalWidth / 2; 
    contentViewport.width = contentFrame.dimensions.contentWidth; 
    contentViewport.height = contentFrame.dimensions.contentHeight; 

    _configureMargins(contentViewport);
    layoutImages(contentViewport, contentFrame); 
//    sizeToViewport( $('#universe'), contentViewport, contentFrame);
//    _layoutGraphs(contentViewport);
    layoutCaptions( contentViewport, contentFrame ); 
}


const uiFrameFeature = function( app ){

    app.ui.visualElements = { 
        topNav    : topNavCss, 
        bottomNav : bottomNavCss,
        resize    : _ =>  _configureLayout( app )
    };
    
    _configureLayout( app ); 
    return app; 
}

module.exports = {
   uiFrameFeature
}
