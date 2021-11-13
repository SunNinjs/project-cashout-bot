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

const reqObject = {
  type: Object,
  required: true
}

const welcomeSchema = mongoose.Schema({
  GuildID: reqString,
  list: reqObject,
})

module.exports = mongoose.model('webhooks', welcomeSchema)