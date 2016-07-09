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

  $scope.setPokemon = function(pokemon){
    $rootScope.currentPokemon = pokemon;
    $scope.close();
  };

  $scope.reportSighting = function(pokemon){
    swal({
      title: 'Was there a ' + pokemon.name + " around this area?",
      text: "You must allow locations.",
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#FF754A',
      cancelButtonColor: '#bbb',
      confirmButtonText: 'Yes'
    }).then(function() {

      pgaTable.reportSighting(pokemon).then(function(response){
        swal(
          'Marked!!',
          'Your Sighting has been marked',
          'success'
        );

        $scope.close();
      });

    });
  };

});
