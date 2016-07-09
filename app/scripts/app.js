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
  'ngGeolocation'
])
.config(function ($locationProvider, $stateProvider, $httpProvider, $urlRouterProvider, $mdThemingProvider) {

  $locationProvider.html5Mode(true);
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
  });

})

.service('pgaTable', function($http, $geolocation) {

  this.formId = "1JdBMtPa4V-5FZNeDMPw9gC63cU_PYfMY0yvLtFpKZIo";

  this.reportSighting = function (pokemon) {
    // Get geolocation then post
    var $this = this;

    return $geolocation.getCurrentPosition({
      timeout: 10000
    }).then(function(position) {

      var url = "https://docs.google.com/forms/d/"+$this.formId+"/formResponse?submit=Submit";
      var params = {
        "entry.1679630058": pokemon.name,
        "entry.52226537": pokemon.id,
        "entry.1840957835": position.coords.latitude+","+position.coords.longitude
      };

      var urlParams = "";

      angular.forEach(params, function(value, key) {
        urlParams += "&"+key+"="+value;
      });

      console.log(url+urlParams);

      return $http.post(url+urlParams).then(function(response){
        console.log(response);
      },function(error) {
        console.log(error);
      });
    });

  };

}).filter('parseInt', function() {
  return function(input) {
    return parseInt(input);
  };
});
