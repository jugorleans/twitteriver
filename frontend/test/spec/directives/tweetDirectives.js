'use strict';

describe('directive: tweet', function () {
  var compileDirective;
  
  // load the directive's module
  beforeEach(module('twitteriverApp'));
  
  beforeEach(inject(function($rootScope, $compile) {
    var scope = $rootScope.$new();
    
    compileDirective = function(tweet){
        scope.tweet = tweet;
        var element = $compile('<div tweet text={{tweet}}/>')(scope);
        scope.$digest();
        return element.html();
    };
  }));
  
  // Contrôle du traitement des MENTION (@)
  describe('with twitter mentions', function() {
    it('should works with simple mention case', function() {
      // cas simple
      expect(compileDirective('mention : @jugorleans')).toBe('mention : <a href="https://www.twitter.com/@jugorleans" target="_blank">@jugorleans</a>');
    });
    it('should ignore "." in mention', function() {
      // mention avec un "." en fin de chaine
      expect(compileDirective('mention : @jugorleans.')).toBe('mention : <a href="https://www.twitter.com/@jugorleans" target="_blank">@jugorleans</a>.');
    });
    it('should ignore ":" in mention', function() {
      // mention en début de phrase suivi de ':'
      expect(compileDirective('@jugorleans: it\'s a mention')).toBe('<a href="https://www.twitter.com/@jugorleans" target="_blank">@jugorleans</a>: it\'s a mention');
    });
    it('should works with several mentions', function() {
      // plusieurs mentions dans le tweet
      expect(compileDirective('Multi mention: @jugorleans and @twitter')).toBe('Multi mention: <a href="https://www.twitter.com/@jugorleans" target="_blank">@jugorleans</a> and <a href="https://www.twitter.com/@twitter" target="_blank">@twitter</a>');
    });
  });
  
  // Contrôle du traitement des HASHTAG (#)
  describe('with twitter hashtags', function() {
    it('should works with simple hashtag case', function() {
      // cas simple
      expect(compileDirective('hashtag : #jugorleans')).toBe('hashtag : <a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a>');
    });
    it('should ignore "." in hashtag', function() {
      // hashtag avec un "." en fin de chaine
      expect(compileDirective('hashtag : #jugorleans.')).toBe('hashtag : <a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a>.');
    });
    it('should ignore ":" in hashtag', function() {
      // hashtag en début de phrase suivi de ":"
      expect(compileDirective('#jugorleans: it\'s a hashtag')).toBe('<a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a>: it\'s a hashtag');
    });
    it('should works with several hashtags', function() {
      // plusieurs hashtags dans le tweet
      expect(compileDirective('Multi hashtag: #jugorleans and #twitter')).toBe('Multi hashtag: <a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a> and <a href="https://twitter.com/hashtag/twitter?src=hash" target="_blank">#twitter</a>');
    });
  });
  
  // Contrôle du traitement des URL (http)
  describe('with URL', function() {
    it('should works with simple http case', function() {
      // cas simple
      expect(compileDirective('url : http://www.jugorleans.fr/')).toBe('url : <a href="http://www.jugorleans.fr/" target="_blank">http://www.jugorleans.fr/</a>');
    });
    it('should works with https case', function() {
      // cas https
      expect(compileDirective('url : https://www.jugorleans.fr/')).toBe('url : <a href="https://www.jugorleans.fr/" target="_blank">https://www.jugorleans.fr/</a>');
    });
    it('should works with only http', function() {
      // cas http sans www
      expect(compileDirective('url : http://jugorleans.fr/')).toBe('url : <a href="http://jugorleans.fr/" target="_blank">http://jugorleans.fr/</a>');
    });
  });
});
