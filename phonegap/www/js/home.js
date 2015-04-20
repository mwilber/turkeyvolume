tvgaControllers.controller('HomeCtrl', ['$scope', '$filter', 
function($scope, $filter) {

    $scope.showHelp = false;
    
    $scope.Init = function(){
        //alert(device.uuid); 
    };
    
    $scope.SetUpGA = function(){
        alert(device.uuid);
        ga('create', 'UA-76054-30', {
            'storage': 'none',
            'clientId':device.uuid
        });
        ga('send', 'pageview', {'page': '/index.html'});  
    };
    
    $scope.Init();
    
}]);