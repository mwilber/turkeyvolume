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