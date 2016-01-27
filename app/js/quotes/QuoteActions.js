
servicesModule.factory('QuoteActions', 
    ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
    var QuoteActions = {};
        function emptyWorks(editing) {
            if(!editing || !editing.works || editing.works.length == 0) {
                return true;
            }
            return false;
        }
        $rootScope.emptyWorks = emptyWorks;

        $rootScope.updateQuoteActions = function($scope, jobId, quoteId) {
            //var quoteId = angular.isDefined(quoteId)?quoteId:$scope.editing._quoteId;
            $log.info('updateQuoteActions loc path: ' + $scope.location.path() +
            ' quoteId: ' + quoteId);

            $rootScope.quoteActions = [];
            $rootScope.jobId = jobId;
            $rootScope.quoteId = quoteId;

            $rootScope.quoteActions.push({
                "icon":"icon-print",
                "text": "Summary",
                "href": "#/view-quote/" + quoteId
            });

            $rootScope.quoteActions.push({
                "icon":"icon-edit",
                "text": "Works",
                "href": "#/edit-works/" + quoteId
            });

            $rootScope.quoteActions.push({
                "icon":"icon-edit",
                "text": "Work Outlines",
                "href": "#/edit-outlines/" + quoteId
            });
            $rootScope.quoteActions.push({
                "icon":"icon-edit",
                "text": "Items",
                "href": "#/edit-quote/" + quoteId
            });
            $rootScope.quoteActions.push({
                "icon":"icon-edit",
                "text": "Labours",
                "href": "#/edit-labours/" + quoteId
            });
            $rootScope.quoteActions.push({
                "icon":"icon-edit",
                "text": "Plants",
                "href": "#/edit-plants/" + quoteId
            });

            angular.forEach($rootScope.quoteActions, function(i) {
              var action = i.href.split('/')[1];
              if($rootScope.location.path().indexOf(action) !== -1) {
                    $rootScope.actionLabel = i.text;
              }
            } )

            $rootScope.contractActions = [];

            if(!emptyWorks($rootScope.editing)) {
                $rootScope.contractActions.push({
                    "icon":"icon-edit",
                    "text": "Edit",
                    "href": "#/edit-contract/" + quoteId
                });
            }

            angular.forEach($rootScope.contractActions, function(i) {
              var action = i.href.split('/')[1];
              if($rootScope.location.path().indexOf(action) !== -1) {
                    $rootScope.actionLabel = i.text;
                }
            } )

        }



    return QuoteActions;
}]);
