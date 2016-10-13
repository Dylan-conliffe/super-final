angular.module('Cypher')
    .controller('cypherCtrl', cypherController)
    .filter('trustUrl', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

cypherController.$inject = ['$http', '$sce', 'Upload']

function cypherController($http, $sce, Upload) {
    var cCtrl = this;

    cCtrl.hello = "yass! it's working"

    $http.get('/me').then(function (response) {
        // // console.log("Profile data: ", response.data);
        cCtrl.track = response.data.tracks
        cCtrl.file = response.data.file;
        cCtrl.about = response.data.about;
        cCtrl.role = response.data.role;
        cCtrl.artist = response.data.artist;
        cCtrl.software = response.data.software;
        // // console.log(response.data.software)
        console.log(response.data);
    });


    cCtrl.createProfile = function () {
        Upload.upload({
            url: '/profile/edit',
            method: "POST",
            data: {
                files: cCtrl.file,
                data: {
                    about: cCtrl.about,
                    role: cCtrl.role,
                    software: cCtrl.software,
                    artist: cCtrl.artist,
                    file : cCtrl.file
                }
            }
        }).then(function (response) {
            console.log("updated user: ", response);
            cCtrl.file = response.data.file;
            alert('Saved, refresh page')
        }, function (error) {
            console.error(error);
        });
    };

    cCtrl.addTracks = function (){
        console.log("cCtrl.track", cCtrl.file);

        Upload.upload({
            url: '/profile/tracks',
            method: 'POST',
            data: {
                files: cCtrl.file
            }
            
        });
        alert('Saved, refresh page')
    };

    cCtrl.getTracks = function() {
        $http.get('/profile/tracks')
            .then(function(res){
                
                console.log('Track list', res.data);
                cCtrl.trackList = res.data;
            }, function(err){
                console.error(err);
            });
    };

    cCtrl.getTracks();
}
