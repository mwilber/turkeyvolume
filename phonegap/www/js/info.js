tvgaControllers.controller('InfoCtrl', ['$scope', '$http', 'veganMode', 
function($scope, $http, veganMode) {
   
   $scope.veganset = veganMode.Get();
   
   $scope.$watch('veganset', function() {
       console.log('veganmode has changed!', $scope.veganset);
       if( $scope.veganset ){
           veganMode.Set(true);
       }else{
           veganMode.Set(false);
       }
       
   });
    
    $scope.ViewGZPage = function(){
        try{
            ga('send', 'event', 'button', 'click', 'gzprod', 0);
        }catch(exception){
            console.log("ga fail");
        }
        window.open('http://apps.greenzeta.com/', '_system', 'location=no');
    };
    
    $scope.ViewGZHomePage = function(){
        try{
            ga('send', 'event', 'button', 'click', 'gzprod', 0);
        }catch(exception){
            console.log("ga fail");
        }
        window.open('http://www.greenzeta.com/', '_system', 'location=no');
    };
    
    $scope.CkVeganMode = function(evt){
        console.log(evt);
    };

}]);