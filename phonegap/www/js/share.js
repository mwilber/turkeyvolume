tvgaControllers.controller('ShareCtrl', ['$scope', '$element', '$http', 'tvgaImage', 'cacheDb', 
function($scope, $element, $http, tvgaImage, cacheDb) {
    
    $scope.tkyImage;
    $scope.publishStatus = false;
    $scope.shareUrl = "";
    $scope.shareUrlRoot = "";
    $scope.metadata = {
        title:"Turkey Volume", 
        link:"http://www.turkeyvolumeguessingapp.com", 
        image:"http://www.turkeyvolumeguessingapp.com/img/share.gif",
        message:"Express your space in terms of Turkeys!",
        description:"Express your space in terms of Turkeys!"
    };
    
    //console.log('banner', $scope.gzad_banner);

    
    //console.log($element[0]);
    
    //$scope.canvasHeight-($scope.canvasHeight/3)
    
    console.log('share.js');
    
    $scope.Init = function(){
        
        console.log('initting');
        
        //Set up the ad here
        if( localStorage['gzad_banner'] ){
            try{
               console.log('found banner');
                var doc = document.getElementById('gzad_banner').contentWindow.document;
                doc.open();
                doc.write(atob(localStorage['gzad_banner']));
                doc.close();
            }catch(e){
                console.log('something went horribly wrong with the ad.');
            }
        }
        
        console.log('getting the image');
        cacheDb.Get('canvasComposite').then(function(result) {
            $scope.tkyImage = result;
            //console.log("share", $scope.tkyImage);
            $scope.$apply();
        }).catch(function(error) {
            console.log('catching for some reason');
        });
    };
    
    $scope.TurkeySave = function(){
        try{
            ga('send', 'event', 'button', 'click', 'share_save', 0);
        }catch(exception){
            console.log("ga fail");
        }
        $scope.publishStatus = true;
        //var img = $scope.tkyVol.stage.canvas.toDataURL("image/png");
        //console.log(img);
        
        var postData = {
            cloudName: 'TVGApp',
    		cloudImage: $scope.tkyImage,
            cloudHeight: tvgaImage.GetDims().height,
            cloudWidth: tvgaImage.GetDims().width,
            cloudDepth: tvgaImage.GetDims().depth,
    		cloudDataStart: '',
    		cloudDataFinish: tvgaImage.GetVol(),
    		profileId: '',
    		cloudComment: '',
    		checkinTwitter: '',
    		decoy: 'nothinghere',
    	};
        
        $http.post('https://turkeyvolume.herokuapp.com/reactor/jsonapi/share', postData).success(function(response){
        //$http.post('https://gibson.loc/turkeyvolume/reactor/jsonapi/share', postData).success(function(response){
            console.log("Saving list...");
            console.log(response);
            $scope.shareUrl = response.url;
            $scope.metadata.image = response.img;
            $scope.metadata.title = tvgaImage.GetVol()+" Turkeys Will Fit In This Space";
            $scope.publishStatus = false;

        }).error(function(){
            alert('Something went wrong. Please try again.');
            $scope.publishStatus = false;
        });
    };
    
    $scope.FbShare = function(){
        try{
            ga('send', 'event', 'button', 'click', 'share_fb', 0);
        }catch(exception){
            console.log("ga fail");
        }
        var fbcontent = "https://www.facebook.com/dialog/feed?app_id=1646252625586188&link="+escape($scope.shareUrl)+"&picture="+escape($scope.metadata.image)+"&name="+escape($scope.metadata.title)+"&message="+escape($scope.metadata.message)+"&description="+escape($scope.metadata.description)+"&redirect_uri=https://facebook.com/";
        window.open(fbcontent, '_system');
        return false;
    };
    
    $scope.TwShare = function(){
        try{
            ga('send', 'event', 'button', 'click', 'share_tw', 0);
        }catch(exception){
            console.log("ga fail");
        }
        var twurl = "https://mobile.twitter.com/compose/tweet?status="+escape($scope.metadata.title)+escape(": ")+escape($scope.shareUrl)+escape(" ")+escape($scope.metadata.description);
        window.open(twurl, '_system');
        return false;
    };
    
    $scope.EmShare = function(){
        try{
            ga('send', 'event', 'button', 'click', 'share_em', 0);
        }catch(exception){
            console.log("ga fail");
        }
        var emurl = "mailto:?subject="+escape($scope.metadata.title)+"&body="+escape($scope.metadata.message)+escape(": ")+escape($scope.shareUrl)+"%0D%0A%0D%0A"+escape($scope.metadata.description)+" "+escape($scope.metadata.link);
        window.open(emurl, '_system');
        return false;
    };
    
    $scope.GpShare = function(){
        try{
            ga('send', 'event', 'button', 'click', 'share_gp', 0);
        }catch(exception){
            console.log("ga fail");
        }
        var gpcontent = "https://plus.google.com/share?url="+escape($scope.shareUrl)+"&description="+escape($scope.metadata.description);
        window.open(gpcontent, '_system');
        return false;
    };
    
    $scope.PnShare = function(){
        try{
            ga('send', 'event', 'button', 'click', 'share_pn', 0);
        }catch(exception){
            console.log("ga fail");
        }
        var pncontent = "https://pinterest.com/pin/create/button/?url="+escape($scope.shareUrl)+"&media="+escape($scope.metadata.image)+"&description="+escape($scope.metadata.title)+escape('! ')+escape($scope.metadata.description)+escape('.');
        window.open(pncontent, '_system');
        return false;
    };
    
    $scope.Init();
    
}]);