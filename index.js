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
    var cl = my.el.classList;
    if (cl.contains(my.className)) {
      // alredy closed
      return;
    }
    if (!check('closing', e)) {
      return self;
    }
    document.removeEventListener('click', close);
    k.unbind();
    cl.add(my.className);
    return self;
  }

  function open(e) {
    var cl = my.el.classList;
    if (!cl.contains(my.className)) {
      return;
    }
    if (!check('opening', e)) {
      return self;
    }
    cl.remove(my.className);
    document.addEventListener('click', close);
    k.bind('esc', close);
    return self;
  }

  function opening(e) {
    e.stopPropagation();
    e.preventDefault();
    open(e);
  }

  my.el = document.querySelector(selectors.popup);
  if (selectors.trigger) {
    document.querySelector(selectors.trigger).addEventListener('click', opening);
  }
  if (selectors.event) {
    window.addEventListener(selectors.event, opening);
  }
  my.el.querySelector('.close').addEventListener('click', close);

  self.open = open;
  self.close = close;

  emitter(self);

  return self;
}
