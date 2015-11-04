'use strict';

//http://gbayer.com/big-data/app-engine-datastore-how-to-efficiently-export-your-data/
// 4/Yu8YSmD8QKzCoPDYG6IS6Q_UPJDA.InMdB48ftKwVgrKXntQAax1e9q9HfwI

// Declare app level module which depends on filters, and services
var myApp = angular.module('jobq', ['$strap.directives', 'ui.bootstrap', 'ngGrid',
    'jobq.filters', 'jobq.services',
    'jobq.quote.services',
    'jobq.directives',
    'jobq.spinnerServices',
    'jobq.quote.core',
    'jobq.auth']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: DashboardCtrl});
    $routeProvider.when('/new-job', {templateUrl: 'partials/job.html', controller: CreateJobCtrl});
    $routeProvider.when('/edit-job/:jobId',
      {templateUrl: 'partials/edit-job.html', controller: EditJobCtrl});
    $routeProvider.when('/print-job/:jobId', {templateUrl: 'partials/print-job.html', controller: PrintJobCtrl});
    $routeProvider.when('/job-quotes/:jobId', {templateUrl: 'partials/job-quotes.html', controller: EditJobCtrl});

    $routeProvider.when('/view-quote/:quoteId/:workIdx',
      {templateUrl: 'partials/view-quote.html', controller: ViewQuoteCtrl});
    $routeProvider.when('/edit-contract/:quoteId',
    {templateUrl: 'partials/edit-contract.html', controller: EditContractCtrl});
    $routeProvider.when('/edit-outlines/:quoteId/:workIdx', {templateUrl: 'partials/edit-outlines.html', controller: EditOutlineCtrl});

    $routeProvider.when('/print-contract/:quoteId',
    {templateUrl: 'partials/print-contract.html', controller: ViewContractCtrl});
    $routeProvider.when('/view-contract/:quoteId', {templateUrl: 'partials/view-contract.html', controller: ViewContractCtrl});
    
    $routeProvider.when('/edit-works/:quoteId/:workIdx', {templateUrl: 'partials/edit-works.html', controller: EditWorksCtrl});
    $routeProvider.when('/edit-quote/:quoteId/:workIdx', {templateUrl: 'partials/edit-quote.html', controller: EditQuoteCtrl});
    $routeProvider.when('/edit-labours/:quoteId/:workIdx', {templateUrl: 'partials/edit-labours.html', controller: EditLabourCtrl});

    $routeProvider.when('/edit-plants/:quoteId/:workIdx', {templateUrl: 'partials/edit-plants.html', controller: EditPlantCtrl});
    $routeProvider.when('/print-plants/:quoteId',
      {templateUrl: 'partials/print-plants.html', controller: PrintPlantCtrl});

    $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: SettingsCtrl});

    $routeProvider.when('/login', {templateUrl: 'features/auth/login/login.html', controller: LoginCtrl});

    $routeProvider.otherwise({redirectTo: '/dashboard'});
  }]);

