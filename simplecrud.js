const mongoose = require("mongoose");

const blogschema = require("./models/blog");

async function connectTodatabase() {
  try {
    console.log("Attempting databse function");
    await mongoose.connect(
      `mongodb+srv://daas20112000:Mohan2011@blobpost.bf24dy2.mongodb.net/sivi-blob-post`,
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
  console.log("field---->", field);
  switch (field) {
    case "getallblogs":
      await connectTodatabase();
      console.log(
        "await blobSchema.findById(id)---->",
        await blogschema.findById(args.id)
      );
      return await blogschema.findById(args.id);
    case "getalblog":
      console.log("Query getallblogs called");
      await connectTodatabase();
      return await blogschema.find({});
    default:
      throw new Error("Unknown field, unable to resolve " + event.field);
  }
};
