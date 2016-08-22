angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.homePage', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/homePage.html',
        controller: 'homePageCtrl'
      }
    }
  })

  .state('tabsController.calendar', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/calendar.html',
        controller: 'calendarCtrl'
      }
    }
  })

  .state('tabsController.gCStatus', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/gCStatus.html',
        controller: 'gCStatusCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('queue', {
    url: '/queue',
    templateUrl: 'templates/queue.html',
    controller: 'queueCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

  .state('tabsController.teams', {
    url: '/teams',
    views: {
      'tab1': {
        templateUrl: 'templates/teams.html',
        controller: 'teamsCtrl'
      }
    }
  })

  .state('history', {
    url: '/history',
    templateUrl: 'templates/history.html',
    controller: 'historyCtrl'
  })

  .state('tabsController.arizona', {
    url: '/teams/arizona',
    views: {
      'tab1': {
        templateUrl: 'templates/arizona.html',
        controller: 'arizonaCtrl'
      }
    }
  })

  .state('tabsController.arizonaSt', {
    url: '/teams/asu',
    views: {
      'tab1': {
        templateUrl: 'templates/arizonaSt.html',
        controller: 'arizonaStCtrl'
      }
    }
  })

  .state('tabsController.login', {
    url: '/page11',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/teams')

  

});