'use strict()';

function switchImage($scope, $http, scores) {
  if(scores.happiness >= 0.27) {
    $scope.memeIndex = $scope.randomIndex($scope.memes);
  }
}

// var memeAPI = "https://api.imgflip.com/get_memes";

var memeAPI = "http://version1.api.memegenerator.net/Instances_Select_ByPopular?languageCode=en&pageSize=24"

function HomeCtrl($scope, $interval, $http, $ionicPopup, $timeout) {
  console.log('HomeCtrl');

  $scope.memeIndex = 0;

  $scope.randomIndex = function (array) {
    return Math.floor(Math.random() * array.length);
  }

  $scope.$on('$ionicView.enter', function (e) {

    $http.get(memeAPI)
      .then(function (resp) {
        $scope.memes =
          // resp.data.data.memes;
          resp.result;
        console.log($scope.memes);
      })
  });

  //*//
  var myPopup;
  var t = 1800;
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

            if(scores.happiness >= 0.27 && !myPopup) {
              // $interval.cancel(stream);
              t = 3600;
              // An elaborate, custom popup
              myPopup = $ionicPopup.show({
                // template: '<input type="password" ng-model="data.wifi">',
                title: 'You looks great today',
                subTitle: 'Thank you for your business',
                scope: $scope,
              });

              $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason

                switchImage($scope, $http, scores);

                // Dosomething here

                t = 1800;
                myPopup = null;
              }, 3600);
            }

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
  //*/
}

function webCamStream($http, $scope, $ionicPopup, $timeout) {

}
