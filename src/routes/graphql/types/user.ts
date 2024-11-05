import {
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';
import { Profile } from './profile.js';
import { Post } from './post.js';

export interface IUser {
  id: string;
  name: string;
  balance: number;
}

export type UserInput = {
  name: string;
  balance: number;
};

export const User: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (source: IUser, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findUnique({ where: { userId: source.id } });
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (source: IUser, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.post.findMany({ where: { authorId: source.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      async resolve(source: IUser, _args, { prisma }: { prisma: PrismaClient }) {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: source.id },
        });

        return await prisma.user.findMany({
          where: {
            id: { in: subscribers.map((user) => user.authorId) },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      async resolve(source: IUser, _args, { prisma }: { prisma: PrismaClient }) {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: source.id },
        });

        return await prisma.user.findMany({
          where: {
            id: { in: subscribers.map((user) => user.subscriberId) },
          },
        });
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
