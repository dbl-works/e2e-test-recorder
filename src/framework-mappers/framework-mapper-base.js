/**
 * @interface
 */
export class FrameworkMapperBase {
  /**
   *
   * @param {TestStep} testStep
   * @returns {string}
   * @abstract
   * @static
   */
  static map(testStep) {}

  /**
   * @param {HTMLElement} testStep
   * @returns {string}
   * @abstract
   * @static
   */
  static getSelector(element) {}
}
