import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';
import { User } from './user.js';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export const Post: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: User,
      resolve: async (source: IPost, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findUnique({ where: { id: source.authorId } });
      },
    },
  }),
});