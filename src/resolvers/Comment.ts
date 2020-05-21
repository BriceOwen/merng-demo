import { CommentResolvers } from '../generated/graphqlgen';

export const Comment: CommentResolvers.Type = {
  ...CommentResolvers.defaultResolvers,

  post: ({ id }, args, ctx) => {
    return ctx.prisma.comment({ id }).post();
  },

  author: ({ id }, args, ctx) => {
    return ctx.prisma.comment({ id }).author();
  },
};
