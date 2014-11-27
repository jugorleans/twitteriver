angular.module('wall').filter('linkEnhancer', function () {
  return function (tweet) {
    return tweet
      .replace(/(https?:\/\/[^\s]+)|(@[\w]+)|#([\w]+)/g, function () {
        if (RegExp.$1) return '<a href="' + RegExp.$1 + '" target="_blank">' + RegExp.$1 + '</a>';
        if (RegExp.$2) return '<a href="https://www.twitter.com/' + RegExp.$2 + '" target="_blank">' + RegExp.$2 + '</a>';
        if (RegExp.$3) return '<a href="https://twitter.com/hashtag/' + RegExp.$3 + '?src=hash" target="_blank">#' + RegExp.$3 + '</a>';
      });
  }
});
