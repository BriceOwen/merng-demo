import { QueryResolvers } from '../../generated/graphqlgen';

import post from './post';

export const Query: QueryResolvers.Type = {
  ...post,
};
