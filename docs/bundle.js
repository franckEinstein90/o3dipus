(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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






},{"../common/features":10,"./storyBoard/main.js":2,"./ui/main.js":7}],2:[function(require,module,exports){
"use strict";


const storyBoard = function( app ){
   app.storyBoard = [ {
       typeA:['$A', '$B'], 
       typeB:['$A$B', "$B$C"], 
       typeC:['$A$C']
   }];
}

module.exports = {
   storyBoard
}
},{}],3:[function(require,module,exports){
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


},{"./sizeToViewport":6}],4:[function(require,module,exports){
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

},{"./sizeToViewport":6}],5:[function(require,module,exports){

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

    let contentFormats = $('#contentFormats').data('formats');
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

    debugger
    _configureMargins(contentViewport);
    layoutImages(contentViewport, contentFrame); 
    
    sizeToViewport( $('#universe'), contentViewport);
    _layoutGraphs(contentViewport);
    layoutCaptions( contentViewport); 
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

},{"../utils/cssDef":8,"../utils/divPerimeter":9,"./imgLayout":3,"./layoutCaptions":4,"./sizeToViewport":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
/******************************************************************************
 * 
 ******************************************************************************/
"use strict"
/******************************************************************************/
/******************************************************************************/


const ui = function( app ){
    app.ui = {}; 
    app.ui.frame = require('./frame/main.js').uiFrameFeature( app )
}


const resizeUI = function( app ){
    app.ui.visualElements.resize();
}

const addUiFeature = app => {
    ui(app);
    $(window).resize(()=>{
        resizeUI( app ); 
    })
    return app; 
}

module.exports = {
    addUiFeature
}

},{"./frame/main.js":5}],8:[function(require,module,exports){
"use strict";

const cssDef = options => screen => {

   let assign = (value, property) => {
       if(typeof value[property] === 'function'){
           return value[property](screen)
       } else {
           return value[property]
       }
   }
   let height = 0
   let width = 0

   if(options.width) width = assign( options, 'width')
   if(options.height) height = assign( options, 'height')

   return {
       left: 0, 
       top: 0, 
       width, 
       height
   }    
}

module.exports = {
    cssDef
}

},{}],9:[function(require,module,exports){
/*****************************************************************************/
"use strict"
/*****************************************************************************/

const divPerimeter = function(divID){
    let returnObject =    {
        height: $( divID ).height(), 
        width:  $( divID ).width()
    }; 

    returnObject.orientation = returnObject.height > returnObject.width 
        ? 'portrait' 
        : 'landscape'; 

    return returnObject; 
}

module.exports = {
    divPerimeter
}

},{}],10:[function(require,module,exports){
"use strict"

const featureSystem = (function(){

    let _features       = new Map()
    let _reqMajor       = 0
    let _requirements   = new Map()

    return {

        get featureList()  {
            let list = {} 
            _features.forEach((value, key)=>{
                list[key] = value
            })
            return list
        },

        implements  : function(featureLabel){
            if(!_features.has(featureLabel)) return false
            return(_features.get(featureLabel).state === 'implemented')
        }, 

        addRequirement  : function({
            req, 
            parentReq
        }) {
            if( parentReq === undefined || parentReq === null){
                _reqMajor += 1
                _requirements.set(  _reqMajor, req)
            }
        },

        includes: featureName => {
            if(_features.has(featureName)) return _features.get(featureName)
            return false
        },

        addFeature : function({
            label, 
            description, 
            state
        }){
            if(featureSystem.includes(label)){
                throw "feature already exists"
            }
            if(description === undefined || description === null){
                description = "no description"
            }
            _features.set(label, {state, description})
        }
    }

})();

const mountFeatureSystem = function( app ){
    app.features = featureSystem;
    app.addFeature = feature => featureSystem.addFeature( feature );
    app.implements = featureLabel => featureSystem.implements(featureLabel);
}

module.exports = {
    mountFeatureSystem 
};

},{}]},{},[1]);
