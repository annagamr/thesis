const db = require("../Models");

checkDuplicateUsernameOrEmailAndRolesExisted = async (req, res, next) => {
  try {
    const userByUsername = await db.user.findOne({ username: req.body.username });
    if (userByUsername) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    const userByEmail = await db.user.findOne({ email: req.body.email });
    if (userByEmail) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!db.ROLES.includes(req.body.roles[i])) {
          return res.status(400).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
        }
      }
    }

    next();
  } catch (err) {
    console.log("Error is here " + err);
    res.status(500).send({ message: err });
  }
};
const verifySignUp = {
  checkDuplicateUsernameOrEmailAndRolesExisted
};

module.exports = verifySignUp;