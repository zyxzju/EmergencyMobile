// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('EmergencyMobile', ['ionic', 'services', 'controllers', 'ngCordova'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        alert('掉线啦');
    })

  });
})

// --------路由, url模式设置----------------
.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  //注册与登录
  $stateProvider
    .state('signIn', {
      cache: false,
      url: '/signIn',
      templateUrl: 'templates/signIn/signIn.html',
      controller: 'SignInCtrl'
    })
    .state('register',{
      url:'/register',
      templateUrl:'templates/signIn/register.html',
      controller:'RegisterCtrl'
    })
    .state('location',{
      url:'/location',
      templateUrl:'templates/signIn/location.html',
      controller:'LocationCtrl'
    });

  //急救人员与分流人员
  $stateProvider
    .state('ambulance', {
      url: '/ambulance',
      abstract: true,
      templateUrl: 'templates/ambulance/tabs.html'
    })
    //急救人员
    .state('ambulance.list',{
      url: '/list',
      views:{
        'ambulance':{
        templateUrl: 'templates/ambulance/list.html',
        controller:'AmbulanceListCtrl'
        }
      }
    })
    // .state('ambulance.newPatient',{
    //   url: '/newPatient',
    //   views:{
    //     'ambulance':{
    //     templateUrl: 'templates/ambulance/newPatient.html',
    //     // controller:'ambulancePatientCtrl'
    //     }
    //   }
    // })
        
    .state('newPatient',{
      url: '/newPatient',
        templateUrl: 'templates/ambulance/newPatient.html',
        controller:'NewPatientCtrl'
    })
    .state('injury',{
      url: '/injury',
      templateUrl: 'templates/ambulance/injury.html',
      controller:'InjuryCtrl'
    })
    .state('vitalSign',{
      url: '/vitalSign',
      templateUrl: 'templates/ambulance/vitalSign.html',
      controller:'VitalSignCtrl'
    })
    .state('treatment',{
      url: '/treatment',
      templateUrl: 'templates/ambulance/treatment.html',
      controller:'TreatmentCtrl'
    })
    .state('evacuation',{
      url: '/evacuation',
      templateUrl: 'templates/ambulance/evacuation.html',
      controller:'EvacuationCtrl'
    })
    //分流人员
    .state('ambulance.list1',{
      url: '/list1',
      views:{
        'ambulance':{
        templateUrl: 'templates/ambulance/list1.html',
        // controller:'ambulancePatientCtrl'
        }
      }
    })
    .state('visitInfo',{
      url: '/visitInfo',
      templateUrl: 'templates/ambulance/visitInfo.html',
      controller:'VisitInfoCtrl'
    })
    .state('triage',{
      url: '/triage',
      templateUrl: 'templates/ambulance/triage.html',
      controller:'TriageCtrl'
    })
    .state('ambulance.mine',{
      url: '/mine',
      views:{
       'mine':{
          templateUrl: 'templates/mine/setting.html',
          controller:'SettingCtrl'
        }
      }
    })
    .state('ambulance.myProfile',{
      url: '/myprofile',
      views:{
       'mine':{
          templateUrl: 'templates/mine/myProfile.html',
          controller:'myProfileCtrl'
        }
      }
    })   
    .state('ambulance.setPassword', {
      cache:false,
      url: '/setPassword',
      views:{
       'mine':{
          templateUrl: 'templates/signIn/setPassword.html',
          controller: 'SetPasswordCtrl'
        }
      }      
    });

    //起始页
    $urlRouterProvider.otherwise('/signIn');
  }])

