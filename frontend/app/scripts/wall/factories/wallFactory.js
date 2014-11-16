'use strict';

angular.module('wall').factory('wallFactory',function($rootScope){
    
    var socket = io.connect('http://localhost:8000');
    
    //var socket = "";
    
    var perform = function(callback,args){
        if(callback){
            $rootScope.$apply(function () {    
                callback.apply(socket, args);
            });
        }
    };
    
    return {
    
        on : function(callback){
            socket.on('tweet-io:tweets',function(){
                perform(callback,arguments);
            });
        },
        
        connect : function (callback) {
            socket.emit('tweet-io:start', true, function () {
                perform(callback,arguments);
            })
        }
    };
});