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

  function buildDelayedToggler(navID) {
    return debounce(function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
      .toggle()
      .then(function () {

      });
    }, 200);
  }

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

  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildDelayedToggler('right');
  $scope.pokemons = [];
  $scope.myPosition = $geolocation.position;

  $http.get('pokemon.json').success(function(data) {
    $scope.pokemons = data;
  });

  $scope.getQuery = function(){
    if(!$rootScope.currentPokemon){
      return "";
    }

    return "PokedexId = "+$rootScope.currentPokemon.id;
  }

  $scope.openLegal = function(){
    swal(
      'Legal',
      "Pokémon images, names and information (c) 1995-2014 Nintendo/Game freak.\n\n"+
      "Images and content were taken from the following resources:\n\n"+
      "PokéAp\n"+
      "Pokémon Database\n"+
      "veekun/pokedex"
    );
  };

  $scope.close = function (side) {
    $mdSidenav(side).close();
  };

  // Watch users Location
  $geolocation.watchPosition({
    timeout: 5000,
    maximumAge: 250
  })

  // Default Sydney Location when fails
  var sydenyLocation = {
    latitude: -33.8688,
    longitude: 151.2093
  }

  var zoom = 16;

  $scope.map = {
    center: sydenyLocation,
    zoom: zoom
  };

  $scope.map.fusionlayer = {
      options: {
        heatmap: {
          enabled: false
        },
        query: {
          select: "Location",
          from: "1b4XoPuboTQ-x6K_uoIpjEg0k4Nwa8gEewhFpDypw",
          where: $scope.getQuery()
        }
      }
    }

    // Update on Pokemon Select
    $rootScope.$watch('currentPokemon', function(pokemon){
      $scope.map.fusionlayer.options.query.where = $scope.getQuery();
    });

    $scope.$on('$geolocation.position.changed', function(event, newPosition){
        if(!($scope.map.center == sydenyLocation && newPosition)){
          return
        }
        $rootScope.currentLocation = newPosition.coords;
        $scope.map.center = {
            latitude: newPosition.coords.latitude,
            longitude: newPosition.coords.longitude
        };
    })

});
