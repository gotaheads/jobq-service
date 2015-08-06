'use strict';


function ViewContractCtrl($scope, $http, $routeParams) {
    $scope.quoteId = $routeParams.quoteId;

    var $log = $scope.$log;
    console.log("ViewContractCtrl " + $scope.quoteId);
    
    var paymentsDefault = {
        'paymentIntro':'If you choose to accept quotation payment is as follows: ',
        'payments':[{
            'title':'Booking deposit',
            'portion':'10%'
        },

        {
            'title':'On commencement of works',
            'portion':'30%'
        },

        {
            'title':'Progress payment to be arranged',
            'portion':'50%'
        },

        {
            'title':'Final payment on final inspection',
            'portion':'10%'
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
            content:'Damon Fuhrer'
        }]
    }
                               
    $http.get('/restlet/job/contract/' + $scope.quoteId).success(function(quote) {
        $scope.contract = quotes.contract;

        if(!$scope.contract.payments) {
            $scope.contract.payments = paymentsDefault.payments;
        }
        

        $scope.created = new Date();
        
        $scope.quotes = quotes;
        
        $scope.printQuote = function() {
            $log.info("EditJobCtrl printQuote : " + $scope.quotes.id);
            QuoteService.openPrint($scope.quotes);
        }

    });    

}

ViewContractCtrl.$inject = ['$scope','$http', '$routeParams'];
