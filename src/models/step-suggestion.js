let lastId = 0

export class StepSuggestion {
  constructor(name, description, args) {
    // TODO: suggest ``cy.get('...').should('contain.text', '${selection.toString()}')`
    this.id = (++lastId).toString()
    this.name = name
    this.description = description
    this.args = args
  }
}
