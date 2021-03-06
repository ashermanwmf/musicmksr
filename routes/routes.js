const passport = require('passport');
const helpers = require('./routehelpers');
const multer = require('multer');
const upload = multer();

module.exports = function(app) {

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    helpers.newUser,
    helpers.setCookie,
    helpers.setUserId,
    helpers.setHeader,
    helpers.loginRedirect
  );

  app.get('/logout',
    helpers.terminateSession,
    helpers.loginRedirect
  );

  // get sounds for sequencer
  app.get('/api/sample/:songTitle', helpers.getSong);

  // get sound options for each track in sequencer
  app.get('/api/options/:userId', helpers.getSampleOptions);

  // get session info for requests
  app.get('/api/session', helpers.getUserSession);

  // get profile info for user
  app.get('/api/profile/:userId',
    helpers.isLoggedIn,
    helpers.getUserProfile
  );

  // post and save sequences when logged in as a user
  app.post('/api/save',
    helpers.isLoggedIn,
    helpers.saveSequence
  );

  // delete sequences from profile page
  app.delete('/api/deleteSequence/:sequenceName/:userId',
    helpers.isLoggedIn,
    helpers.deleteSequence
  );

  // post and upload sounds and save them to the server
  app.post('/api/upload',
    upload.single('file'),
    helpers.isLoggedIn,
    helpers.uploadAudio
  );

  // get and share beats by loading them
  app.get('/load/:sequenceName/:userId', 
    helpers.loadSequence
  );

  app.get('/api/sequence/:userId/:sequenceName',
    helpers.getSequence
  );

};
