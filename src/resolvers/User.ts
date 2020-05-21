import { UserResolvers } from '../generated/graphqlgen';

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  posts: ({ id }, args, ctx) => {
    return ctx.prisma.user({ id }).posts();
  },

  comments: ({ id }, args, ctx) => {
    return ctx.prisma.user({ id }).comments();
  },

  likes: ({ id }, args, ctx) => {
    return ctx.prisma.user({ id }).likes();
  },
};
