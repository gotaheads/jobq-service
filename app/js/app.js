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
    'jobq.auth',
    'jobq.quotes']).
  config(['$routeProvider', '$provide', '$httpProvider', function($routeProvider, $provide, $httpProvider) {
    //$provide.factory('myHttpInterceptor', function($q, $location) {
    //    return function(promise) {
    //        return promise.then(function(response) {
    //            // do something on success
    //        }, function(response) {
    //            var status = response.status;
    //            switch (status) {
    //                case 401:
    //                case 403:
    //                    console.error('401/403');
    //                    //$location.path('/login');
    //            }
    //            //// do something on error
    //            //if (canRecover(response)) {
    //            //    return responseOrNewPromise
    //            //}
    //
    //            return $q.reject(response);
    //        });
    //    }
    //});
    //
    //$httpProvider.responseInterceptors.push('myHttpInterceptor');

    $routeProvider.when('/dashboard', {templateUrl: 'features/dashboards/dashboard.html', controller: DashboardCtrl});
    $routeProvider.when('/new-job', {templateUrl: 'partials/job.html', controller: CreateJobCtrl});

    $routeProvider.when('/edit-job/:jobId',
      {templateUrl: 'features/jobs/edit/edit-job.html', controller: EditJobCtrl});
    $routeProvider.when('/print-job/:jobId',
      {templateUrl: 'features/jobs/print/print-job.html', controller: PrintJobCtrl});

    $routeProvider.when('/job-quotes/:jobId',
      {templateUrl: 'partials/job-quotes.html', controller: EditJobCtrl});

    $routeProvider.when('/view-quote/:quoteId/:workIdx',
      {templateUrl: 'features/quotes/view/view-quote.html', controller: ViewQuoteCtrl});
    $routeProvider.when('/view-quote/:quoteId',
      {templateUrl: 'features/quotes/view/view-quote.html', controller: ViewQuoteCtrl});
    $routeProvider.when('/edit-contract/:quoteId',
    {templateUrl: 'features/contracts/edit/edit-contract.html', controller: EditContractCtrl});
    $routeProvider.when('/edit-outlines/:quoteId/:workIdx',
      {templateUrl: 'features/quotes/outlines/outlines.html', controller: EditOutlineCtrl});

    $routeProvider.when('/print-contract/:quoteId',
    {templateUrl: 'features/contracts/print/print-contract.html', controller: ViewContractCtrl});
    $routeProvider.when('/view-contract/:quoteId', {templateUrl: 'partials/view-contract.html', controller: ViewContractCtrl});
    
    $routeProvider.when('/edit-works/:quoteId', {templateUrl: 'features/quotes/works/works.html', controller: EditWorksCtrl});
    $routeProvider.when('/edit-quote/:quoteId/:workIdx', {templateUrl: 'features/quotes/items/items.html', controller: EditItemsCtrl});
    $routeProvider.when('/edit-labours/:quoteId/:workIdx',
      {templateUrl: 'features/quotes/labours/labours.html', controller: EditLabourCtrl});

    $routeProvider.when('/edit-plants/:quoteId/:workIdx',
      {templateUrl: 'features/quotes/plants/plants.html', controller: EditPlantCtrl});
    $routeProvider.when('/print-plants/:quoteId',
      {templateUrl: 'features/quotes/plants/print/plants.html', controller: PrintPlantCtrl});

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


    if(UserProfiles.userProfile()) {
        //$http.defaults.headers.common['token'] = userProfile.token;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + UserProfiles.userProfile().token;
    }
    $rootScope.userProfile = {business:{itemTypes:[],chargeRates:{}}};
    
    $rootScope.showMenu = true;
    
    $rootScope.loadUserProfile = function()  {
        var url = createUrl('/userprofiles')
        return $http.get(url).then(function(res) {
            var profile = res.data[0];
            return $rootScope.userProfile = profile;
            //return $rootScope.userProfile;
        },function(res) {
            $location.path('/login');
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


     function append(text, maxLen) {
       var append = maxLen - text.length;
       return text;
     }

     $rootScope.chop =function(text, maxLen) {
       if(!text) return '';

       return (text.length <= maxLen
         ?(append(text, maxLen))
         :text.substring(0, maxLen-3)+'...');
     }

     var actions = ['edit-quote','edit-labours','edit-plants','edit-outlines'];

     $rootScope.showWorks = function(action) {
       return (actions.indexOf(action) === -1?false:true);
     }

     $rootScope.workSelected = function(workIdx, idx, actionClass) {
       if(!$rootScope.showWorks($rootScope.currentAction)) {
         return '';
       }

       return (idx == workIdx?actionClass:'');
     }

     $rootScope.fromNow =function(date) {
       return moment(date).fromNow();
     }


   }]);
