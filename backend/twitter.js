
var mongoose = require('mongoose');

// openshift
var optionsDb = {
  user: process.env.DB_LOGIN || '',
  pass: process.env.DB_PASSWORD || ''
}

var url = process.env.DB_URL || 'mongodb://localhost/test';
mongoose.connect(url, optionsDb); 

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('db open');
});

var tweetSchema = mongoose.Schema({
    login : String,
    name : String,
    content: String,
    date:Date,
    url:String
})

tweetSchema.methods.saveOK = function () {
    console.log('tweet de '+ this.name +' sauvegardé');
}

var Tweet = mongoose.model('tweet', tweetSchema);


var Twit = require('twit');
var io = require('./app').io;
var TWEETS_BUFFER_SIZE = 1;
var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
var SOCKETIO_START_EVENT = 'tweet-io:start';
var SOCKETIO_STOP_EVENT = 'tweet-io:stop';
var nbOpenSockets = 0;
var isFirstConnectionToTwitter = true;


var tweetsBuffer = [];

/*Credential Twitter*/
var T = new Twit({
    consumer_key:         '******',
    consumer_secret:      '******',
    access_token:         '******',
    access_token_secret:  '******'
});

console.log("Twitter stream => #jugorleans @jugorleans");
var stream = T.stream('statuses/filter', { track: ['jugorleans'] });

/**
 * Handle Socket.IO disconnect event
 */
var discardClient = function() {
	console.log('Client disconnected !');
	nbOpenSockets--;
};

/**
 * Handle Socket.IO disconnect event
 */
var handleClient = function(data, socket) {
	if (data == true) {
		console.log('Client connected !');
		nbOpenSockets++;
	}
};

/**
 * Socket.IO conf
 */
io.sockets.on('connection', function(socket) {

	socket.on(SOCKETIO_START_EVENT, function(data) {
		handleClient(data, socket);
	});

	socket.on(SOCKETIO_STOP_EVENT, discardClient);

	socket.on('disconnect', discardClient);
});


/**
 * Handle Twitter connect event
 */
stream.on('connect', function(request) {
	console.log('Connected to Twitter API');
});

/**
 * Handle Twitter disconnect event
 */
stream.on('disconnect', function(message) {
	console.log('Disconnected from Twitter API. Message: ' + message);
});

/**
 * Handle Twitter reconnect event
 */
stream.on('reconnect', function (request, response, connectInterval) {
  	console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
});


stream.on('tweet', function(tweet) {
	console.log('new tweet');
	//Create message containing tweet + location + username + profile pic
	var msg = {};
    msg.date = tweet.created_at;
    msg.login = tweet.user.screen_name;
    msg.name = tweet.user.name;
    msg.text = tweet.text;
    msg.img = tweet.user.profile_image_url_https;
    
    console.log('le '+msg.date+' '+msg.name+' aka '+msg.login+' a tweeté : '+msg.text);

	var newTweetInfos = new Tweet({ login: msg.login,name: msg.name, content: msg.text, date: msg.date, url:msg.img })
	console.log(newTweetInfos);
    newTweetInfos.saveOK();
    newTweetInfos.save(function (err, newTweetInfos) {
        if (err) return console.error(err);
        console.log('enregistrement OK : ' + msg);
        //push msg into buffer
        tweetsBuffer.push(msg);
        broadcastTweets();
    });
    
});

var broadcastTweets = function() {
	//send buffer only if full
	if (tweetsBuffer.length >= TWEETS_BUFFER_SIZE) {
		//broadcast tweets
		io.sockets.emit(SOCKETIO_TWEETS_EVENT, tweetsBuffer);
		
		oldTweetsBuffer = tweetsBuffer;
		tweetsBuffer = [];
	}
};


exports.tweetsListRest = function(dateMax, nbTweetsMax, res) {
    var query = Tweet.find({date:{$lt:new Date(dateMax)}}).sort({date:-1}).limit(nbTweetsMax || process.env.TWEETS_LIMIT || 5);
    query.exec(function (err, tweets) {
        
        var tweetsResult = {};
        for (var i in tweets){
            var msg = {};
            msg.date = tweets[i].date;
            msg.login = tweets[i].login;
            msg.name = tweets[i].name;
            msg.text = tweets[i].content;
            msg.img = tweets[i].url;
            tweetsResult[i] = msg;
        }
        
        var nbTweets = 0;
        if (tweets){
            nbTweets = tweets.length;
        }
        console.log('tweetsListRest - nb tweets returned : ' + nbTweets);
        
        
        res.send(tweetsResult);
    });
};

exports.updateOldTweets = function() {
    console.log('twitter.updateOldTweets');
    
    var query = Tweet.find({});
    query.exec(function (err, tweets) {
        tweets.forEach(function(doc){
            //var queryUpdate = Tweet.update({ _id: doc._id },{ $set:{ "date": new Date(doc.date) }});
            //queryUpdate.exec();
            
            if (doc.url){
                console.log('url existante : ' + doc.url);
            } else {
            
                T.get('users/show', { screen_name : doc.login },  function (err, data, response) {
                    if (!err){
                        console.log('URL ' + data.profile_image_url_https);
                        var queryUpdate = Tweet.update({ _id: doc._id },{ $set:{ "url": data.profile_image_url_https }});
                        queryUpdate.exec();
                        console.log('Tweet mis à jour : ' + doc._id)
            
                    } else {
                        console.log('User en cours : ' + doc.login)
                        console.log('err : ' + err);
                    }
                });
            }
        });
    });
};
