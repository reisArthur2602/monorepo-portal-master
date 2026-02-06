import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    shouldBeAdmin(): Promise<void>;
  }
}
