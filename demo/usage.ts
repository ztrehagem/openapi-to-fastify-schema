import type { FastifyInstance } from "fastify";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import operations from "../.generated/operationMap.js";

declare const app: FastifyInstance;

const { method, url, schema } = operations.createPost;

app.withTypeProvider<JsonSchemaToTsProvider>().route({
  method,
  url,
  schema,
  handler: async (req, reply) => {
    req.params.userHandle;
    await reply.status(201).send({
      post: {
        id: 1,
        body: "Hello",
        dateTime: "2023-01-01T00:00:00Z",
        user: {
          handle: "johndoe",
          name: "John Doe",
        },
      },
      // irregularProperty: "foo",
    });
  },
});
