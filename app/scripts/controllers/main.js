'use strict';

/**
* @ngdoc function
* @name pgaApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the pgaApp
*/
angular.module('pgaApp')
.controller('MainCtrl' , function ($scope, $timeout, $mdSidenav, $rootScope, $http, lodash, pgaTable, $sce, $geolocation) {

  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildDelayedToggler('right');
  $rootScope.mapsUrl = 'views/map.html';

  $http.get('scripts/pokemon.json').success(function(data) {
     $scope.pokemons = data;
  });

  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
      args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  function buildDelayedToggler(navID) {
    return debounce(function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
      .toggle()
      .then(function () {

      });
    }, 200);
  }

  function buildToggler(navID) {
    return function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
      .toggle()
      .then(function () {

      });
    }
  }

  $scope.getIframeUrl = function(){

    var pokemonId = $rootScope.currentPokemon ? parseInt($rootScope.currentPokemon.id) : 0;

    if(!$rootScope.currentLocation){
      $rootScope.currentLocation = "&lat=-33.50&lng=150.84279004958148"
    }

    var iframeUrl = "https://www.google.com/fusiontables/embedviz?q=select+col3+from+1b4XoPuboTQ-x6K_uoIpjEg0k4Nwa8gEewhFpDypw+where+col2+%3D+"
    +pokemonId
    +"&viz=MAP&h=false&"+$rootScope.currentLocation+"&t=1&z=15&l=col3&y=3&tmplt=4&hml=GEOCODABLE";

    return $sce.trustAsResourceUrl(iframeUrl);
  }

  $scope.openLegal = function(){
      swal(
        'Legal',
        "Pokémon images, names and information (c) 1995-2014 Nintendo/Game freak.\n\n"+
        "Images and content were taken from the following resources:\n\n"+
        "PokéAp\n"+
        "Pokémon Database\n"+
        "veekun/pokedex"
      )
  }

  $scope.close = function (side) {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav(side).close()
      .then(function () {
        // Do nothing
      });
  };

  //Init our rootLocation
  return $geolocation.getCurrentPosition({
    timeout: 10000
  }).then(function(position) {
    $rootScope.currentLocation = "&lat="+position.coords.latitude+"&lng="+position.coords.longitude;
  });

});
