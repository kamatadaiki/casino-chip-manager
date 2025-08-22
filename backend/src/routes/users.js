// backend/src/app.js
const express    = require('express')
const authRoutes = require('./routes/auth')
const chipRoutes = require('./routes/chips')
const userRoutes = require('./routes/users')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/chips', chipRoutes)
app.use('/users', userRoutes)

// 最後にエラーハンドラを登録
app.use(errorHandler)

module.exports = app