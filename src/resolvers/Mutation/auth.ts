import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MutationResolvers } from '../../generated/graphqlgen';
import { User } from '../../generated/prisma-client';
// import { Context } from '../../utils'

const generateToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    process.env.APP_SECRET,
    { expiresIn: '1hr' }
  );
};

const register: MutationResolvers.RegisterResolver = async (
  parent,
  args,
  ctx
) => {
  if (
    args.registerInput.username.trim() === '' ||
    (args.registerInput.email.trim() === '' ||
      args.registerInput.password.trim() === '')
  ) {
    throw new Error('Args are empty');
  }

  const userExists =
    (await ctx.prisma.$exists.user({
      username: args.registerInput.username,
    })) || (await ctx.prisma.$exists.user({ email: args.registerInput.email }));
  if (userExists) {
    throw new Error('Username is taken or Email is already exists');
  }

  const password = await bcrypt.hash(args.registerInput.password, 10);
  const user = await ctx.prisma.createUser({
    ...args.registerInput,
    password,
  });

  const token = generateToken(user);

  return {
    token,
    user,
  };
};

const login: MutationResolvers.LoginResolver = async (
  parent,
  { username, password },
  ctx
) => {
  const user = await ctx.prisma.user({ username });
  if (!user) {
    throw new Error(`No such user found for username: ${username}`);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = generateToken(user);

  return {
    token,
    user,
  };
};

export const auth = {
  register,
  login,
};
