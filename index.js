const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { ApolloServer } = require("apollo-server-lambda");
// const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const blobSchema = require("./models/blog");

async function connectTodatabase() {
  try {
    console.log("Attempting databse function");
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error, "error from database connection");
    return error;
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
    getablog: async (parent, args) => {
      console.log("Query getablog called with args:", args);
      await connectTodatabase();
      console.log(
        "await blobSchema.findById(id)---->",
        await blobSchema.findById(args.id)
      );
      return await blobSchema.findById(args.id);
    },
    getallblogs: async () => {
      console.log("Query getallblogs called");
      await connectTodatabase();
      return await blobSchema.find({});
    },
  },
  Mutation: {
    createblog: async (parent, args) => {
      console.log("Mutation createblog called with args:", args);
      let title = args.title;
      let content = args.content;
      let author = args.author;
      let publicationdate = args.publicationdate;
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
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// const url = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });

exports.graphqlHandler = server.createHandler();
