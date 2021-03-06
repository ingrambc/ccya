const router = require('express').Router();
const passport = require('../../config/passport');
const db = require('../../models');
const authMiddleware = require('../../config/middleware/authMiddleware');

router.post('/login',passport.authenticate('local', {
    failureRedirect: '/api/users/unauthorized',
    failureFlash: true,
  }),
  (req, res, next) => {
    console.log('sign in successful');
    res.json({
      user: req.user,
      loggedIn: true,
    });
  },
);

router.post('/signup', (req, res, next) => {
  db.User.findOne({ username: req.body.username }, (err, user) => {
    if (err) throw err;
    if (user) {
      console.log('user already exists');
      return res.json('user already exists');
    }
    if (!user) {
      db.User.findOne({ email: req.body.email }, (error, useremail) => {
        if (error) throw error;
        if (useremail) {
          return res.json('email is already in use');
        }
        if (!useremail) {
          const newUser = new db.User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            });
          newUser.password = newUser.generateHash(req.body.password);
          newUser.save((error2) => {
            if (error2) throw error2;
            console.log('user saved!');
            res.redirect(307, '/api/users/login');
          });
        }
      });
    }
  });
});

router.post('/addchild', authMiddleware.isLoggedIn, (req, res, next) => {
  db.User.update(
    {_id: req.user._id},
    {$push: {participants: {
      childName: req.body.childName,
      childDoB: req.body.childDoB,
      address: req.body.address
    }}},
    (error2) =>{
      if (error2) throw error2;
      console.log('participant saved!');
      res.redirect(307, '/api/users/login');
    }
  )
})

router.get('/unauthorized', (req, res, next) => {
  res.json({
    error: req.flash('error'),
    message: 'user not authenticated',
  });
});

router.get('/profile', authMiddleware.isLoggedIn, (req, res, next) => {
  res.json({
    user: req.user,
    loggedIn: true,
  });
});

router.get('/logout', authMiddleware.logoutUser, (req, res, next) => {
  res.json('User logged out successfully');
});

router.get('/admin', authMiddleware.isAdmin, (req, res, next) => {
  res.json({
    user: req.user,
    loggedIn: true,
  });
});

router.post('/removeParticipant', authMiddleware.isLoggedIn, (req, res, next) => {
  db.User.update(
    {_id: req.user._id},
    {$pull: { "participants" : { _id: req.body.childID }}},
    (error2) =>{
      if (error2) throw error2;
      console.log('participant removed!');
      res.redirect(307, '/api/users/login');
  });
});

router.get("/fillEvents", (req, res, next) => {
  // console.log("Entered userRoutes fillEvents");
  db.Team.find( {}, {name: 1, schedule: 1, _id: 0},
    (error2, result) =>{
      if (error2){
        throw error2;
      }
      // console.log("api/users/fillEvents has run");
      // console.log("userRoute Result", result);
      res.json(result);
  });
  // db.Team.find().toArray((err, result) =>{
  //   if(err) throw err;
  //   res.json(result);
  // })
});

router.post('/register', authMiddleware.isLoggedIn, (req, res, next) => {
  db.Team.update(
    {name: req.body.team},
    {$push: {roster: {
      name: req.body.name,
      dob: req.body.childDoB,
      address: req.body.address,
      phone: req.body.phone
    }}},
    (error2) =>{
      if (error2) throw error2;
      console.log('Registration succesdul!');
      res.json("success");
    }
  )
})

module.exports = router;
