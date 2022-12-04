export const TestStepTypes = {
  CLICK: 'CLICK',
  INPUT: 'INPUT',
  CHECK: 'CHECK',
}

let lastId = 0

export class TestStep {
  constructor(type, args) {
    if (!TestStepTypes[type]) {
      throw new Error(`Invalid TestStep type: ${type}`);
    }

    this.id = (++lastId).toString();

    this.type = type
    this.args = args
  }
}
