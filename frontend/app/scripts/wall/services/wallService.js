'use strict';

/**
 * Wall Service
 */
angular.module('wall').service('wallService',['wallFactory','tweetFactory','$rootScope', function(wallFactory,tweetFactory,$rootScope){

    var wallService = {};
    
    /**
     * Number of tweet per page
     */
    var nbTweet = 15;
    
    /**
     * Connection to socket
     */
    wallService.getStream = function(callback){
        wallFactory.connect();
        wallFactory.on(callback);
    };
    
    /**
     * Get next tweet page
     */
    wallService.findPreviousTweet = function(date){
        if(!date){
            date = JSON.stringify(new Date());
            date = date.substring(1,date.length-1)
        }
        return tweetFactory.search(date,nbTweet);
    };
    
    return wallService;
}]);