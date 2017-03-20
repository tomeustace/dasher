module.exports = {
  'Test add view': function test(browser) {
    const devServer = browser.globals.devServerURL;

    browser
      .url(devServer)
      .waitForElementVisible('#app', 1000)
      .assert.containsText('h2', 'Dasher')
      .setValue('.view-name input', ['myview1'])
      .click('.view-save')
      .clearValue('.view-name input')
      .waitForElementVisible('#tabs', 1000)
      .assert.elementPresent('.tab')
      .pause(5000)
      .setValue('.view-name input', ['myview2'])
      .click('.view-save')
      .pause(15000)
      .elements('css selector', '.tab', function(result){
        let els = result.value;
        let count = els.length;
        if(count !== 2) {
          //trigger failure, is there a better way to do this??
          this.assert.value(count, 2);
          this.end();
        }
        console.log('elements count is ' + count);
      })
      .end();
  },
};
