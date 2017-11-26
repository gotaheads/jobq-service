'use strict';

function CreateJobCtrl($scope, $http, Quote, Apis) {
    $scope.title = 'Create new job';
    
    console.log("CreateJobCtrl");
    $scope.job = {
        address: '',
        budget: 0,
        client: '',
        created: new Date(),
        finalPrice: 0,
        quoteId:-1,
        quotes: [],
        status: "Pending",
        totalDiff: 0,
        totalPrice: 0,
        version: 1
    };
              
    $scope.save = function() {
        var url = Apis.createApiUrl('/jobs'),job = $scope.job;

        $http.post(url, $scope.job)
        .success(function(data, status, headers, config) {
            var jobId = data.id;
                job._id = jobId;
                var quote = Quote.newQuota(job);
                console.log('job saved d:' + ' id '+ jobId);

                $http.post(Apis.createApiUrl('/quotes'), quote)
                    .success(function(data, status, headers, config) {
                        var quoteId = data.id;
                        job._quoteId = quoteId;
                        $http.put(Apis.createApiUrl('/jobs/'+jobId), job)
                            .success(function(data, status, headers, config) {
                                console.log('job saved d:' + ' id '+ quoteId);
                                $scope.location.path('edit-job/' + jobId);
                            })
                    });
        })
        .error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;        
        });
    };    
}

CreateJobCtrl.$inject = ['$scope','$http', 'Quote', 'Apis'];



function SettingsCtrl($scope, $http, QuoteService, Apis, UserProfiles) {
    var $log = $scope.$log;

    //$scope.userProfile = UserProfiles.userProfile();

    console.log("SettingsCtrl $scope.userProfile: ", $scope.userProfile);
    
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
        var url = Apis.createApiUrl('/userprofiles/'+profile._id);
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

SettingsCtrl.$inject = ['$scope','$http', 'QuoteService', 'Apis', UserProfiles];