var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
var fs = require('fs');

exports.io = io;
var twitter = require('./twitter');
var tweetsListRest = require('./twitter').tweetsListRest;
var updateOldTweets = require('./twitter').updateOldTweets;

app.configure(function() {
    
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
    var ip = process.env.OPENSHIFT_NODEJS_IP || "localhost" ;
	app.set('port', port);
  	app.set('ipaddr', ip);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.engine('html', require('ejs').renderFile);
    
    ['fonts', 'images', 'scripts', 'styles', 'views'].forEach(function (dir){
        app.use('/'+dir, express.static(__dirname+'/'+dir));
    });
        
    app.all('*', function(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        if ('OPTIONS' == req.method) return res.send(200);
        next();
    });

    
    console.log('Serveur démarré ip=' + ip + ' port=' + port);
});

/**
 *  Populate the cache.
 */
server.populateCache = function() {
    if (typeof server.zcache === "undefined") {
        server.zcache = { 'index.html': '' };
    }

    //  Local cache for static content.
    server.zcache['index.html'] = fs.readFileSync('./index.html');
};

server.createRoutes = function() {
    server.routes = { };

    server.routes['/asciimo'] = function(req, res) {
        var link = "http://i.imgur.com/kmbjB.png";
        res.send("<html><body><img src='" + link + "'></body></html>");
    };

    server.routes['/'] = function(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.send(server.cache_get('index.html') );
    };
    
    /* GET tweetsList. */ 
    server.routes['/_searchtweet'] = function(req, res) {
        console.log('/_searchtweet/ with query : ' + JSON.stringify(req.query));
        tweetsListRest(req.query.beforeDate, req.query.nbTweets, res);
    };
    
    /* GET tweetsList. */ 
    server.routes['/_updateOldTweets'] = function(req, res) {
        console.log('/_updateOldTweets');
        updateOldTweets();
        res.send('OK');
    };
    
};

/**
 *  Initialize the server (express) and create the routes and register
 *  the handlers.
 */
server.initializeServer = function() {
    server.createRoutes();
    server.app = app;

    //  Add handlers for the app (from the routes).
    for (var r in server.routes) {
        server.app.get(r, server.routes[r]);
    }

    ['fonts', 'images', 'scripts', 'styles', 'views'].forEach(function (dir){
        server.app.use('/'+dir, express.static(__dirname+'/'+dir));
    });
};


/**
 *  Retrieve entry (content) from cache.
 *  @param {string} key  Key identifying content to retrieve from cache.
 */
server.cache_get = function(key) { return server.zcache[key]; };

/**
 *  Initializes the sample application.
 */
server.initialize = function() {
    server.populateCache();

    // Create the express server and routes.
    server.initializeServer();
};


server.initialize();
server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});

