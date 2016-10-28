angular.module('app.controllers', [])
  
.controller('homePageCtrl', ['$scope', '$stateParams', 'TripSvc', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Pouch, TripSvc) {
	

}])
   
.controller('calendarCtrl', ['$scope', '$stateParams', 'ImageSvc', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, ImageSvc) {
	
	$scope.imageSvc = ImageSvc;
	$scope.blobUrl = ImageSvc.currentImage.imageUrl;

}])
   
.controller('gCStatusCtrl', ['$scope', '$log', '$stateParams', 'ImageSvc', 'Pouch', 'TripSvc', 'Receipt', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $log, $stateParams, ImageSvc, Pouch, TripSvc, Receipt) {
	
	$scope.imageSvc = ImageSvc;
	$scope.takePic = function() {
		ImageSvc.takePicture().then(function(file) {
			//create a receipt, set the title and vendor defaults
            var rcpt = new Receipt();
            rcpt.title = 'rcpt ' + moment().format('YYMMDD.hhmmss');
            rcpt.vendor = 'some travel vendor';
            
            TripSvc.trips[0].addReceipt(rcpt, file).then(function(imgUrl) {
                ImageSvc.currentImage.imageUrl = imgUrl;
            });
            
//			Pouch.db.putAttachment(docId, attachId, file, 'image/jpeg')
//			.then(function (result) {
//				// handle result
//				$log.log(result);
//				return Pouch.db.getAttachment(docId, attachId);
//			}).then(function(blob) {
//				if (blob) {
//					$log.info(blob);
//					ImageSvc.currentImage.imageUrl = URL.createObjectURL(blob);
//					$log.info(ImageSvc.currentImage.imageUrl);
//				}
//			}).catch(function (err) {
//				console.log(err);
//			});	
		});
	}
}])
         
.controller('queueCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('settingsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('teamsCtrl', ['$scope', '$q', '$log', '$stateParams', '$timeout', 'Pouch', 'Trip', 'TripSvc', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $q, $log, $stateParams, $timeout, Pouch, Trip, TripSvc) {
	var self = this;
	self.trips = [];
    $scope.tripSvc = TripSvc;
	$scope.initDb = _initDb;
    $scope.getAttachments = _getAttchments;
    $scope.atts = [];
    
	_init();	
	
	function _init() {
		TripSvc.ready.then(function() {
			$log.info('controller started');
			//Pouch.reset();
			//_addTrip().then(function() { _addTrip(); });
		});
	}
    function _initDb() {
        Pouch.reset()
        .then(function() {
            _addTrip().then(function() { _addTrip(); });                    
        }).catch(function(err) {
            $log.error(err);
        })
    }
    
    function _getAttchments() {
        $scope.atts = [];
        var t = TripSvc.trips[0];
        var chain = $q.when();
        t.receipts.forEach(function(r) {
            $log.info('Receipt: ' + r.title);
            chain.then(function() {
                return Pouch.db.getAttachment(t.receiptDocId, r.attachId)
                .then(function(blob) {
                    $log.info(URL.createObjectURL(blob));
                    var imgSrc = URL.createObjectURL(blob)
                    $scope.atts.push({image: imgSrc});
                    $scope.$apply();
                });
            })
        });
        return Pouch.db.getAttachment
    }

	function _addTrip() {
		var tripIndex = TripSvc.trips.length;
		var t = new Trip();
		t.title = 'Trip #' + (tripIndex + 1);		
		return TripSvc.addTrip(t);
	}
	
	function _runController() {
	var attachment = 
			"TGVnZW5kYXJ5IGhlYXJ0cywgdGVhciB1cyBhbGwgYXBhcnQKTWFrZS" +
			"BvdXIgZW1vdGlvbnMgYmxlZWQsIGNyeWluZyBvdXQgaW4gbmVlZA==";
	var title = 'att' + ((TripSvc.trips[1]._attachments?Object.keys(TripSvc.trips[1]._attachments).length:1) + 2).toString() + '.txt';
	Pouch.db.putAttachment(TripSvc.trips[1]._id, title, TripSvc.trips[1]._rev, attachment, 'text/plain').then(function (result) {
		// handle result
		console.log(result);
		return Pouch.db.get(TripSvc.trips[1]._id, { attachments:true });
	}).then(function(tripDoc) {
		console.info(tripDoc);
		var updatedTrip = new Trip(tripDoc);
		TripSvc.trips[1] = updatedTrip;
		//delete tripDoc._attachments;
		console.info(TripSvc.trips[1]);
//		return Pouch.db.put(tripDoc);
//	}).then(function(result) {
//		console.info(result);		
	}).catch(function (err) {
  		console.log(err);
	});	
	}
	
//	console.log(t);
//	Pouch.db.post(t).then(function(result) {
//		console.info(result);
//	}).catch(function(err) {
//		console.error(err);
//	});

}])
   
.controller('historyCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('arizonaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('arizonaStCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('loginCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 