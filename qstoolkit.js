/*
  Q's JavaScript Toolkit v2.0.0a
  A generic alternative to jQuery, allowing some amazing chaining.
*/

'use strict';
if(!window) {
  throw new Error('qstoolkit only works in a browser environment!');
}
const AsyncFunction = (async () => {}).constructor;


//--------------------------------- Shortcuts --------------------------------//
// Type names
const qt = {
  f: 'function',
  n: 'number',
  o: 'object',
  s: 'string',
  u: 'undefined',
  a: 'array',

  qe: 'Qelement',
  ql: 'Qlist',
  qv: 'Qevent',
  qm: 'Qemitter',
  css: 'CSS argument type',
  csstf: 'CSS timing function',

  nd: 'Node',
  ndl: 'NodeList',
  tn: 'tagname',
  he: 'HTMLElement',
  hc: 'HTMLCollection',
  hei: 'HTMLInputElement',
  hes: 'HTMLSelectElement',
}
// Generate a type error
function qte(varname, allowedTypes) {
  let types = [];

  if(to(allowedTypes, qt.s))
    allowedTypes = allowedTypes.split(',');

  if(!is(allowedTypes, Array))
    throw new qte('allowedTypes', 's,a');

  for(let type of allowedTypes)
    if(type in qt)
      types.push(qt[type]);

  if(types.length == 0)
    throw new TypeError(`'${varname}' is undefined`);

  let out = `'${varname}' is not a`;

  if('aeiou'.includes(types[0][0]))
    out += 'n';

  for(let i = 0; i < types.length; i++)
    out += `${
      i > 0 && types.length > 2 ? ', ' : ' '
    }${
      i == types.length - 1 ? 'or ' : ''
    }${types[i]}`;

  return TypeError(out);
}
// Typeof shorthand
function to(thing, type) {
  if(nu(type))
    return typeof(thing) == type;
  else
    return typeof thing;
}
// Instanceof shorthand
function is(thing, type) {
  return thing instanceof type;
}
// Not undefined shorthand
function nu(thing) {
  return thing !== undefined;
}
// Is undefined shorthand
function iu(thing) {
  return thing === undefined;
}


//-------------------------------- Proxy Tools -------------------------------//
function hideProps(thing, props) {
  return new Proxy(thing, {
    defineProperty: (target, property, descriptor) => props.includes(property) ?
      target :
      Object.defineProperty(target, property),
    deleteProperty: (target, property) => props.includes(property) ?
      true :
      delete target[property],
    get: (target, property, receiver) => props.includes(property) ?
      undefined :
      is(target[property], Function) ?
        target[property].bind(target) :
        target[property],
    getOwnPropertyDescriptor: (target, prop) => props.includes(prop) ?
      undefined :
      Object.getOwnPropertyDescriptor(target),
    has: (target, prop) => props.includes(prop) ?
      false :
      (prop in target),
    ownKeys: target => Reflect.ownKeys(target).reduce(
      (goodKeys, key) => {
        if(!props.includes(key))
          goodKeys.push(key);

        return goodKeys;
      },
      []
    ),
    set: (target, property, value, receiver) => {
      if(!props.includes(property))
        target[property] = value;

      return !props.includes(property);
    }
  });
}
function asFunc(internal, handler) {
  return new Proxy(handler, {
    get: (target, property, receiver) => is(internal[property], Function) ?
      internal[property].bind(internal) :
      internal[property],

    construct: (target, argumentsList, newTarget) => new internal(...argumentsList),
    defineProperty: (target, property, descriptor) => Object.defineProperty(internal, property, descriptor),
    deleteProperty: (target, property) => delete internal[property],
    getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(internal, prop),
    getPrototypeOf: target => Object.getPrototypeOf(internal),
    has: (target, prop) => prop in internal,
    isExtensible: target => Object.isExtensible(internal),
    ownKeys: target => Reflect.ownKeys(internal),
    preventExtensions: target => Object.preventExtensions(internal),
    set: (target, property, value, receiver) => {
      internal[property] = value;
      return true;
    },
    setPrototypeOf: (target, prototype) => Object.setPrototo(internal, prototype),
  });
}


// //--------------------------------- qPromise ---------------------------------//
// // Better promise
// let qPromise = executor => {
//   let internal = new Promise(executor);
//
//   let ret =  asFunc(internal, function() {
//     internal.then(...arguments);
//     return ret;
//   })
//
//   return ret;
// }


