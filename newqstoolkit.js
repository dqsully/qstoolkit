/*
  Q's JavaScript Toolkit v1.0.3b
  A generic alternative to jQuery, allowing some amazing chaining.
  Instructions for compressing:
    Make sure all functions have aliases
    Replace all function calls with their shortened aliases
    Replace all "new qelement"s with the newq function
    Put this through jscompress.com
  TODO
    - qlist for events, elements, and more
*/

'use strict';

// Promise polyfil
// Better Promises
var qPromise = (function() {
  var a;

  // Try to use Microevents
  if(window.MutationObserver) {
    var el = document.createElement('a');
    var queue = [];
    var mo = new MutationObserver(function() {
      for(; queue.length > 0;) queue.shift()();
    });
    mo.observe(el, {attributes: true});
    a = function(callback) {
      queue.push(callback);
      if(queue.length == 1)
        el.setAttribute('x', 0);
    };
  } else a = setTimeout;

  function qPromise(executor, multiple, onevalue) {
    if(!q.is(this))
      return qPromise.applyNew(arguments); // Force new instance
    // Constructor
    /*
      Stack reference
        .s : state
        .o : onResolve
        .j : onReject
        .n : next
        .p : previous
        .v : value
        */
    var stack = {}, next = stack, finalMsg;
    var empty = function(){}, o = 'o', j = 'j';

    function createF(next, ofNext, rewriteFinalMsg) {
      next = next.n;
      if(!next) return empty;
      return function(msg) {
        if(rewriteFinalMsg && onevalue) finalMsg = msg;
        a(function() {
          if(!multiple && next.p.s != 0) return; // Allow only to be called once
          next.v = msg;
          try {
            next.p.s = (ofNext == j) + 1;
            next[ofNext](next.d ? finalMsg : createF(next, o), next.d ? empty : createF(next, j), msg);
            if(next.d) createF(next, o)(msg); // resolve
          } catch(e) {
            next.p.s = 2;
            createF(next, j)(msg); // reject
          }
        });
      }
    }

    function NewPromise(onResolve) {
      return NewPromise.then(onResolve, null, 1);
    }
    NewPromise.then = function(onResolve, onReject, callAfterThis) {
      onResolve = onResolve || function(o, j, n) {o(n);};
      onReject = onReject || function(o, j, n) {j(n);};
      next.n = {
        d: callAfterThis,
        p: next,
        o: onResolve,
        j: onReject,
        s: 0,
        v: undefined
      };
      // Call resolve if already resolved
      if(next.s == 1) {
        onResolve(createF(next.n, o), createF(next.n, j));
        next.n.s = 1;
      }
      // Call reject if already rejected
      else if(next.s == 2) {
        onReject(createF(next.n, o), createF(next.n, j));
        next.n.s = 2;
      }

      next = next.n;

      // Define value getter (and clone)
      var r = function() {return Function.prototype.apply.call(NewPromise, undefined, arguments);};
      for(var key in NewPromise) if(NewPromise.hasOwnProperty(key)) r[key] = NewPromise[key];
      (function(n){Object.defineProperty(r, 'value', {get: function() {return n;}})})(next);

      return r;
    }
    NewPromise.catch = function(onReject) {
      return NewPromise.then(null, onReject);
    }
    Object.defineProperty(NewPromise, 'multiAllowed', {get: function() {return multiple;}});

    // Call it
    next.s = 0;
    (function(next) {a(function() {
      executor(createF(next, o, true), createF(next, j, true));
    })})(next);

    NewPromise.__proto__ = this.__proto__; // Extend returned object to be this

    return NewPromise;
  }

  return qPromise;
})();


Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this)
        if (this.hasOwnProperty(key))
            temp[key] = this[key];
    return temp;
};
Function.prototype.applyNew = function(args) {
  (args = Array.from(args)).unshift(undefined);
  return new (Function.prototype.bind.apply(this, args));
}
Function.prototype.callNew = function() {
  (args = Array.from(args)).unshift(undefined);
  return new (Function.prototype.bind.apply(this, arguments));
}
Object.prototype.getKeys = function() {return Object.keys(this);}
Object.prototype.defineProperty = function(property, descriptor) {return Object.defineProperty(this, property, descriptor);}
Object.prototype.getOwnPropertyNames = function() {return Object.getOwnPropertyNames(this);}
Object.prototype.getOwnPropertyDescriptor = function(property) {return Object.getOwnPropertyDescriptor(this, property);}
Object.prototype.hasGetOrSet = function(property) {
  var tmp = this.getOwnPropertyDescriptor(property);
  if('get' in tmp || 'set' in tmp)
    return true;
  return false;
}
Object.prototype.equals = function (compareTo) {
  if(typeof(compareTo) != qs.to)
    return null;
  if(this == compareTo)
    return true;
  var paths = [this.path(), compareTo.path()];
  var arrs = [];
  var tmp;
  var keys = [paths[0].getKeys(), paths[1].getKeys()];
  //Length Test
  if(keys[0].length != keys[1].length)
    return false;
  //Key Test
  for(var a=0; a<keys[0].length; a++)
    if(keys[1].indexOf(keys[0][a]) == -1)
      return false;
  //Value Tests
  for(var i = 0; i<keys[0].length; i++) {
    //Get array from address
    arrs = [this, compareTo];
    tmp = keys[0][i].split('.');
    for(var a=0; a<tmp.length; a++) {
      arrs[0] = arrs[0][tmp[a]];
      arrs[1] = arrs[1][tmp[a]];
    }
    for(var a in arrs[0]) {
      if(typeof(arrs[0][a]) != typeof(arrs[1][a]))
        return false;
      if(typeof(arrs[0][a]) != qs.to &&  arrs[0][a] !== arrs[1][a])
        return false;
    }
  }
  return true;
}
// Get path to all values other than objects
Object.prototype.path = function() {
  var out = {}, stack = [], prev;
  var keys, ar, a, i, j, s, rm, badar, isbad;
  while(true) {
    ar = this;
    // Go to current path
    for(i=0; i<stack.length; i++)
      ar = ar[stack[i]];

    keys = ar.getKeys();

    // Reset text path
    s = '';
    // Continue search
    for(i=(rm ? keys.indexOf(prev) + 1 : 0); i<keys.length; i++) {
      // If tree continues, follow
      if(typeof(a = ar[keys[i]]) == qs.to) {
        // Make sure you don't end up where you were before
        badar = this, isbad = false;
        if(a == badar) isbad = true;
        for(j=0; j<stack.length-1&&isbad==false; j++)
          if(a == (badar = badar[stack[j]]))
            isbad = true;

        if(!isbad) {
          stack.push(keys[i]);
          rm = false;
          break;
        }
      } else {
        //Add current path to output
        // Get text path if it doesn't yet exist
        if(!s)
          for(var j=0; j<stack.length; j++)
            s += (j>0?'.':'') + stack[j];
        out[s + (s.length > 0 ? '.' : '') + keys[i]] = a;
        rm = true;
      }
    }
    // Go back a layer in the tree, reached the end
    if(rm) {
      if(stack.length == 0)
        return out;
      prev = stack.pop();
    }
  }
}
Object.prototype.extend = function(toAppend) {
  if(typeof(toAppend) != qs.to)
    throw new TypeError('Not a valid Object');
  var keys = toAppend.getKeys(), akey, cur;
  for(var i=0; i<keys.length; i++) {
    if(typeof(cur = toAppend[keys[i]]) == qs.to) {
      akey = cur.getKeys();
      // Allow getters and setters
      if((akey.length == 2 && 'get' in cur && 'set' in cur) || (akey.length == 1 && ('get' in cur || 'set' in cur)))
        this.defineProperty(keys[i], cur);
      else
        this[keys[i]] = cur;
    } else
      this[keys[i]] = cur;
  }
}
// Similar to indexOf
Object.prototype.keyOf = function(value) {
  var keys = this.getKeys(), v;
  for(var i=0; i<keys.length; i++)
    if((v = this[keys[i]]) == value)
      return keys[i];
  return -1;
}
String.prototype.containsAny = function(find, begin) {
  if(typeof(find) == qs.ts) {
    for(var i=0; i<find.length; i++)
      if(this.indexOf(find[i], begin) != -1)
        return true;
  } else if(typeof(find) == qs.to) {
    var keys = find.getKeys();
    for(var i=0; i<keys.length; i++)
      if(this.indexOf(find[keys[i]], begin) != -1)
        return true;
  }
  return false;
}
String.prototype.containsOnly = function(find, i) {
  i = i || 0;
  if(typeof(find) == qs.ts) {
    for(; i<this.length; i++)
      if(find.indexOf(this[i]) != -1)
        return false;
  } else if(typeof(find) == qs.to) {
    for(; i<this.length; i++)
      if(find.keyOf(this[i]) != -1)
        return false;
  }
  return true;
}
Object.prototype.if = function(condition, func) {
  if(condition)
    func(this);
  return this;
}
Object.prototype.for = function(start, end, func) {
  for(var i=start; i<end; i++)
    func(i, this);
  return this;
}
Object.prototype.foreach = function(func) {
  var keys = this.getKeys();
  for(var i=0; i<keys.length; i++)
    func(this[keys[i]], this, keys[i]);
  return this;
}
// Key polyfil
KeyboardEvent.prototype.getKey = function(force) {
  if(!force && 'key' in this)
    return this.key;
  var key = qs.keys[this.which || this.keyCode];
  if(typeof(key) == qs.to)
    key = key[+this.shiftKey];
  return key;
}
Number.prototype.bound = function(lower, higher) {
  if(lower > higher)
    return Math.max(higher, Math.min(lower, this));
  return Math.min(higher, Math.max(lower, this));
}
window.events = [];
window.on = function(name, func, callNow) {
  if(typeof(name) == qs.to) {
    for(var i=0; i<name.length; i++)
      this.on(name[i], func, callNow);
    return this;
  }
  if(!(name in this.events))
    this.events[name] = new qevent({'attachTo': this, 'name': name});
  if(!q.is(func))
    return this.events[name];
  if(callNow)
    func();
  this.events[name].add(func);
  return this;
}

