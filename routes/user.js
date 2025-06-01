const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Listing = require('../models/listing');
const User=require('../models/user');
const passport = require('passport');
const wrapasync=require('../utils/wrapAsync');
const {redirectUrl}=require('../middleware');
router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
});

router.post('/signup', wrapasync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "success..Welcome");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));


router.get('/login',(req,res)=>{
    res.render("users/login.ejs");
});

router.post('/login',redirectUrl,passport.authenticate('local', {
    failureRedirect: '/login', 
    failureFlash: true}), 
    async(req,res)=>{
        req.flash("success","Welcome to WanderCrip");
        res.redirect(res.locals.redirectUrl);
})

router.get('/logout', async (req,res,next)=>{
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
})
module.exports = router;