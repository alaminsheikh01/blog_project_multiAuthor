const {validationResult} =require('express-validator')
const readingTime = require('reading-time')
const Flash = require('../utils/Flash')
const errorFormator = require('../utils/validationErrorsFormator')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

exports.createPostGetController = async (req, res, next) =>{

    let profile = await Profile.findOne({ user: req.user._id })
    if(!profile){
        return res.redirect('/dashboard/create-profile')
    }

    res.render('pages/dashboard/post/createPost', {
        title: 'Create A New Post',
        error: {},
        flashMessage: Flash.getMessage(req),
        value: {}
    })
}

exports.createPostPostController = async (req, res, next )=>{
    let {title, body, tags} = req.body
    let errors = validationResult(req).formatWith(errorFormator)

    if(!errors.isEmpty()) {
        res.render('pages/dashboard/post/createPost', {
            title: 'Create A New Post',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags
            }
        })
    }

    if(tags) {
        tags = tags.split(',')
        tags = tags.map(t =>t.trim())
    }

    let readTime = readingTime(body).text
    let post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    if(req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    try{
        let createdPost = await post.save()
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { 'posts': createdPost._id }}
        )

        req.flash('success', 'Post Created Succesfully')
        return res.redirect(`/posts/edit/${createdPost._id}`)

    }catch(e){
        next(e)
    }

}

exports.editPostGetController = async (req, res, next )=>{
    let postId = req.params.postId

    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId })
        if(!post) {
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }
        res.render('pages/dashboard/post/editPost', {
            title: "Edit Your post",
            error: {},
            flashMessage: Flash.getMessage(req),
            post
        })
    }catch(e) {
        next(e)
    }
}


exports.editPostPostController = async (req, res, next )=>{
    let {title, body, tags } = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormator)

    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if(!post) {
            let error = new Error('404 page not found')
            error.status = 404
            throw error
        }

        if(!errors.isEmpty()){
            res.render('pages/dashboard/post/createPost', {
                title:'Create A new post ',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post
            })
        }
        if(tags) {
            tags = tags.split(',')
            tags = tags.map(t =>t.trim())
        }

        let thumbnail = post.thumbnail
        if(req.file)
        {
            thumbnail = req.file.filename
        }
        await Post.findOneAndUpdate(
            { _id: post._id },
            { $set: { title, body, tags, thumbnail }},
            { new: true }
        )
        req.flash('success','Post updated succesfully')
        res.redirect('/posts/edit/' + post._id)

    }catch(e){
        next(e)
    }
}

exports.DeletePostGetController = async (req, res, next )=>{
    let { postId } = req.params

    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId })
        if(!post ){
            let error = new Error('404 page not found')
            error.status = 404
            throw error
        }

        await Post.findOneAndDelete({ _id: postId })
        await Profile.findOneAndUpdate(
            {user: req.user._id },
            { $pull: {'posts': postId }}
        )

        req.flash('success', 'Post Delete Succesfully')
        res.redirect('/posts')



    }catch(e){
        next(e)
    }
}

exports.postsGetController = async( req, res, next )=>{
    try{
        let profile = await Profile.findOne({ user: req.user._id })
        if(!profile){
            return res.redirect('/dashboard/create-profile')
        }
        let posts = await Post.find({ author: req.user._id })
        res.render('pages/dashboard/post/posts',{
            title: 'My Created Posts',
            posts,
            flashMessage: Flash.getMessage(req)
        })

    }catch(e){
        next(e)
    }
}