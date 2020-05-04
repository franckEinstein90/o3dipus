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