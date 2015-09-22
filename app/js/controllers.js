'use strict';

function DashboardCtrl($scope, $http) {
    var url = createUrl('/jobs');
    $http.get(url).success(function(jobs) {
        $scope.jobs = jobs;
    });

    
}
DashboardCtrl.$inject = ['$scope','$http'];

function CreateJobCtrl($scope, $http) {
    $scope.title = 'Create new job';
    
    console.log("CreateJobCtrl");
    $scope.job = {
        "client":"",
        "address":"",
        "budget":0
    };
              
    $scope.save = function() {
        var url = createUrl('/jobs/-1');
        $http.post(url, $scope.job)
        .success(function(data, status) {
            console.log('job saved d:' + data + ' id '+ data._id + ' s:' + status);

            $scope.location.path('edit-job/' + data._id);
        })
        .error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;        
        });
    };    
}

CreateJobCtrl.$inject = ['$scope','$http'];

function PrintJobCtrl($scope, JobService, $http, $routeParams) {
    $scope.jobId = $routeParams.jobId;

    var url = createUrl('/jobs/' + $scope.jobId);
    $http.get(url).success(function(job) {
        $scope.job = job;

        //$scope.quote = job.quotes[0];
    });
}


function ViewContractCtrl($scope, ContractService, $routeParams,QuoteService) {
    var $log = $scope.$log;

    $scope.title = 'View contract';
    $scope.quoteId = $routeParams.quoteId;
    $scope.$log.info("ViewContractCtrl " + $scope.quoteId);
    $scope.editing = {};
    $scope.predicate = '-rowNumber';

    ContractService.find($scope.quoteId).then(function(result) {
        $scope.$log.info("found " + result.data.id);
        var quote = result.data;
        $scope.contract = quote.contract;
        $scope.quote = quote;
        $scope.editing = quote;
        $scope.printQuote = function() {
            $log.info("ViewContractCtrl printQuote : " + $scope.quote._id);
            QuoteService.openPrint($scope.quote);
        }
        
        $scope.updateQuoteActions($scope);

    });
}

ViewContractCtrl.$inject = ['$scope', 'ContractService', '$routeParams','QuoteService'];


function SettingsCtrl($scope, $http, QuoteService) {
    var $log = $scope.$log;
    console.log("SettingsCtrl");
    
    $scope.business = {
    };

    $scope.remove = function(idx) {
        $scope.utils.remove($scope.template.sections, idx);
    }

    $scope.add = function(idx) {
        idx = $scope.utils.add($scope.template.sections, {content:''}, idx);
        $scope.focus('content_' + idx);
    }

    $scope.down = function(idx) {
        $scope.utils.down($scope.template.sections, idx);
    }

    $scope.up = function(idx) {
        $scope.utils.up($scope.template.sections, idx);
    }


    $scope.addNewChargeRate = function() {
        $log.info('addNewChargeRate' );
        $scope.business.chargeRates.push({
            labour:'',
            rate:0
        });
    }
    
    $scope.addNewItemType = function() {
        $log.info('addNewItemType' );
        $scope.business.itemTypes.push({
            type:'',
            margin:0.1
        });
    }
    
    $scope.save = function() {
        var profile = $scope.userProfile;
        var url = createUrl('/userprofiles/'+profile._id);
        $http.put(url, profile)
        .success(function(data, status) {
            console.log('settings saved d:' + data + ' s:' + status);
            //$scope.loadUserProfile();
        })
        .error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;        
        });
    };

    $scope.$watch('userProfile.businessId', function(evt, cur, prev) {

        $scope.loadUserProfile().then(function(profile) {

            $scope.business = profile.business;
            $scope.template = profile.template;

            if($scope.business.itemTypes == undefined) {
                $scope.business.itemTypes = [];
                $scope.business.itemTypes.push({
                    type:'Material',
                    margin:0.1
                });
                $scope.business.itemTypes.push({
                    type:'Equipment Hire',
                    margin:0.1
                });
                $scope.business.itemTypes.push({
                    type:'Per square metre',
                    margin:0.1
                });
            }

            if($scope.business.chargeRates == undefined) {
                $scope.business.chargeRates = [];
                $scope.business.chargeRates.push({
                    labour:'Landscape Supervisor',
                    rate:65
                });
                $scope.business.chargeRates.push({
                    labour:'Landscape Tradesperson',
                    rate:65
                });
                $scope.business.chargeRates.push({
                    labour:'Landscape Labourer',
                    rate:45
                });
                $scope.business.chargeRates.push({
                    labour:'Gardern assessment callout fee',
                    rate:250
                });
                $scope.business.chargeRates.push({
                    labour:'Landscape Apprentice 1-2',
                    rate:40
                });
                $scope.business.chargeRates.push({
                    labour:'Landscape Apprentice 3-4',
                    rate:45
                });

                $scope.business.chargeRates.push({
                    labour:'Qualified Horticulturist',
                    rate:65
                });
                $scope.business.chargeRates.push({
                    labour:'Studen/Trainee/Apprentice',
                    rate:50
                });
            }


            if($scope.template == undefined) {
                $scope.template = {};
            }
            if($scope.template.paymentIntro == undefined) {
                $scope.template.paymentIntro = contractDefault.paymentIntro;
            }
            if($scope.template.payments == undefined) {
                $scope.template.payments = contractDefault.payments;
            }
            if(QuoteService.hasContents($scope.template)) {
                $scope.template.sections = contractDefault.sections;
            }
            if($scope.template.intro == undefined) {
                $scope.template.intro = contractDefault.intro;
            }



        });

    });


    var contractDefault = {
        'intro':'I have prepared the following quotation for construction works. All works quoted are based on design and dimensions presented previously and approved by you.',
        'paymentIntro':'If you choose to accept quotation payment is as follows: ',
        'payments':[{
            'title':'Booking deposit',
            'portion':'0.1'
        },

        {
            'title':'On commencement of works',
            'portion':'0.3'
        },

        {
            'title':'Progress payment to be arranged',
            'portion':'0.5'
        },

        {
            'title':'Final payment on final inspection',
            'portion':'0.1'
        },],
        'sections':[{
            content:'On receipt of deposit a start date will be confirmed and schedule of works set. Approved work aside, I will leave the rest of the property in the same state and condition as it was before commencement of landscape works.  I take responsibility for any damage caused by me to the property while undertaking landscape works.'
        },

        {
            content:'Any variations to works and subsequent price variations will be agreed upon by both parties prior to variation.'
        },

        {
            content:'Please note this quote is valid for two months.'
        },

        {
            content:'If you have any questions regarding this quote or works to be undertaken please contact me on 0408122643 or 94170157.'
        },

        {
            content:'I look forward to hearing from you.'
        },

        {
            content:'Kind regards,'
        },

        {
            content:$scope.userProfile.business.owner
        }]
    }
                               
}

SettingsCtrl.$inject = ['$scope','$http', 'QuoteService'];