'use strict';

const Model = require('objection').Model;
const jwt = require('jsonwebtoken');
const validator = require('validator');
const ValidationError = require('objection').ValidationError;
const bcrypt = require('bcrypt');

class User extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'user';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],

      properties: {
        id: { type: 'integer' },
        email: { type: 'string', minLength: 1, maxLength: 255 }
      }
    };
  }

  async comparePassword(password) {
    if (!password) {
      return false;
    }
    let pass = await bcrypt.compare(password, this.password);
    return pass;
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {

    }
  }

  async getJWT() {
    return await jwt.sign({
      userId: this.id
    }, CONFIG.jwt_encryption);
  }

  async $beforeInsert() {

    await super.$beforeInsert();

    if (!validator.isEmail(this.email || '')) {
      throw new ValidationError({
        message: "Not a valid email!",
        type: "ModelValidation",
        data: {
          message: "Please enter a valid email.",
          code: 406,
          status: "error"
        }
      })
    }

    let userExists = await this.constructor.query().select('id').where('email', this.email).first();

    if (userExists) {
      throw new ValidationError({
        message: "Account with this email already exists!",
        type: "ModelValidation",
        data: {
          status: "error",
          code: 406,
          message: "Account already exists with this email!"
        }
      });
    }

    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }

  }

  async $beforeUpdate() {
    await super.$beforeUpdate();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  $formatJson(json, opt) {
    json = super.$formatJson(json, opt);
    json.password ? delete json.password : json;
    return json;
  }

}

module.exports = User;