const qs = {
  eNd: 'Not a valid qelement or Node',
  eNdOrTag: 'Not a valid tagname, qelement, or Node',
  eNdOrList: 'Not a valid qelement, Node, qlist, HTMLCollection, or NodeList',
  eEm: 'Not a valid qelement or HTMLElement',
  eEmOrTag: 'Not a valid tagname, qelement, or HTMLElement',
  eFunc: 'Not a valid function',
  eNum: 'Not a valid number',
  eSelOrEm: 'Not a valid CSS Selector or HTMLElement',
  eList: 'Not a valid qlist, HTMLCollection, or NodeList',
  eIn: 'Not a valid HTMLInputElement',
  eSe: 'Not a valid HTMLSelectElement',
  eNEA: 'Not enough arguments',
  eORng: 'Argument out of range',
  fId: 'abcdefghijklmnopqrstuvwxyz1234567890-_~`|\\/?=<!@$%^`',
  tf: 'function',
  tn: 'number',
  to: 'object',
  ts: 'string',
  tu: 'undefined',
  keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    },
  cssTypeNumber: 0,
  cssTypeAngle: 1,
  cssTypeLength: 2,
  cssTypePercentage: 3,
  cssTypeLengthPercentage: 4
};
// Generate rest of keys
(function(){var a; for(a=1;a<25;a++)qs.keys[111+a]='F'+a;var b='';for(a=65;a<91;a++)qs.keys[a]=[(b=String.fromCharCode(a)).toLowerCase(),b]})();

var qsettings = {
  defaultCSSUnits: {
    length: 'px',
    angle: 'deg',
  },
  bezierAccuracy: 15, // 2^-n tolerance
  cacheLength: 10, // Max Items
  cacheTimeout: 100, // Milliseconds
  cacheGCInterval: 1000, // Milliseconds
}

var qevent = (function() {
  var curRef = 0;
  function makeRef() {
    return '<#qstoolkit.event#>' + curRef++ + '</#qstoolkit.event#>';
  }

  /*
    Options:
      attachTo - element to attach to
      name - name of evento n element to attach to
      once - trigger only once?
      */
  function qevent(options) {
    if(this == undefined)
      return qevent.applyNew(arguments); // Force new instance

    options = options || {};

    var handlers = {}, names = {}, nativeHandlers = {};
    var triggered = false;
    if('attachTo' in options)
      (options['attachTo'].em || options['attachTo']).addEventListener(options['name'], function() {
        triggered = true;
      });

    function addHandler(handler, name) {
      var ref = makeRef();
      handlers[ref] = handler;
      names[name] = ref;
      if('attachTo' in options)
        (options.attachTo.em || options.attachTo).addEventListener(options.name, nativeHandlers[ref] = function(e) {
          var ret = handler.call(undefined, e, options.attachTo);
          if(ret === false) e.preventDefault();
          return ret;
        });
      return ref;
    }

    function event(func, vars) {
      var doResolve;
      if(func !== undefined) {
        if(typeof(func) == qs.tf) {
          var resolveFunc;
          function willResolve() {
            return resolveFunc.apply(undefined, arguments);
          }

          // Register handler
          if(options.once && triggered) {
            // Run current and all next handlers
            var toReturn = qPromise(function(resolve) {
              resolveFunc = resolve;
            }, false, true)(func);

            toReturn.id = addHandler(willResolve, func.name);
            return toReturn;
          }

          // Make chain
          var toReturn = qPromise(function(resolve) {
            resolveFunc = resolve;
          }, !options.once, true)(func);

          toReturn.id = addHandler(willResolve, func.name);
          return toReturn;
        } else
          return event.t.apply(undefined, arguments); // Trigger
      }
    }
    event.extend({
      triggered: {get: function() {
        return triggered;
      }},
      trigger: function() {
        var a = arguments, t = this;
        return new qPromise(function(resolve) {
          var keys = handlers.getKeys();
          for(var i=0; i<keys.length; i++)
            if(handlers[keys[i]] != null)
              handlers[keys[i]].apply(undefined, a);
          triggered = true;
          resolve();
        });
      },
      add: function(func, callNow) {
        var resolveFunc;
        function willResolve() {
          return resolveFunc.apply(undefined, arguments);
        }

        if(typeof(func) != qs.tf) throw new TypeError(qs.eFunc);
        // Register handler
        if(options.once && triggered) {
          // Run current and all next handlers
          var toReturn = qPromise(function(resolve) {
            resolveFunc = resolve;
          }, false, true)(func);

          toReturn.id = addHandler(willResolve, func.name);
          return toReturn;
        }

        // Make chain
        var toReturn = qPromise(function(resolve) {
          resolveFunc = resolve;
        }, !options.once, true)(func);

        toReturn.id = addHandler(willResolve, func.name);
        return toReturn;
      },
      remove: function(id) {
        if(!(id in handlers))
          throw new RangeError(qs.eORng);
        handlers[id] = undefined;
        names[names.keyOf(id)] = undefined;
        if('attachTo' in options)
          (options.attachTo.em || options.attachTo).removeEventListener(options.name, nativeHandlers[id]);
      },
      clear: function() {
        var keys = handlers.getKeys();
        for(var i=0; i<keys.length; i++)
          handlers[keys[i]] = undefined;
      },
      names: {get: function() {
        return names;
      }},
      raw: {get: function() {
        return {handlers: handlers, names: names, nativeHandlers: nativeHandlers};
      }},
    });

    // Aliases
    event.extend({
      rem: event.remove,
      t: event.trigger,
      clr: event.clear,
    });

    event.__proto__ = this.__proto__; // Extend returned object to this
    return event;
  }
  return qevent
})();