//-------------------------- Extensions to Builtins --------------------------//
// Do a deep object comparison
Object.equals = (a, b) => {
  if(a === b)
    return true;

  let stack = [];

  // Returns true if mismatch found
  let addToStack = (obj_a, obj_b) => {
    let keys_a = Object.keys(obj_a), keys_b = Object.keys(obj_b);

    // Check to make sure that both objects have the same keys
    if(keys_a.length != keys_b.length)
      return true;

    for(let key of keys_a)
      if(!keys_b.includes(key))
        return true;

    // Add the objects to the stack
    stack.push([obj_a, obj_b, keys_a]);
  }

  // Add the root of the trees to the stack
  if(addToStack(a, b))
    return false;

  stackLoop: while(1) {
    let [obj_a, obj_b, keys] = stack[stack.length - 1];

    keyLoop: while(keys.length > 0) {
      let key = keys.pop();

      if(to(obj_a[key], qt.o)) {
        // Found a object, try to continue depth-first seach

        // Make sure that both values are objects
        if(to(obj_b[key]) != qt.o)
          return false;

        // Avoid recursive object references
        for(let [prevObj_a, prevObj_b] of stack) {
          let a_rec = obj_a[key] == prevObj_a, b_rec = obj_b[key] == prevObj_b;

          // If one recurses and the other does not, then objects are not equal
          if(a_rec ^ b_rec)
            return false;

          // If both recurse, skip this key
          if(a_rec && b_rec)
            continue keyLoop;
        }

        // Add object onto tree
        if(addToStack(obj_a[key], obj_b[key]))
          return false;
        continue stackLoop;
      } else {
        // Found a value, make sure both versions are the same

        if(obj_a[key] !== obj_b[key])
          return false;
      }
    }
  }

  return true;
}
// Get path to all values other than objects
Object.paths = (target, getValues) => {
  let out = [], stack = [target, Object.keys(target)];

  stackLoop: while(1) {
    let [obj, keys] = stack[stack.length - 1];

    keyLoop: while(keys.length > 0) {
      let key = keys.pop();

      if(to(obj[key], qt.o)) {
        // Found an object, try to continue depth-first search

        // Avoid recursive object references
        for(let [prevObj] of stack)
          if(obj[key] == prevObj)
            continue keyLoop;

        // Add object onto tree
        stack.push([obj[key], Object.keys(obj[key]), key]);
        continue stackLoop;
      } else {
        // Found a value, add it to the output

        // Construct an array of property names to get to value
        let path = [];
        for(let frame of stack.slice(1))
          path.push(frame[2]);
        path.push(key);

        // Add it to the output
        if(getValues)
          out.push([path, obj[key]]);
        else
          out.push(path);
      }
    }

    // Go back a layer in the tree, reached the end
    stack.pop();

    // Return the value if we climbed back up to the top of the tree
    if(stack.length == 0)
      return out;
  }
}
// Find the key of a particular value
Object.keyOf = (target, value) => {
  let keys = Object.keys(target), v;

  for(let key of keys) {
    v = target[key];

    if(v === value)
      return key;
  }

  return undefined;
}
// Better version of Object.assign
Object.assign = (source, extension) => {
  let descriptors = Object.getOwnPropertyDescriptors(extension);

  for(let property in descriptors)
    Object.defineProperty(source, property, descriptors[property]);
}
// Add alisases for properties in the object
Object.alias = (source, names) => {
  for(let newName in names) {
    let descriptor = Object.getOwnPropertyDescriptor(source, names[newName]);

    if(descriptor)
      Object.defineProperty(source, newName, descriptor);
    else
      source[newName] = source[names[newName]];
  }
}
// Shorthand function for regex matching
String.prototype.matches = function(regex) {
  return this.search(regex) >= 0;
}
// Bound a number between two other numbers
Number.prototype.bound = function(lower, higher) {
  if(lower > higher)
    return this.bound(higher, lower);

  return Math.min(higher, Math.max(lower, this));
}
// Shorthand for checking if a function is asynchronous
Function.prototype.isAsync = function() {
  return is(this, AsyncFunction);
}
// Modify .bind to keep track of original function
let originalFunctionSymbol = Symbol('originalFunction');
{
  let originalBind = Function.prototype.bind;

  Function.prototype.bind = function() {
    let bound = originalBind.apply(this, arguments);

    if(originalFunctionSymbol in this)
      Object.defineProperty(bound, originalFunctionSymbol, {
        value: this[originalFunctionSymbol],
      });
    else
      Object.defineProperty(bound, originalFunctionSymbol, {
        value: this,
      });

    return bound;
  }
}
// Add shorthand for event listeners
EventTarget.prototype.on = function(name, func, callNow) {
  if(!this.events)
    this.events = {};

  if(is(name, Array)) {
    // Apply function(s) to all events in name
    let names = name;

    for(let name of names)
      this.on(name, func, callNow);
  } else if(to(name, qt.o)) {
    // Apply every function in name based on key
    let events = name;

    for(let name in events)
      if(is(events[name], Array))
        for(let func of events[name])
          this.on(name, func, callNow);
      else
        this.on(name, events[name], callNow);
  } else if(is(func, Array)) {
    // Apply every function in func
    let funcs = func;

    for(let func of funcs)
      this.on(name, func, callNow);
  } else {
    // Apply a single function to a single event
    if(!to(name, qt.s))
      throw new qte('name', 'a,o,s')

    if(!(name in this.events))
      this.events[name] = new Qevent({attach: this, name});

    if(iu(func))
      return this.events[name];

    if(!is(func, Function))
      throw new qte('func', 'f');

    if(callNow)
      func();

    this.events[name].add(func);
  }

  return this;
}


//--------------------------------- Constants --------------------------------//
const qs = {
  eNEA: 'Not enough arguments',
  eORng: 'Argument out of range',
  fId: 'abcdefghijklmnopqrstuvwxyz1234567890-_~`|\\/?=<!@$%^`',
  origFunc: originalFunctionSymbol,
  cssTypeNumber: 0,
  cssTypeAngle: 1,
  cssTypeLength: 2,
  cssTypePercentage: 3,
  cssTypeLengthPercentage: 4
};


//--------------------------------- Settings ---------------------------------//
const qsettings = {
  defaultCSSUnits: {
    length: 'px',
    angle: 'deg',
  },
  bezierAccuracy: 15, // 2^-n tolerance
  cacheLength: 100, // Max items
  cacheTimeout: 100, // Milliseconds
  cacheGcInterval: 1000, // Milliseconds
}


//---------------------------------- Qevent ----------------------------------//
function Qevent({attach, name, once} = {}) {
  // Make sure we are creating a new Qevent
  if(iu(this))
    return new Qevent(...arguments);

  let props = {
    _target: attach,
    _handlers: [],
    _triggered: false,
    _once: once,
    _self: null,
  };

  // Initialize this
  Object.assign(this, props);


  // Attach to an HTMLElement if instructed to do so
  if(nu(attach)) {
    if(to(name) != qt.s)
      throw new qte('name', 's');

    getem(attach).addEventListener(name, this.trigger.bind(this));
  }

  this._self = hideProps(this, Object.keys(props));

  return this._self;
}

// Prototype extensions
Object.assign(Qevent.prototype, {
  get triggered() {
    return this._triggered;
  },
  async trigger() {
    this._triggered = true;

    for(let handler of this._handlers)
      await handler(...arguments);
  },
  add(func, callNow) {
    if(is(func, Array)) {
      let funcs = func;

      for(let func in funcs)
        this.add(func, callNow);

      return this._self;
    }

    if(!is(func, Function))
      throw new qte('func', 'f');

    this._handlers.push(func);

    if(this._once && this._triggered)
      func();

    return this._self;
  },
  remove(func) {
    if(!is(func, Function))
      throw new qte('func', 'f');

    let i = this._handlers.indexOf(func);
    if(i >= 0)
      this._handlers.splice(i, 1);

    if(this._target)
      this._target.removeEventListener(func);

    return this._self;
  },
  clear() {
    if(this._target)
      for(let handler of this._handlers)
        this._target.removeEventListener(handler);

    this._handlers = [];

    return this._self;
  },
});

// Prototype aliases
Object.alias(Qevent.prototype, {
  rem: 'remove',
  t: 'trigger',
  clr: 'clear',
});


