require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.set('trust proxy', 'loopback')
app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

// API routes should come before static files
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/clients', require('./routes/clientRoutes'))
app.use('/api/cigars', require('./routes/cigarRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/appointments', require('./routes/appointmentRoutes'))
app.use('/api/itineraries', require('./routes/itineraryRoutes'))
app.use('/api/config', require('./routes/configRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))
app.use('/api/images', require('./routes/imageRoutes'))

// Serve static files after API routes
app.use(express.static(path.join(__dirname, '../client/Cigarlift/dist')))

// This should be the last route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/Cigarlift/dist/index.html'))
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})