var qc = (function() {
  var cache = [];

  function tocache(element, selector, extraTime, searchIn) {
    searchIn = searchIn || document;
    cache.push({element: element, time: Date.now() + extraTime, selector: selector, searchIn: searchIn});
    if(cache.length >= qsettings.cacheLength) cache.shift();
    return element;
  }

  function cacheGC() {
    for(var i=0; i<cache.length;) {
      if(i >= qsettings.cacheLength || Date.now() - cache[i].time > qsettings.cacheTimeout)
        cache.splice(i, 1);
      else
        i++;
    }
    setTimeout(cacheGC, qsettings.cacheGCInterval);
  }
  setTimeout(cacheGC, qsettings.cacheGCInterval);


  /*Options
    - extraTime : extra time to add to cache expiration time
    - searchIn : element or thing to search in
    - forceList : force output to array
      */
  function qc(selector, options) {
    var extraTime = (options && options.extraTime) || 0;
    // searchIn validation and formatting
    var search = (options && options.searchIn && options.searchIn.em) || document;
    if(search && !qelement.is(search))
      throw new TypeError(qs.eNd);
    // Cache
    for(var i=0; i<cache.length; i++)
      if(cache[i].selector == selector && ((options && options.searchIn) || document) == cache[i].searchIn)
        return cache[i].element;
    // Validation and qelement creation
    if(selector instanceof qelement)
      return tocache(selector, selector, extraTime, (options && options.searchIn) || null);
    if(selector instanceof HTMLElement)
      return tocache(newq(selector), selector, extraTime, (options && options.searchIn) || null);
    if(qlist.is(selector))
      return tocache(qlist.from(selector), selector, extraTime, (options && options.searchIn) || null);
    if(typeof(selector) != qs.ts) throw new TypeError(qs.eSelOrEm);
    // getElementById shortcut
    if(selector[0] == '#' && selector.substr(1).toLowerCase().containsOnly(qs.fId))
      return tocache(newq(search.getElementById(selector.substr(1))), selector, extraTime, (options && options.searchIn) || null);
    // Querying
    var results = search['querySelector' + (options && options.first ? '' : 'All')](selector);
    if(options && options.forceList)
      return qelement.fromNodes(results, true);
    if(results.length == 0)
      return null;
    if(results.length == 1)
      return newq(results[0]);
    return qelement.fromNodes(results);
  }
  qc.extend({
    clearCache: function() {
      if(arguments.length > 0) {
        for(var i=0; i<cache.length; i++)
          for(var a=0; a<arguments.length; a++)
            if(cache[i].selector == arguments[a])
              cache.splice(i, 1);
      } else
        cache = [];
    }
  });

  return qc;
})();
var q = (function() {
  function q(selector, options) {
    // searchIn validation and formatting
    var search = (options && options.searchIn && options.searchIn.em) || document;
    if(search && !qelement.is(search))
      throw new TypeError(qs.eNd);
    // Validation and qelement creation
    if(selector instanceof qelement)
      return selector;
    if(selector instanceof HTMLElement)
      return newq(selector);
    if(qlist.is(selector))
      return new qelist(selector);
    if(typeof(selector) != qs.ts)
      throw new TypeError(qs.eSelOrEm);
    // getElementById shortcut
    if(selector[0] == '#' && selector.substr(1).toLowerCase().containsOnly(qs.fId))
      return newq(search.getElementById(selector.substr(1)));
    // Querying
    var results = search['querySelector' + (options && options.first ? '' : 'All')](selector);
    if(options && options.forceList)
      return qelement.fromNodes(results, true);
    if(results.length == 0)
      return null;
    if(results.length == 1)
      return newq(results[0]);
    return qelement.fromNodes(results);
  }

  // Tool Definitions
  function bezier(t, x1, y1, x2, y2) {
    return {
      x: 3*t*(x1+t*(x2-2*x1+t*(1/3+x1-x2))),
      y: 3*t*(y1+t*(y2-2*y1+t*(1/3+y1-y2)))
    };
  }
  var detect, sbarWidth, oref = 0;

  q.extend({
    record: function(key, value) {
      if(!q.is(value)) return localStorage.getItem(key);
      localStorage.setItem(key, value || '');
    },
    setup: function(options) {
      var keys = options.getKeys();
      for(var i=0; i<keys.length; i++)
        qsettings[keys[i]] = options[keys[i]];
    },
    async: function() {
      setTimeout.apply(undefined, arguments);
    },
    timer: function() {
      setInterval.apply(undefined, arguments);
    },
    log: function() {
      var line = q.lineNumber(1);
      var args = Array.prototype.unshift.call(arguments, line.file + ':' + line.line + ':');
      console.log.apply(undefined, arguments);
      return arguments[1];
    },
    ref: function() {
      return '<#Qref:' + (oref++) + '>';
    },
    limit: function(modifier, timeout, func) {
      var args = null, lock = false;
      return function newfunc() {
        args = modifier(arguments, args);
        if(!lock) {
          lock = true;
          timeout(function onframe() {
            lock = false;
            func.apply(undefined, args);
            args = null;
          });
        }
      }
    },
    lineNumber: function(stackBack) { // 0 is caller function
      var stack, call, clean, isNative, line, col, hasName, script;
      stackBack = (stackBack || 0) + 2;
      stack = (new Error('')).stack.split('\n');
      if(!stackBack in stack) throw new RangeError('Stack index ' + stackBack + ' exceeds stack length');
      call = stack[stackBack];
      clean = call.slice(call.indexOf('at ') + 3, call.length);
      isNative = clean.containsAny(['(native)']);
      hasName = /.+ \(.+\)/.test(clean);
      col = clean.lastIndexOf(':');
      line = clean.lastIndexOf(':', col - 1) + 1;
      script = clean.slice(hasName ? clean.indexOf('(') + 1 : 0, line-1); // )
      return {
        iNative: isNative,
        func: clean.slice(0, clean.indexOf(' ')),
        hasName: hasName,
        script: script,
        line: isNative ? '(native)' : clean.slice(line, col),
        col: isNative ? '(native)' : clean.slice(col + 1, hasName ? clean.length - 1 : undefined),
        raw: clean,
        file: script.slice(script.lastIndexOf('/') + 1)
      };
    },
    scrollbarWidth: {get: function() {
      if(sbarWidth) return sbarWidth;
      var inner, outer;
      qc('body')
        .a(
          outer = newq('div')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .style('visibility', 'hidden')
            .style('width', 200)
            .style('height', 150)
            .style('overflow', 'hidden')

            .a(
              inner = newq('p')
                .style('width', '100%')
                .style('height', 200)
            )
        );
    }},
    onready: qevent({once: true}),
    onload: qevent({once: true}),
    registerEventHandlers: function(searchIn) {
      var ems = q('*[qclick]', {searchIn: searchIn, forceList: true});
      for(var i=0; i<ems.length; i++)
        ems[i].on('click', window[ems[i].attr('qclick')]);
    },
    is: function() {
      var alen = arguments.length;
      for(var i=0; i<alen; i++)
        if(arguments[i] === undefined)
          return false;
      return true;
    },
    demoAnimation: function(animations, name) {
      if(name) {
        var s = q.record('q');
        if(s == null || s == '')
          s = [];
        if(s[name] == true)
          return;
        s[name] = false;
        q.record('q', s);
      }
      var i=0; len = animations.length - 1, exit = false, t;
      var run = function() {
        var em, styles, tmp, plen;
        for(var p=0; p<animations[i].properties.length; p++) {
          var em = animations[i].properties[p].em;
          var styles = animations[i].properties[p].styles.split(';');
          for(var a=0; a<styles.length; a++) {
            tmp = styles[a].split(':');
            if(tmp != '')
              em.style(tmp[0], tmp[1]);
          }
        }
        if(!exit)
          t = q.async(run, animations[i].time);
        i++;
        if(i >= len) i = i % len;
      }
      t = q.async(run, animations[i].time);
      function callback() {
        clearTimeout(t);
        exit = true;
        var tmp;
        if(name) {
          var s = q.record('q');
          if(s == null || s == '')
            s = [];
          s[name] = true;
          q.record('q', s);
        }
        for(var p=0; p<animations[len].properties.length; p++) {
          var em = animations[len].properties[p].em;
          var styles = animations[len].properties[p].styles.split(';');
          for(var a=0; a<styles.length; a++) {
            tmp = styles[a].split(':');
            if(tmp != '')
              em.style(tmp[0], tmp[1]);
          }
        }
      }
      return callback;
    },
    generateCSSFunction: function(options) {
      /*Options
        - {} options
          - "" name
          - [] versions
            - {}
              - {} testfor?
                - ## numArguments?
              - [] argumentTypes
                - ##
          */
      var str = 'var a=arguments,o,d,s=qsettings.defaultCSSUnits,r;', func = {};
      var i, j, len, version, keys, conds, t, args, isCheckingArgs, v;

      for(i=0, len=options.versions.length; i<len; i++) {
        v = options.versions[i];
        isCheckingArgs = 0;

        // Define default options
        str += 'd=[';
        for(j=0; j<v.argumentTypes.length; j++) {
          t = v.argumentTypes[j];
          if(typeof(t) != qs.tn || t < 0 || t > 4) throw new TypeError('Not a valid argument type');
          str += (j > 0 ? ',' : '') + t;
        }
        str += '];';

        // Validate for current version
        str += 'if(';
        conds = 0;
        if(v.testfor) {

          keys = v.testfor.getKeys();
          for(j=0; j<keys.length; j++) {
            switch(keys[j]) {
              case 'numArguments':
                // Make sure #args is correct, and if extra options are added, that they are truly options
                isCheckingArgs = true;
                args = Number.parseInt(v.testfor[keys[j]]); // parseInt for security reasons
                if(args == 0) throw new Error('Not a valid request of number of arguments');
                str += (conds > 0 ? '&&' : '') + '(a.length==' + args + '||(a.length==' + (args+1) + '&&a[a.length-1]instanceof Array))';
                break;
            }
          }

        } else str += 'true';

        // Define options variable if it exists
        str += '){' + (args ? 'if(a.length==' + (args+1) + ')o=a[' + args + '];' : '');

        // Modify arguments to specified units
        /*
        for(var i=0; i<a.length; i++) {
          if(o && i in o) {
            r = o;
            if(o[i] == 5) o[i] = d[i];
          } else if(typeof(a[i]) == qs.tn) {
            r = d;
          } else r=0;
          if(r) a[i] = a[i] + (r[i] == 1 ? s.angle : (r[i] == 2 || r[i] == 4 ? s.length : (r[i] == 3 ? "%" : "")));
        }
        */
        str += 'for(var i=0;i<a.length;i++){if(o&&i in o){r=o;if(o[i]==5)o[i]=d[i];}else if(typeof(a[i])==qs.tn)r=d;else r=0;if(r)a[i]=a[i]+(r[i]==1?s.angle:(r[i]==2||r[i]==4?s.length:(r[i]==3?"%":"")));}';

        str += 'return "' + options.name + '("';
        for(j=0; j<args; j++) str+='+' + (j>0?'","+':'') + 'a['+j+']';
        str += '+")";}';
      }
      str += 'else throw new Error(qs.eNEA);';

      func[options.name] = new Function(str);
      q.extend(func);
    },
    CSSTimingFunctions: {
      'ease':       [0.25, 0.1,  0.25, 1   ],
      'linear':     [0,    0,    1,    1   ],
      'ease-in':    [0.42, 0,    1,    1   ],
      'ease-out':   [0,    0,    0.58, 1   ],
      'ease-in-out':[0.42, 0,    0.58, 1   ],
    },
    // x1, y1, x2, y2, interval, onEnd
    bezierAnimation: function(callback, duration, options) {
      var x1, y1, x2, y2, interval, onEnd;
      function getAnimFunc(name) {
        x1 = q.CSSTimingFunctions[name][0], y1 = q.CSSTimingFunctions[name][1], x2 = q.CSSTimingFunctions[name][2], y2 = q.CSSTimingFunctions[name][3];
      }

      // Setup ease values
      if('x1' in options && 'y1' in options && 'x2' in options && 'y2' in options)
        x1 = options.x1, y1 = options.y1, x2 = options.x2, y2 = options.y2;
      else if(!('timingFunction' in options))
        getAnimFunc('ease');
      else if(!(options.timingFunction in q.CSSTimingFunctions))
        throw new TypeError('Animation function not predefined');
      else
        getAnimFunc(options.timingFunction);

      if('interval' in options && typeof(options.interval) == qs.tn)
        interval = options.interval;

      if('onend' in options && typeof(options.onend) == qs.tf)
        onEnd = options.onend;

      if(x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) throw new RangeError('X value(s) must be between 0 through 1');
      if(typeof(duration) != qs.tn) throw new TypeError('duration not a number');
      if(typeof(callback) != qs.tf) throw new TypeError('callback not a function');

      var s = performance.now(), cancel = false;

      function int() {
        if(cancel) return;
        var t = (performance.now() - s) / duration; // time passed
        if(t > 1) {
          callback(1);
          if(onEnd) onEnd();
          return;
        }

        var blow = 0, bhigh = 1, bmid, fout, num = qsettings.bezierAccuracy, tol = Math.pow(2, -num);
        for(var i=0; i<num; i++) {
          bmid = (blow + bhigh)/2;
          fout = bezier(bmid, x1, y1, x2, y2);
          if(Math.abs(fout.x - t) <= tol) break;
          if(fout.x < t) blow = bmid;
          else bhigh = bmid;
        }
        callback(fout.y);
        if(interval) setTimeout(int, interval);
        else requestAnimationFrame(int);
      }

      if(interval) setTimeout(int, interval);
      else requestAnimationFrame(int);
      return function() {
        cancel = true;
      }
    },
    isCSSValueSupported: function(property, value) {
      if(!detect) detect = newq('d');
      return detect.style(property, value).style(property) == value;
    }
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
      name: 'rotateZ',
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
  ].foreach(q.generateCSSFunction);

  return q;
})();
function newq(element) {
  return new qelement(element);
}
function makeq(element) {
  if(element instanceof qelement) return element;
  return newq(element);
}
var qelement = (function() {
  function qelement(element) {
    if(typeof(element) == qs.ts) this.em = document.createElement(element);
    else if(element instanceof Node) this.em = element;
    else if(element instanceof qelement) return element;
    else throw new TypeError(qs.eNdOrTag);
    if(typeof(this.em.events) != qs.to) this.em.events = {};
    if(typeof(this.em.devents) != qs.to) this.em.devents = {};
  }
  function css(a, y) {
    if(!q.is(a)) return '';
    return (typeof(a) == qs.tn ? a.toFixed(3) + qsettings.defaultCSSUnits.length : a.trim());
  }
  qelement.extend( {
    fromNodes: function(nodelist, forcelist) {
      if(!forcelist) {
        if(nodelist instanceof Node) return makeq(nodelist);
        if(nodelist instanceof qlist) return nodelist
      }
      if(!(nodelist instanceof HTMLCollection || nodelist instanceof NodeList || nodelist instanceof Array)) throw new TypeError(qs.eList);
      var out = [];
      for(var i=0; i<nodelist.length; i++)
        out.push(makeq(nodelist[i]));
      return qlist.from(out, qelement);
    },
    is: function(test) {
      return (test instanceof Node || test instanceof qelement);
    },
    isem: function(test) {
      return (test instanceof HTMLElement || test instanceof qelement);
    },
    isstr: function(test) {
      return (test instanceof Node || test instanceof qelement || typeof(test) == qs.ts);
    },
    isemstr: function(test) {
      return (test instanceof HTMLElement | test instanceof qelement || typeof(test) == qs.ts);
    }
  })
  qelement.onextensions = {
    resize: function(me, ev) {
      var style = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 'calc(100% + 1px)',
        height: 'calc(100% + 1px)',
        overflow: 'hidden',
        'z-index': '-1',
        visibility: 'hidden'
      }, styleChild = {
        position: 'absolute',
        left: '0',
        top: '0',
        transition: '0s'
      }, sensor, expand, expandChild, shrink, reset, pw, ph, called = false, shouldCall = true, first = 2;
      me.extendEm('resizeSensor',
        sensor = me.a('div')
          .classes('resize-sensor')
          .style(style)
          .a(expand = newq('div')
            .classes('resize-sensor-expand')
            .style(style)
            .a(expandChild = newq('div')
              .style(styleChild)
              .style({
                width: 100000,
                height: 100000
              })
            )
          ).a(shrink = newq('div')
            .classes('resize-sensor-shrink')
            .style(style)
            .a(newq('div')
              .style(styleChild)
              .style({
                width: '200%',
                height: '200%',
              })
            )
          )
      );

      if(me.computedStyle('position') == 'static')
        me.style('position', 'relative');
      shrink.scroll(100000, 1000000);
      expand.scroll(100000, 1000000);

      function onScroll(e) {
        if(first) {
          first--;
          return;
        }
        if(!shouldCall) {
          shouldCall = true;
          return;
        }
        if((me.width != pw || me.height != ph) && !called) {
          window.requestAnimationFrame(function() {
            ev.t({
              width: pw = me.width,
              height: ph = me.height
            });
            called = false;
          })
          switch(e.target.className) {
            case 'resize-sensor-expand':
              shrink.scroll(100000, 100000);
            break;
            case 'resize-sensor-shrink':
              expand.scroll(100000, 100000);
            break;
          }
          called = true;
          shouldCall = false;
        }
      }
      expand.on('scroll', onScroll);
      shrink.on('scroll', onScroll);
      return function destroy() {
        sensor.detach();
      }
    }
  };
  qelement.prototype.extend({
    on: function(name, func, callNow) {
      var out = [];
      if(!q.is(name))
        throw new RangeError(qs.eNEA);
      if(typeof(name) == qs.to) {
        for(var i=0; i<name.length; i++)
          out.push(this.on(name[i], func, callNow));
        if(!q.is(func))
          return out;
        return this;
      }
      var isAnExtension = name in qelement.onextensions;
      if(!(name in this.em.events)) {
        this.em.events[name] = new qevent(isAnExtension ? {} : {'attachTo': this, 'name': name});
        if(isAnExtension)
          this.em.devents[name] = qelement.onextensions[name](this, this.em.events[name]);
      }
      if(!q.is(func))
        return this.em.events[name];
      if(callNow)
        func();
      this.em.events[name].add(func);
      return this;
    },
    // Destroy event
    non: function(name) {
      if(name in this.em.events) {
        if(name in this.em.devents[name]) this.em.devents[name]();
        this.em.events[name].clear();
        this.em.events[name] = null;
      }
      return this;
    },
    id: function(newid) {
      if(!q.is(newid)) return this.em.id;
      this.em.id = newid;
      return this;
    },
    class: function(add, rem) {
      if(add != null) {
        if(add instanceof Array) {
          for(var i=0; i<add.length; i++)
            this.em.classList.add(add[i]);
        } else
          this.em.classList.add(add);
      }
      if(rem != null) {
        if(typeof(rem) == qs.to) {
          for(var i=0; i<rem.length; i++)
            this.em.classList.remove(rem[i]);
        } else {
            this.em.classList.remove(rem);
        }
      }
      return this;
    },
    classes: function() {
      if(!(0 in arguments)) return this.em.classList;
      var n = '';
      for(var i=0; i<arguments.length; i++)
        n += (n.length == 0 ? '' : ' ') + arguments[i];
      this.em.className = n;
      return this;
    },
    hasClass: function(seachFor) {
      return this.em.classList.contains(seachFor);
    },
    addClass: function() {
      for(var i=0; i<arguments.length; i++)
        this.em.classList.add(arguments[i]);
      return this;
    },
    remClass: function() {
      for(var i=0; i<arguments.length; i++)
        this.em.classList.remove(arguments[i]);
        return this;
    },
    togClass: function(c) {
      return this.em.classList.toggle(c);
    },
    text: function(t) {
      if(!q.is(t))
        return (this.em instanceof HTMLInputElement || this.em instanceof HTMLSelectElement) ? this.em.value : this.em.textContent;
      if(this.em instanceof HTMLInputElement || this.em instanceof HTMLSelectElement)
        this.em.value = t;
      else
        this.em.textContent = t;
      return this;
    },
    title: function(t) {
      if(!q.is(t))
        return this.em.title;
      this.em.title = t;
      return this;
    },
    html: function(h) {
      if(!q.is(h))
        return this.em.innerHTML;
      this.em.innerHTML = h;
      return this;
    },
    appendHtml: function(h) {
      thislem.innerHTML += h;
      return this;
    },
    outerHtml: function(h) {
      if(!q.is(h))
        return this.em.outerHTML;
      this.em.outerHTML = h;
      return this;
    },
    children: function(index) {
      if(!q.is(index)) return qelement.fromNodes(this.em.children);
      if(typeof(index) == qs.tn) {
        if(index >= 0 && index in this.em.children)
          return newq(this.em.children[index]);
        else if((this.childCount + index) in this.em.children)
          return newq(this.em.children[this.childCount + index]);
        return null;
      }
      if(typeof(index) == qs.ts) return q(index, {searchIn: this, forceList: true});
      if(index instanceof Array) {
        var out = [];
        for(var i=0; i<index.length; i++)
          out.push(this.children(index[i]));
        return out;
      }
      return null;
    },
    childCount: {get: function() {
      return this.em.children.length;
    }},
    index: {get: function() {
      var t = this.em, i = 0;
      while((t = t.previousElementSibling) != null)
        i++;
      return i;
    }},
    nodeIndex: {get: function() {
      var t = this.em; i = 0;
      while((t = t.prevousSibling) == null)
        i++;
      return i;
    }},
    append: function(child) {
      var s;
      if(!qelement.isstr(child))
        throw new TypeError(qs.eNd);
      this.em.appendChild((s = makeq(child)).em);
      return typeof(child) == qs.ts ? s : this;
    },
    insertAt: function(child, index) {
      var s;
      this.em.insertBefore((s = makeq(child)).em, this.em.children[index]);
      return typeof(child) == qs.ts ? s : this;
    },
    insertBefore: function(child, before) {
      var s;
      if(!(qelement.isstr(child) || qelement.is(before)))
        throw new TypeError(qs.eNd);
      this.em.insertBefore((s = makeq(child)).em);
      return typeof(child) == qs.ts ? s : this;
    },
    detach: function() {
      this.em.parentNode.removeChild(this.em);
      return this;
    },
    appendTo: function(parent) {
      var s;
      if(!qelement.isstr(parent))
        throw new TypeError(qs.eNd);
      (s = makeq(parent)).em.appendChild(this.em);
      return typeof(parent) == qs.ts ? s : this;
    },
    insertInto: function(parent ,index) {
      var s;
      if(!qelement.isstr(parent))
        throw new TypeError(qs.eNd);
      (s = makeq(parent)).insertAt(this, index);
      return typeof(parent) == qs.ts ? s : this;
    },
    insertBeforeIn: function(parent, before) {
      if(!(qelement.is(parent) || qelement.is(before)))
        throw new TypeError(qs.eNd);
      (parent.em || parent).insertBefore(this, before.em || beofre);
      return this;
    },
    insertBeforeThis: function(element) {
      var s;
      if(!(qelement.isstr(element)))
        throw new TypeError(qs.eNd);
      this.em.parentNode.insertBefore((s = makeq(element)).em, this.em);
      return typeof(element) == qs.ts ? s : this;
    },
    insertAfterThis: function(element) {
      var s;
      if(!(qelement.isstr(element)))
        throw new TypeError(qs.eNd);
      this.em.parentNode.insertBefore((s = makeq(element)).em, this.em.parentNode.children[this.nodeIndex + 1]);
      return typeof(element) == qs.ts ? s : this;
    },
    previousSibling: {get: function() {
      return newq(this.em.previousElementSibling);
    }},
    nextSibling: {get: function() {
      return newq(this.em.nextElementSibling);
    }},
    remove: function(child) {
      if(qelement.is(child)) {
        this.em.removeChild(child.em || child);
        return this;
      }
      if(child instanceof Array) {
        for(var i=0; i<child.length; i++) {
          if(!qelement.is(child[i]))
            throw new TypeError(qs.eNdOrList);
          this.em.removeChild(child[i].em || child[i]);
        }
        return this;
      }
      if(typeof(child) == qs.tn) {
        this.em.removeChild(this.em.children[child]);
        return this;
      }
      throw new TypeError(qs.eNdOrList);
    },
    hasSelection: {get: function() {
      if(!(this.em instanceof HTMLInputElement))
        throw new TypeError(qs.eIn);
      if(this.em.selectionStart == this.em.selectionEnd)
        return false;
      return true;
    }},
    cursor: function(index) {
      if(!(this.em instanceof HTMLInputElement))
        throw new TypeError(qs.eIn);
      if(!q.is(index))
        return this.em.selectionStart;
      this.em.setSelectionRange(index, index);
      return this;
    },
    selection: function(begin, end) {
      if(!(this.em instanceof HTMLInputElement))
        throw new TypeError(qs.eIn);
      if(!q.is(begin))
        return [this.em.selectionStart, this.em.selectionEnd];
      if(!q.is(end))
        this.em.setSelectionRange(begin, begin);
      else
        this.em.setSelectionRange(begin, end);
      return this;
    },
    firstChild: {get: function() {
      return newq(this.em.firstElementChild);
    }},
    firstNodeChild: {get: function() {
      return newq(this.em.firstChild);
    }},
    lastChild: {get: function() {
      return newq(this.em.lastElementChild);
    }},
    lastNodeChild: {get: function() {
      return newq(this.em.lastChild);
    }},
    parent: {get: function() {
      return newq(this.em.parentElement);
    }},
    parentNode: {get: function() {
      return newq(this.em.parentNode);
    }},
    height: {get: function() {
      return this.em.offsetHeight;
    }},
    width: {get: function() {
      return this.em.offsetWidth;
    }},
    clientHeight: {get: function() {
      return this.em.clientHeight;
    }},
    clientWidth: {get: function() {
      return this.em.clientWidth;
    }},
    outerHeight: {get: function() {
      var c = this.computedStyle(), h = this.em.offsetHeight;
      // Add padding and border
      if(c['box-sizing'] == 'content-box') {
        h += parseFloat(c['padding-top']) + parseFloat(c['padding-bottom']) + parseFloat(c['border-top-width']) + parseFloat(c['border-bottom-width']);
      }
      return h += parseFloat(c['margin-top']) + parseFloat(c['margin-bottom']);
    }},
    outerWidth: {get: function() {
      var c = this.computedStyle(), h = this.em.offsetWidth;
      // Add padding and border
      if(c['box-sizing'] == 'content-box') {
        h += parseFloat(c['padding-left']) + parseFloat(c['padding-right']) + parseFloat(c['border-left-width']) + parseFloat(c['border-right-width']);
      }
      return h += parseFloat(c['margin-left']) + parseFloat(c['margin-right']);
    }},
    style: function(propname) {
      if(!q.is(propname)) return this.em.style;
      if(typeof(propname) == qs.to) {
        var keys = propname.getKeys();
        for(var i=0; i<keys.length; i++)
          // Use browser-specific alias if property name is not valid
          this.em.style[!(keys[i] in qs.styles) && keys[i] in qs.styleAliases ? qs.styleAliases[keys[i]] : keys[i]] = css(propname[keys[i]]);
        return this;
      }
      if(!(1 in arguments)) return this.em.style[propname];
      // TODO: Create structure for every css property, to automate types
      var str = css(arguments[1]);
      for(var i=2; i<arguments.length; i++)
        str += ' ' + css(arguments[i]);

      // Use broswer-specific alias if property name is not valid
      if(qs.styles && !(propname in qs.styles) && (propname in qs.styleAliases))
        this.em.style[qs.styleAliases[propname]] = str;
      else
        this.em.style[propname] = str;
      return this;
    },
    computedStyle: function(propname) {
      if(propname)
        return getComputedStyle(this.em)[propname];
      return getComputedStyle(this.em);
    },
    validity: function(type) {
      if(!q.is(type))
        return this.em.validity;
      this.em.setCustomValidity(type);
      return this;
    },
    selected: function(i) {
      if(!(this.em instanceof HTMLSelectElement))
        throw new TypeError(qs.eSe);
      if(!q.is(i))
        return this.em.selectedIndex;
      this.em.selectedIndex = 0;
      return this;
    },
    clearChildren: function() {
      while(this.em.children.length > 0)
        this.em.removeChild(this.em.firstChild);
      return this;
    },
    hasChildren: {get: function() {
      return this.em.children.length > 0;
    }},
    focus: function() {
      this.em.focus();
      return this;
    },
    blur: function() {
      this.em.blur();
      return this;
    },
    attr: function(key, value) {
      if(!q.is(value))
        return this.em.getAttribute(key);
      this.em.setAttribute(key, value);
      return this;
    },
    hasExtension: function(key) {
      if(typeof(this.em.extensions) != qs.to || !('extensions' in this.em))
        return false;
      return key in this.em.extensions;
    },
    extendEm: function(key, value) {
      if(typeof(this.em.extensions) != qs.to || !('extensions' in this.em))
        this.em.extensions = {};
      if(!q.is(value))
        return this.em.extensions[key];
      this.em.extensions[key] = value;
      return this;
    },
    href: function(value, addListener) {
      if(!q.is(value))
        return this.em.getAttribute('href');
      this.em.setAttribute('href', value);
      if((addListener || (addListener == undefined && !(this.em instanceof HTMLAnchorElement))) && !('anchorEmulator' in this.on('click').names)) {
        var t = this.em;
        this.on('click', function anchorEmulator() {
          location.pathname = t.getAttribute('href');
        });
      }
      return this;
    },
    scroll: function(x, y) {
      if(!q.is(x) && !q.is(y))
        return {x: this.em.scrollLeft, y: this.em.scrollTop};
      if(x != null)
        this.em.scrollLeft = x;
      if(y != null)
        this.em.scrollTop = y;
      return this;
    },
    clientRect: {get: function() {
      return this.em.getBoundingClientRect();
    }},
    offsetBottom: {get: function() {
      return this.em.offsetBottom;
    }},
    offsetTop: {get: function() {
      return this.em.offsetTop;
    }},
    offsetLeft: {get: function() {
      return this.em.offsetLeft;
    }},
    offsetRight: {get: function() {
      return this.em.offsetRight;
    }},
  });

  // TODO: Aliases
  qelement.prototype.extend({
    c: qelement.prototype.children,
    cc: {get:function(){return this.em.children.length}},
    hc: {get:function(){return this.em.children.length > 0}},

    fc: {get:function(){return newq(this.em.firstElementChild)}},
    lc: {get:function(){return newq(this.em.lastElementChild)}},
    fnc: {get:function(){return newq(this.em.firstChild)}},
    lnc: {get:function(){return newq(this.em.lastChild)}},

    p: {get:function(){return newq(this.em.parentElement)}},
    pn: {get:function(){return newq(this.em.parentNode)}},

    ns: {get:function(){return newq(this.em.nextElementSibling)}},
    nns: {get:function(){return newq(this.em.nextSibling)}},
    ps: {get:function(){return newq(this.em.previousElementSibling)}},
    pns: {get:function(){return newq(this.em.previousSibling)}},

    a: qelement.prototype.append,
    rm: qelement.prototype.remove,
    d: qelement.prototype.detach,
    i: qelement.prototype.insertAt,

    cls: qelement.prototype.classes,
    cl: qelement.prototype.class,
    tcl: qelement.prototype.togClass,
    acl: qelement.prototype.addClass,
    rcl: qelement.prototype.remClass,

    t: qelement.prototype.text,
    s: qelement.prototype.style,
    cs: qelement.prototype.computedStyle,
    at: qelement.prototype.attr,

    f: qelement.prototype.focus,
    b: qelement.prototype.blur,

    sel: qelement.prototype.selected,
    cur: qelement.prototype.cursor,
    v: qelement.prototype.validity,

    h: {get:function(){return this.em.offsetHeight}},
    w: {get:function(){return this.em.offsetWidth}},
    ch: {get:function(){return this.em.clientHeight}},
    cw: {get:function(){return this.em.clientWidth}},
    oh: {get:function(){return this.outerHeight}},
    ow: {get:function(){return this.outerWidth}},

    ot: {get:function(){return this.em.offsetTop}},
    ob: {get:function(){return this.em.offsetBottom}},
    or: {get:function(){return this.em.offsetRight}},
    ol: {get:function(){return this.em.offsetLeft}},
    cr: {get:function(){return this.em.getBoundingClientRect()}},

    he: qelement.prototype.hasExtension,
    ee: qelement.prototype.extendEm,
  });

  return qelement;
})();

