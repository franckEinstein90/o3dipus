"use strict"

const divPerimeter = function(divID){
    let height  =   $( divID ).height()
    let width   =   $( divID ).width()
    let orientation = height > width ? 'portrait' : 'landscape' 
     return {
        height,
        width,
        orientation
    }
}

module.exports = {
    divPerimeter
}