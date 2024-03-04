const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./passport')
const cors = require('cors');
const authRoute = require('./routes/auth')
const orderRoute = require('./routes/order')
const express = require('express')
const app = express()

app.use(cookieSession({
    name: "session",
    keys: ["cigarlift"],
    maxAge: 24 * 60 * 60 * 1000 // 1 day
}))

// The code below is from philippkrauss, it fixes a session.regenerate not found
// error. Another fix would be to use passport v0.5.0, but this seems to work.
// Source is https://stackoverflow.com/questions/72375564/typeerror-req-session-regenerate-is-not-a-function-using-passport
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: "http://localhost:5173",
    methods:"GET, POST, DELETE, PATCH",
    credentials: true,
}))

app.use("/auth", authRoute)
app.use("/order", orderRoute)

app.listen("5000", ()=>{
    console.log("Server is running!")
})