angular
	.module('app.services')
	.service('Pouch', pouchService);

function pouchService($log) {
	var self = this;
	_initDB();
	
	self.reset = function() {
		return self.db.destroy().then(function(result) {
			$log.info('successfully destroyed database');
		}).catch(function(err) {
			$log.error(err);
		});
	};
	
	function _initDB() {
		self.db = new PouchDB('gcmobile');
	}
	
	return self;
}