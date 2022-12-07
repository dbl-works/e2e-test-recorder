export const TestStepTypes = {
  CLICK: 'CLICK',
  INPUT: 'INPUT',
  CHECK: 'CHECK',
  CONTAIN: 'CONTAIN',
}

let lastId = 0

export class TestStep {
  constructor(type, args) {
    if (!TestStepTypes[type]) {
      throw new Error(`Invalid TestStep type: ${type}`)
    }

    this.id = (++lastId).toString()

    this.type = type
    this.args = args
  }

  get selector() {
    return this.args.selector
  }

  get content() {
    return this.args.content
  }

  get value() {
    return this.args.value
  }

  get override() {
    return this.args.override
  }

  set override(value) {
    this.args.override = value
  }
}
