import type { FastifyInstance } from "fastify";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import operations from "../.generated/operationMap.js";

declare const app: FastifyInstance;

const { method, url, schema } = operations.getUser;

app.withTypeProvider<JsonSchemaToTsProvider>().route({
  method,
  url,
  schema,
  handler: async (req, reply) => {
    req.params.userHandle;
    await reply.status(200).send({
      user: {
        handle: "foo",
        name: "bar",
      },
      // irregularProperty: "foo",
    });
  },
});
