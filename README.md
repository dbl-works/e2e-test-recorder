# E2E Test Recorder

## Setup

### Install Dependencies

Run `yarn install` to install the dependencies.


## Build

1. You need to export the bookmarklet by running `yarn build:bookmarklet`

2. Then open `open ./dist/bookmarklet.html` in your browser.

3. Drag & Drop that to your bookmarks bar.


## Todo

- [ ] Let it suggest using a test id like `data-test-id` to the user.

- [ ] Move the UI code to another module

- [ ] Write tests for the interaction handlers.

- [ ] Organize the interaction handles to have the `register` method to register the events.

- [ ] Support `TestStepSuggestion` that will be shown if a condition met.
