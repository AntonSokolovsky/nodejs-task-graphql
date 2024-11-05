import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { ChangeUserInput, CreateUserInput, UserInput, User } from './types/user.js';
import { UUIDType } from './types/uuid.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileInput,
  Profile,
} from './types/profile.js';
import { ChangePostInput, CreatePostInput, PostInput, Post } from './types/post.js';
import { ContextType, userDL } from './dataLoader.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: User,
      args: { dto: { type: CreateUserInput } },
      resolve: async (_parent, args: { dto: UserInput }, { prisma }: ContextType) => {
        return await prisma.user.create({
          data: args.dto,
        });
      },
    },
    changeUser: {
      type: User,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeUserInput },
      },
      resolve: async (
        _parent,
        args: { dto: UserInput; id: string },
        { prisma }: ContextType,
      ) => {
        return await prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        try {
          await prisma.user.delete({
            where: { id: args.id },
          });

          return true;
        } catch (err) {
          return false;
        }
      },
    },
    createPost: {
      type: Post,
      args: { dto: { type: CreatePostInput } },
      resolve: async (_parent, args: { dto: PostInput }, { prisma }: ContextType) => {
        return await prisma.post.create({ data: args.dto });
      },
    },
    changePost: {
      type: Post,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangePostInput },
      },
      resolve: async (
        _parent,
        args: { id: string; dto: PostInput },
        { prisma }: ContextType,
      ) => {
        return await prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        await prisma.post.delete({
          where: { id: args.id },
        });
        return null;
      },
    },
    createProfile: {
      type: Profile,
      args: { dto: { type: CreateProfileInput } },
      resolve: async (_parent, args: { dto: ProfileInput }, { prisma }: ContextType) => {
        return await prisma.profile.create({
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: Profile,
      args: { id: { type: UUIDType }, dto: { type: ChangeProfileInput } },
      resolve: async (
        _parent,
        args: { id: string; dto: ProfileInput },
        { prisma }: ContextType,
      ) => {
        return await prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        try {
          await prisma.profile.delete({
            where: { id: args.id },
          });

          return true;
        } catch (err) {
          return false;
        }
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        { prisma }: ContextType,
      ) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
        return `User:${args.userId} subscribed to author:${args.authorId}!`;
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (
        _parent,
        args: { userId: string; authorId: string },
        { prisma }: ContextType,
      ) => {
        try {
          await prisma.subscribersOnAuthors.deleteMany({
            where: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          });
          return true;
        } catch {
          return false;
        }
      },
    },
  },
});
