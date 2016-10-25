angular.module('app.controllers', [])
  
.controller('homePageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Pouch) {

}])
   
.controller('calendarCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('gCStatusCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


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
   
.controller('teamsCtrl', ['$scope', '$stateParams', '$timeout', 'Pouch', 'Trip', 'TripSvc', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $timeout, Pouch, Trip, TripSvc) {
	
//	var t = new Trip();
//	t.title = "Trip 2";
//	var rcpt = { type: 'hotel', amount: 482.73 };
//	t.addReceipt(rcpt);
	$timeout(function() {
		console.log('pausing');
		//_runController();
		console.log(TripSvc);
		TripSvc.trips[0].receiptIndex = 1;
		TripSvc.trips[1].receiptIndex = 4;
		TripSvc.saveTrips().then(function() {
			console.log('completed tripSvc save');
		});
	}, 1500);
	
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
 