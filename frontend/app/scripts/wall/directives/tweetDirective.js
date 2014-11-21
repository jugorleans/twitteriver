'use strict';

angular.module('wall').directive('tweet',function(){
    
    return{
        
        scope: {
            text: '@text'
        },
        
        link: function(scope, element){
            var tweet = scope.text
              .replace(/(https?:\/\/[^\s]+)|(@[\w]+)|#([\w]+)/g, function() {
                if (RegExp.$1) return '<a href="' + RegExp.$1 + '" target="_blank">' + RegExp.$1 + '</a>';
                if (RegExp.$2) return '<a href="https://www.twitter.com/' + RegExp.$2 + '" target="_blank">' + RegExp.$2 + '</a>';
                if (RegExp.$3) return '<a href="https://twitter.com/hashtag/' + RegExp.$3 + '?src=hash" target="_blank">#' + RegExp.$3 + '</a>';
              });
            
            element.html(tweet.trim());
        }
    };
});
