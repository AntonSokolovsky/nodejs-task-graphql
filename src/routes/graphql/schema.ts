import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { User } from './types/user.js';
import { IMember, MemberType, MemberTypeIdEnum } from './types/member.js';
import { PrismaClient } from '@prisma/client';
import { Post } from './types/post.js';
import { IProfile, Profile } from './types/profile.js';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      async resolve(_source, _args, { prisma }: { prisma: PrismaClient }) {
        return await prisma.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (_source, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.post.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (_source, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findMany();
      },
    },
    users: {
      type: new GraphQLList(User),
      resolve: async (_source, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: async (_source, args: IMember, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },
    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        _source,
        args: { id: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return await prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    user: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (
        _source,
        args: { id: string },
        { prisma }: { prisma: PrismaClient },
      ) => {
        return await prisma.user.findUnique({ where: { id: args.id } });
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, args: IProfile, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});

export const schema = new GraphQLSchema({ query });
