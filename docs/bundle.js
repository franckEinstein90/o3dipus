(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/******************************************************************************
 * The timeSpanUtils module defines several utilites related to time ranges. 
 * It includes:
 *
 *  - A TimeSpan object that abstracts the concept of a length of a span 
 *    between two time markers. 
 *
 *  - A Timer object
 *
 ******************************************************************************/

const timeSpanUtils = (function() {
    const secondSpanMs = 1000,
        daySpanMs = secondSpanMs * 60 * 60 * 24,
        monthAfter = function(monthAsDate) {
            return new Date(monthAsDate.getFullYear(),
                monthAsDate.getMonth() + 1, 1);
        };

    return {
        isValidDate: function(date) {
            return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
        },
        /**************************************************
         * Includes definition for the following objects: 
         * - TimeSpan
         * - Timer
         *************************************************/
        TimeSpan: function(beginDate, endDate, timeStep) {
            if (!timeSpanUtils.isValidDate(beginDate)) {
                timeSpanUtils.invalidDate(beginDate)
            }
            if (!timeSpanUtils.isValidDate(endDate)) {
                timeSpanUtils.invalidDate(endDate)
            }
            if (endDate <= beginDate) {
                throw TimeSpan.invalidDateSpan
            }
            this.beginDate = beginDate;
            this.endDate = endDate;
            this.step = timeStep;

            return this; 
        },

        Timer: function(onPeriodBegin, settings) {
            this.onBegin = onPeriodBegin;
            this.settings = settings;
            this.timer = null;
            this.fps = settings.fps || 30;
            this.interval = Math.floor(1000 / this.fps);
            this.timeInit = null;

            return this;
        },

        day: function() {
            return daySpanMs;
        },

        month: function(monthAsDate) {
            let thisMonth = new Date(monthAsDate.getFullYear(), monthAsDate.getMonth(), 1);
            return monthAfter(thisMonth).getTime() - thisMonth.getTime();
        },

        /*****************************************************
         * Errors and exceptions
         ****************************************************/
        invalidDate: function(aDate) {
            throw `${aDate} is not a valid date`
        },
        invalidDateSpan: "Invalid Date Span"
    };
})();

timeSpanUtils.TimeSpan.prototype = {

    setStep: function(step) {
        this.step = step;
    },

    includes: function(targetDate) {
        //returns true if the the timespan instance includes the targetDate
        let targetYear = targetDate.getFullYear();
        if (this.beginDate.getFullYear() <= targetYear && this.endDate.getFullYear() >= targetYear) {
            if (this.step === "year") {
                return true;
            }
            let targetMonth = targetDate.getMonth();
            if (this.beginDate.getMonth() <= targetMonth && this.endDate.getMonth() >= targetMonth) {
                if (this.step === "month") {
                    return true;
                }
                let targetDay = targetDate.getDate();
                if (this.beginDate.getDate() <= targetDay && this.endDate.getDate() >= targetDay) {
                    if (this.step === "day") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}

timeSpanUtils.Timer.prototype = 
{
    run: function()
    {
        let $this = this; 
        this.onBegin();
        this.timeInit += this.interval; 
        this.timer = setTimeout(
            function(){$this.run()}, 
            this.timeInit - (new Date).getTime()
        ); 
    }, 
    start: function()
    {
        if(this.timer == null){
            this.timeInit = (new Date).getTime();
            this.run();
        }
    }, 
    stop: function()
    {
        clearTimeout(this.timer); 
        this.timer = null;
    }
} 





/******************************************************************************
* dateUtils namespace 
*******************************************************************************/
const dateUtils = (function() {

    let theMonths = [   "January", "February", "March", 
                        "April", "May", "June", "July", 
                        "August", "September", "October", 
                        "November", "December"],

        dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },

        separator = "_",

        pad0 = function(digit) {
            return digit.toString().padStart(2, '0');
        };

    return {

        setSeparator: function(sep) {
            separator = sep;
        },

        firstDayOfMonth: function(theYear, monthIdx) {
            return new Date(theYear, monthIdx, 1).getDay();
        },

        monthLength: function(theYear, theMonth, timeMeasure) {
            let thisMonth = new Date(theYear, theMonth, 1);
            return Math.ceil(timeSpanUtils.month(thisMonth) / timeSpanUtils.day());
        },

        monthIdxToStr: function(monthIdx) {
            return theMonths[monthIdx];
        },
        dayStamp: function() {
            if (arguments.length == 0) { //if the function is called without arguments, returns today as dateStamp
                let d = new Date();
                return dateUtils.dayStamp(d.getFullYear(), d.getMonth(), d.getDate());
            }
            return arguments[0].toString() + separator +
                (arguments[1] + 1).toString().padStart(2, '0') + separator +
                (arguments[2]).toString().padStart(2, '0');
        },
        dayStampToDate: function(dayStamp) {
            let dateParts = dayStamp.split(separator);
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        },
        dateToDayStamp: function(someDate) {
            return dateUtils.dayStamp(someDate.getFullYear(), someDate.getMonth(), someDate.getDate());
        }
    }
})(); //end dateUtils

module.exports = {
    timeSpanUtils,
    dateUtils
};

},{}],2:[function(require,module,exports){
/*******************************************************************
 * events namespace
 * FranckEinstein90
 * ---------------
 *
 *  events.Event: Include implementations for:
 *
 *  - object events.Event, base class for all other event object in system
 *    . has status on or off
 *    . can be flipped from one to the other
 *    . has a unique id
 *  
 *  - object events.Chain, implements concept of a chain of events
 *    . sets of events that are linked to one another
 *
 *  - object events.Register, keeps tracks of all objects and their status
 *
 *  ------------
 *  Unit tests: /test/events.js
 *  Dependent modules: /src/calendarEvents.js
 * 
 * *****************************************************************/

const events = (function() {


    let eventRegistrar = new Map(),

        generateUUID = function() {
            let d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        };

    return {

        eventState: {
            on: 1,
            off: 0
        },

        /*************************************************************
         * events.Event
         * FranckEinstein90
         * -------------------
         *
         *  base event abstraction. A wrapper for:  
         *   - a unique id
         *   - a status of on or off
         *
         * **********************************************************/
        Event: function(state) { // events.Event registered at construction
            this.id = generateUUID();

            this.onOffActions = [];
            this.onOnActions = [];
            this.onFlipActions = [];

            if (state === undefined) {
                this.state = events.eventState.on;
            } else {
                this.state = state
            }


            eventRegistrar.set(this.id, this.state);
        },

        /*************************************************************
         * events.Chain
         * -------------------
         *  Structure that links events to each other
         *  provides facilities to create webs of related 
         *  events
         * **********************************************************/
        Chain: function() {
            //todo
        },

        /*************************************************************
         * events.Registrar
         * -------------------
         *  Structure into which events can be registered. Provides
         *  various operations on the set of registered events, map, 
         *  filter, reduce
         * **********************************************************/

        Registrar: function() { // Event registrar
            this.events = new Map();
        },

        /*************************************************************
         * events.Exception
         * -------------------
         *  Error Structure 
         * **********************************************************/
        Exception: function(err) {

        }
    };
})();


/******************************************************************************
 * Event class prototype
 * 
 * ***************************************************************************/

events.Event.prototype = {

    on: function() { //event is ongoing
        if (this.isOff()) {
            this.state = events.eventState.on;
            this.onOnActions.forEach(x => x());
        }
    },

    off: function() { //event is offgoing
        if (this.isOn()) {
            this.state = events.eventState.off;
            this.onOffActions.forEach(x => x());
        }
    },

    isOn: function() {
        return (this.state == events.eventState.on);
    },

    isOff: function() {
        return (this.state === events.eventState.off);
    },

    flip: function() {
        if (this.isOn()) {
            this.off()
        } else {
            this.on()
        }
        this.onFlipActions.forEach(x => x());
    },
}

/******************************************************************************
 * Registrar class
 * -----------------
 *  data structure that holds and registers events, 
 *  keeping track of their status
 * 
 * ***************************************************************************/
events.Registrar.prototype = {

    /*****************************************************************
     *  Registers an event in the registrar
     *  *************************************************************/
    register: function(ev) {
        this.events.set(ev.id, ev);
    },

    size: function(ev) {
        return this.events.size;
    },

    flush: function(ev) {
        return this.events.clear();
    },

    forEach: function(eventCallbackFunction) {
        this.events.forEach(eventCallbackFunction);
    },

    get: function(eventId) {
        return this.events.get(eventId);
    },

    filter: function(filterPred) {
        /********************************************************
         * returns an array of events filtered as 
         * per the predicate argument
         * *****************************************************/
        let arrayRes = [];
        this.events.forEach((value, key) => {
            if (filterPred(value)) {
                arrayRes.push(value)
            }
        });
        return arrayRes;
    },

    remove: function(evId) {
        /********************************************************
         * removes an event with given id from 
         * the registrar
         * *****************************************************/
        if (!this.events.has(evId)) {
            throw new events.Exception("Event does not exist");
        }
        this.events.delete(evId);
    }


}



module.exports = {
    events
};

},{}],3:[function(require,module,exports){
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

},{"./dateUtils":1,"./events":2}]},{},[3]);