//--------------------------------- Qemitter ---------------------------------//
function Qemitter() {
  let props = {
    _events: {},
    _self: null,
  };

  Object.assign(this, props);

  this._self = hideProps(this, Object.keys(props));

  return this._self;
}

// Prototype extensions
Object.assign(Qemitter.prototype, {
  on(name, func, callNow) {
    if(is(name, Array)) {
      // Apply function(s) to all events in name
      let names = name;

      for(let name of names)
        this.on(name, func, callNow);
    } else if(to(name, qt.o)) {
      // Apply every function in name based on key
      let events = name;

      for(let name in events)
        if(is(events[name], Array))
          for(let func of events[name])
            this.on(name, func, callNow);
        else
          this.on(name, events[name], callNow);
    } else if(is(func, Array)) {
      // Apply every function in func
      let funcs = func;

      for(let func of funcs)
        this.on(name, func, callNow);
    } else {
      // Apply a single function to a single event
      if(!to(name, qt.s))
        throw new qte('name', 'a,o,s')

      if(!(name in this._events))
        this._events[name] = new Qevent();

      if(iu(func))
        return this._events[name];

      if(!is(func, Function))
        throw new qte('func', 'f');

      if(callNow)
        func();

      this._events[name].add(func);
    }

    return this._self;
  },
  addEvent(name, options) {
    if(is(name, Array)) {
      let names = name;

      for(let name of names)
        this.addEvent(name);
    } else if(to(name, qt.o)) {
      let events = name;

      for(let name in events)
        this.addEvent(name, events[name]);
    } else if(to(name) != qt.s)
      throw new qte('name', 's');
    else if(name in this._list)
      throw new Error(`Event '${name}' already exists`);
    else
      this._list[name] = new Qevent(options);

    return this._self;
  }
});


