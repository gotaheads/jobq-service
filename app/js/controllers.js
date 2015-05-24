'use strict';

function DashboardCtrl($scope, $http) {
    $http.get('/restlet/jobs').success(function(jobs) {
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
        $http.post('/restlet/jobs/-1', $scope.job)
        .success(function(data, status) {
            console.log('job saved d:' + data + ' id '+ data.id + ' s:' + status);

            $scope.location.path('edit-job/' + data.id);
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
    $http.get('/restlet/jobs/' + $scope.jobId).success(function(job) {
        $scope.job = job;
        $scope.userProfile = job.quotes[0];
    });
}

function EditJobCtrl($scope, JobService, $http, $routeParams, QuoteService) {
    var $log = $scope.$log;
    $scope.title = 'Edit job';
    $scope.jobId = $routeParams.jobId;
    $scope.finalised = false;
    $scope.statuses = ['Preparing Quote', 'Quote approved',
    'Work in progress'
    ,'Completed', 'Cancelled'];
    
    $scope.$log.info("EditJobCtrl " + $scope.jobId);
    
    $http.get('/restlet/jobs/' + $scope.jobId).success(function(job) {
        $scope.job = job;
        $scope.editing = job;

        var workIdx = job.quotes.length - 1;
        $scope.userProfile = job.quotes[workIdx];
        $scope.workIdx = workIdx;

        switch(job.status) {
            case 'Completed':
            case 'Cancelled':
                $scope.finalised = true;
        }
        
        $scope.$watch("editing.client", function(value) {
            console.log("client changed: " + value);
            $scope.userProfile.client = value;
        },true);
        $scope.$watch("editing.address", function(value) {
            console.log("address changed: " + value);
            $scope.userProfile.address = value;
        },true);
        $scope.$watch("editing.budget", function(value) {
            console.log("Budget changed: " + value);
            $scope.userProfile.budget = value;
        },true);

        JobService.updateActions($scope);

        $scope.addRecentJob(job.id, job.client);
    });

    $scope.printQuote = function() {
        $log.info("EditJobCtrl printQuote : " + $scope.userProfile.id);
        QuoteService.openPrint($scope.userProfile);
    }

    $scope.printJob = function() {
        $log.info("EditJobCtrl printJob: " + $scope.job.id);

        JobService.saveJob($scope.job).then(function(result) {
            var job = result.data;
            $scope.$log.info("saveJob finished " + job.id);
            window.open(
                '#/print-job/' + job.id,
                '_blank'
                );
        });
    }
    
    $scope.cancel = function() {
        $scope.job.status = 'Cancelled';
        $scope.save();
    }
    
    $scope.complete = function() {
        $scope.job.status = 'Completed';
        $scope.save();
    }
    
    $scope.save = function() {
        JobService.saveJob($scope.job).then(function(result) {
//            $scope.$log.info("saveJob finished " + result.data);
            var job = result.data;
            QuoteService.updateStatus($scope.userProfile, job);
            QuoteService.updateQuoteStatus(job);
        });
    };

    $scope.remove = function() {
        JobService.remove($scope.job).then(function(result) {
            $scope.$log.info("remove finished " + result.data);
            $scope.location.path('/dashboard');
        });
    };

    $scope.$watch("editing.works", function(value) {
        console.log("Model: " + value);
    },true);
}

EditJobCtrl.$inject = ['$scope', 'JobService', '$http', '$routeParams','QuoteService'];

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
        $scope.contract = userProfile.contract;
        $scope.userProfile = userProfile;
        $scope.editing = userProfile;
        $scope.printQuote = function() {
            $log.info("ViewContractCtrl printQuote : " + $scope.userProfile.id);
            QuoteService.openPrint($scope.userProfile);
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
        var profile = {};
        profile.business = $scope.business;
        profile.template = $scope.template;
        $http.put('/restlet/business/' + $scope.userProfile.businessId, profile)
        .success(function(data, status) {
            console.log('settings saved d:' + data + ' s:' + status);
            $scope.status = status;
            $scope.data = data;
            $scope.result = data; // Show result from server in our <pre></pre> element
            $scope.loadUserProfile();
        })
        .error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;        
        });
    };

    $scope.$watch('userProfile.businessId', function(evt, cur, prev) {
        $http.get('/restlet/business/' + $scope.userProfile.businessId).
        success(function(profile) {

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