var express = require('express');
var router = express.Router();

let roleModel = require('../schemas/roles')
let userModel = require('../schemas/users')


// GET USERS BY ROLE ID
router.get('/:id/users', async function (req, res, next) {

  try {

    let id = req.params.id;

    let role = await roleModel.findById(id);

    if (!role) {

      res.status(404).send({
        message: "ROLE NOT FOUND"
      });

    } else {

      let users = await userModel.find({
        role: id,
        isDeleted: false
      });

      res.send(users)

    }

  } catch (error) {

    res.status(404).send({
      message: "ID NOT FOUND"
    });

  }

});

module.exports = router;