angular.module('home', [])
    .controller('HomeCtrl', HomeCtrl);

function HomeCtrl ($scope) {

    console.log('Home Controller');

    this._name = 'Home';

}

class Blah {
}
