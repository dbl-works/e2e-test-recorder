# E2E Test Recorder

## Setup

### Install Dependencies

Run `yarn install` to install the dependencies.


## Usage

1. Visit the page/web app you want to record the interactions on.
2. Click on the bookmark.
3. Copy the code to your test script :)

## Build

1. You need to export the bookmarklet by running `yarn build:bookmarklet`

2. Then open `open ./dist/bookmarklet.html` in your browser.

3. Drag & Drop that to your bookmarks bar.


## Todo

- [x] Let it suggest using a test id like `data-cy` or `data-testid` to the user.

- [ ] Link the selector failure to the mapper (i.e. cypress contains mapper should not fail when there's no selector)

- [ ] Move the UI code to another module

- [ ] Write tests for the interaction handlers.

- [ ] Organize the interaction handles to have the `register` method to register the events.

- [ ] Support `TestStepSuggestion` that will be shown if a condition met.
