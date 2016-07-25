'use strict';

/**
* @ngdoc function
* @name pgaApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the pgaApp
*/
angular.module('pgaApp')
.controller('PokedexCtrl', function ($scope, $timeout, $rootScope, $mdSidenav, pgaTable) {

  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('left').close()
      .then(function () {
        // Do nothing
      });
  };

  $scope.togglePokemonWatch = function(pokemon){
    if($rootScope.isWatchingPokemon(pokemon)){
      $rootScope.unWatchPokemon(pokemon);
    }else{
      $rootScope.watchPokemon(pokemon);
    }
    $rootScope.$broadcast('surroundingPokemonChanged');
  }

});
