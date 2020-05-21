import { Resolvers } from '../generated/graphqlgen';
import { Query } from './Query';
import { Subscription } from './Subscription';
import QueryResolversType from './Type';
import { auth } from './Mutation/auth';
import { post } from './Mutation/post';
import { User } from './User';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';
import { IResolvers } from 'graphql-tools/Interfaces';

export const resolvers = ({
  Query,
  Mutation: {
    ...auth,
    ...post,
  },
  Subscription,
  User,
  Post,
  Comment,
  Like,
  ...QueryResolversType,
} as unknown) as IResolvers;
