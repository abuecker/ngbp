describe('Home', function () {

  beforeEach(module('ngbp'));

  var $scope;

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controller('HomeCtrl', {
      $scope: $scope
    });
  }));

  it('should...', function () {
    expect(true).toBeTruthy();
  });

});

