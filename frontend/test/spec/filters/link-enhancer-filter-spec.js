'use strict';

describe('link enhancer spec', function () {
	var linkEnhancer;

  beforeEach(module('twitteriverApp'));

  beforeEach(inject(function (linkEnhancerFilter) {
    linkEnhancer = linkEnhancerFilter;
  }));

  // Contrôle du traitement des MENTION (@)
  describe('with twitter mentions', function() {
    it('should works with simple mention case', function() {
      // cas simple
      expect(linkEnhancer('mention : @jugorleans')).toBe('mention : <a href="https://www.twitter.com/jugorleans" target="_blank">@jugorleans</a>');
    });
    it('should ignore "." in mention', function() {
      // mention avec un "." en fin de chaine
      expect(linkEnhancer('mention : @jugorleans.')).toBe('mention : <a href="https://www.twitter.com/jugorleans" target="_blank">@jugorleans</a>.');
    });
    it('should ignore ":" in mention', function() {
      // mention en début de phrase suivi de ':'
      expect(linkEnhancer('@jugorleans: it\'s a mention')).toBe('<a href="https://www.twitter.com/jugorleans" target="_blank">@jugorleans</a>: it\'s a mention');
    });
    it('should works with several mentions', function() {
      // plusieurs mentions dans le tweet
      expect(linkEnhancer('Multi mention: @jugorleans and @twitter')).toBe('Multi mention: <a href="https://www.twitter.com/jugorleans" target="_blank">@jugorleans</a> and <a href="https://www.twitter.com/twitter" target="_blank">@twitter</a>');
    });
    it('should ignore mail format', function() {
      // ignore les '@' correspondant à un mail
      expect(linkEnhancer('Ignore nom.prenom@mail mais pas: @jugorleans and @twitter')).toBe('Ignore nom.prenom@mail mais pas: <a href="https://www.twitter.com/jugorleans" target="_blank">@jugorleans</a> and <a href="https://www.twitter.com/twitter" target="_blank">@twitter</a>');
    });
  });

  // Contrôle du traitement des HASHTAG (#)
  describe('with twitter hashtags', function() {
    it('should works with simple hashtag case', function() {
      // cas simple
      expect(linkEnhancer('hashtag : #jugorleans')).toBe('hashtag : <a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a>');
    });
    it('should ignore "." in hashtag', function() {
      // hashtag avec un "." en fin de chaine
      expect(linkEnhancer('hashtag : #jugorleans.')).toBe('hashtag : <a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a>.');
    });
    it('should ignore ":" in hashtag', function() {
      // hashtag en début de phrase suivi de ":"
      expect(linkEnhancer('#jugorleans: it\'s a hashtag')).toBe('<a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a>: it\'s a hashtag');
    });
    it('should works with several hashtags', function() {
      // plusieurs hashtags dans le tweet
      expect(linkEnhancer('Multi hashtag: #jugorleans and #twitter')).toBe('Multi hashtag: <a href="https://twitter.com/hashtag/jugorleans?src=hash" target="_blank">#jugorleans</a> and <a href="https://twitter.com/hashtag/twitter?src=hash" target="_blank">#twitter</a>');
    });
  });

  // Contrôle du traitement des URL (http)
  describe('with URL', function() {
    it('should works with no match case', function() {
      // cas simple sans correspondance à remplacer
      expect(linkEnhancer('simple tweet')).toBe('simple tweet');
    });
    it('should works with simple http case', function() {
      // cas simple
      expect(linkEnhancer('url : http://www.jugorleans.fr/')).toBe('url : <a href="http://www.jugorleans.fr/" target="_blank">http://www.jugorleans.fr/</a>');
    });
    it('should works with https case', function() {
      // cas https
      expect(linkEnhancer('url : https://www.jugorleans.fr/')).toBe('url : <a href="https://www.jugorleans.fr/" target="_blank">https://www.jugorleans.fr/</a>');
    });
    it('should works with http followed by tabulation', function() {
      // cas http suivi d'une tabulation
      expect(linkEnhancer('url : http://jugorleans.fr/\twith tabulation')).toBe('url : <a href="http://jugorleans.fr/" target="_blank">http://jugorleans.fr/</a>\twith tabulation');
    });
    it('should works with http followed by new line', function() {
      // cas http suivi d'un saut de ligne
      expect(linkEnhancer('url : http://jugorleans.fr/\nnew line')).toBe('url : <a href="http://jugorleans.fr/" target="_blank">http://jugorleans.fr/</a>\nnew line');
    });
    it('should works with http that contains #', function() {
      // cas http contenant le caractère dièse
      expect(linkEnhancer('url : http://jugorleans.fr/#app contains sharp')).toBe('url : <a href="http://jugorleans.fr/#app" target="_blank">http://jugorleans.fr/#app</a> contains sharp');
    });
    it('should ignore URL ending with ...', function() {
      // ignore les URL se terminant par '...'
      expect(linkEnhancer('url : http://jugorleans...')).toBe('url : http://jugorleans...');
    });
  });
});
