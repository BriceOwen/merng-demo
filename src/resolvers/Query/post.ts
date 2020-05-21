// import { getUserId, Context } from '../utils';
import { QueryResolvers } from '../../generated/graphqlgen';

const getPosts: QueryResolvers.GetPostsResolver = (parent, args, ctx) => {
  return ctx.prisma.posts({
    orderBy: 'createdAt_DESC',
  });
};

const getPost: QueryResolvers.GetPostResolver = async (
  parent,
  { postId },
  ctx
) => {
  const post = await ctx.prisma.post({ id: postId });
  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

export default { getPosts, getPost };
