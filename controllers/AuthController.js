'use strict';

const User = require('./../models/User');
const Token = require('../models/Token');
const validator = require('validator');

const signUp = async (req, res) => {

  let data = req.body;

  let err, inserted_user;
  [err, inserted_user] = await to(User.query().insertAndFetch(data));
  if (err) return badRequestError(res, err.message);

  let auth_token = await inserted_user.getJWT();

  let inserted_token;
  [err, inserted_token] = await to(Token.query().insertAndFetch({
    userId: inserted_user.id,
    token: auth_token
  }));
  if (err) return ReE(res, err, 422);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('AuthToken', auth_token)

  return createdResponse(res, {
    ...inserted_user
  }, "Your account has been created successfully");
}

const login = async (req, res) => {

  let err, user;
  const data = req.body;

  if (!data.password) {
    return badRequestError(res, "Please enter password");
  }

  if (!validator.isEmail(data.email)) {
    return badRequestError(res, "Please enter a valid email");
  }

  [err, user] = await to(User.query().where('email', data.email).first());
  if (!user) {
    return badRequestError(res, 'Email is not registered.');
  }

  if (!await user.comparePassword(data.password)) {
    return badRequestError(res, 'Please enter valid credentials.');
  }

  let token, auth_token = await user.getJWT();
  [err, token] = await to(Token.query().insertAndFetch({
    userId: user.id,
    token: auth_token
  }));
  if (!err) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('AuthToken', auth_token)
  }

  return okResponse(res, {
    ...user.toJSON(),
  }, "Login Successfully");
}

const logout = async (req, res) => {
  await Token.query().delete().where('token', req.token).where('userId', req.user.id);
  return noContentResponse(res);
}

module.exports = {
  signUp,
  login,
  logout
}
