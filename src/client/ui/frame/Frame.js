/*****************************************************************************/
"use strict";

/*****************************************************************************/

const Scene = function({htmlId, colBegin, colEnd, rowBegin, rowEnd}){
    this.htmlId = htmlId;
    this.colBegin = colBegin; 
    this.colEnd = colEnd; 
    this.rowBegin = rowBegin; 
    this.rowEnd = rowEnd; 
}

const Frame = function(viewport){
    this.viewport = viewport
    this.elements = new Map();
}

Frame.prototype.store = function(id, css, rowColInfo){
    let row = rowColInfo.row;
    let col = rowColInfo.col; 
    let msg = `element id at row ${row + 1}, col ${col + 1 }`
    if (id === undefined) throw `undefined visual ${msg}`
    if(this.elements.has(id)) throw `duplicate frame id:${id}, ${msg}`
    let scene = new Scene({
        htmlId: id, 
        colBegin: col, 
        rowBegin: row, 
        colEnd: col + rowColInfo.horSpan,
        rowEnd: row + rowColInfo.vertSpan
    }); 
    this.elements.set(id, scene); 
}

Frame.prototype.getScene = function(htmlID){
    return this.elements.get(htmlID); 
}
/*****************************************************************************/
module.exports = {
    Frame
}


