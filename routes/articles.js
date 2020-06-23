const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

// create new article form page: get request
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

// update article by id form page: get request
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findByIdAndUpdate(req.params.id)
    res.render('articles/edit', { article: article })
})

// view article: get request
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if(article == null) res.redirect('/')
    res.render('articles/show', { article: article })
})

// create new article request: post request
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

// update article by id request: put request
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

// delete article by id: delete request
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
    
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
    
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            console.log(e)
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = router