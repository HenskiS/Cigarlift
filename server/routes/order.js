require('dotenv')
const router = require('express').Router()
const passport = require('passport')
const requireAuth = require('../middleware/requireAuth');

//router.use(requireAuth)
router.get("/test", (req, res)=>{
    res.status(200).json({ data: ["1","2","3","4","5","6","7","8"] })
})

module.exports = router