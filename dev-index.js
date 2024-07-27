const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const blobSchema = require("./models/blog");

function connectTodatabase() {
  try {
    console.log("databse funnction called successfully");
    mongoose.connect(
      "mongodb+srv://daas20112000:****@blobpost.bf24dy2.mongodb.net/*****",
      {
        useNewUrlParser: true,
      }
    );
    mongoose.connection.once("open", () => {
      console.log("Mongo Db connected successfully");
    });
  } catch (error) {
    console.log(error, "error from database connection");
  }
}

const typeDefs = `#graphql
  type blog {
      id: ID
    title: String
    content: String
    author: String
    publicationdate: String
  }

  type Query {
    getablog(id: ID!): blog
    getallblogs: [blog]
  }
    type Mutation {
    createblog(title: String, content: String, author: String, publicationdate: String): blog
  }`;
const resolvers = {
  Query: {
    getablog: async (id) => {
      await connectTodatabase();
      console.log(
        "await blobSchema.findById(id)---->",
        await blobSchema.findById(id)
      );
      return await blobSchema.findById(id);
    },
    getallblogs: async () => {
      await connectTodatabase();
      return await blobSchema.find({});
    },
  },
  Mutation: {
    createblog: async (title, content, author, publicationdate) => {
      await connectTodatabase();
      let blogcreation = new blobSchema({
        title,
        content,
        author,
        publicationdate,
      });
      return await blogcreation.save();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
};
startServer();
