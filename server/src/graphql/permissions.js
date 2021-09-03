import { and, rule, shield } from "graphql-shield";

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const isUpdatingOwnLibrary = rule()(
  (root, { input: { userId } }, { user }, info) => {
    return user?.sub === userId;
  }
);

const isEditingOwnReview = rule()(
  async (root, args, { dataSources, user }, info) => {
    const id = args.input ? args.input.id : args.id;
    const review = await dataSources.db.getReviewById(id);
    return user.sub === review.user_id.toString();
  }
);

const permissions = shield(
  {
    // queries to apply rule to
    Query: {
      user: isAuthenticated
    },
    Mutation: {
      addBooksToLibrary: and(isAuthenticated, isUpdatingOwnLibrary),
      createAuthor: isAuthenticated,
      createBook: isAuthenticated,
      createReview: isAuthenticated,
      deleteReview: and(isAuthenticated, isEditingOwnReview),
      removeBooksFromLibrary: and(isAuthenticated, isUpdatingOwnLibrary),
      updateReview: and(isAuthenticated, isEditingOwnReview)
    }
  },
  { debug: process.env.NODE_ENV === 'development' }
);

export default permissions;
