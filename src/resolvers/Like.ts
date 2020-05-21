import { LikeResolvers } from '../generated/graphqlgen';

export const Like: LikeResolvers.Type = {
  ...LikeResolvers.defaultResolvers,

  post: ({ id }, args, ctx) => {
    return ctx.prisma.like({ id }).post();
  },

  author: ({ id }, args, ctx) => {
    return ctx.prisma.like({ id }).author();
  },
};