let qc, qca, q, qa;
{
  let cache = [];
  let allcache = [];

  // Helper function for each cache
  for(let aCache of [cache, allcache])
    aCache.add = (element, selector, parent, extraTime) => {
      aCache.push({
        element,
        time: Date.now() + extraTime,
        selector,
        parent,
      });

      if(aCache.length > qsettings.cacheLength)
        aCache.shift();
    }

  // Garbage Collection (repeated setTimeout in case cacheGCInterval changes)
  function cacheGC() {
    let now = Date.now();

    for(let i = 0; i < cache.length;)
      if(i >= qsettings.cacheLength || now - cache[i].time > qsettings.cacheTimeout)
        cache.splice(i, 1);
      else
        i++;

    setTimeout(cacheGC, qsettings.cacheGcInterval);
  }
  setTimeout(cacheGC, qsettings.cacheGcInterval);

  qc = (selector, parent = document, extraTime = 0) => {
    if(is(selector, Array)) {
      let selectors = selector;
      let results = [];

      for(let selector of selectors)
        results.push(qc(selector, parent, extraTime));

      return results;
    } else if(!to(selector, qt.s))
      throw new qte('selector', 'sa');

    if(isNaN(+extraTime))
      throw new qte('options.extraTime', 'n');

    // Read from cache first
    for(let item of cache)
      if(item.selector == selector && parent == item.parent)
        return newq(item.element);

    let result = getem(parent).querySelector(selector);

    cache.add(result, selector, parent, extraTime);

    if(result)
      return newq(result);
    else
      return null;
  }

  qca = (selector, parent = document, extraTime = 0) => {
    if(is(selector, Array)) {
      let selectors = selector;
      let results = [];

      for(let selector of selectors)
        results = results.concat(qca(selector, parent, extraTime));

      return results;
    } else if(!to(selector, qt.s))
      throw new qte('selector', 'sa');

    if(isNaN(+extraTime))
      throw new qte('options.extraTime', 'n');

    // Read from cache first
    for(let item of cacheall)
      if(item.selector == selector && parent == item.parent)
        return Qlist.from(item.element.slice(0));

    let results = getem(parent).querySelectorAll(selector);

    cacheall.add(Array.prototype.slice.call(results, 0));

    return Qlist.from(Array.prototype.map.call(results, newq));
  }

  q = (selector, parent = document) => {
    if(is(selector, Array)) {
      let selectors = selector;
      let results = [];

      for(let selector of selectors)
        results.push(q(selector, parent));

      return results;
    } else if(!to(selector, qt.s))
      throw new qte('selector', 'sa');

    let result = getem(parent).querySelector(selector);

    if(result)
      return newq(result);
    else
      return null;
  }

  qa = (selector, parent = document) => {
    if(is(selector, Array)) {
      let selectors = selector;
      let results = [];

      for(let selector of selectors)
        results = results.concat(qa(selector, parent));

      return results;
    } else if(!to(selector, qt.s))
      throw new qte('selector', 'sa');

    let results = getem(parent).querySelectorAll(selector);

    return Qlist.from(Array.prototype.map.call(results, newq));
  }


  let bezier = (t, x1, y1, x2, y2) => ({
    x: 3*t*(x1+t*(x2-2*x1+t*(1/3+x1-x2))),
    y: 3*t*(y1+t*(y2-2*y1+t*(1/3+y1-y2)))
  });

  let detect, sbarWidth;

  Object.assign(q, {
    record(key, value) {
      if(iu(value))
        return localStorage.getItem(key);
      else
        localStorage.setItem(key, value == null ? '' : value);
    },
    setup(options) {
      Object.assign(qsettings, options);
    },
    timer() {
      setTimeout(...arguments);
    },
    alarm() {
      setInterval(...arguments);
    },
    stopTimer() {
      clearTimeout(...arguments);
    },
    stopAlarm() {
      clearInterval(...arguments);
    },
    log(value) {
      console.log(...arguments);
      return value;
    },
    throttle(timeout, func, modifier) {
      let args = null, lock = false;

      return () => {
        if(is(modifier, Function))
          args = modifier(arguments, args);
        else
          args = arguments;

        if(!lock) {
          lock = true;
          timeout(() => {
            lock = false;
            func(...args);
            args = null;
          });
        }
      }
    },
    get scrollbarWidth() {
      if(nu(sbarWidth))
        return sbarWidth;

      let inner, outer;

      qc('body')
        .a(
          outer = newq('div')
            .s({
              position: 'absolute',
              top: 0,
              left: 0,
              visibility: 'hidden',
              width: 200,
              height: 150,
              overflow: 'hidden',
            })
        );

      outer.a(
        inner = newq('div')
          .s({
            width: '100%',
            height: '100%',
          })
      );

      let w1 = inner.width;
      outer.s('overflow', 'scroll');
      let w2 = inner.width;

      if(w1 == w2)
        w1 = outer.clientWidth;

      outer.detach();

      sbarWidth = w1 - w2;
      return sbarWidth;
    },
    onready: Qevent({once: true}),
    onload: Qevent({once: true}),
    demoAnimation(animations, name) {
      if(name) {
        let s = q.record('q') || [];

        if(s[name])
          return;

        s[name] = false;
        q.record('q', s);
      }

      let timer;
      let i = 0;

      // Alarm to alternate between animations
      let run = () => {
        for(let property of animations[i].properties) {
          let styles = property.styles.split(';');

          for(let style of styles) {
            let parts = style.split(':');

            if(parts.length >= 2)
              em.s(parts[0], parts[1]);
          }
        }

        timer = q.timer(run, animations[i].time);
        i = (i + 1) % (animations.length - 1);
      }
      timer = q.timer(run, animations[i].time);

      // Callback to stop operations
      return () => {
        q.stopTimer(timer);

        if(name) {
          let s = q.record('q') || [];

          s[name] = true;

          q.record('q', s);
        }

        for(let property of animations[animations.length - 1].properties) {
          let styles = property.styles.split(';');

          for(let style of styles) {
            let parts = style.split(':');

            if(parts.length >= 2)
              em.s(parts[0], parts[1]);
          }
        }
      };
    },
    generateCSSFunction(options) {
      /*
        - {} options
          - "" name
          - [] versions
            - {} (version)
              - {} test?
                - ## numArgs?
              - [] argTypes
                - ## (argument type)
      */
      let str = 'let a=arguments,o,d,s=qsettings.defaultCSSUnits,r;';

      for(let i in options.versions) {
        let version = options.versions[i];

        // Define default options
        str += 'd=[';
        for(let j in version.argTypes) {
          let argType = version.argTypes[j];

          if(!to(argType, qt.n) || argType < 0 || argType > 4)
            throw new qte(`options.versions[${i}].argTypes[${j}]`, 'css');

          str += j > 0 ? `,${argType}` : argType;
        }
        str += '];';

        // Validate for current version
        str += 'if(';
        let conds = 0, args;
        if(version.test) {
          for(let key of Object.keys(version.test))
            switch(key) {
              case 'numArgs':
                // Make sure number of arguments is correct
                args = +v.test[key];

                if(args < 1)
                  throw new TypeError('Argument limiting too strict');

                str += `${conds > 0 ? '&&' : ''}(a.length==${args}||(a.length==${args + 1}&&is(a[a.length-1],Array)))`;

                break;
            }
        } else
          str += '1';

        // Define options variable if it exists
        str += `){${args ? `if(a.length==${args+1})o=a[${args}]` : ''}`;

        // Modify arguments to specified units
        /*
          for(let i in a) {
            if(o && i in o) {
              r = 0;
              if(o[i] == 5)
                o[i] = d[i];
            } else if(to(a[i], qt.n))
              r = d;
            else
              r = 0;

            if(r)
              a[i] = a[i] + (
                r[i] == 1 ?
                  s.angle :
                  (
                    r[i] == 2 || r[i] == 4 ?
                      s.length :
                      (r[i] == 3 ? "%" : "")
                  )
              )
          }
        //*/
        str += 'for(let i in a){if(o&&i in o){r=0;if(o[i]==5)o[i]=d[i];}else if(to(a[i],qt.n))r=d;else r=0;if(r)a[i]=a[i]+(r[i]==1?s.angle:(r[i]==2||r[i]==4?s.length:(r[i]==3?"%":"")))}';

        str += `return"${options.name}("`;
        for(let j = 0; j < args; j++)
          str += `+${j > 0 ? '","+' : ''}a[${j}]`;
        str += '+")";}';
      }
      str += 'else throw new TypeError(qs.eNEA);';

      q[options.name] = new Function(str);
    },
    CSSTimingFunctions: {
       'ease':       [0.25, 0.1,  0.25, 1   ],
       'linear':     [0,    0,    1,    1   ],
       'ease-in':    [0.42, 0,    1,    1   ],
       'ease-out':   [0,    0,    0.58, 1   ],
       'ease-in-out':[0.42, 0,    0.58, 1   ],
    },
    // x1, y1, x2, y2, interval, onEnd
    bezierAnimation(callback, duration, options) {
      let x1, y1, x2, y2, interval, onend;

      let getAnimFunc = name => (x1 = q.CSSTimingFunctions[name][0], y1 = q.CSSTimingFunctions[name][1], x2 = q.CSSTimingFunctions[name][2], y2 = q.CSSTimingFunctions[name][3]);

      if(['x1', 'y1', 'x2', 'y2'].reduce((p, v) => v = v && (p in options), true))
        ({x1, y1, x2, y2} = options);
      else if(!('timingFunction' in options))
        getAnimFunc('ease');
      else if(!(options.timingFunction in q.CSSTimingFunctions))
        throw new qte('options.timingFunction', 'csstf');
      else
        getAnimFunc(options.timingFunction);

      if('interval' in options && to(options.interval, qt.n))
        ({interval} = options);

      if('onend' in options && to(options.onend, qt.f))
        ({onend} = options);

      if(x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1)
        throw new RangeError('X value(s) must be between 0 through 1');
      if(!to(duration, qt.n))
        throw new qte('duration', 'n');
      if(!to(callback, qt.f))
        throw new qte('callback', 'f');

      let s = performance.now(), cancel = false;

      let int = () => {
        if(cancel)
          return;

        let t = (performance.now() - s) / duration; // time passed
        if(t > 1) {
          callback(t);

          if(onend)
            onend();

          return;
        }

        let blo = 0, bhi = 1, bmid, fout, num = qsettings.bezierAccuracy, tol = Math.pow(2, -num);

        for(let i = 0; i < num; i++) {
          bmid = (blo + bhi) / 2;
          fout = bezier(bmid, x1, y1, x2, y2);

          if(Math.abs(fout.x - t) <= tol)
            break;

          if(fout.x < t)
            blo = bmid;
          else
            bhi = bmid;
        }

        callback(fout.y);

        if(interval)
          setTimeout(int, interval);
        else
          requestAnimationFrame(int);
      }

      if(interval)
        setTimeout(int, interval);
      else
        requestAnimationFrame(int);

      return () => cancel = true;
    },
    isCSSValueSupported(property, value) {
      if(!detect)
        detect = newq('d');

      return detect.style(property, value).style(property) == value;
    },
  });

  // Generate css functions
  [
    {
      name: 'matrix',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 0 ],
        },
        {
          testfor: { numArguments: 6 },
          argumentTypes: [ 0, 0, 0, 0, 0, 0 ]
        }
      ]
    },
    {
      name: 'translate',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 4 ]
        },
        {
          testfor: { numArguments: 2 },
          argumentTypes: [ 4, 4 ]
        }
      ]
    },
    {
      name: 'translateX',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 4 ]
        }
      ]
    },
    {
      name: 'translateY',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 4 ]
        }
      ]
    },
    {
      name: 'scale',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 0 ]
        },
        {
          testfor: { numArguments: 2 },
          argumentTypes: [ 0, 0 ]
        }
      ]
    },
    {
      name: 'scaleX',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 0 ]
        }
      ]
    },
    {
      name: 'scaleY',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 0 ]
        }
      ]
    },
    {
      name: 'rotate',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 1 ]
        }
      ]
    },
    {
      name: 'skew',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 1 ]
        },
        {
          testfor: { numArguments: 2 },
          argumentTypes: [ 1, 1 ]
        }
      ]
    },
    {
      name: 'skewX',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 1 ]
        }
      ]
    },
    {
      name: 'skewY',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 1 ]
        }
      ]
    },
    {
      name: 'matrix3d',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 0 ]
        },
        {
          testfor: { numArguments: 16 },
          argumentTypes: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        }
      ]
    },
    {
      name: 'translate3d',
      versions: [
        {
          testfor: { numArguments: 3 },
          argumentTypes: [ 4, 4, 2 ]
        }
      ]
    },
    {
      name: 'translateZ',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 2 ]
        }
      ]
    },
    {
      name: 'scale3d',
      versions: [
        {
          testfor: { numArguments: 3 },
          argumentTypes: [ 0, 0, 0 ]
        }
      ]
    },
    {
      name: 'scaleZ',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 0 ]
        }
      ]
    },
    {
      name: 'rotate3d',
      versions: [
        {
          testfor: { numArguments: 4 },
          argumentTypes: [ 0, 0, 0, 1 ]
        }
      ]
    },
    {
      name: 'rotateX',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 1 ]
        }
      ]
    },
    {
      name: 'rotateY',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 1 ]
        }
      ]
    },
    {
      name: 'rota20150527_181431teZ',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 1 ]
        }
      ]
    },
    {
      name: 'perspective',
      versions: [
        {
          testfor: { numArguments: 1 },
          argumentTypes: [ 2 ]
        }
      ]
    }
  ].forEach(q.generateCSSFunction);
}


