angular.module('app.services', [])

.service('TripSvc', ['$q', 'Pouch', 'Trip', function($q, Pouch, Trip){
	
	var self = this;
	self.trips = [];
	self.addTrip = _addTrip;
	self.saveTrips = _saveTrips;
	_init();
	
	function _init() {
		Pouch.db.allDocs({ include_docs:true, attachments:true }).then(function(result) {
			console.info(result);
			result.rows.forEach(function(r) {
				var t = new Trip(r.doc);
				self.addTrip(t);
				console.log('add trip: ' + t._id);
			});
			return result;
		}).then(function() {
			console.log('tripCount: ' + self.trips.length);
		});
	}
	
	function _addTrip(trip) {
		self.trips.push(trip);
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
			});
		};
	}

}])

.factory('Trip', function() {
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
			self.receipts.push(r);
		}
    }

    return Trip;
});