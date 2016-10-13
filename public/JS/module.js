angular.module('Cypher', ['ngRoute','ngFileUpload'])
.config(Router);

Router.$inject = ['$routeProvider'];

function Router($routeProvider) {
    console.info('router loaded fam')

    $routeProvider.otherwise({
        redirectTo: '/about'
    });

    $routeProvider
        .when('/tracks', {
            templateUrl: '/html/templates/mytracks.html',
        })
        .when('/tracks/list', {
            templateUrl: '/html/templates/tracklist.html',
        })
        .when('/about', {
            templateUrl: 'html/templates/aboutyou.html',
        })
        .when('/edit',{
            templateUrl: '/html/templates/edit.html',
        });
};
