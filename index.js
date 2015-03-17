var events = require('event');
var classes = require('classes');
var query = require('query');
var emitter = require('emitter');
var k = require('k')(window);

module.exports = onoff;

/*global document*/

function onoff(selectors) {
  var self = {}, my = {
    className: 'hidden'
  };

  function check(name, e) {
    var veto;
    self.emit(name, e, my.el, function() {
      veto = true;
    });
    return !veto;
  }

  function close(e) {
    var cl = classes(my.el);
    if (cl.has(my.className)) {
      // alredy closed
      return;
    }
    if (!check('closing', e)) {
      return self;
    }
    events.unbind(document, 'click', close);
    k.unbind();
    cl.add(my.className);
    return self;
  }

  function open(e) {
    var cl = classes(my.el);
    if (!cl.has(my.className)) {
      return;
    }
    if (!check('opening', e)) {
      return self;
    }
    cl.remove(my.className);
    events.bind(document, 'click', close);
    k.bind('esc', close);
    return self;
  }

  function opening(e) {
    e.stopPropagation();
    e.preventDefault();
    open(e);
  }

  my.el = query(selectors.popup);
  if (selectors.trigger) {
    events.bind(query(selectors.trigger), 'click', opening);
  }
  if (selectors.event) {
    events.bind(window, selectors.event, opening);
  }
  events.bind(query('.close', my.el), 'click', close);

  self.open = open;
  self.close = close;

  emitter(self);

  return self;
}
