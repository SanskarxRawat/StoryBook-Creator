const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middlewares/auth");

const Story = require("../models/Story");

//@description  Show add Page
//@route        GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

//@description  Show add Page
//@route        POST /stories/add
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//@description  Show all Stories
//@route        GET /stories/add
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//@description  Show Single Story
//@route        GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try{

    let story=await Story.findById(req.params.id).populate('user').lean()

    if(!story){
      return res.render("error/404")
    }

    res.render('stories/show',{
      story
    })

  }catch(err){
    console.error(err)
    res.render("error/500")
  }
  
});


//@description  Show add Edit Page
//@route        GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();

  if (!story) {
    res.render("error/404");
  }
  if (story.user != req.user.id) {
    res.redirect("/stories");
  } else {
    res.render("stories/edit", {
      story,
    });
  }
});

//@description  Update Stories
//@route        PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  let story = await Story.findById(req.params.id).lean();

  if (!story) {
    return res.render("error/404");
  }
  if (story.user != req.user.id) {
    res.redirect("/stories");
  } else {
    story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.redirect("/dashboard");
  }
});

//@description  Delete Story
//@route        GET /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});


//@description  User Stories
//@route        GET /user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  
  try{

    let stories=await Story.find({
      user:req.params.userId,
      status:'public'
    }).populate().lean()

    res.render('stories/index',{
      stories
    })

  }catch(err){
    console.log(err)
    return res.render("error/500")
  }
});


module.exports = router;
