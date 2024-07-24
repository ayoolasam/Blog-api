
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  followed: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
 
},
{
  timestamps:true
});

const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;
