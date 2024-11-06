import { GraphQLList, GraphQLObjectType, GraphQLResolveInfo } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { IUser, User } from './types/user.js';
import { MemberType, MemberTypeIdEnum } from './types/member.js';
import { Post } from './types/post.js';
import { Profile } from './types/profile.js';
import { ContextType } from './dataLoader.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_parent, _args, { prisma }: ContextType) => {
        return await prisma.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (_parent, _args, { prisma }: ContextType) => {
        return await prisma.post.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (_parent, _args, { prisma }: ContextType) => {
        return await prisma.profile.findMany();
      },
    },
    users: {
      type: new GraphQLList(User),
      resolve: async (
        _parent,
        _args,
        context: ContextType,
        resolveInfo: GraphQLResolveInfo,
      ) => {
        const parsedResolveInfo = parseResolveInfo(resolveInfo);
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfo as ResolveTree,
          resolveInfo.returnType,
        );

        const users: IUser[] = await context.prisma.user.findMany({
          include: {
            subscribedToUser: 'subscribedToUser' in fields,
            userSubscribedTo: 'userSubscribedTo' in fields,
          },
        });

        users.forEach((user) => {
          context.dataLoaders.userDL.prime(user.id, user);
        });

        return users;
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeIdEnum } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        return await prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },
    post: {
      type: Post,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        return await prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    user: {
      type: User,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, context: ContextType) => {
        return await context.dataLoaders.userDL.load(args.id);
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, args: { id: string }, { prisma }: ContextType) => {
        return await prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
