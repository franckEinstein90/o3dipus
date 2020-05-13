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
