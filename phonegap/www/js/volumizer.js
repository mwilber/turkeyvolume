tvgaControllers.controller('VolumizerCtrl', ['$scope', '$rootScope', '$element', '$http', 'tvgaImage', 'cameraPhoto', 'veganMode', 'cacheDb', 
function($scope, $rootScope, $element, $http, tvgaImage, cameraPhoto, veganMode, cacheDb) {
    
    $rootScope.tkyVol;
    $scope.showHelp = false;
    $scope.dummyphoto = "";
    $scope.canvasWidth = 1024;
    $scope.canvasHeight = 1024;
    $scope.canvasMarginTop = -($element[0].clientWidth*1.06);
    $scope.canvasMarginLeft = ($element[0].clientWidth*0.03);
    $scope.canvasScale = ($element[0].clientWidth*0.94)/$scope.canvasWidth
    $scope.canvasStyle = "-ms-transform-origin:0% 0%; -webkit-transform-origin: 0% 0%; transform-origin: 0% 0%; -ms-transform: scale("+$scope.canvasScale+"); -webkit-transform: scale("+$scope.canvasScale+"); transform: scale("+$scope.canvasScale+");"
    $scope.actualHeight = "(not set)";
    $scope.actualWidth = "(not set)";
    $scope.actualDepth = "(not set)";
    $scope.fillReady = "true";
    $scope.canvasHide = false;
    $scope.canvasMsg = "Loading...";
    
    $scope.ddim = "h";
    $scope.dval = "";
    $scope.dunit = "f";
    
    console.log($element[0]);
    //$element[0].clientWidth
    //$scope.canvasHeight-($scope.canvasHeight/3)
    
    $scope.Init = function(){
        
        //console.log("OLD TKYVOL",$rootScope.tkyVol);
        
        //alert("Take Pic Here");
        cacheDb.Get('canvasPhoto').then(function(result) {
            var tkyOpts = {
                'extrude_multiplier':(150*($scope.canvasWidth/1024)),
                'copy_margin':(50*($scope.canvasWidth/1024)),
                'line_size':(10*($scope.canvasWidth/1024)),
                'dot_size':(10*($scope.canvasWidth/1024)),
                'tab_radius':(75*($scope.canvasWidth/1024)),
                'element':{
                    'id':'volumizer',
                    'height':$scope.canvasHeight,
                    'width':$scope.canvasWidth,
                },
                'start_rect':{
                    width:$scope.canvasHeight-($scope.canvasHeight/3),
                    height:$scope.canvasHeight-($scope.canvasHeight/3),
                    x:($scope.canvasHeight/6),
                    y:($scope.canvasHeight/9),
                },
                'backgroundData':result,
                'vegan_mode':veganMode.Get(),
            };
            $rootScope.tkyVol = new TurkeyVol(tkyOpts);
            //console.log("NEW TKYVOL",$rootScope.tkyVol);
            
            //$rootScope.tkyVol.InitDim('w',3);
        }).catch(function(error) {
            console.log('catching for some reason');
        });
        
        
    };
    
    $scope.OpenDimModal = function(){
        try{
            ga('send', 'event', 'button', 'click', 'dim_open', 0);
        }catch(exception){
            console.log("ga fail");
        }
        mdim.show('modal');
        //console.log("NEW TKYVOL",$rootScope.tkyVol);
        $scope.CkSizeInput();
    };
    
    $scope.CkSizeInput = function(){
        if( $scope.dval == "" ) $('#dval').focus();
    };
    
    $scope.SetDim = function(){
        try{
            ga('send', 'event', 'button', 'click', 'dim_set', 0);
        }catch(exception){
            console.log("ga fail");
        }
        //var th = prompt("enter height");
        $rootScope.tkyVol.InitDim($scope.ddim,$scope.dval, $scope.dunit);
        mdim.hide();
    };
    
    $scope.TurkeyFill = function(){
        
        $scope.canvasMsg = "COUNTING TURKEYS";
        $scope.canvasHide = true;
        
        try{
            ga('send', 'event', 'button', 'click', 'turkey_get', 0);
        }catch(exception){
            console.log("ga fail");
        }
        
        
        
        
        $rootScope.tkyVol.Fill($rootScope.tkyVol).then(function(tvol){
            console.log('volume', tvol);
            tvgaImage.SetVol(tvol);
            //var img = $rootScope.tkyVol.stage.canvas.toDataURL("image/png");
            //console.log(img);
            //tvgaImage.SetImage($rootScope.tkyVol.stage.canvas.toDataURL("image/png"));
            cacheDb.Set('canvasComposite', $rootScope.tkyVol.stage.canvas.toDataURL("image/png")).then(function(result) {
                tvgaImage.SetDims($rootScope.tkyVol.GetDim('h'), $rootScope.tkyVol.GetDim('w'), $rootScope.tkyVol.GetDim('d'));
                $rootScope.tkyVol.Destroy();
                $rootScope.tkyVol = null;
                myNavigator.pushPage('share.html');
            }).catch(function(error) {
                console.log('catching for some reason');
                alert("Could not save photo. Please try again.")
            });
        }).catch(function(error){
            console.log('error filling');
        });
        
    };
    
    $scope.TurkeySave = function(){
        
    };
    
    $(document).bind("seth", function(){
        //console.log("NEW TKYVOL",$rootScope.tkyVol);
        $scope.actualHeight = (parseFloat($rootScope.tkyVol.GetDim('h')).round(1))+" "+$rootScope.tkyVol.GetUnit();
        $scope.$apply();
    });
    $(document).bind("setw", function(){
        $scope.actualWidth = (parseFloat($rootScope.tkyVol.GetDim('w')).round(1))+" "+$rootScope.tkyVol.GetUnit();
        $scope.$apply();
    });
    $(document).bind("setd", function(){
        $scope.actualDepth = (parseFloat($rootScope.tkyVol.GetDim('d')).round(1))+" "+$rootScope.tkyVol.GetUnit();
        $scope.$apply();
    });
    
    $scope.Init();
    
}]);