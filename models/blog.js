const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blobSchema = new Schema({
  title: String,
  content: String,
  author: String,
  publicationdate: String,
});
module.exports = mongoose.model("blob", blobSchema);
