tvgaServices.service('tvgaImage', [
    function(){
        
        var imagedata = "";
        var dims = {
            height:0,
            width:0,
            depth:0
        };

        return {
            GetImage: function () {
                return imagedata;
            },
            SetImage: function(value) {
                imagedata = value;
                localStorage.setItem("imagedata", imagedata);
            },
            GetDims: function () {
                return dims;
            },
            SetDims: function(pH, pW, pD) {
                dims.height = pH;
                dims.width = pW;
                dims.depth = pD;
            },
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
                imagedata = value;
                //localStorage.setItem("imagedata", imagedata);
            }
        };
    }
]);