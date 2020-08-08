const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

// Load config
dotenv.config({path: './config/config.env'})

//connect to database
connectDB()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// Routes
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
})
,
app.use('/articles', articleRouter)

// Listen for port
const PORT = process.env.PORT || 5000 

app.listen(PORT, console.log(`Server running on port ${PORT}`))