function getem(element) {
  if(is(element, Qelement))
    return element.em;
  else if(is(element, HTMLElement) || is(element, Window) || is(element, Node))
    return element;
  else
    throw new qte('element', 'qe,he');
}
function newq(element) {
  return new Qelement(element);
}
function makeq(element) {
  if(is(element, Qelement))
    return element;

  return newq(element);
}

let Qelement;
{
  Qelement = function(element) {
    if(to(element, qt.s))
      this.em = document.createElement(element);
    else if(is(element, Node))
      this.em = element;
    else if(is(element, Qelement))
      return element;
    else
      throw new qte('element', 's,nd,qe');

    if(to(this.em.events, qt.o) || !this.em.events)
      this.em.events = {};
    if(to(this.em.disposers, qt.o) || !this.em.disposers)
      this.em.disposers = {};
  }

  Object.assign(Qelement, {
    fromNodes(nodelist) {
      if(!(
        is(nodelist, HTMLCollection) ||
        is(nodelist, NodeList) ||
        is(nodelist, Array) ||
        is(nodelist, Qlist)
      ))
        throw new qte('nodelist', 'hc,ndl,a');

      return Qlist.from(nodelist).map(makeq);
    },
    is: em => is(em, Node) || is(em, Qelement),
    isem: em => is(em, HTMLElement) || is(em, Qelement),
    onextensions: {
      resize(me, ev) {
        let style = {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 'calc(100% + 1px)',
          height: 'calc(100% + 1px)',
          overflow: 'hidden',
          'z-index': '-1',
          visibility: 'hidden',
        }, childStyle = {
          position: 'absolute',
          left: 0,
          top: 0,
          transition: '0s',
        };

        let sensor = me.em.resizeSensor = me.a('div')
          .classes('resize-sensor')
          .style(style);
        let expand = sensor.a('div')
          .classes('resize-sensor-expand')
          .style(style);
        let expandChild = expand.a('div')
          .style(styleChild)
          .style({
            width: 100000,
            height: 100000,
          });
        let shrink = sensor.a('div')
          .classes('resize-sensor-shrink')
          .style(style);
        shrink.a('div')
          .style(styleChild)
          .style({
            width: '200%',
            height: '200%',
          });

        if(me.computedStyle('position') == 'static')
          me.style('position', 'relative');
        shrink.scroll(100000, 100000);
        expand.scroll(100000, 100000);

        let called = false, shouldCall = true, first = 2;
        let pw, ph;

        let actions = {
          'resize-sensor-expand': () => expand.scroll(100000, 100000),
          'resize-sensor-shrink': () => shrink.scroll(100000, 100000),
        };

        let onScroll = e => {
          if(first) {
            first--;
            return;
          }

          if(!shouldCall) {
            shouldCall = true;
            return;
          }

          if((me.width != pw || me.height != ph) && !called) {
            window.requestAnimationFrame(() => {
              ev.t({
                width: pw = me.width,
                height: ph = me.height,
              });
              called = false;
            });

            let a = actions[e.target.className];
            if(a)
              a();

            called = true;
            shouldCall = false;
          }
        }

        [expand, shrink].forEach(em => em.on('scroll', onScroll));

        return () => sensor.detach();
      }
    }
  });

  function css(stylename, value) {
    // TODO later change value unit based on stylename

    if(iu(value))
      return '';

    if(to(value, qt.n))
      return `${value.toFixed(3)}${qsettings.defaultCSSUnits.length}`;

    return `${value}`.trim();
  }

  Object.assign(Qelement.prototype, {
    on(name, func, callNow) {
      if(is(name, Array)) {
        // Apply function(s) to all events in name
        let names = name;

        for(let name of names)
          this.on(name, func, callNow);
      } else if(to(name, qt.o)) {
        // Apply every function in name based on key
        let events = name;

        for(let name in events)
          if(is(events[name], Array))
            for(let func of events[name])
              this.on(name, func, callNow);
          else
            this.on(name, events[name], callNow);
      } else if(is(func, Array)) {
        // Apply every function in func
        let funcs = func;

        for(let func of funcs)
          this.on(name, func, callNow);
      } else {
        // Apply a single function to a single event
        if(!to(name, qt.s))
          throw new qte('name', 'a,o,s')

        if(!(name in this.em.events))
          if(name in Qelement.onextensions) {
            this.em.events[name] = new Qevent();
            this.em.disposers[name] = Qelement.onextensions[name](this, this.em.events[name]);
          } else
            this.em.events[name] = new Qevent({attach: this, name});

        if(iu(func))
          return this.em.events[name];

        if(!is(func, Function))
          throw new qte('func', 'f');

        if(callNow)
          func();

        this.em.events[name].add(func);
      }

      return this;
    },
    off(name, func) {
      if(name in this.em.events)
        if(nu(func))
          this.em.events[name].remove(func);
        else {
          if(name in this.em.disposers)
            this.em.disposers[name]();

          this.em.events[name].clear();
          delete this.em.events[name];
        }

      return this;
    },
    id(newid) {
      if(iu(newid))
        return this.em.id;

      this.em.id = newid;
      return this;
    },
    class() {
      if(!(0 in arguments))
        return this.em.classList;

      let s = '';
      for(let name of arguments)
        s += name + ' ';

      this.em.className = s;

      return this;
    },
    hasClass: className => this.em.classList.contains(className),
    addClass() {
      for(let cls of arguments)
        this.em.classList.add(cls);

      return this;
    },
    remClass() {
      for(let cls of arguments)
        this.em.classList.remove(cls);

      return this;
    },
    togClass() {
      for(let cls of arguments)
        this.em.classList.toggle(cls);

      return this;
    },
    text(text) {
      if(is(this.em, HTMLInputElement) || is(this.em, HTMLSelectElement))
        if(iu(text))
          return this.em.value;
        else
          this.em.value = text;
      else
        if(iu(text))
          return this.em.textContent;
        else
          this.em.textContent = text;

      return this;
    },
    title(title) {
      if(iu(title))
        return this.em.title;

      this.em.title = title;
      return this;
    },
    html(html) {
      if(iu(html))
        return this.em.innerHTML;

      this.em.innerHTML = h;
      return this;
    },
    outerHtml(html) {
      if(iu(html))
        return this.em.outerHTML;

      this.em.outerHTML = html;
      return this;
    },
    get children() {
      return Qelement.fromNodes(this.em.children);
    },
    query(selector) {
      return q(selector, this);
    },
    queryAll(selector) {
      return qa(selector, this);
    },
    get childCount() {
      return this.em.children.length;
    },
    get index() {
      let em = this.em, i = 0;

      while((em = em.previousElementSibling) != null)
        i++;

      return i;
    },
    get nodeIndex() {
      let em = this.em, i = 0;

      while((em = em.previousSibling) != null)
        i++;

      return i;
    },
    append(childArg) {
      let child = makeq(childArg);

      this.em.appendChild(child.em);

      return to(childArg, qt.s) ? child : this;
    },
    insertAt(childArg, index) {
      let child = makeq(childArg);

      this.em.insertBefore(child.em, this.em.children[index]);

      return to(childArg, qt.s) ? child : this;
    },
    insertBefore(childArg, before) {
      let child = makeq(childArg);

      this.em.insertBefore(child.em, getem(before));

      return to(childArg, qt.s) ? child : this;
    },
    detach() {
      this.em.parentNode.removeChild(this.em);
      return this;
    },
    appendTo(parentArg) {
      let parent = makeq(parentArg);

      parent.append(this);

      return to(parentArg, qt.s) ? parent : this;
    },
    insertInto(parentArg, index) {
      let parent = makeq(parentArg);

      parent.insertAt(this, index);

      return to(parentArg, qt.s) ? parent : this;
    },
    insertBeforeIn(parentArg, before) {
      let parent = makeq(parentArg);

      parent.insertBefore(this, before);

      return to(parentArg, qt.s) ? parent : this;
    },
    insertBeforeThis(elementArg) {
      let element = makeq(elementArg);

      this.em.parentNode.insertBefore(element, this.em);

      return to(elementArg, qt.s) ? element : this;
    },
    insertAfterThis(elementArg) {
      let element = makeq(elementArg);

      this.em.parentNode.insertBefore(
        element,
        this.em.parentNode.children[this.nodeIndex + 1]
      );

      return to(elementArg, qt.s) ? element : this;
    },
    get previousSibling() {
      return newq(this.em.previousElementSibling);
    },
    get nextSibling() {
      return newq(this.em.nextElementSibling);
    },
    remove(children) {
      let args;

      if(is(children, Array))
        args = children;
      else
        args = arguments;

      let numbers = [];
      let ems = [];

      for(let child of arguments) {
        if(to(child, qt.n))
          numbers.push(child);
        else if(Qlement.is(child))
          ems.push(child);
      }

      // Remove elements by index from last to first
      numbers.sort((a, b) => a < b);

      for(let num of numbers)
        this.em.removeChild(this.em.children[num]);

      // Remove any other elements
      for(let child of children)
        this.em.removeChild(getem(child));
    },
    get hasSelection() {
      if(!is(this.em, HTMLInputElement))
        throw new qte('this', 'hei');

      return this.em.selectionStart != this.em.selectionEnd;
    },
    cursor(index) {
      if(!is(this.em, HTMLInputElement))
        throw new qte('this', 'hei');

      if(iu(index))
        return this.em.selectionEnd;

      this.em.setSelectionRange(index, index);

      return this;
    },
    selection(begin, end) {
      if(!is(this.em, HTMLInputElement))
        throw new qte('this', 'hei');

      if(iu(begin))
        return [this.em.selectionStart, this.em.selectionEnd];

      if(iu(end))
        end = begin;

      this.em.setSelectionRange(begin, end);

      return this;
    },
    get firstChild() {
      return newq(this.em.firstElementChild);
    },
    get firstNodeChild() {
      return newq(this.em.firstChild);
    },
    get lastChild() {
      return newq(this.em.lastElementChild);
    },
    get lastNodeChild() {
      return newq(this.em.lastChild);
    },
    get parent() {
      return this.em.parentElement;
    },
    get parentNode() {
      return this.em.parentNode;
    },
    get height() {
      return this.em.offsetHeight;
    },
    get width() {
      return this.em.offsetWidth;
    },
    get clientHeight() {
      return this.em.clientHeight;
    },
    get clientWidth() {
      return this.em.clientWidth;
    },
    get outerHeight() {
      let computedStyle = this.computedStyle(), height = this.em.offsetHeight;

      // Add padding and border
      if(computedStyle['box-sizing'] == 'content-box')
        height += (
          parseFloat(computedStyle['padding-top']) +
          parseFloat(computedStyle['padding-bottom']) +
          parseFloat(computedStyle['border-top-width']) +
          parseFloat(computedStyle['border-bottom-width'])
        );

      return (
        height +
        parseFloat(computedStyle['margin-top']) +
        parseFloat(computedStyle['margin-bottom'])
      );
    },
    get outerWidth() {
      let computedStyle = this.computedStyle(), height = this.em.offsetWidth;

      // Add padding and border
      if(computedStyle['box-sizing'] == 'content-box')
        height += (
          parseFloat(computedStyle['padding-left']) +
          parseFloat(computedStyle['padding-right']) +
          parseFloat(computedStyle['border-left-width']) +
          parseFloat(computedStyle['border-right-width'])
        );

      return (
        height +
        parseFloat(computedStyle['margin-left']) +
        parseFloat(computedStyle['margin-right'])
      );
    },
    style(propname) {
      if(iu(propname))
        return this.em.style;

      if(to(propname, qt.o)) {
        let properties = propname;

        for(let propname in properties)
          this.em.style[
            propname in qs.styleAliases ?
            qs.styleAliases[propname] :
            propname
          ] = css(propname, properties[propname]);

        return this;
      }
      if(!(1 in arguments))
        return this.em.style[propname];

      let str = '';
      for(let i = 1; i < arguments.length; i++)
        str += css(propname, arguments[i]) + ' ';

      this.em.style[
        propname in qs.styleAliases ?
        qs.styleAliases[propname] :
        propname
      ] = str;

      return this;
    },
    computedStyle(propname) {
      if(iu(propname))
        return getComputedStyle(this.em);

      return getComputedStyle(this.em)[propname];
    },
    validity(type) {
      if(iu(type))
        return this.em.validity;

      this.em.setCustomValidity(type);
      return this;
    },
    selectedOption(i) {
      if(!is(this.em, HTMLSelectElement))
        throw new qte('this', 'hes');

      if(iu(i))
        return this.em.selectedIndex;

      this.em.selectedIndex = i;

      return this;
    },
    get hasChildren() {
      return this.em.children.length > 0;
    },
    focus() {
      this.em.focus();

      return this;
    },
    blur() {
      this.em.blur();

      return this;
    },
    attr(key, value) {
      if(iu(value))
        return this.em.getAttribute(key);

      this.em.setAttribute(key, value);
      return this;
    },
    href(value, addListener) {
      if(iu(value))
        return this.em.getAttribute('href');

      this.em.setAttribute('href', value);

      if((addListener || (addListener == undefined && !is(this.em, HTMLAnchorElement))) && !this.em.hasAnchorEmulator) {
        this.em.hasAnchorEmulator;

        this.on('click', () => {
          location = this.href();
        });
      }

      return this;
    },
    scroll(x, y) {
      if(iu(x) && iu(y))
        return {x: this.em.scrollLeft, y: this.em.scrollTop};

      if(x != null)
        this.em.scrollLeft = x;

      if(y != null)
        this.em.scrollTop = y;

      return this;
    },
    get clientRect() {
      return this.em.getBoundingClientRect();
    },
    get offsetBottom() {
      return this.em.offsetBottom;
    },
    get offsetTop() {
      return this.em.offsetTop;
    },
    get offsetLeft() {
      return this.em.offsetLeft;
    },
    get offsetRight() {
      return this.em.offsetRight;
    },
  });

  Object.alias(Qelement.prototype, {
    c: 'children',
    cc: 'childCount',
    hc: 'hasChildren',
    i: 'index',
    ni: 'nodeIndex',

    fc: 'firstChild',
    lc: 'lastChild',
    fnc: 'firstNodeChild',
    lnc: 'lastNodeChild',

    p: 'parent',
    pn: 'parentNode',

    ns: 'nextSibling',
    nns: 'nextNodeSibling',
    ps: 'previousSibling',
    pns: 'previousNodeSibling',

    a: 'append',
    rm: 'remove',
    d: 'detach',
    ia: 'insertAt',
    ib: 'insertBefore',
    ibt: 'insertBeforeThis',
    iat: 'insertAfterThis',

    cl: 'class',
    hcl: 'hasClass',
    tcl: 'togClass',
    acl: 'addClass',
    rcl: 'remClass',

    t: 'text',
    tt: 'title',
    s: 'style',
    cs: 'computedStyle',
    at: 'attr',

    f: 'focus',
    b: 'blur',

    sel: 'selection',
    hsel: 'hasSelection',

    so: 'selectedOption',
    cur: 'cursor',
    v: 'validity',

    h: 'height',
    w: 'width',
    ch: 'clientHeight',
    cw: 'clientWidth',
    oh: 'offsetHeight',
    ow: 'offsetWidth',

    ot: 'offsetTop',
    ob: 'offsetBottom',
    or: 'ofsetRight',
    ol: 'offsetLeft',
    cr: 'clientRect',

    m: 'html',
    om: 'outerHtml',

    q: 'query',
    qa: 'queryAll',

    sc: 'scroll',
  });
}

