"use strict";

const cssDef = require('../utils/cssDef').cssDef;

let bottomNavCss = cssDef({ 
   width: s => s.width, 
   height: s => s.orientation === 'portrait' ? 55 : 30 
})

let topNavCss    = cssDef({
   width: s => s.width,
   height:55
})


const _configureOuterLayout = function( ){

   //figure out which type of viewPort fits this best 
   let layoutType = figureOutLayout()
   //render surrounding ui 

   return {
      configureLayout : function( storyBoard ){
         //get current frame of story
         //get current column of frame
         //render story for layoutType, story.frame, story.frame.column 
      }
   }
}

const _configureLayout = function( app ){

   let contentViewport = _configureOuterLayout( )
   contentViewport.configureLayout( app.storyBoard )
}


const uiFrameFeature = function( app ){

   return {
      topNav : topNavCss, 
      bottomNav : bottomNavCss,
      resize : function(){
         _configureLayout( app )
      }
   };
}

module.exports = {
   uiFrameFeature
}