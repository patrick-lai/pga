'use strict';

/**
* @ngdoc function
* @name pgaApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the pgaApp
*/

angular.module('pgaApp')
.controller('MainCtrl' , function ($scope, $timeout, $mdSidenav, $rootScope, $http, lodash, pgaTable, $sce, $geolocation, pvApi, $moment) {

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

  $scope.appSettings = $rootScope.appSettings;
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildDelayedToggler('right');
  $scope.myPosition = $geolocation.position;
  $scope.reportFormUrl = "https://docs.google.com/a/originoffice.com/forms/d/e/1FAIpQLSdwkzgXy1cta5zRzWBS4BL8DQKZhrxe8qdwqDQtabbxziUtPA/viewform";

  $http.get('pokemon.json').success(function(data) {
    // Fetch pokemon List
    $rootScope.pokemons = data;
  });

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

  $scope.updateDistance = function(distance){
    $rootScope.updateMap();
  }

  $scope.close = function (side) {
    $mdSidenav(side).close();
  };

  // Watch users Location every 60 seconds
  $geolocation.watchPosition({
    timeout: 60000,
    maximumAge: 250
  });

  // Default Sydney Location when fails
  var sydneyLocation = {
    latitude: -33.8688,
    longitude: 151.2093
  };

  var zoom = 16;

  $scope.map = {
    center: sydneyLocation,
    zoom: zoom
  };

    function updateData(){

      if(!$rootScope.currentLocation){
        return
      }

      function deepComare(a,b){
        return a.id == b.id
      }

      // fetch data from api
      pvApi.fetchApiData($rootScope.currentLocation).then(function(response){
        // Mark the map with pokemon
        if(response.data.length){
          // Work out difference
          var newData = response.data;
          var add = lodash.differenceWith(newData, $rootScope.surroundingPokemon, deepComare);
          var remove = lodash.differenceWith($rootScope.surroundingPokemon, newData, deepComare);
          var difference = lodash.union(add,remove);

          $rootScope.surroundingPokemon = lodash.unionWith($rootScope.surroundingPokemon,add, deepComare);

          lodash.remove($rootScope.surroundingPokemon,function(p){
            return lodash.includes(remove,p.id);
          });

        }
      })
    }

    $scope.makeCoords = function(lat,lng){
      return {
        latitude: lat,
        longitude: lng
      }
    }

    // Follow you around the map
    $scope.$on('$geolocation.position.changed', function(event, newPosition){
        if(!($scope.map.center === sydneyLocation && newPosition)){
          return;
        }
        $rootScope.currentLocation = newPosition.coords;
        $scope.map.center = {
            latitude: newPosition.coords.latitude,
            longitude: newPosition.coords.longitude
        };
        // Update the map
        updateData();
    });

    $scope.watchAll = function(){
      for(var p in $rootScope.pokemons){
        $rootScope.watchPokemon($rootScope.pokemons[p]);
      }
      $rootScope.updateMap();
    }

    $scope.watchNone = function(){
      $rootScope.clearLocalStorage();
      $rootScope.updateMap();
    }

    $scope.showHelp = function(){
      swal({
        title: '<h5>How to use</h5>',
        type: 'info',
        html:
          'The map will watch for selected pokemon around you<br/><br/>' +
          'You may filter down by the left menu<br/><br/>' +
          'We Wish this tool will help fellow trainers :).<br/>',
        confirmButtonText:
          'close'
      });
    };

});
