var express = require('express');
var router = express.Router();

let userModel = require('../schemas/users')

/* GET ALL USERS */
router.get('/', async function (req, res, next) {

  let dataUsers = await userModel.find({
    isDeleted: false
  }).populate("role")

  res.send(dataUsers);
});


// GET USER BY ID
router.get('/:id', async function (req, res, next) {

  try {

    let id = req.params.id;

    let result = await userModel.findById(id).populate("role");

    if (!result || result.isDeleted) {

      res.status(404).send({
        message: "ID NOT FOUND"
      });

    } else {
      res.send(result)
    }

  } catch (error) {

    res.status(404).send({
      message: "ID NOT FOUND"
    });

  }

});


// CREATE USER
router.post('/', async function (req, res, next) {

  let newUser = new userModel({

    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    role: req.body.role

  })

  await newUser.save();

  res.send(newUser)

});


// UPDATE USER
router.put('/:id', async function (req, res, next) {

  try {

    let id = req.params.id;

    let result = await userModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    res.send(result)

  } catch (error) {

    res.status(404).send(error)

  }

});


// SOFT DELETE USER
router.delete('/:id', async function (req, res, next) {

  try {

    let id = req.params.id;

    let result = await userModel.findById(id);

    if (!result || result.isDeleted) {

      res.status(404).send({
        message: "ID NOT FOUND"
      });

    } else {

      result.isDeleted = true;
      await result.save();

      res.send(result)

    }

  } catch (error) {

    res.status(404).send({
      message: "ID NOT FOUND"
    });

  }

});


// POST /enable
router.post('/enable', async function (req, res, next) {

  try {

    let { email, username } = req.body;

    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });

    if (!user) {

      res.status(404).send({
        message: "USER NOT FOUND"
      });

    } else {

      user.status = true;

      await user.save();

      res.send(user)

    }

  } catch (error) {

    res.status(500).send(error)

  }

});


// POST /disable
router.post('/disable', async function (req, res, next) {

  try {

    let { email, username } = req.body;

    let user = await userModel.findOne({
      email: email,
      username: username,
      isDeleted: false
    });

    if (!user) {

      res.status(404).send({
        message: "USER NOT FOUND"
      });

    } else {

      user.status = false;

      await user.save();

      res.send(user)

    }

  } catch (error) {

    res.status(500).send(error)

  }

});

module.exports = router;