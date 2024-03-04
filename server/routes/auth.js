require('dotenv')
const router = require('express').Router()
const passport = require('passport')

router.get("/login/failed", (req, res)=>{
    res.status(401).json({success: false, message:"Login Failed"})
})
router.get("/login/success", (req, res)=>{
    if (req.user){
        res.status(200).json({ 
            success: true, 
            message: "Login Successful!", 
            user: req.user, 
            //cookies: req.cookied
        })
    }
    else res.status(401).json({success: false, message:"Login Failed"})
})

router.get("/logout", (req, res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL);
      });
})

router.get("/google", passport.authenticate("google", { scope: ['profile'] }))

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",//process.env.CLIENT_URL,
    failureRedirect: "/login/failed"
}))

module.exports = router