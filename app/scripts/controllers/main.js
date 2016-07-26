'use strict';

/**
* @ngdoc function
* @name pgaApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the pgaApp
*/

angular.module('pgaApp')
.controller('MainCtrl' , function ($scope, $timeout, $interval, $mdSidenav, $rootScope, $http, lodash, pgaTable, $sce, $geolocation, pvApi, $moment) {

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
  $scope.loading = true;
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildDelayedToggler('right');
  $scope.myPosition = $geolocation.position;
  $scope.reportFormUrl = "https://docs.google.com/a/originoffice.com/forms/d/e/1FAIpQLSdwkzgXy1cta5zRzWBS4BL8DQKZhrxe8qdwqDQtabbxziUtPA/viewform";

  $http.get('pokemon.json').success(function(data) {
    // Fetch pokemon List
    $rootScope.pokemons = data;
    if($rootScope.watchedPokemons == null){
      $rootScope.watchedPokemons = [];
      $rootScope.watchAll();
    }
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
    $rootScope.setDistance(distance);
    $rootScope.updateMap();
  }

  $scope.close = function (side) {
    $mdSidenav(side).close();
  };


  $geolocation.getCurrentPosition({
    timeout: 60000
  }).then(function(position) {
    if($scope.myPosition.error){
      swal("Please allow locations for this app to work");
    }
    $rootScope.currentLocation = position.coords;
    updateData();
  });


  // Watch users Location
  $geolocation.watchPosition({
    timeout: 30000,
    maximumAge: 250,
    enableHighAccuracy: true
  });

  // Default Sydney Location when fails
  var sydneyLocation = {
    latitude: -33.8688,
    longitude: 151.2093
  };

  var zoom = 16;

  $scope.map = {
    center: sydneyLocation,
    zoom: zoom,
    markers: [],
    markersEvents: {
      click: function(marker, eventName, model) {
        $scope.map.window.model = model;
        $scope.map.window.show = true;
      }
    },
    window: {
      marker: {},
      show: false,
      closeClick: function() {
        this.show = false;
      },
      options: {}
    }
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
      if(!response.data.status) return;

      if(response.data.pokemon.length){
        // Work out difference
        var newData = response.data.pokemon;
        var add = lodash.differenceWith(newData, $rootScope.surroundingPokemon, deepComare);
        var remove = lodash.differenceWith($rootScope.surroundingPokemon, newData, deepComare);
        var difference = lodash.union(add,remove);

        $rootScope.surroundingPokemon = lodash.unionWith($rootScope.surroundingPokemon,add, deepComare);

        lodash.remove($rootScope.surroundingPokemon,function(p){
          return lodash.includes(remove,p.id);
        });
        $scope.loading = false;
      }
    },function(error){
      swal("Please wait, We will refresh the map in a minute");
      $scope.loading = false;
    });
  }

  $scope.makeCoords = function(lat,lng){
    return {
      latitude: lat,
      longitude: lng
    }
  }

  // Follow you around the map
  $scope.$on('$geolocation.position.changed', function(event, newPosition){
    if(!newPosition){
      return;
    }
    $rootScope.currentLocation = newPosition.coords;
    $scope.map.center = {
      latitude: newPosition.coords.latitude,
      longitude: newPosition.coords.longitude
    };
    // Update on first time
  });

  //Interval update Data
  $interval(updateData, 45000);

  $scope.showHelp = function(){
    swal({
      title: '<h5>How to use</h5>',
      type: 'info',
      html:
      'The map will watch for selected pokemon around you<br/><br/>' +
      'You may filter down by the left menu<br/><br/>' +
      'Tap the pokemon on the map to see countdown timer<br/><br/>' +
      'We Wish this tool will help fellow trainers :).<br/>',
      confirmButtonText:
      'close'
    });
  };

});
