const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }), // take request body and forward it to the context
  // so we can access it from the arguemt context in every Mutation
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to DB');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
