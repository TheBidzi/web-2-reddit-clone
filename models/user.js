const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username:   { type: String, required: true },
  password:   { type: String, select: false },
  createdAt:  { type: Date },
  updatedAt:  { type: Date },
  firstName:  { type: String },
  lastName:   { type: String },
  age:        { type: Number },
  sign:       { type: String }
});

// Use a regular function here to avoid issues with this!
UserSchema.pre('save', function(next) {
  const date = new Date();
  this.updatedAt = date;
  if ( !this.createdAt ) {
    this.createdAt = date;
  }

  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

// Must use function style function to bind this.password!
UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
}

const User = mongoose.model('user', UserSchema);
module.exports = User;
