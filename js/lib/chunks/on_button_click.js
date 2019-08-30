function onButtonClick(e) {

  e.preventDefault();

  var self = this;

  var current_target = e.currentTarget;

  var event_prefix;

  var event_id;

  var node_target;

  var data_target;

  /** don't waste time if the button is inactive */
  if (current_target.hasClass('inactive')) return;

  /** if current target has target, get target from data-target */
  if (current_target.hasClass('target')) {
    data_target = self.getAttribute('data-target');
    event_prefix = 'button:' + data_target;
    /** look-up for the main target */
    node_target = Y.all('#' + data_target);
  }
  /** current target is the main target */
  else {
    event_id = self.get('id');
    event_prefix = 'button:' + event_id;
    /** find possible reference targets to this target */
    node_target = Y.all('a[data-target=' + event_id + ']');
  }

  if (self.hasClass('on')) {
    self.removeClass('on');
    if (Y.Lang.isObject(node_target)) {
      node_target.each(node => {
        node.removeClass('on');
      });
    }
    Y.fire(event_prefix + ':off', e);
  } else {
    self.addClass('on');
    if (Y.Lang.isObject(node_target)) {
      node_target.each(node => {
        node.addClass('on');
      });
    }
    Y.fire(event_prefix + ':on', e);
  }
  Y.fire(event_prefix + ':toggle', e);
}

Y.delegate('click', onButtonClick, 'body', 'a.button');
