angular.module('app.services')

.service('ImageSvc', function($q, $log, $cordovaCamera) {
    var self = this;
	self.currentImage;
	self.takePicture = _takePicture;		
		    
    function _takePicture(useLibrary) {
        var options = {
          quality: 80,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: (useLibrary==0)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 850,
          targetHeight: 1100,
          saveToPhotoAlbum: false
        };
        var outputFile = "";
        var imgData = "";
        var blob;
        var imageId;
        var imageFile = "";
        var currentImage = {};
		
		return $cordovaCamera.getPicture(options)
        .then(function(imageData) {
            //placeholder for now to allow passing thru the promise chain...
			$log.info('cordovaCamera.getPicture: ' + imageData);
			currentImage.imageData = imageData;
            return _getImageFileEntry(imageData);
		}).then(function(fileEntry) {
			$log.info('File.getFileEntry: ' + fileEntry);
			currentImage.imageFileEntry = fileEntry;
			return _getImageFile(fileEntry);
		}).then(function(file) {
			$log.info('File.getFile: ' + file);
			currentImage.imageFile = file;
			self.currentImage = currentImage;
			return file;
    	}).catch(function(error) {
            $log.error('_takePicture error: ' + error);
			return;
        });        
    }
    
    function _getImageFileEntry(fileUri) {        
        return $q(function(resolve, reject) {
            window.resolveLocalFileSystemURI(fileUri,function(fileEntry) {
                resolve(fileEntry);
            }, function(error) {
                reject(error);
            });
        });
    }
		
    function _getImageFile(fileEntry) {        
        return $q(function(resolve, reject) {
            fileEntry.file(function(file) {
                resolve(file);
            }, function(error) {
                reject(error);
            });
        });
    }
        
	return self;
})
