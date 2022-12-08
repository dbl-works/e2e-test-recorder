import { TestStep } from "../models/test-steps";

export interface FrameworkMapperBase {
  map(testStep: TestStep): string

  getSelector(element: HTMLElement): string | null
}