var qlist = (function() {
  var setfunc;

  function qlist(reference) {
    if(!q.is(this))
      return qlist.applyNew(arguments);


    var ar = [], proto;
    setfunc = function(newAr) {
      ar = newAr;
      if(!q.is(reference)) {
        reference = ar[0];
        extendThis();
      }
    }

    // Custom function/type
    var ret = function qlist(index, value) {
      if(!q.is(index))
        return ar;

      if(!q.is(value))
        return ar[index];

      if(!q.is(reference)) {
        reference = ar[0] || value;
        extendThis();
      }
      ar[index] = value;
      return ret;
    }

    // Custom methods
    ret.extend({
      copy: function() {
        var ret = qlist(reference);
        setfunc(ar.slice());
        return ret;
      },
      combine: function(func) {
        var out, len = ar.length;
        for(var i=0; i<len; i++)
          out = func(ar[i], out, ret, i);
        return out;
      },
      foreach: function(func) {
        for(var i=0; i<ar.length; i++)
          func(ar[i], this, i);
        return this;
      },
      raw: {get:function() {
        return ar;
      }},
      reference: {get:function() {
        return reference;
      }}
    });

    // Built-in array methods with polyfills whenever necessary
    ret.extend({
      length: {get: function() {
        return ar.length;
      }},
      concat: function() {
        for(var i=0; i<argument.length; i++) {
          if(arguments[i] instanceof Array)
            ar.concat(arguments[i]);
          else if(arguments[i] instanceof qlist)
            ar.concat(arguments[i]());
        }
      },
      copyWithin: function(target, start, end) {
        if(ar.copyWithin) {
          ar.copyWithin.apply(undefined, arguments);
          return this;
        }

        // Made from polyfillfrom MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
        var len = ar.length >>> 0;
        var relativeTarget = target >> 0;
        var to = relativeTarget < 0 ? Math.max(len + relativeTarget, 0) : Math.min(relativeTarget, len);
        var relativeStart = start >> 0;
        var fr = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
        var relativeEnd = end == undefined ? len : end >> 0;
        var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
        var count = Math.min(final - fr, len - to);
        var direction = 1;
        if(fr < to && to < (fr + count)) {
          direction = -1;
          fr += count - 1;
          to += count - 1;
        }
        for(; count > 0; count--) {
          if(fr in ar)
            ar[to] = ar[fr];
          else
            delete ar[to];

          fr += direction;
          to += direction;
        }

        return this;
      },
      every: function() {
        return ar.every.apply(undefined, arguments);
      },
      fill: function(value, start, end) {
        if(ar.fill) {
          ar.fill.apply(undefined, arguments);
          return this;
        }

        // Made from polyfillfrom MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
        var len = ar.length;
        var relativeStart = start >> 0;
        var i = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
        var relativeEnd = end === undefined ? len : end >> 0;
        var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
        for(; i<final; i++)
          ar[i] = value;

        return this;
      },
      filter: function() {
        return qlist.of(ar.filter.apply(undefined, arguments));
      },
      find: function(callback, thisArg) {
        if(ar.find)
          return ar.find.apply(undefined, arguments);

        // Made from polyfillfrom MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
        if(typeof(callback) != qs.tf)
          throw new TypeError('callback must be a function');
        var length = ar.length >>> 0;
        var value;

        for(var i=0; i<length; i++) {
          value = ar[i];
          if(callback.call(thisArg, value, i, list))
            return value;
        }
        return undefined;
      },
      findIndex: function(callback, thisArg) {
        if(ar.find)
          return ar.find.apply(undefined, arguments);

        // Made from polyfillfrom MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
        if(typeof(callback) != qs.tf)
          throw new TypeError('callback must be a function');
        var length = ar.length >>> 0;

        for(var i=0; i<length; i++)
          if(callback.call(thisArg, ar[i], i, list))
            return i;

        return -1;
      },
      forEach: function() {
        ar.forEach.apply(undefined, arguments);
        return this;
      },
      includes: function(searchElement, fromIndex) {
        if(ar.includes)
          return ar.includes.apply(undefined, arguments);

        // Made from polyfillfrom MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
        var len = ar.length;
        if(len == 0)
          return false;
        fromIndex = fromIndex >>> 0;
        fromIndex = fromIndex >= 0 ? fromIndex : Math.min(len + fromindex, 0);
        for(; fromIndex<len; fromIndex++)
          if(searchElement === ar[fromIndex] || (ar[fromIndex] !== ar[fromIndex] && searchElement !== searchElement))
            return true;
        return false;
      },
      indexOf: function() {
        return ar.indexOf.apply(undefined, arguments);
      },
      join: function() {
        return ar.join.apply(undefined, arguments);
      },
      lastIndexOf: function() {
        return ar.lastIndexOf.apply(undefined, arguments);
      },
      map: function() {
        return qlist.of(ar.map.apply(undefined, arguments));
      },
      pop: function() {
        return ar.pop();
      },
      push: function() {
        return ar.push.apply(undefined, arguments);
      },
      reduce: function() {
        return ar.reduce.apply(undefined, arguments);
      },
      reduceRight: function() {
        return ar.reduceRight.apply(undefined, arguments);
      },
      reverse: function() {
        ar.reverse();
        return this;
      },
      shift: function() {
        return ar.shift();
      },
      slice: function() {
        return qlist.of(ar.slice.apply(undefined, arguments));
      },
      some: function() {
        return ar.some.apply(undefined, arguments);
      },
      sort: function() {
        ar.sort.apply(undefined, arguments);
        return this;
      },
      splice: function() {
        return qlist.of(ar.splice.apply(arguments));
      },
      toLocaleString: function() {
        return ar.toLocaleString();
      },
      toString: function() {
        return ar.toString();
      },
      unshift: function() {
        return ar.unshift.apply(undefined, arguments);
      },
    });

    // Extend all reference functions/properties to ret
    var extendThis;
    (extendThis = function() {
      if(!reference) return;
      var names = (proto = reference.prototype || reference.__proto__).getOwnPropertyNames();
      for(var i=0; i<names.length; i++) (function(m) {
        if(!proto.hasGetOrSet(m) && typeof(proto[m]) == qs.tf) {
          ret[m] = function() {
            var out, tmp, type = 'this', i=0, len = ar.length;

            // Check if 'this' needs to be returned
            if(i in ar) {
              // tmp = proto[m].apply(ar[i], arguments);
              tmp = ar[i][m].apply(ar[i], arguments); // Preferred as it allows for closures
              if(tmp !== ar[i]) {
                type = typeof(tmp);
                out = type == qs.tn ? tmp : [tmp];
              }
            } else return null;

            // Run on the rest of the contained elements
            for(i=1; i<len; i++) {
              // tmp = proto[m].apply(ar[i], arguments);
              tmp = ar[i][m].apply(ar[i], arguments); // Preferred as it allows for closures
              if(type != 'this')
              out.push(tmp);
            }
            if(type == 'this')
            return ret;
            return qlist.from(out);
          }
        } else if(proto.hasGetOrSet(m)) {
          ret.defineProperty(m, {get: function() {
            var out, type, tmp, i=0, len = ar.length;

            if(i in ar) {
              type = typeof(ar[i][m]);
              out = [ar[i][m]];
            } else return null;

            for(i=1; i<len; i++)
            out.push(ar[i][m]);

            return qlist.from(out);
          }});
        }
      })(names[i]);

      if(typeof(reference) == 'number' || reference == Number) {
        ret.extend({
          sum: function() {
            var out = 0;
            for(var i=0; i<ar.length; i++)
              out += ar[i];
            return out;
          },
          avg: function() {
            var out = 0;
            for(var i=0; i<ar.length; i++)
              out += ar[i];
            return out / ar.length;
          },
          prod: function() {
            var out = 1;
            for(var i=0; i<ar.length; i++)
              out *= ar[i];
            return out;
          }
        })
      }
    })()

    // Make sure returned object extends this
    ret.__proto__ = this.__proto__;
    return ret;
  }

  qlist.extend({
    is: function(list) {
      if(list instanceof Array | list instanceof HTMLCollection || list instanceof NodeList) return true;
      return false;
    },
    from: function(arrayLike, reference) {
      var ret = qlist(reference || arrayLike[0]);
      setfunc(Array.from(arrayLike));
      return ret;
    },
    of: function() {
      if(!(0 in arguments))
        throw new RangeError(qs.eNEA);

      var ret = qlist(arguments[0]);
      setfunc(Array.from(arguments));
      return ret;
    }
  });

  return qlist;
})();

