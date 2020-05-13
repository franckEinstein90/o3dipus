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

   

    const runComic = function( storyBoard ){
        let currentPage = storyBoard[0];
        let drawCurrentPage = function(){
        };
        drawCurrentPage();
    }

    runComic(app.storyBoard);
})






},{"../common/features":7,"./storyBoard/main.js":2,"./ui/main.js":4}],2:[function(require,module,exports){
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

const cssDef = require('../utils/cssDef').cssDef;
const divPerimeter = require('../utils/divPerimeter').divPerimeter; 

let bottomNavCss = cssDef({ 
   width: s => s.width, 
   height: s => s.orientation === 'portrait' ? 55 : 30 
})

let topNavCss    = cssDef({
   width: s => s.width,
   height:55
})


const _configureOuterLayout = function( app ){
    debugger

    let screen = divPerimeter( window ); 
    //figure out which type of viewPort fits this best 
    //let layoutType = figureOutLayout()
    //render surrounding ui 
    
    let contentViewport = {
        top: 0, 
        height: screen.height, 
        width: screen.width, 
        bottom: screen.height
    };

    if(app.ui.visualElements.topNav){
        let topNav = app.ui.visualElements.topNav( screen ); 
        contentViewport.top     += topNav.height; 
        contentViewport.height  -= topNav.height; 
        $('#topNav').css(topNav)
    }

    return contentViewport; 
}

const _configureLayout = function( app ){

    let contentViewport = _configureOuterLayout( app  );
    contentViewport.border = 'none';
    $('#images').css( contentViewport ); 

    $('#images').children("img").each( function(){
        $( this ).css({
            'border' : 'none'
        });
        let position = $( this ).position(); 
        let height   = $( this ).height();
        let width    = $( this ).width();
        let imgCss   = {
            width : (width / 1800) * contentViewport.width, 
            left : (position.left / 1800) * contentViewport.width, 
            top : (position.top / 1350) * contentViewport.height, 
            height: (height / 1350) * contentViewport.height
        }
        $( this ).css(imgCss)
    })
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

},{"../utils/cssDef":5,"../utils/divPerimeter":6}],4:[function(require,module,exports){
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

const addUiFeature = app => {
    ui(app);
    return app; 
}

module.exports = {
    addUiFeature
}

},{"./frame/main.js":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
