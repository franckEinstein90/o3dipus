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
    require('../common/features').addFeatureSystem( app );
    require('./ui/main.js').addUiFeature( app );
    require('./storyBoard/main.js').storyBoard( app );

   

    const runComic = function( storyBoard ){
        let currentPage = storyBoard[0];
        let drawCurrentPage = function(){
            debugger
        };
        drawCurrentPage();
    }

    runComic(app.storyBoard);
})






},{"../common/features":5,"./storyBoard/main.js":2,"./ui/main.js":4}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
/******************************************************************************
 * 
 ******************************************************************************/
"use strict"
/******************************************************************************/
/******************************************************************************/


const ui = function( app ){

    let _appUiFrame = require('./frame/main.js').uiFrameFeature( app )

    return {
        frame : _appUiFrame
    }
}

const addUiFeature = app => {
    app.ui = ui(app);
    return app; 
}

module.exports = {
    addUiFeature
}

},{"./frame/main.js":3}],5:[function(require,module,exports){
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

})()

const addFeatureSystem = function( app ){
    app.features = featureSystem
    app.addFeature = feature => featureSystem.addFeature( feature )
    app.implements = featureLabel => featureSystem.implements(featureLabel)
}

module.exports = {
    addFeatureSystem
}

},{}]},{},[1]);
