const { ApolloServer, gql } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const typeDefs = gql`
  type Blog {
    id: ID!
    author: String!
    title: String!
    content: String!
  }

  type Query {
    getablog(id: ID!): Blog
    getallblogs: [Blog]
  }

  type Mutation {
    createblog(author: String!, title: String!, content: String!): Blog
    updateblog(id: ID!, author: String, title: String, content: String): Blog
    deleteblog(id: ID!): String
  }
`;


const resolvers = {
  Query: {
    getablog: async (parent,args) => {
      await connectToDatabase();
      return Blog.findById(args.id);
    },
    getallblogs: async () => {
      await connectToDatabase();
      return Blog.find({});
    },
  },
  Mutation: {
    createblog: async (parent,args) => {
      const {author, title, content } = args
      await connectToDatabase();
      const newBlog = new Blog({ author, title, content });
      return newBlog.save();
    },
    updateblog: async (parent,args) => {
      const {author, title, content } = args
      await connectToDatabase();
      const updateData = { author, title, content };
      return Blog.findByIdAndUpdate(id, updateData, { new: true });
    },
    deleteblog: async (parent,args) => {
      await connectToDatabase();
      const result = await Blog.findByIdAndDelete(args.id);
      if (!result) throw new Error("Blog not found");
      return "Blog deleted successfully";
    },
  },
};

const connectToDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database connection failed");
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => ({
    headers: event.headers,
  }),
});

exports.graphqlHandler = server.createHandler();
