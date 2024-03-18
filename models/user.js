/** User class for message.ly */
const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/** User of the site. */

class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    try {
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
      const results = await db.query(
        `
    INSERT INTO users (
      username, 
      password, 
      first_name, 
      last_name, 
      phone, 
      join_at,
      last_login_at
      ) 
    VALUES ($1, $2, $3, $4, $5, current_timestamp, CURRENT_TIMESTAMP
      ) RETURNING 
    username, password, first_name, last_name, phone
    `,
        [username, hashedPassword, first_name, last_name, phone]
      );
      const user = results.rows[0];
      return user;
    } catch (error) {
      throw error;
    }
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    try {
      const results = await db.query(
        "SELECT password FROM users WHERE username = $1",
        [username]
      );
      const user = results.rows[0];
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid;
      } else {
        throw new ExpressError("Invalid username/password", 400);
      }
    } catch (error) {
      throw error;
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
           SET last_login_at = current_timestamp
           WHERE username = $1
           RETURNING username`,
      [username]
    );

    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
  }
  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    try {
      const results = await db.query(
        `SELECT username, first_name, last_name, phone FROM users`
      );
      return results.rows;
    } catch (error) {
      throw error;
    }
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    try {
      const results = await db.query(
        `SELECT username, first_name, last_name, phone, join_at, last_login_at 
        FROM users WHERE username=$1`,
        [username]
      );
      const user = results.rows[0];
      return user;
    } catch (error) {
      throw error;
    }
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    try {
      const results = await db.query(
        `SELECT 
          messages.id,
          messages.to_username AS to_user,
          messages.body,
          messages.sent_at,
          messages.read_at,
          users.username AS to_username,
          users.first_name,
          users.last_name,
          users.phone
      FROM 
          messages
      JOIN 
          users ON messages.to_username = users.username
      WHERE 
          messages.from_username = $1`,
        [username]
      );

      // if (results.rows.length === 0) {
      //   throw new ExpressError(`No messages found for user: ${username}`, 404);
      // }
      const messages = results.rows.map((m) => ({
        id: m.id,
        to_user: {
          username: m.to_username,
          first_name: m.first_name,
          last_name: m.last_name,
          phone: m.phone,
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at,
      }));

      return messages;
    } catch (error) {
      throw error;
    }
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    try {
      const results = await db.query(
        `
          SELECT 
              messages.id, 
              messages.from_username AS from_user, 
              body, 
              sent_at, 
              read_at, 
              users.username AS from_username, 
              users.first_name, 
              users.last_name, 
              users.phone
          FROM 
              messages
          JOIN 
              users ON messages.from_username = users.username
          WHERE 
              messages.to_username = $1
        `,
        [username]
      );
      const messages = results.rows.map((m) => ({
        id: m.id,
        from_user: {
          username: m.from_username,
          first_name: m.first_name,
          last_name: m.last_name,
          phone: m.phone,
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at,
      }));

      return messages;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
