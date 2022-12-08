import { FrameworkMapperBase } from "../framework-mappers/framework-mapper-base";

export interface InteractionHandlerConfig {
  getMapper(): FrameworkMapperBase
}
