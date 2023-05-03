# @ztrehagem/openapi-to-fastify-schema

## Usage

1. Prepare with generating schema objects and type definitions.

```sh
npm install -g @ztrehagem/openapi-to-fastify-schema
# or
npm install -D @ztrehagem/openapi-to-fastify-schema

# then
openapi-to-fastify-schema ./path/to/your/openapi.yaml
```

2. Use schema object in Fastify instance.

```ts
import type { FastifyInstance } from "fastify";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import operations from "@ztrehagem/openapi-to-fastify-schema/generated";

declare const app: FastifyInstance;

const { method, url, schema } = operations.getUser;

app.withTypeProvider<JsonSchemaToTsProvider>().route({
  method,
  url,
  schema,
  handler: async (req, reply) => {
    // Typed!
    req.params.userHandle;

    await reply.status(200).send({
      // Typed!
      user: {
        handle: "foo",
        name: "bar",
      },
    });
  },
});
```
