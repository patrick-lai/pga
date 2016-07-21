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
  'uiGmapgoogle-maps'
])
.config(function ($locationProvider, $stateProvider, $httpProvider, $urlRouterProvider, $mdThemingProvider, uiGmapGoogleMapApiProvider) {

  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBbw9PJvWsQn_qmBIMSxFAMrtSJcqM70Sg',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
  });

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

.service('pgaTable', function($http, $geolocation, $rootScope) {

  this.formId = "1JdBMtPa4V-5FZNeDMPw9gC63cU_PYfMY0yvLtFpKZIo";
  this.apiKey = "AIzaSyBbw9PJvWsQn_qmBIMSxFAMrtSJcqM70Sg";

  this.reportSighting = function (pokemon) {

    var url = "https://docs.google.com/forms/d/"+this.formId+"/formResponse?submit=Submit";

    var params = {
      "entry.1679630058": pokemon.name,
      "entry.52226537": pokemon.id,
      "entry.1840957835": $rootScope.currentLocation.latitude+","+$rootScope.currentLocation.longitude
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

}).filter('parseInt', function() {
  return function(input) {
    return parseInt(input);
  };
});
