'use strict';

angular.module('wall').factory('tweetFactory',['$http',function($http){
    
    var urlBase = 'http://jugorleans-twitteriver.rhcloud.com:8000/';
    
    return {
        search : function(beforeDate,nbTweet){
            var uri = '_searchtweet/?beforeDate=%date&nbTweets=%nbTweet';
            uri = uri.replace('%date',beforeDate).replace('%nbTweet',nbTweet);
            var url = urlBase + uri;
            return $http.get(url);
        }
    };

}]);