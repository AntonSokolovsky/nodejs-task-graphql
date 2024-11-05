import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { User } from './user.js';
import { PrismaClient } from '@prisma/client';
import { MemberType, MemberTypeId, MemberTypeIdEnum } from './member.js';

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
}

export const Profile: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
    user: {
      type: User,
      resolve: async (source: IProfile, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findUnique({ where: { id: source.userId } });
      },
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source: IProfile, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.memberType.findUnique({ where: { id: source.memberTypeId } });
      },
    },
  }),
});