myApp.run(['$rootScope', '$location', '$log', '$filter', '$http',
           'Quote','Coolections','QuoteActions', 'Auths','UserProfiles',
   function($rootScope, $location, $log, $filter,$http,
            Quote, Coolections, QuoteActions, Auths, UserProfiles) {
    $rootScope.authenticated = Auths.isAuthenticated();
    Auths.forwardToLogin($location.path());

    $rootScope.location = $location;
    $rootScope.$log = $log;
    $rootScope.capitalize = $filter('capitalize');
    $rootScope.qot = Quote;
    $rootScope.utils = Coolections

    $rootScope.browser = BrowserDetect.browser;
    $rootScope.browserVersion = BrowserDetect.version;
    $rootScope.browserOS = BrowserDetect.OS;

    $rootScope.hostname = window.location.hostname;
    $log.info('myApp hostname: ' + $rootScope.hostname);
    $log.info('myApp path: ' + $rootScope.location.path());
    
    $rootScope.userProfile = {business:{itemTypes:[],chargeRates:{}}};
    
    $rootScope.showMenu = true;
    
    $rootScope.loadUserProfile = function()  {
        var url = createUrl('/userprofiles')
        return $http.get(url).then(function(res) {
            var profile = res.data[0];
            return $rootScope.userProfile = profile;
            //return $rootScope.userProfile;
        });
    }

    $rootScope.findChargeRateByLabour = function(labour) {
        var f;
        $rootScope.userProfile.business.chargeRates.forEach(function(i) {
            if(i.labour == labour) {
                f = i;
            }
        });
        return f;
    }

    $rootScope.findItemType = function(type) {
        var f;
        $rootScope.userProfile.business.itemTypes.forEach(function(i) {
            if(i.type == type) {
                f = i;
            }
        });
        return f;
    }


    $rootScope.loadUserProfile();

    $rootScope.stringify = function(data) {
        return  JSON.stringify(data);
    }

    $rootScope.focus = function(id) {
        window.setTimeout(function() {
            $log.info('focus...' + id);
            $('#' + id).focus();
        },100);
        
    }

    $rootScope.recentJobs = [];

    function isClientExisted(jobs, client) {
        var existed = false;
        jobs.forEach(function(job) {
           if(job.name == client)  {
               existed = true;
           }
        });
        return existed;
    }

    $rootScope.$on('$routeChangeStart', function(evt, cur, prev) {
        var path = $location.path();
        $log.info('$routeChangeStart...' + path);

        Auths.forwardToLogin(path);
    });

    $rootScope.addRecentJob = function(jobId, client) {
        if(!client) {
            return;
        }

        if(isClientExisted($rootScope.recentJobs, client)) {
            return;
        }

        if($rootScope.recentJobs.length > 3) {
            $rootScope.recentJobs.splice(0, 1);
        }

        $log.info('adding recentJobs: ' + client);

        $rootScope.recentJobs.push({path:'/edit-job/'+jobId, name:client});
        //UserProfiles.addRecentJobs(jobId, client);
    }


    $rootScope.jobTabs = [];
    $rootScope.jobTabs.push({key:'edit-job', path:'#/edit-job/',label:'Job'});
    $rootScope.jobTabs.push({key:'job-quotes', path:'#/view-quote/',label:'Quote/Contract', id:'123'});

    $rootScope.dropdown = [];

//    $rootScope.updateQuoteActions = function($scope) {
//        var quoteId = $scope.editing._quoteId;
//        $log.info('updateQuoteActions loc path: ' + $scope.location.path() +
//                  ' quoteId: ' + quoteId);
//
//        $rootScope.quoteActions = [];
//
//        $rootScope.quoteActions.push({
//            "icon":"icon-print",
//            "text": "Summary",
//            "href": "#/view-quote/" + quoteId
//            });
//
//        $rootScope.quoteActions.push({
//            "icon":"icon-edit",
//            "text": "Works",
//            "href": "#/edit-works/" + quoteId
//            });
//
////        if(!emptyWorks($rootScope.editing)) {
//            $rootScope.quoteActions.push({
//                "icon":"icon-edit",
//                "text": "Work Outlines",
//                "href": "#/edit-outlines/" + quoteId
//                });
//            $rootScope.quoteActions.push({
//                "icon":"icon-edit",
//                "text": "Items",
//                "href": "#/edit-quote/" + quoteId
//                });
//            $rootScope.quoteActions.push({
//                "icon":"icon-edit",
//                "text": "Labours",
//                "href": "#/edit-labours/" + quoteId
//                });
//            $rootScope.quoteActions.push({
//                "icon":"icon-edit",
//                "text": "Plants",
//                "href": "#/edit-plants/" + quoteId
//                });
////        }
//
//        angular.forEach($rootScope.quoteActions, function(i) {
//            if(i.href.indexOf($rootScope.location.path()) !== -1) {
//                $rootScope.actionLabel = i.text;
//            }
//        } )
//
//        $rootScope.contractActions = [];
//
//        if(!emptyWorks($rootScope.editing)) {
//            $rootScope.contractActions.push({
//                "icon":"icon-edit",
//                "text": "Edit",
//                "href": "#/edit-contract/" + quoteId
//                });
//    //        $rootScope.contractActions.push({
//    //            "icon":"icon-camera-retro",
//    //            "text": "View",
//    //            "href": "#/view-contract/" + quoteId
//    //            });
//        }
//
//        angular.forEach($rootScope.contractActions, function(i) {
//            if(i.href.indexOf($rootScope.location.path()) !== -1) {
//                $rootScope.actionLabel = i.text;
//            }
//        } )
//
//    }

}]);
