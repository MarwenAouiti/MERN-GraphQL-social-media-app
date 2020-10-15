const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Mutation: {
    // create comment
    async createComment(_, { postId, body }, context) {
      const { username } = checkAuth(context);
      if (body.trim === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'comment should not be empty!',
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post does not exist anymore!');
      }
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);

      if (post) {
        const commendIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commendIndex].username === username) {
          post.comments.splice(commendIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action Not Allowed!');
        }
      } else {
        throw new UserInputError('Post not found!');
      }
    },
    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // post already liked so unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
            createAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found!');
      }
    },
  },
};
