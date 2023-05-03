import type { FastifySchema, HTTPMethods } from "fastify";

export type Operation = {
  url: string;
  method: HTTPMethods;
  schema: FastifySchema;
};
