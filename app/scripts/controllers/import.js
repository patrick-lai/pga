
angular.module('pgaApp')
.controller('ImportCtrl', function ($scope, $rootScope, $http, lodash, pgaTable) {
  var sampleInput = [{"Name":"Bulbasaur","ID":1,"Location":"Leumeah Train Station, Foodworks Tahmoor Carpark, Bizim Market Auburn"}];
  var baseGeoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  var keyComponent = "&key="+pgaTable.apiKey;

  $scope.jsonInput = JSON.stringify(sampleInput, null, 4);

  $scope.parsePokemon = function(){
    $scope.parsedCSV = "TimeStamp,pokemonName,pokemonID,Location\n";

    try{
      var parsedJson = JSON.parse($scope.jsonInput);
    }catch(err){
      swal(err);
      return;
    }

    lodash.forEach(parsedJson, function(value,key){
      if(value.Location != undefined && value.Location != null){
        var locations = value.Location.split(',');
        for(var i in locations){
          $http.get(baseGeoCodeUrl+locations[i]+keyComponent).then(function(response){
            if(response.data.results.length > 0){
              var location = response.data.results[0].geometry.location;
              console.log(location);
              $scope.parsedCSV += [Date(),value.Name,value.ID,location.lat+" "+location.lng].join(',') + "\n";
            }
          })
        }
      }
    });

  }

  $scope.parseInput = function(){
    $scope.parsePokemon();
  }

});