let Qlist;
{
  Qlist = function(reference, isNested) {
    if(iu(this))
      return new Qlist(...arguments);

    if(reference != null && !to(reference, qt.f))
      throw new qte('reference', 'f');

    let props = {
      _internal: [],
      _type: reference,
      _isNested: isNested,
      _self: null,
    };

    // Initialize this
    Object.assign(this, props);

    // Hide props and add index catchers
    this._self = hideProps(
      new Proxy(
        this,
        {
          has(target, prop) {
            let index = +prop;

            if(index >= 0 && index < target._internal.length)
              return true;
            if(index < 0 && index >= -target._internal.length)
              return true;

            if(prop in target)
              return true;

            if(prop in target._internal)
              return true;

            return target._type && prop in target._type.prototype;
          },

          get(target, prop, receiver) {
            let index;

            try {
              index = +prop;
            } catch(e) {
              index = NaN;
            }

            if(index >= 0 && index < target._internal.length)
              return target._internal[index];
            if(index < 0 && index >= -target._internal.length)
              return target._internal[target._internal.length + index];

            if(prop in target)
              return target[prop];

            if(prop in target._internal) {
              let internalProp = target._internal[prop];

              if(to(internalProp, qt.f))
                return function() {
                  let ret = internalProp.apply(target._internal, arguments);

                  if(is(ret, Array))
                    return Qlist.from(ret);

                  return ret;
                };

              return internalProp;
            }

            if(target._type && target._type.prototype && !(prop in target._type.prototype))
              return undefined;

            if(target._type && target._type.prototype && 'get' in Object.getOwnPropertyDescriptor(target._type.prototype, prop))
              return Qlist.from(target._internal.map(thing => thing[prop]));

            if(target._isNested)
              return function() {
                let newArray = [];
                let isAlwaysSelf = true;

                for(let thing of target._internal) {
                  if(thing.reference == undefined)
                    newArray.push(new Qlist(undefined, target._isNested - 1));
                  else {
                    let newThing = thing[prop](...arguments);

                    if(thing !== newThing)
                      isAlwaysSelf = false;

                    newArray.push(newThing);
                  }
                }

                if(isAlwaysSelf)
                  return target._self;

                return Qlist.from(newArray);
              }

            if(target._type && target._type.prototype && to(target._type.prototype[prop], qt.f))
              return function() {
                let isAlwaysSelf = true;

                let newArray = target._internal.map(thing => {
                  let newThing = thing[prop](...arguments);

                  if(thing !== newThing)
                    isAlwaysSelf = false;

                  return newThing;
                });

                if(isAlwaysSelf)
                  return target._self;

                return Qlist.from(newArray);
              };

            return Qlist.from(target._internal.map(thing => thing[prop]));
          },

          set(target, prop, value, receiver) {
            let index;

            try {
              index = +prop;
            } catch(e) {
              index = NaN;
            }

            let isGoodType =
              (reference == Number && to(value, qt.n)) ||
              (reference == Boolean && to(value, qt.b)) ||
              (reference == String && to(value, qt.s)) ||
              reference == Object;

            if(target._isNested && is(value, Qlist)) {
              isGoodType = (
                value.reference == undefined ||
                target.reference[qs.origFunc] == value.reference[qs.origFunc] &&
                target.isNested - 1 == value.isNested
              );
            }

            if(index >= 0)
              if(!isGoodType && target._type && !is(value, target._type))
                throw new TypeError(`'item' does not conform to typed array`);
              else {
                target._internal[index] = value;
                return true;
              }
            if(index < 0)
              if(!isGoodType && target._type && !is(value, target._type))
                throw new TypeError(`'item' does not conform to typed array`);
              else {
                target._internal[target._internal.length + index] = value;
                return true;
              }

            if(prop in target) {
              target[prop] = value;
              return true;
            }

            if(prop in target._internal) {
              target._internal[prop] = value;
              return true;
            }

            if(target._type && !(prop in target._type.prototype)) {
              target[prop] = value;
              return true;
            }

            if(target._type && 'set' in Object.getOwnPropertyDescriptor(target._type.prototype)) {
              Qlist.from(target._internal.map(thing => thing[prop] = value));
              return true;
            }

            if(target._type && to(target._type.prototype[prop], qt.f))
              return false;

            target[prop] = value;
            return true;
          },

          deleteProperty(target, prop) {
            let index = +prop;

            if(index >= 0 && index < target._internal.length)
              return delete target._internal[index];
            if(index < 0 && index >= -target._internal.length)
              return delete target._internal[target._internal.length + index];

            if(prop in target)
              return delete target[prop];

            if(prop in target._internal)
              return delete target._internal[prop];

            if(target._type && !(prop in target._type.prototype))
              return delete target[prop];

            return false;
          },

          ownKeys(target) {
            let ret = [];

            for(let i = 0; i < target._internal.length; i++)
              ret.push(i.toString());

            return ret;
          },
        }
      ),
      Object.keys(props)
    );

    return this._self;
  }

  Object.assign(Qlist.prototype, {
    get reference() {
      return this._type;
    },
    get isNested() {
      return this._isNested;
    },
  });

  Qlist.prototype[Symbol.iterator] = function*() {
    for(let thing in this._internal)
      yield thing;
  };

  Object.assign(Qlist, {
    from(arrayLike, overrideReference) {
      if(overrideReference != null && !to(overrideReference, qt.f))
        throw new qte('overrideReference', 'f');

      let reference = overrideReference;
      let isNested = 0;

      if(!reference)
        for(let item of arrayLike)
          if(item != null) {
            if(reference == null)
              reference = item.constructor;
            else if(!overrideReference)
              while(
                !is(item, reference) &&
                reference.__proto__ != Function.prototype &&
                reference.__proto__ != Object.prototype
              )
                reference = reference.__proto__;
            else if(!is(item, reference))
              throw new TypeError(`Array contains items that are not of type 'overrideReference'`);
          }


      if(arrayLike[0] instanceof Qlist) {
        reference = arrayLike[0].reference;
        isNested = arrayLike[0].isNested + 1;
      }

      let ret = new Qlist(reference, isNested);

      for(let i in arrayLike)
        if(!isNaN(+i))
          ret[+i] = arrayLike[i];

      return ret;
    }
  });

  Qlist.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
}

q.onready.add(() => {
  let styles = getComputedStyle(document.body);

  qs.styles = [];
  qs.styleAliases = {};

  for(let style of styles) {
    qs.styles.push(style);

    if(style[0] == '-')
      qs.styleAliases[style.substr(style.indexOf('-', 1) + 1)] == style;
  }
});

{
  function setIsLoaded() {
    Object.defineProperty(q, 'ready', {value: true});
    Object.defineProperty(q, 'r', {value: true});
  }

  document.addEventListener('DOMContentLoaded', () => {
    q.onready.t('DOMContentLoaded');
    setIsLoaded();
  });
  document.addEventListener('load', () => {
    if(!q.r) {
      q.onready.t('load');
      setIsLoaded();
    }
  });
  window.addEventListener('load', () => {
    if(!q.r) {
      q.onready.t('load');
      setIsLoaded();
    }
  });
}
