angular.module('app.services', [])

.service('TripSvc', ['$q', '$log', 'Pouch', 'Trip', function($q, $log, Pouch, Trip){
	
	var self = this;
	self.trips = [];
	self.addTrip = _addTrip;
	self.saveTrips = _saveTrips;
	self.ready = _init();
	
	function _init() {
		return Pouch.db.allDocs({ include_docs:true, attachments:true })
		.then(function(result) {
			console.info(result);
			result.rows.forEach(function(r) {
				if (r.doc.tripDate) {
					var t = new Trip(r.doc);
					self.trips.push(t);
					$log.log('init trip: ' + t._id);
				} else { $log.log('not a trip record'); }
			});
			return result;
		}).catch(function(error) {
			$log.error(err);
			return false;
		});
//		}).then(function() {
//			console.log('tripCount: ' + self.trips.length);
//		});
	}
	
	function _addTrip(trip) {
		self.trips.push(trip);
		return Pouch.db.put(trip)
			.then(function(result) {
				console.info('Trip successfully added to pouchdb');				
			}).catch(function(err) {
				console.error(err);
			});
	}
	
	function _saveTrips() {
		var chain = $q.when();
		self.trips.forEach(function(t) {
			chain = chain.then(_saveTrip(t));
		});
		return chain;
	}
			
	function _saveTrip(doc) {
		//needs to be a factory to all sequential promise chaining in _saveTrips()
		return function() {
			return Pouch.db.put(doc).then(function(result) {
				console.log('SaveTrip...');
				console.log(result);
				return result;
			}).catch(function(err) {
				console.error('Err_SaveTrip:');
				console.error(err);
				return false;
			});
		};
	}

}])

.factory('Trip', function($log, Pouch) {
    var Trip = function(data) {
        var self = this;
		this._id = moment().format('YYYYMMDD.hhmmss.SSS');
        this.title = "";
		this.tripDate = moment().toDate();
		this.receipts = [];
		
		if (data) {
            //boolean attributes from the JSON data
			self._id = data['_id'];
			self._rev = data['_rev'];
			self._attachments = data['_attachments'];
            self.title = data['title'];
            self.tripDate = moment(data['tripDate']).toDate();
			
			if (data.receipts && data.receipts.length > 1) {
				data.receipts.forEach(function(r) {
					self.receipts.push(r);
				});
			}
        }
		
		Trip.prototype.addReceipt = function(r) {
			var self = this;			
//			var attachment = 
//					"TGVnZW5kYXJ5IGhlYXJ0cywgdGVhciB1cyBhbGwgYXBhcnQKTWFrZS" +
//					"BvdXIgZW1vdGlvbnMgYmxlZWQsIGNyeWluZyBvdXQgaW4gbmVlZA==";
			var attachment = r.imageFile;
			self.receipts.push(r);
			
//			Pouch.db.putAttachment(self._id, r.attachmentId, self._rev, attachment, 'image/jpeg')
//			.then(function (result) {
//				// handle result
//				$log.log(result);
//				return Pouch.db.get(TripSvc.trips[1]._id, { attachments:true });
//			}).then(function(tripDoc) {
//				$log.info(tripDoc);
//				var updatedTrip = new Trip(tripDoc);				
//				TripSvc.trips[1] = updatedTrip;
//				//delete tripDoc._attachments;
//				console.info(TripSvc.trips[1]);
//		//		return Pouch.db.put(tripDoc);
//		//	}).then(function(result) {
//		//		console.info(result);		
//			}).catch(function (err) {
//				console.log(err);
//			});	
		}
    }

    return Trip;
});