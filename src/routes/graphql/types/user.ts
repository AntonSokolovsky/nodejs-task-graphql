import {
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { IProfile, Profile } from './profile.js';
import { IPost, Post } from './post.js';
import { ContextType } from '../dataLoader.js';

type Subscriber = {
  subscriberId: string;
  authorId: string;
};

export type IUser = {
  id: string;
  name: string;
  balance: number;
  profile?: IProfile;
  posts?: IPost[];
  userSubscribedTo?: Subscriber[];
  subscribedToUser?: Subscriber[];
};

export type UserInput = {
  name: string;
  balance: number;
};

export const User: GraphQLObjectType<IUser, ContextType> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: Profile,
      resolve: async (parent, _args, context: ContextType) => {
        return await context.dataLoaders.profileDL.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (parent, _args, context: ContextType) => {
        return await context.dataLoaders.postDL.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (parent, _args, context) => {
        if (parent.userSubscribedTo && parent.userSubscribedTo?.length) {
          const usersIds = parent.userSubscribedTo.map((user) => user.authorId);
          const authors = context.dataLoaders.userDL.loadMany(usersIds);

          return authors;
        }
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (parent, _args, context) => {
        if (parent.subscribedToUser && parent.subscribedToUser?.length) {
          const usersIds = parent.subscribedToUser.map((user) => user.subscriberId);
          const subscribers = context.dataLoaders.userDL.loadMany(usersIds);

          return subscribers;
        }
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