var qnet = (function() {
  function qnet(path, verb) {
    this.con = new XMLHttpRequest;
    this.open = false;
    this.data = this.path = this.verb = null;
    if(q.is(path)) {
      this.path = path || this.path;
      this.verb = ver || this.verb;
      this.con.open(this.verb || 'GET', this.path);
      this.open = true;
    }
  }
  qnet.prototype.extend({
    onload: new qevent(),
    onstatechange: new qevent(),
    send: function(data, path, verb) {
      var con = this.con, t = this;
      if(!this.open) {
        if(!(path || this.path))
          throw new ReferenceError('path is not set');
        this.path = path || this.path;
        this.verb = verb || this.verb;
        con.open(this.ver || 'Get', this.path);
      }
      con.addEventListener('readystatechange', function() {
        t.data = con.response;
        t.onstatechange.t(con.response);
        if(con.readyState == 4) t.onload.t(con.response);
      });
      con.send(data);
      return this;
    },
    open: function(path, verb) {
      if(!this.open) {
        this.con.open(verb || 'GET', path);
        this.open = true;
      }
      return this;
    }
  });
  qnet.extend({
    getJson: function(url) {
      return qPromise(function(resolve, reject) {
        var client = new XMLHttpRequest;
        client.open('GET', url);
        client.onreadystatechange = function() {
          if(client.readyState == 4)
            if(client.status == 200)
              resolve(this.response);
            else reject(this);
        }
        client.responseType = 'json';
        client.setReqjestHeader('Accept', 'application/json');
        client.send();
      });
    }
  });
  return qnet;
})();

q.onready(function() {
  var styles = getComputedStyle(document.body);
  qs.styles = [];
  qs.styleAliases = {};
  for(var i=0; i<styles.length; i++) {
    qs.styles.push(styles[i]);
    if(styles[i][0] == '-')
      qs.styleAliases[styles[i].substr(styles[i].indexOf('-', 1) + 1)] = styles[i];
  }
})(q.registerEventHandlers);

document.addEventListener('DOMContentLoaded', function() {
  q.onready('DOMContentLoaded');
  q.defineProperty('loaded', {value: true});
});
document.addEventListener('load', function() {
  if(!q.loaded) {
    q.onready('load');
    q.onload();
    q.defineProperty('loaded', {value: true});
  }
})
