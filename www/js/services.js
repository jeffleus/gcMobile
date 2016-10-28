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
        this.receiptDocId = 'rcpts_' + this._id;
        this.receiptRev = '0-0';
        this.receiptIndex = 0;
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
            self.receiptIndex = data['receiptIndex'];
            self.receiptDocId = data['receiptDocId'];
            self.receiptRev = data['receiptRev'];
			
			if (data.receipts && data.receipts.length > 1) {
				data.receipts.forEach(function(r) {
					self.receipts.push(r);
				});
			}
        }
		
		Trip.prototype.addReceipt = function(r, file) {
			var self = this;
            r.attachId = 'receipt_' + (++self.receiptIndex) + '.jpg';
            var receiptResult = {};
            return _saveAttachment.call( self, r.attachId, file )
                .then(function(result){
                    self.receiptIndex++;
                    self.receiptRev = result.receiptRev;
                    self.receipts.push(r);
                    receiptResult.imageUrl = result.imageUrl;
                    return Pouch.db.put(self);
                }).then(function(result) {
                    self._rev = result.rev;
                    return receiptResult.imageUrl; 
                }).catch(function(err) {
                    self.receiptIndex--;
                    $log.error(err);
                });
		};
        
        function _saveAttachment(attachId, file) {
            //grab the docId for receipt master doc from this trip object
            var docId = this.receiptDocId;
            //setup the latest document revision nunmber if not new
            var attachmentResult = {};
            var rev = (this.receiptRev!=="0-0")?this.receiptRev:undefined;
            //put the image file in the receipt master doc
			return Pouch.db.putAttachment(docId, attachId, rev, file, 'image/jpeg')
                .then(function (result) {
                    //log the result and update the trip to hold the latest revision for the master doc
                    $log.log(result);
                    attachmentResult.receiptRev = result.rev;
                    //then, grab the image file blob using getAttachment
                    return Pouch.db.getAttachment(docId, attachId);
                }).then(function(blob) {
                    if (blob) {
//                        $log.info(blob);
//                        //set the imageUrl of the current image as an object URL for the blob data
//                        ImageSvc.currentImage.imageUrl = URL.createObjectURL(blob);
//                        $log.info(ImageSvc.currentImage.imageUrl);
                        attachmentResult.imageUrl = URL.createObjectURL(blob);
                        return attachmentResult;
                    }
                }).catch(function (err) {
                    console.log(err);
                });            
        }
    }

    return Trip;
})

.factory('Receipt', function($log) {
    var Receipt = function(data) {
        var self = this;
        this.title = "";
        this.vendor = "";
        this.receiptDate = moment().toDate();
		
		if (data) {
            //boolean attributes from the JSON data
            self.title = data['title'];
            self.vendor = data['vendor'];
            self.receiptDate = moment(data['receiptDate']).toDate();
            //picked up once saved to the pouchdb w/ an attachment
            self.docId = data['docId'];
            self.attachId = data['attachId'];			
        }
    }

    return Receipt;
});