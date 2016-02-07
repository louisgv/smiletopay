'use strict()';

function GameCtrl($scope, $interval, $http, $ionicPopup, $timeout) {
  console.log('GameCtrl');

  $scope.$on('$ionicView.enter', function (e) {
    // Fetch User information

    // Fetch Merchant
    // Webcam.reset();
    // Webcam.attach("#ng-camera-feed");
    // Init payment amount


  });

  //*//

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
          $http.post("http://smiletopay.mybluemix.net/u", data)
            .success(function (jsonString, status) {
              // console.log(data);
              var jsonData = JSON.parse(jsonString);
              // console.log(jsonData[0]);
              if(jsonData.length > 0) {
                var scores = jsonData[0].scores;

                console.log(scores);

                var maxValue = -1;
                for(var emo in scores) {
                  if(scores.hasOwnProperty(emo)) {
                    var value = scores[emo]
                    if(value > maxValue) {
                      $scope.feeling = emo;
                      maxValue = value;
                    }
                  }
                }
              }
            })
        })
      }, t);
    })
    //*/
}
