const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const reqNumber = {
  type: Number,
  required: true
}

const reqArray = {
  type: Array,
  required: true
}

const reqBoolen = {
  type: Boolean,
  required: true
}

const welcomeSchema = mongoose.Schema({
  dev: reqString,
  GuildID: reqString,
  prefix: reqString,
})

module.exports = mongoose.model('settings', welcomeSchema)