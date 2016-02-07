'use strict()';

function PaymentCtrl($scope, $interval, $http, $ionicPopup, $timeout) {
  console.log('PaymentCtrl');

  $scope.paymentDone = false;

  $scope.$on('$ionicView.enter', function (e) {
    // Fetch User information

    // Fetch Merchant
    // Webcam.reset();
    // Webcam.attach("#ng-camera-feed");
    // Init payment amount
    $scope.paymentAmount = 9999;

    $scope.purchase = {
      item: "Pills",
      price: 4000
    }

    $http.get("http://smiletopay.mybluemix.net/it")
      .success(function (data) {
        console.log(data);
        $scope.customer = data.customer[0];
        $scope.merchant = data.merchant;
        // console.log($scope.merchant);

      })
  });

  //*//
  var myPopup;
  // TODO: Change this to 1800
  // var defaultT = 999999;
  var defaultT = 1800;
  var t = defaultT;
  Webcam.on("load", function () {
      var stream = $interval(function () {
        Webcam.snap(function (data_uri) {
          // var dataToSubmit = {__ContentType : "image/jpeg", base64 : data_uri};
          var data = {
            json: JSON.stringify({
              data: data_uri
            })
          };
          if (myPopup)
            return;
          $http.post("http://smiletopay.mybluemix.net/u", data)
            .success(function (jsonString, status) {
              // console.log(data);
              var jsonData = JSON.parse(jsonString);
              // console.log(jsonData[0]);
              if(jsonData.length > 0) {
                var scores = jsonData[0].scores;

                console.log(scores);

                if(scores.happiness >= 0.27 && !myPopup) {
                  $interval.cancel(stream);
                  t = 3600;
                  // An elaborate, custom popup
                  myPopup = $ionicPopup.show({
                    // template: '<input type="password" ng-model="data.wifi">',
                    title: 'Your transaction has been made',
                    subTitle: 'Thank you for your business',
                    scope: $scope,
                  });

                  $timeout(function () {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                    // console.log($scope.merchant);

                    // Dosomething here
                    var purData = JSON.stringify({
                      "merchant_id": $scope.merchant._id,
                      "medium": "balance",
                      "purchase_date": "2016-02-07",
                      "amount": $scope.purchase.price,
                      "status": "pending",
                      "description": "string"
                    });

                    $http.post("http://api.reimaginebanking.com/accounts/56241a14de4bf40b17112ff0/purchases?key=05a6bdee581daba72bc5fd068e78e8e9", purData)
                      .success(function (jsonString1, status1) {
                        var jsonData1 = JSON.parse(jsonString);
                        console.log(jsonData1);
                      })

                    $scope.customer.balance -= $scope.purchase.price;

                    t = defaultT;
                    myPopup = null;
                  }, t);
                }
              }
            })
        })
      }, t);
    })
    //*/
}
