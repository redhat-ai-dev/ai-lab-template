const NodeEnvironment = require('jest-environment-node').default;

class NodeEnvironmentDetectFail extends NodeEnvironment {
  async setup() {
    super.setup();

    this.global.hasTestFailures = false;
  }

  handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure') {
      this.global.hasTestFailures = true;
    }
    if (super.handleTestEvent) {
      super.handleTestEvent(event, state);
    }
  }
}

module.exports = NodeEnvironmentDetectFail;