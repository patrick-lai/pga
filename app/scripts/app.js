'use strict';

/**
* @ngdoc overview
* @name pgaApp
* @description
* # pgaApp
*
* Main module of the application.
*/
angular
.module('pgaApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ui.router',
  'ngMaterial',
  'ngLodash',
  'ngGeolocation',
  'uiGmapgoogle-maps',
  'LocalStorageModule',
  'ngAudio',
  'angular-momentjs',
  'angular-vibrator',
  'timer'
])
.config(function ($locationProvider, $stateProvider, $httpProvider, $urlRouterProvider, $mdThemingProvider, $momentProvider, uiGmapGoogleMapApiProvider, localStorageServiceProvider) {

  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBbw9PJvWsQn_qmBIMSxFAMrtSJcqM70Sg',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
  });

  $momentProvider
   .asyncLoading(false)
   .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');

  localStorageServiceProvider
   .setPrefix('pgaApp');

  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $mdThemingProvider.theme('default')
  .primaryPalette('grey')
  .dark(); // Dark is pretty cool.
  $stateProvider
  .state({
    name: 'Main',
    url: '/',
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
  })
  .state({
    name: 'Test',
    url: '/test',
    tempalteUrl: 'views/test.html'
  })
  .state({
    name: 'Importer',
    url: '/import',
    templateUrl: 'views/import.html'
  });

})
.run(function($http, $rootScope, lodash, localStorageService, ngAudio, vibrator){
  $rootScope.notificationMp3 = ngAudio.load('audio/notification.mp3');
  $rootScope.pokemons = [];
  $rootScope.watchPokemon = function(pokemon){
    return localStorageService.set(parseInt(pokemon.id), true);
  };

  $rootScope.unWatchPokemon = function(pokemon){
    return localStorageService.remove(parseInt(pokemon.id));
  };

  $rootScope.isWatchingPokemon = function(pokemon){
    var val = localStorageService.get(parseInt(pokemon.id));
    return val != undefined && val != null;
  }

  $rootScope.setDistance = function(distance){
    $rootScope.appSettings.distance = distance;
    localStorageService.set('distance',distance);
  }

  // Setup Distance
  $rootScope.appSettings = {};
  $rootScope.appSettings.distance = localStorageService.get('distance');

  $rootScope.notified = [];

  // set Default distance
  if(!$rootScope.distance){
      $rootScope.setDistance(500);
  }

  $rootScope.surroundingPokemon = [];
  $rootScope.filteredPokemon = [];

  function filterPokemon(){
    $rootScope.filteredPokemon =
    lodash.chain($rootScope.surroundingPokemon)
          .filter(function(p){
            var include = $rootScope.isWatchingPokemon({id: p.pokemonId}) && p.distance <= $rootScope.appSettings.distance;

            if(!include){
              return false;
            }

            //notify once only
            if(!lodash.includes($rootScope.notified, p.id)){
              $rootScope.notified.push(p.id);
              $rootScope.notificationMp3.play();
              vibrator.vibrate(1000);
            }

            return include;
          }).map(function(p){
            p.show = true;
            return p;
          })
          .value();
  }

  $rootScope.clearLocalStorage = function(){
    localStorageService.clearAll();
  }

  $rootScope.updateMap = function(){
    $rootScope.$broadcast('surroundingPokemonChanged');
  }

  $rootScope.$watch("surroundingPokemon", function(){
     $rootScope.updateMap();
  });

  $rootScope.$on('surroundingPokemonChanged', function(event, message) {
    filterPokemon();
  });

  $http.get('pokemon.json').success(function(response) {
    // Fetch pokemon List
    $rootScope.pokemons = response.data;
  });

})

.service('pvApi', function($http, $geolocation, $rootScope){

  this.baseUrl = "https://www.whereispokemon.com/fetch";

  this.maxDistance = 1000;

  this.fetchApiData = function(coords){
    var data = {
      lat : $rootScope.currentLocation.latitude,
      lng : $rootScope.currentLocation.longitude,
      distance : this.maxDistance
    }
    return $http.post(this.baseUrl, data, function(response){
      return response.data;
    });
  }

})

.service('pgaTable', function($http, $geolocation, $rootScope) {

  this.formId = "1JdBMtPa4V-5FZNeDMPw9gC63cU_PYfMY0yvLtFpKZIo";
  this.apiKey = "AIzaSyBbw9PJvWsQn_qmBIMSxFAMrtSJcqM70Sg";

  this.reportSighting = function (pokemon) {

    var url = "https://docs.google.com/forms/d/"+this.formId+"/formResponse?submit=Submit";

    var params = {
      // "entry.1679630058": pokemon.name,
      "entry.52226537": pokemon.id + " " + pokemon.name,
      "entry.1840957835": $rootScope.currentLocation.latitude+" "+$rootScope.currentLocation.longitude
    };

    angular.forEach(params, function(value, key) {
      url += "&"+key+"="+value;
    });

    return $http.post(url).then(function(response){
      console.log(response);
    },function(error) {
      console.log(error);
    });

  };

})
.filter('parseInt', function() {
  return function(input) {
    return parseInt(input);
  };
});
