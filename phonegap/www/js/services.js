tvgaServices.service('tvgaImage', [
    function(){
        
        var imagedata = "";

        return {
            GetImage: function () {
                return imagedata;
            },
            SetImage: function(value) {
                imagedata = value;
                localStorage.setItem("imagedata", imagedata);
            }
        };
    }
]);

tvgaServices.service('cameraPhoto', [
    function(){
        
        var imagedata = "";

        return {
            GetPhoto: function () {
                return imagedata;
            },
            SetPhoto: function(value) {
                imagedata = "data:image/jpeg;base64,"+value;
                //localStorage.setItem("imagedata", imagedata);
            }
        };
    }
]);