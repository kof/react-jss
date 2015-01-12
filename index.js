'use strict';

var jss = require('jss');

function useSheet(rules, options) {
  var refs = 0,
      sheet;

  if (!options) options = {};
  if (options.named == null) options.named = true;

  function attach() {
    if (!sheet)
      sheet = jss.createStyleSheet(rules, options);

    sheet.attach();
  }

  function detach() {
    sheet.detach();
  }

  function ref() {
    if (refs === 0)
      attach();

    refs++;
    return sheet;
  }

  function deref() {
    refs--;

    if (refs === 0)
      detach();
  }

  var Mixin = {
    componentWillMount: function () {
      this.sheet = ref();
    },

    componentWillUnmount: function () {
      deref();
      this.sheet = null;
    }
  };

  // Support React Hot Loader
  if (module.hot) {
    Mixin.componentWillUpdate = function () {
      if (this.sheet !== sheet) {
        this.sheet.detach();
        this.sheet = ref();
      }
    };
  }

  return Mixin;
}

module.exports = useSheet;
