  
/*******************************************************************************
  -------------------------------------
 *  httpServer.js 
 *
 *  set's up the http server, debug and logging
 ******************************************************************************/
"use strict"
/*****************************************************************************/
const http = require('http')



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

const httpServer = function( app ){

    let _port 		    = app.data.port

    app.express.set( 'port', port ) 
    let _server = http.createServer( app.express )

    _server.listen( port )
    _server.on('error', x     => onError(port))
    _server.on('listening', x => onListening(_server.address()))

    return _server
}


module.exports = {
    httpServer
}
