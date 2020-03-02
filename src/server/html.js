/*****************************************************************************
 *
 *
 * ***************************************************************************/
"use strict"
/*****************************************************************************/
const hbs = require('express-handlebars')
/*****************************************************************************/

const hbsTemplate = (function(){

    return {
        compile : function({
        input, 
        output, 
        data){
            debugger
        }
    }
})()


const compileHandlebarsTemplate = function( app ){

    app.compileHandlebarsTemplate = (input, output, data) => 
    hbsTemplates.compile({
        input, 
        output, 
        data
    })

    app.addFeature({
        label : 'compileHandlebarsTemplate', 
        state : 'in dev' 
    })
}

module.exports = {
 compileHandlebarsTemplate
}


