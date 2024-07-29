const { ApolloServer } = require("apollo-server-lambda");
const {
    ApolloServerPluginLandingPageLocalDefault,
  } = require("apollo-server-core");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Blog = require("./models/blog");

dotenv.config();
async function connectToDatabase() {
  try {
    console.log("Attempting database connection...");
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

const typeDefs = `#graphql
  type Blog {
    _id: ID!
    author: String!
    title: String!
    content: String!
  }

  type Query {
    getallblogs: [Blog]
    getblog(id: ID!): Blog
  }

  type Mutation {
    createblog(input: BlogInput!): Blog
    deleteblog(id: ID!): Blog
  }

  input BlogInput {
    author: String!
    title: String!
    content: String!
  }
`;

const resolvers = {
  Query: {
    getallblogs: async () => {
      try {
        return await Blog.find({});
      } catch (error) {
        console.error("Error in getallblogs resolver:", error);
        throw error;
      }
    },
    getblog: async (parent,args) => {
      try {
        return await Blog.findById(args.id);
      } catch (error) {
        console.error("Error in getblog resolver:", error);
        throw error;
      }
    },
  },
  Mutation: {
    createblog: async (parent,args) => {
      try {
        const newBlog = new Blog(args.input);
        return await newBlog.save();
      } catch (error) {
        console.error("Error in createblog resolver:", error);
        throw error;
      }
    },
    deleteblog: async (parent,args) => {
      try {
        return await Blog.findByIdAndDelete(args.id);
      } catch (error) {
        console.error("Error in deleteblog resolver:", error);
        throw error;
      }
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

const handler = server.createHandler();
exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  try {
    await connectToDatabase();
    const result = await handler(event);
    return result;
  } catch (error) {
    console.error("Error handling the event:", error);
    throw error;
  }
};

// async function startServer() {
//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 4000 },
//     context: async ({ event }) => {
//       await connectTodatabase();
//       return { event };
//     },
//     formatResponse: async (parent, args) => {
//       return await handleGraphQLResonse(args.context.event);
//     },
//   });
//   console.log(`🚀  Server ready at: ${url}`);
// }
// startServer();
