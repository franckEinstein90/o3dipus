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
const events = require('../common/events').events
const dateUtils = require('../common/dateUtils').dateUtils
const timeSpanUtils = require('./../common/dateUtils').timeSpanUtils

const EventChain = function(tag, colsNumber){

    let evRegistrar = new events.Registrar()
    for(let i=0; i<colsNumber; i++){
        let ev = new events.Event()
        if(i % 4 === 0){
            ev.on()
        }
        evRegistrar.register(ev)
    }
    return evRegistrar
}


$(document).ready(function() {
    
    const app = {}
    require('../common/features').addFeatureSystem( app )
    require('./ui/ui.js').addUiFeature( app )

    let pageEventsTop = ['blue'].map( color => EventChain(color, 25))
    let pageEventsBottom = ['red'].map( color => EventChain(color, 25))
    let makeTableRow = (color, content) => `<tr style="background-color:${color}">${content}</tr>`

    let printEvents = (eventChain, tableInnerId, backgroundColor) => {
            let eventTableCells = "",
                decorateTD = x => x.isOn() ? ` style = "background-color:${backgroundColor}"` : "";
                eventChain.forEach(ev => eventTableCells += `<td ${decorateTD(ev)}>&nbsp;</td>`);
                $(tableInnerId).append(makeTableRow("white", eventTableCells));
        },

        randSwitch = (registrar) => {
            registrar.forEach(function(ev) {
                if (Math.floor(Math.random() * 3)) {
                    ev.off();
                } else {
                    ev.on();
                }
            })
        },

        printBanners = function(){

               $("#events").empty()
               $('#eventsBottom').empty()

                pageEventsTop.forEach(x => {
                    printEvents(x, "#events", "orange");
                    randSwitch(x)
                })

               pageEventsBottom.forEach(x => {
                    printEvents(x, "#eventsBottom", "orange");
                    randSwitch(x)
                })

        },

        timer = new timeSpanUtils.Timer(printBanners, {
            fps: 1 });

    timer.start();
})





