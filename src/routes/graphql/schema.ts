import { GraphQLSchema } from 'graphql';
import { mutation } from './mutation.js';
import { query } from './query.js';

export const schema = new GraphQLSchema({ query, mutation });
