export const TestStepTypes = {
  CLICK: 'CLICK',
}

export class TestStep {
  constructor(type, args) {
    if (!TestStepTypes[type]) {
      throw new Error(`Invalid TestStep type: ${type}`);
    }

    this.type = type
    this.args = args
  }
}
