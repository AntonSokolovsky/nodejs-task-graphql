import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { Profile } from './profile.js';
import { ContextType } from '../dataLoader.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export interface IMember {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export const MemberType: GraphQLObjectType<IMember, ContextType> = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (parent, _args, { prisma }: ContextType) => {
        return await prisma.profile.findMany({
          where: { memberTypeId: parent?.id },
        });
      },
    },
  }),
});
