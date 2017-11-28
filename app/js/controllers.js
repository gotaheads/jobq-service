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

    var userProfile = $scope.userProfile = UserProfiles.userProfile();
    $scope.business = userProfile.business;
    $scope.template = userProfile.template;

    console.log("SettingsCtrl $scope.userProfile: ", $scope.userProfile);
    

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

    $scope.addNewPayment = function() {
        $log.info('addNewPayment' );
        $scope.template.payments.push({
            title:'',
            portion:0.1
        });
    }

    $scope.save = function() {
        var profile = $scope.userProfile;
        var url = Apis.createApiUrl('/userprofiles/'+profile._id);
        $http.put(url, profile)
        .success(function(data, status) {
            console.log('settings saved d:' + data + ' s:' + status);
            UserProfiles.save(profile);
        })
        .error(function(data, status) {
            $scope.data = data || "Request failed";
            $scope.status = status;        
        });
    };

}

SettingsCtrl.$inject = ['$scope','$http', 'QuoteService', 'Apis', 'UserProfiles'];