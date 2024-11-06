import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';
import { User } from './user.js';
import { UUIDType } from './uuid.js';
import { ContextType } from '../dataLoader.js';

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export type PostInput = {
  title: string;
  content: string;
  authorId: string;
};

export const Post: GraphQLObjectType<IPost, ContextType> = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    authorId: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    author: {
      type: User,
      resolve: async (parent, _args, { prisma }: ContextType) => {
        return await prisma.user.findUnique({ where: { id: parent?.authorId } });
      },
    },
  }),
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});
