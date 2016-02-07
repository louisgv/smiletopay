'use strict()';

// var memeAPI = "https://api.imgflip.com/get_memes";

// var memeAPI = "http://version1.api.memegenerator.net/Instances_Select_ByPopular?languageCode=en&pageSize=24"

var memeAPI = "./com/home/meme.json";

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
          resp.data;
        console.log($scope.memes);
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
                  // $interval.cancel(stream);
                  t = 3600;
                  // An elaborate, custom popup
                  myPopup = $ionicPopup.show({
                    // template: '<input type="password" ng-model="data.wifi">',
                    title: 'You look great today',
                    subTitle: 'Meme on',
                    scope: $scope,
                  });

                  $timeout(function () {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                    $scope.memeIndex = $scope.randomIndex($scope.memes);

                    // Dosomething here

                    t = defaultT;
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
    })
    //*/
}
