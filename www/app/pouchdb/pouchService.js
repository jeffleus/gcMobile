angular
	.module('app.services')
	.service('Pouch', pouchService);

function pouchService() {
	var self = this;
	self.db = new PouchDB('gcmobile');
	
	return self;
}