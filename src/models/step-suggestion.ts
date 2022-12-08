let lastId = 0

export class StepSuggestion {
  public id: string
  public name: string
  public description: string
  public args: Record<string, any>

  constructor(name: string, description: string, args: Record<string, any>) {
    // TODO: suggest ``cy.get('...').should('contain.text', '${selection.toString()}')`
    this.id = (++lastId).toString()
    this.name = name
    this.description = description
    this.args = args
  }
}
