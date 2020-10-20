const { AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    // get all posts
    async getPosts() {
      try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    // get post by id
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    // create post
    async createPost(_, { body }, context) {
      // check if current user is authenticated
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post should not be empty!');
      }
      // create the post
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      // save the post
      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post,
      });

      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully!';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
};
