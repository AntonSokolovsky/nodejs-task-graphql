import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schema.js';
import { getDataLoaders } from './dataLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const context = {
        prisma: fastify.prisma,
        dataloaders: getDataLoaders(fastify.prisma),
      };
      const response = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue: context,
      });

      return response;
    },
  });
};

export default plugin;
