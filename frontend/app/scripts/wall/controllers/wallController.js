'use strict';

/**
 * @ngdoc function
 * @name wall.controller:WallCtrl
 * @description
 * # WallCtrl
 * Wall Controller of the wall module
 */
angular.module('twitteriverApp')
  .controller('WallCtrl',['$scope','logger','wallService', function ($scope,logger, wallService) {
      
      $scope.infiniteScroll = {
          busy : false,
          nextPage : function(){
              this.busy = true;
              if($scope.tweets){
                  var tweet = $scope.tweets[$scope.tweets.length - 1];
                  findPreviousTweet(tweet.date);
                }else{
                    findPreviousTweet();
                }
          }
      }; 
      
      var resultToList = function(data){
          var listTweet = [];
          for(var i in data){
              listTweet.push(data[i])
          }
          return listTweet;
      };
      
      var findPreviousTweet = function(date){
           wallService.findPreviousTweet(date).success(function(data){
               if($scope.tweets){
                   $scope.tweets = $scope.tweets.concat(resultToList(data));
               }else{
                   $scope.tweets = resultToList(data);
               }
                $scope.infiniteScroll.busy = false;
            }).error(function(error){
              console.log('Erreur lors de la récupération des tweets : '+error.message)
              $scope.infiniteScroll.busy = false;
          });
      };
      
      wallService.getStream(function(data){
         var newStack = data.concat($scope.tweets);
         $scope.tweets = newStack;
      });
      
  }]);
