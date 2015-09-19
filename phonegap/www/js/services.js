tvgaServices.service('tvgaImage', [
    function(){
        
        //var imagedata = "";
        var dims = {
            height:0,
            width:0,
            depth:0
        };
        var tvol = 0;

        return {
            GetImage: function () {
                return localStorage.getItem("imagedata");
            },
            SetImage: function(value) {
                //imagedata = value;
                localStorage.setItem("imagedata", value);
            },
            GetDims: function () {
                return dims;
            },
            SetDims: function(pH, pW, pD) {
                dims.height = pH;
                dims.width = pW;
                dims.depth = pD;
            },
            GetVol: function(){
                return tvol;
            },
            SetVol: function(value) {
                tvol = value;
            },
        };
    }
]);

tvgaServices.service('cameraPhoto', [
    function(){
        
        //var imagedata = "";

        return {
            GetPhoto: function () {
                return localStorage.getItem("photodata");
            },
            SetPhoto: function(value) {
                localStorage.setItem("photodata", value);
            }
        };
    }
]);

tvgaServices.service('veganMode', [
    function(){
        
        var veganMode = false;

        return {
            Get: function () {
                return veganMode;
            },
            Set: function(value) {
                veganMode = value;
            }
        };
    }
]);

// Store and retrieve base64 datafiles in local DB
tvgaServices.service('cacheDb', [
    function(){

        var activeFileIdx = "";
        var cachedb = openDatabase('localcache', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
        cachedb.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS tblCache (cacheId INTEGER PRIMARY KEY, cacheName TEXT, cacheData TEXT, cacheTimeStamp INTEGER)");
        });

        return {
            Get: function (pKey) {
                return new Promise(function(resolve, reject) {
                    cachedb.transaction(function (tx) {
                        tx.executeSql('SELECT * FROM tblCache WHERE cacheName=?', [pKey], function(tx, result){
                            try{
                                resolve(result.rows.item(0).cacheData);
                            }catch(err){
                                reject(err);
                            }
                        }, function(result, error){reject(error);});
                    });
                });
            },
            Set: function(pKey, pValue) {
                return new Promise(function(resolve, reject) {
                    // Check for an existing key
                    cachedb.transaction(function (tx) {
                        tx.executeSql('SELECT * FROM tblCache WHERE cacheName=?', [pKey], function(tx, result){
                            if( result.rows.length > 0 ){
                                tx.executeSql('UPDATE tblCache SET cacheData=?, cacheTimeStamp=? WHERE cacheId=?',
                                    [pValue, Date.now(), result.rows.item(0).cacheId], function(tx, response){
                                        status = result.rows.item(0).cacheId;
                                        console.log('Updating tblCache: '+status);
                                        resolve(status);
                                }, function(result, error){console.log(error);reject(error);});
                            }else{
                                tx.executeSql('INSERT INTO tblCache (cacheName, cacheData, cacheTimeStamp) VALUES ( ?, ?, ? )',
                                    [pKey, pValue, Date.now()], function(tx, response){
                                        status = response.insertId;
                                        console.log('Inserting into tblCache: '+status);
                                        resolve(status);
                                }, function(result, error){console.log(error);reject(error);});
                            }
                        }, function(result, error){console.log(error);reject(error);});
                    });
                });
            },
            Clear: function(){
                cachedb.transaction(function (tx) {
                    tx.executeSql("DROP TABLE IF EXISTS tblCache");
                    tx.executeSql("CREATE TABLE IF NOT EXISTS tblCache (cacheId INTEGER PRIMARY KEY, cacheName TEXT, cacheData TEXT, cacheTimeStamp INTEGER)");
                });
            }
        };
    }
]);