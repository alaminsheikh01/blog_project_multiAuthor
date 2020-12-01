const {validationResult} = require('express-validator');
const Flash = require("../utils/Flash");
const User = require('../models/User');
const Profile = require("../models/Profile");
const errorFormatter = require('../utils/validationErrorsFormator')

exports.dashboardGetController = async (req, res, next) => {
  try {

    let profile = await Profile.findOne({
      user: req.user._id
    })
    .populate({
      path: 'posts',
      select: 'title thumbnail'
    })
    .populate({
      path: 'bookmarks',
      select: 'title thumbnail'
    })

    if (profile) {

      return res.render("pages/dashboard/dashboard", {
        title: "My Dashboard",
        flashMessage: Flash.getMessage(req),
        posts: profile.posts.reverse().slice(0,3),
        bookmarks: profile.bookmarks.reverse().slice(0,3)
      });
    }

    res.redirect('/dashboard/create-profile')

  } catch (e) {
    next(e);
  }

}

exports.createProfileGetController = async (req, res, next) =>{
   
    try{
        let profile = await Profile.findOne({ user: req.user._id })
        if(profile){
            return res.redirect('/dashboard/edit-profile')
        }

        res.render('pages/dashboard/create-profile', 
        {
            title: 'Create Your Profile', 
            flashMessage: Flash.getMessage(req),
            error: {}
        })

    }catch(e){
        next(e)
    }

}
exports.createProfilePostControllers = async (req, res, next) =>{
  let errors = validationResult(req).formatWith(errorFormatter)

  if(!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', 
    {
        title: 'Create Your Profile', 
        flashMessage: Flash.getMessage(req),
        error: errors.mapped()
    })
  }

  let {
    name,
    title,
    bio,
    websits,
    facebook,
    twitter,
    github 
  } = req.body

  try{
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      links: {
        websits: websits || '',
        facebook: facebook || '',
        twitter: twitter || '',
        github: github || ''
      },
      posts: [],
      bookmarks: []
    })

    let createdProfile = await profile.save()
    await User.findOneAndUpdate (
      { _id: req.user._id },
      { $set: { profile: createdProfile._id } }
    )

    req.flash('success', 'Profile Created Succesfully')
    res.redirect('/dashboard')

  }catch(e){
    next(e)
  }
}

exports.editProfileGetControllers = async (req, res, next) =>{
  
  try{
    let profile = await Profile.findOne({ user: req.user._id })
    if(!profile){
        return res.redirect('/dashboard/create-profile')
    }

    res.render('pages/dashboard/edit-profile',
    {
        title: 'Edit Your Profile', 
        error: {},
        flashMessage: Flash.getMessage(req),
        profile,
        
    })

}catch(e){
    next(e)
}
}

exports.editProfilePostControllers = async (req, res, next) =>{
  let errors = validationResult(req).formatWith(errorFormatter)

  let {
    name,
    title,
    bio,
    websits,
    facebook,
    twitter,
    github 
  } = req.body

  if(!errors.isEmpty()) {
    return res.render('pages/dashboard/create-profile', {
        title: 'Create Your Profile', 
        flashMessage: Flash.getMessage(req),
        error: errors.mapped(),
        profile: {
          name,
          title,
          bio,
          links: {
            websits,
            facebook,
            twitter,
            github
          }
        }
    })
  }
  try {
    let profile = {
      name,
      title,
      bio,
      links: {
        websits: websits || '',
        facebook: facebook || '',
        twitter: twitter || '',
        github: github || ''
      }
    }
    let updatedProfile = await Profile.findOneAndUpdate (
      { user: req.user._id },
      { $set: profile },
      { new: true }
    )

    req.flash('success', 'Profile Updated Successfully')

    res.render('pages/dashboard/edit-profile', 
    {
        title: 'Edit Your Profile', 
        error: {},
        flashMessage: Flash.getMessage(req),
        profile: updatedProfile
    })

  }catch(e){
    next(e)
  }
}

exports.bookmarksGetController = async (req, res, next) =>{
  try{
    
    let profile = await Profile.findOne( { user: req.user._id })

          .populate({
            path: 'bookmarks',
            model: 'Post',
            select: 'title thumbnail'
          })
          if(!profile){
            return res.redirect('/dashboard/create-profile')
        }
          res.render('pages/dashboard/bookmarks',{
            title: 'My bookmarks',
            flashMessage: Flash.getMessage(req),
            posts: profile.bookmarks
          })
  }catch(e){
    next(e)
  }
}