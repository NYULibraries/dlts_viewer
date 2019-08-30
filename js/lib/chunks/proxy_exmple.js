
DLTS.reactive = {};

DLTS.Proxy = new Proxy(DLTS.reactive, {
  set: (target, key, value) => {

    switch (key) {
    case 'sequence':
      requestSequence(value);
      break;
    }

    target[key] = value;

    return true;

  }
});

DLTS.Proxy.sequence = getSequence();

DLTS.Proxy.loading = false;
