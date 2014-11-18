#Application twitteriver du JUG d'Orléans
===========

River des tweets associés à #jugorleans et @jugorleans

L'application tourne sur openshift : http://jugorleans-twitteriver.rhcloud.com

## Node - installation
* Installer node.js avec les modules suivants
  * body-parser
  * cookie-parser
  * debug
  * ejs
  * express
  * grunt
  * jade
  * mongo-sync
  * mongodb
  * mongoose
  * morgan
  * serve-favicon
  * socket.io
  * twit
  
## Backend - installation
TODO :
* Installer node.js (cf ci-dessus)
* Créer une application twitter depuis https://apps.twitter.com/ 
* Configurer depuis cette application la génération de 4 tokens : 
  * Application API Key
  * Application API Secret
  * Access Token
  * Access Token Secret
* Editer le fichier [/backend/twitter.js](https://github.com/jugorleans/twitteriver/blob/master/backend/twitter.js) avec les tokens générés 
```javascript
  var T = new Twit({
    consumer_key:         'API Key',
    consumer_secret:      'API Secret',
    access_token:         'Access Token',
    access_token_secret:  'Access Token Secret'
   })
```
* Editer la ligne suivante du fichier [/backend/twitter.js](https://github.com/jugorleans/twitteriver/blob/master/backend/twitter.js) pour changer le filtre (ici @jugorleans et #jugorleans) - se référer à [l'API twitter](https://dev.twitter.com/streaming/public) pour plus de précisions

```var stream = T.stream('statuses/filter', { track: ['jugorleans'] });```

* Installer une base MongoDB en local
* Editer l'URL de la base via la ligne suivante du fichier [/backend/twitter.js](https://github.com/jugorleans/twitteriver/blob/master/backend/twitter.js) si vous ne souhaitez pas créer automatiquement une base "test"

`var url = process.env.DB_URL || 'mongodb://localhost/test';`

* Modifier les lignes suivantes du fichier [/backend/app.js](https://github.com/jugorleans/twitteriver/blob/master/backend/app.js) si vous ne souhaitez pas que le serveur tourne sur localhost:8000 par défaut
```javascript
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
    var ip = process.env.OPENSHIFT_NODEJS_IP || "localhost" ;
```
* Démarrer la base mongo ("mongod" depuis un terminal) 
* Démarrer node sur [/backend/app.js](https://github.com/jugorleans/twitteriver/blob/master/backend/app.js) 
* Tweeter avec le contenu attendu depuis Twitter
* Vérifier que le service REST retourne bien le tweet enregistré : http://localhost:8000/_searchtweet/?beforeDate=2017-11-07T20:43:07.000Z&nbTweets=10


