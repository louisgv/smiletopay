'use strict()';

function HomeCtrl($scope, $interval, $http) {
  console.log('HomeCtrl');

  $scope.imgUrl = '';

  $scope.$on('$ionicView.enter', function (e) {
    $http.get("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC")
      // $http.get("http://thecatapi.com/api/images/get?format=src&type=jpg")
      .then(function (response) {
        console.log(response);
        var data = response.data.data;
        // $scope.imgUrl = data.image_original_url;
        $scope.imgUrl = data.fixed_height_small_still_url
      });
  });

  /*//
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

              // anger: 0.00007645053,
              // contempt: 0.006271383,
              // disgust: 0.0001653205,
              // fear: 0.0002528353,
              // happiness: 0.159133181,
              // neutral: 0.830011547,
              // sadness: 0.00287115527,
              // surprise: 0.0012181166

            var maxValue = -1
            for(var emo in scores) {
              if(scores.hasOwnProperty(emo)) {
                var value = scores[emo]
                if(value > maxValue) {
                  $scope.feeling = emo;
                  maxValue = value;
                }
              }
            }

            if(scores.happiness >= 0.36) {
              $http.get("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC")
                // $http.get("http://randomimage.setgetgo.com/get.php")
                .then(function (response) {
                  console.log(response);
                  var data = response.data.data;
                  // $scope.imgUrl = data.image_original_url;
                  $scope.imgUrl = data.fixed_height_small_still_url
                    // $scope.$apply();
                });
            }

          }

        })

      // console.log(data_uri);
      // if (smile){
      //   $interval.cancel(stream);
      //  transaction complete
      // }

    });
  }, 900);
  //*/
}
