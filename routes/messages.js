const express = require(`express`);
const router = new express.Router();
const Message = require("../models/message");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
} = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 **/
router.get("/:id", ensureCorrectUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.get(id);
    return res.json({ message });
  } catch (error) {
    return next(error);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.get("/:from_username", async (req, res, next) => {
  try {
    const { from_username } = req.params;
    const { to_username, body } = req.body;
    const message = await Message.create({ from_username, to_username, body });
    return res.json({ message });
  } catch (error) {
    return next(error);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.get("/:id/read", ensureCorrectUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Message.markRead(id);
    return res.json({ message });
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
