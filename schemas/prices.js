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

const reqObj = {
  type: Object,
  required: true
}

const welcomeSchema = mongoose.Schema({
  disc: reqString,
  digi: reqString,
  xbox: reqString,
  oled: reqString,
  ps4: reqString,
  ov_digi: reqString,
  ov_disc: reqString,
  ov_xbox: reqString,
  ov_oled: reqString
})

module.exports = mongoose.model('prices', welcomeSchema)