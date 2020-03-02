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






},{"../common/dateUtils":3,"../common/events":4,"../common/features":5,"./../common/dateUtils":3,"./ui/ui.js":2}],2:[function(require,module,exports){
/******************************************************************************
 * 
 ******************************************************************************/
"use strict"
/******************************************************************************/
/******************************************************************************/
const sections = [
    window , 
    "#topNav", 
    "#bottomNav"
]

const ui = (function(){

    let _sections = sections.map( section => {
        return {
            jqHandle : section 
        }
    })
        
    
    let _setHeight = (element, height) => {
        element.height(height)
    }

    let _configureUIElements = () => {

        let windowHeight = $(window).height()
        let topNavHeight = $(window).height()/10
        _setHeight( $('#topNav'), topNavHeight ) 

        let bottomNavHeight = $(window).height() / 15
        _setHeight( $('#bottomNav'), bottomNavHeight)

           
        $('#bottomNav').css({
                    top: `${windowHeight - bottomNavHeight}px`, 
                    left: '0'
        })

        let contentHeight = windowHeight - topNavHeight - bottomNavHeight 
        _setHeight( $('#leftNav'), contentHeight) 
        $('#leftNav').css({
                    top: `${topNavHeight}px`, 
                    left: '0', 
                    width: `${$(window).width() > 1200 ? 145 : 0}`
        })

        _setHeight( $('#content'), contentHeight) 
         $('#content').css({
            top: `${topNavHeight}px`, 
            left: $('#leftNav').width(), 
            width: $(window).width() - $('#leftNav').width()
                
        })

        $('#left').css({
            top: `${topNavHeight}px`, 
            left    : $('#leftNav').width(), 
            width   : $( window ).width() > 1200 ? $('#content').width() / 2 : $( window ).width(),
            height  : $( window ).width() > 1200 ? $('#content').height() : 400
        })

        $('#right').css({
            top     : $( window ).width() > 1200 ? `${topNavHeight}px`: $('#left').height(), 
            left    : $( window ).width() > 1200 ? $('#leftNav').width() + $('#left').width() : $('#leftNav').width(), 
            width   : $( window ).width() > 1200 ? $('#content').width()/2 : $( window ).width(),  
            height  : $( window ).width() > 1200 ? $('#content').height() : $('#content').width()/2 
        })

    }

    return {

        configure : function( ){
            _configureUIElements()
            $(window).resize(()=> {
                _configureUIElements()
            })
        }


    }
})()

const addUiFeature = app => {

    ui.configure(app)
    app.ui = ui
    app.addFeature({
        tag: 'ui', 
        state: 'implemented'
    })
    return ui

}

module.exports = {
    addUiFeature
}

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
