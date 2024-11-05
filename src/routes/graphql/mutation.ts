import { GraphQLBoolean, GraphQLObjectType } from 'graphql';
import { ChangeUserInput, CreateUserInput, UserInput, User } from './types/user.js';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileInput,
  Profile,
} from './types/profile.js';
import { ChangePostInput, CreatePostInput, PostInput, Post } from './types/post.js';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: User,
      args: { dto: { type: CreateUserInput } },
      async resolve(
        _source,
        args: { dto: UserInput },
        { prisma }: { prisma: PrismaClient },
      ) {
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
      async resolve(
        _source,
        args: { dto: UserInput; id: string },
        { prisma }: { prisma: PrismaClient },
      ) {
        return await prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      async resolve(_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) {
        await prisma.user.delete({
          where: { id: args.id },
        });
      },
    },
    createProfile: {
      type: Profile,
      args: { dto: { type: CreateProfileInput } },
      async resolve(
        _source,
        args: { dto: ProfileInput },
        { prisma }: { prisma: PrismaClient },
      ) {
        return await prisma.profile.create({
          data: args.dto,
        });
      },
    },
    createPost: {
      type: Post,
      args: { dto: { type: CreatePostInput } },
      async resolve(
        _source,
        args: { dto: PostInput },
        { prisma }: { prisma: PrismaClient },
      ) {
        return prisma.post.create({ data: args.dto });
      },
    },
    changePost: {
      type: Post,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangePostInput },
      },
      async resolve(
        _source,
        args: { id: string; dto: PostInput },
        { prisma }: { prisma: PrismaClient },
      ) {
        return await prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      async resolve(_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) {
        await prisma.post.delete({
          where: { id: args.id },
        });
        return null;
      },
    },
    changeProfile: {
      type: Profile,
      args: { id: { type: UUIDType }, dto: { type: ChangeProfileInput } },
      async resolve(
        _source,
        args: { id: string; dto: ProfileInput },
        { prisma }: { prisma: PrismaClient },
      ) {
        return await prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: UUIDType } },
      async resolve(_source, args: { id: string }, { prisma }: { prisma: PrismaClient }) {
        await prisma.profile.delete({
          where: { id: args.id },
        });
      },
    },
    subscribeTo: {
      type: User,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      async resolve(
        _source,
        args: { userId: string; authorId: string },
        { prisma }: { prisma: PrismaClient },
      ) {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });

        const user = prisma.user.findUnique({ where: { id: args.userId } });

        return user;
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      async resolve(
        _source,
        args: { userId: string; authorId: string },
        { prisma }: { prisma: PrismaClient },
      ) {
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
