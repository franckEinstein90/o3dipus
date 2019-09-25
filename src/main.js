const events = require('./events').events
const dateUtils = require('./dateUtils').dateUtils
const timeSpanUtils = require('./dateUtils').timeSpanUtils

/******************************************************************************
 * The page is bordered at the top with a 4 rows widget and 
 * at the bottom with a  2 rows widget. 
 * ****************************************************************************/
const colsNumber = 25, 

      EventChain = (tag) => {
            let evRegistrar = new events.Registrar();
            for (let i = 0; i < colsNumber; i++) {
                let ev = new events.Event();
                if (i % 4 === 0) {
                    ev.on();
                }
                evRegistrar.register(ev);
            }
            evRegistrar.tag = tag;
            return evRegistrar;
        }

$(document).ready(function() {
        //pageEventsTop = EventChain(4,25, "#events");
    let pageEventsTop = ["blue", "blue", "blue", "blue"].map(
            x => EventChain(x)),

        pageEventsBottom = ["red", "white", "brown"].map(
            x => EventChain(x)),

        makeTableRow = (color, x) => `<tr style="background-color:${color}">${x}</tr>`,


        printEvents = (eventChain, tableInnerId, backgroundColor) => {
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
               $("#events").empty();
               pageEventsTop.forEach(x => {
                    printEvents(x, "#events", "orange");
                    randSwitch(x)
                })
        },

        timer = new timeSpanUtils.Timer(printBanners, {
            fps: 1 });

    timer.start();


});
