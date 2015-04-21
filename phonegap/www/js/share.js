tvgaControllers.controller('ShareCtrl', ['$scope', '$element', '$http', 'tvgaImage',
function($scope, $element, $http, tvgaImage) {
    
    $scope.tkyImage;

    
    console.log($element[0]);
    
    //$scope.canvasHeight-($scope.canvasHeight/3)
    
    $scope.Init = function(){
        $scope.tkyImage = tvgaImage.GetImage();
        console.log("share", $scope.tkyImage);
        $scope.$apply();
    };
    
    $scope.TurkeySave = function(){
        //var img = $scope.tkyVol.stage.canvas.toDataURL("image/png");
        //console.log(img);
        
        var postData = {
            cloudName: 'TVGApp',
    		cloudImage: $scope.tkyImage,
    		cloudDataStart: '',
    		cloudDataFinish: '',
    		profileId: '',
    		cloudComment: '',
    		checkinTwitter: '',
    		decoy: 'nothinghere',
    	};
        
        $http.post('https://turkeyvolume.herokuapp.com/reactor/jsonapi/share', postData).success(function(response){
        //$http.post('https://gibson.loc/turkeyvolume/reactor/jsonapi/share', postData).success(function(response){
            console.log("Saving list...");
            console.log(response);

        }).error(function(){
            alert('Something went wrong. Please try again.');
        });
    };
    
    $scope.Init();
    
}]);