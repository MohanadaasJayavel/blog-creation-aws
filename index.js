const { ApolloServer } = require("@apollo/server");
const mongoose = require("mongoose");
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
const blobSchema = require("./models/blob");

async function connectTodatabase() {
  try {
    console.log("databse funnction called successfully");
    mongoose.connect(
      "mongodb+srv://daas20112000:*****@blobpost.bf24dy2.mongodb.net/****",
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
      return await blobSchema.findById(id);
    },
    getallblogs: async () => {
      await connectTodatabase();
      return await blobSchema.find({});
    },
  },
  Mutation: {
    createablog: async (title, content, author, publicationdate) => {
      await connectTodatabase();
      return await new createablog.save({
        title,
        content,
        author,
        publicationdate,
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
