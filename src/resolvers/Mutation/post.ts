import { MutationResolvers } from '../../generated/graphqlgen';
import { checkAuth } from '../../util/check-auth';

const createPost: MutationResolvers.CreatePostResolver = async (
  parent,
  { body },
  ctx
) => {
  const userId = checkAuth(ctx);

  if (body.trim() === '') {
    throw new Error('Empty arg');
  }
  const post = await ctx.prisma.createPost({
    body,
    author: {
      connect: {
        id: userId,
      },
    },
  });
  return post;
};

const deletePost: MutationResolvers.DeletePostResolver = async (
  parent,
  { postId },
  ctx
) => {
  const userId = checkAuth(ctx);

  const exists = await ctx.prisma.$exists.post({
    id: postId,
    author: { id: userId },
  });

  const post = await ctx.prisma.deletePost({
    id: postId,
  });

  return post;
};

const createComment: MutationResolvers.CreateCommentResolver = async (
  parent,
  { postId, body },
  ctx
) => {
  const userId = checkAuth(ctx);

  if (body.trim() === '') {
    throw new Error('Empty arg');
  }

  const post = await ctx.prisma.post({ id: postId });
  if (!post) {
    throw new Error('Post not found');
  }

  const comment = await ctx.prisma.createComment({
    body,
    post: {
      connect: {
        id: post.id,
      },
    },
    author: {
      connect: {
        id: userId,
      },
    },
  });

  await ctx.prisma.updateUser({
    data: {
      comments: {
        connect: {
          id: comment.id,
        },
      },
    },
    where: {
      id: userId,
    },
  });

  return ctx.prisma.updatePost({
    data: {
      comments: {
        connect: {
          id: comment.id,
        },
      },
    },
    where: {
      id: post.id,
    },
  });
};

const deleteComment: MutationResolvers.DeleteCommentResolver = async (
  parent,
  { postId, commentId },
  ctx
) => {
  const userId = checkAuth(ctx);

  const exists = await ctx.prisma.$exists.comment({
    id: commentId,
    author: { id: userId },
  });

  if (!exists) {
    throw new Error('Action not allowed');
  }

  const comment = await ctx.prisma.deleteComment({
    id: commentId,
  });

  if (!comment) {
    throw new Error('Error occured');
  }

  return ctx.prisma.post({ id: postId });
};

const likePost: MutationResolvers.LikePostResolver = async (
  parent,
  { postId },
  ctx
) => {
  const userId = checkAuth(ctx);

  const postExists = await ctx.prisma.$exists.post({ id: postId });

  if (!postExists) {
    throw new Error('Post not found');
  }

  const like = await ctx.prisma
    .post({
      id: postId,
    })
    .likes({ where: { author: { id: userId } } });

  if (like.length > 0) {
    // Post already likes, unlike it
    const unlike = await ctx.prisma.deleteLike({ id: like[0].id });

    return ctx.prisma.post({ id: postId });
  } else {
    // Not like, liked post
    const like = await ctx.prisma.createLike({
      post: { connect: { id: postId } },
      author: { connect: { id: userId } },
    });

    await ctx.prisma.updateUser({
      data: {
        likes: {
          connect: {
            id: like.id,
          },
        },
      },
      where: {
        id: userId,
      },
    });

    const post = await ctx.prisma.updatePost({
      data: {
        likes: {
          connect: {
            id: like.id,
          },
        },
      },
      where: {
        id: postId,
      },
    });

    return post;
  }
};

export const post = {
  createPost,
  deletePost,
  createComment,
  deleteComment,
  likePost,
};
