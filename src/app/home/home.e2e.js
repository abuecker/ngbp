describe('Home', function () {

    beforeEach(function () {
      browser.get('/');
    });

    it('should...', function () {
        element(by.id('name')).getText().then(function (text) {
            expect(text).toBe('Home');
        });
    });

});

