const mongoose = require("mongoose");
const blogschema = require("./models/blog");
const dotenv = require("dotenv")
dotenv.config()
async function connectTodatabase() {
  try {
    console.log("Attempting databse function");
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 20000,
      }
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error, "error from database connection");
    return error;
  }
}

exports.handler = async (event) => {
  console.log("Received event {}", JSON.stringify(event, 3));

  const field = event.field;
  const args = event.arguments
  console.log("field---->", field, "args ---->", args);
  switch (field) {
    case "getablog":
      console.log("Query blogdetails called");
      await connectTodatabase();
      let blogdetails = await blogschema.findById(args.id);
      console.log("blogdetails---->", blogdetails);
      return blogdetails;
    case "getallblogs":
      console.log("Query getallblogs called");
      await connectTodatabase();
      let allblogs = await blogschema.find({});
      console.log("allblogs--->", allblogs);
      return allblogs
    case "createblog":
      console.log("Creating blog...");
      await connectTodatabase();
      const newBlog = new blogschema({
        author: args.author,
        title: args.title,
        content: args.content
      });
      const savedBlog = await newBlog.save();
      console.log("Created blog:", savedBlog);
      return savedBlog;
    case "updateblog":
      console.log("Updating blog...");
      await connectTodatabase();
      const { id, author, title, content } = args;
      const updateData = {};
      if (author) {
        updateData.author = author
      }
      if (title) {
        updateData.title = title;
      } updateData.title = title;
      if (content) {
        updateData.content = content;
      }
      const updatedBlog = await blogschema.findByIdAndUpdate(args.id, updateData, { new: true });
      console.log("Updated blog:", updatedBlog);
      return updatedBlog;
    case "deleteblog":
      console.log("Deleting blog...");
      const deleteResult = await blogschema.findByIdAndDelete(args.id);
      console.log("Delete result:", deleteResult);
      if (!deleteResult) {
        throw new Error("Blog not found");
      }
      return { message: "Blog deleted successfully" };
    default:
      throw new Error("Unknown field, unable to resolve " + event.field);
  }
};