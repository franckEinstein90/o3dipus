  
/*******************************************************************************
  -------------------------------------
 *  httpServer.js 
 *
 *  set's up the http server, debug and logging
 ******************************************************************************/
"use strict"

/*****************************************************************************/
const http = require('http')
const debug = require('debug')('weirdworld')
/*****************************************************************************/

const normalizePort = function(val) {
    let port = parseInt(val, 10)
    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
}

const onError = function(port, error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const onListening = function(addr) {
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}


const _httpServer = function( app ) {

    app.port = normalizePort( process.env.PORT || 3000)

    app.express.set('port', app.port);

    let _server = http.createServer( app.express );
    _server.on('error'      , x => onError( app.port , x ));
    _server.on('listening'  , x => onListening( _server.address()));

    return {
        start   : function(){
            _server.listen( app.port )
            return app 
        }
    };
}

const httpServer = function( app ){
    app.server = _httpServer( app );
    return app;
}

module.exports = {
    httpServer
}
