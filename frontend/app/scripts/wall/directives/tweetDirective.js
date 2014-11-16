'use strict';

angular.module('wall').directive('tweet',function(){
    
    return{
        
        scope:{
            text: '@text'
        },
        
        link : function(scope,element){
            var tweet = scope.text;
            tweet = tweet.replace(/(http[^ ]*)/g, '<a href="$1" target="_blank">$1</a>');
            tweet = tweet.replace(/(@[^ ]*)/g, '<a href="https://www.twitter.com/$1" target="_blank">$1</a>').replace(/#([^ ]*)/g, '<a href="https://twitter.com/hashtag/$1?src=hash" target="_blank">#$1</a>');
            element.html(tweet.trim());
        }
    };
});