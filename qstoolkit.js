/*
  Q's JavaScript Toolkit v0.4.2
  A generic alternative to jQuery, allowing some amazing chaining.
  Instructions for compressing:
    Make sure all functions have aliases
    Replace all functions with their shortened aliases
    Replace all "new qelement"s with the newq function
    Put this through jscompress.com
*/


'use strict';

//RSVP.js
(function(){"use strict";function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function n(t){return"function"==typeof t}function r(t){return"object"==typeof t&&null!==t}function e(){}function o(t,n){for(var r=0,e=t.length;e>r;r++)if(t[r]===n)return r;return-1}function i(t){var n=t._promiseCallbacks;return n||(n=t._promiseCallbacks={}),n}function u(t,n){return"onerror"===t?void jt.on("error",n):2!==arguments.length?jt[t]:void(jt[t]=n)}function s(){setTimeout(function(){for(var t,n=0;n<Tt.length;n++){t=Tt[n];var r=t.payload;r.guid=r.key+r.id,r.childGuid=r.key+r.childId,r.error&&(r.stack=r.error.stack),jt.trigger(t.name,t.payload)}Tt.length=0},50)}function a(t,n,r){1===Tt.push({name:t,payload:{key:n._guidKey,id:n._id,eventName:t,detail:n._result,childId:r&&r._id,label:n._label,timeStamp:bt(),error:jt["instrument-with-stack"]?new Error(n._label):null}})&&s()}function c(t,n,r){var e=this,o=e._state;if(o===Dt&&!t||o===Kt&&!n)return jt.instrument&&St("chained",e,e),e;e._onError=null;var i=new e.constructor(g,r),u=e._result;if(jt.instrument&&St("chained",e,i),o){var s=arguments[o-1];jt.async(function(){x(o,i,s,u)})}else R(e,i,t,n);return i}function f(t,n){var r=this;if(t&&"object"==typeof t&&t.constructor===r)return t;var e=new r(g,n);return S(e,t),e}function l(t,n,r){return t===Dt?{state:"fulfilled",value:r}:{state:"rejected",reason:r}}function h(t,n,r,e){this._instanceConstructor=t,this.promise=new t(g,e),this._abortOnReject=r,this._validateInput(n)?(this._input=n,this.length=n.length,this._remaining=n.length,this._init(),0===this.length?C(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&C(this.promise,this._result))):O(this.promise,this._validationError())}function p(t,n){return new Ot(this,t,!0,n).promise}function _(t,n){function r(t){S(i,t)}function e(t){O(i,t)}var o=this,i=new o(g,n);if(!gt(t))return O(i,new TypeError("You must pass an array to race.")),i;for(var u=t.length,s=0;i._state===Yt&&u>s;s++)R(o.resolve(t[s]),void 0,r,e);return i}function v(t,n){var r=this,e=new r(g,n);return O(e,t),e}function y(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function d(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function m(t,n){this._id=xt++,this._label=n,this._state=void 0,this._result=void 0,this._subscribers=[],jt.instrument&&St("created",this),g!==t&&("function"!=typeof t&&y(),this instanceof m?N(this,t):d())}function w(){return new TypeError("A promises callback cannot return that same promise.")}function g(){}function b(t){try{return t.then}catch(n){return Ut.error=n,Ut}}function E(t,n,r,e){try{t.call(n,r,e)}catch(o){return o}}function A(t,n,r){jt.async(function(t){var e=!1,o=E(r,n,function(r){e||(e=!0,n!==r?S(t,r,void 0):C(t,r))},function(n){e||(e=!0,O(t,n))},"Settle: "+(t._label||" unknown promise"));!e&&o&&(e=!0,O(t,o))},t)}function j(t,n){n._state===Dt?C(t,n._result):n._state===Kt?(n._onError=null,O(t,n._result)):R(n,void 0,function(r){n!==r?S(t,r,void 0):C(t,r)},function(n){O(t,n)})}function T(t,r,e){r.constructor===t.constructor&&e===kt&&constructor.resolve===Ct?j(t,r):e===Ut?O(t,Ut.error):void 0===e?C(t,r):n(e)?A(t,r,e):C(t,r)}function S(n,r){n===r?C(n,r):t(r)?T(n,r,b(r)):C(n,r)}function k(t){t._onError&&t._onError(t._result),I(t)}function C(t,n){t._state===Yt&&(t._result=n,t._state=Dt,0===t._subscribers.length?jt.instrument&&St("fulfilled",t):jt.async(I,t))}function O(t,n){t._state===Yt&&(t._state=Kt,t._result=n,jt.async(k,t))}function R(t,n,r,e){var o=t._subscribers,i=o.length;t._onError=null,o[i]=n,o[i+Dt]=r,o[i+Kt]=e,0===i&&t._state&&jt.async(I,t)}function I(t){var n=t._subscribers,r=t._state;if(jt.instrument&&St(r===Dt?"fulfilled":"rejected",t),0!==n.length){for(var e,o,i=t._result,u=0;u<n.length;u+=3)e=n[u],o=n[u+r],e?x(r,e,o,i):o(i);t._subscribers.length=0}}function M(){this.error=null}function P(t,n){try{return t(n)}catch(r){return qt.error=r,qt}}function x(t,r,e,o){var i,u,s,a,c=n(e);if(c){if(i=P(e,o),i===qt?(a=!0,u=i.error,i=null):s=!0,r===i)return void O(r,w())}else i=o,s=!0;r._state!==Yt||(c&&s?S(r,i):a?O(r,u):t===Dt?C(r,i):t===Kt&&O(r,i))}function N(t,n){var r=!1;try{n(function(n){r||(r=!0,S(t,n))},function(n){r||(r=!0,O(t,n))})}catch(e){O(t,e)}}function Y(t,n,r){this._superConstructor(t,n,!1,r)}function D(t,n){return new Y(Nt,t,n).promise}function K(t,n){return Nt.all(t,n)}function U(t,n){Xt[Wt]=t,Xt[Wt+1]=n,Wt+=2,2===Wt&&Gt()}function q(){var t=process.nextTick,n=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);return Array.isArray(n)&&"0"===n[1]&&"10"===n[2]&&(t=setImmediate),function(){t(W)}}function F(){return function(){Ft(W)}}function G(){var t=0,n=new Ht(W),r=document.createTextNode("");return n.observe(r,{characterData:!0}),function(){r.data=t=++t%2}}function L(){var t=new MessageChannel;return t.port1.onmessage=W,function(){t.port2.postMessage(0)}}function V(){return function(){setTimeout(W,1)}}function W(){for(var t=0;Wt>t;t+=2){var n=Xt[t],r=Xt[t+1];n(r),Xt[t]=void 0,Xt[t+1]=void 0}Wt=0}function $(){try{var t=require,n=t("vertx");return Ft=n.runOnLoop||n.runOnContext,F()}catch(r){return V()}}function z(t){var n={};return n.promise=new Nt(function(t,r){n.resolve=t,n.reject=r},t),n}function B(t,n){return Nt.all(t,n)}function H(t,n){return Nt.resolve(t,n).then(function(t){return B(t,n)})}function J(t,r,e){var o=gt(t)?B(t,e):H(t,e);return o.then(function(t){if(!n(r))throw new TypeError("You must pass a function as filter's second argument.");for(var o=t.length,i=new Array(o),u=0;o>u;u++)i[u]=r(t[u]);return B(i,e).then(function(n){for(var r=new Array(o),e=0,i=0;o>i;i++)n[i]&&(r[e]=t[i],e++);return r.length=e,r})})}function Q(t,n,r){this._superConstructor(t,n,!0,r)}function X(t,n,r){this._superConstructor(t,n,!1,r)}function Z(t,n){return new X(Nt,t,n).promise}function tt(t,n){return new nn(Nt,t,n).promise}function nt(t,r,e){return Nt.all(t,e).then(function(t){if(!n(r))throw new TypeError("You must pass a function as map's second argument.");for(var o=t.length,i=new Array(o),u=0;o>u;u++)i[u]=r(t[u]);return Nt.all(i,e)})}function rt(){this.value=void 0}function et(t){try{return t.then}catch(n){return sn.value=n,sn}}function ot(t,n,r){try{t.apply(n,r)}catch(e){return sn.value=e,sn}}function it(t,n){for(var r,e,o={},i=t.length,u=new Array(i),s=0;i>s;s++)u[s]=t[s];for(e=0;e<n.length;e++)r=n[e],o[r]=u[e+1];return o}function ut(t){for(var n=t.length,r=new Array(n-1),e=1;n>e;e++)r[e-1]=t[e];return r}function st(t,n){return{then:function(r,e){return t.call(n,r,e)}}}function at(t,n){var r=function(){for(var r,e=this,o=arguments.length,i=new Array(o+1),u=!1,s=0;o>s;++s){if(r=arguments[s],!u){if(u=lt(r),u===an){var a=new Nt(g);return O(a,an.value),a}u&&u!==!0&&(r=st(u,r))}i[s]=r}var c=new Nt(g);return i[o]=function(t,r){t?O(c,t):void 0===n?S(c,r):n===!0?S(c,ut(arguments)):gt(n)?S(c,it(arguments,n)):S(c,r)},u?ft(c,i,t,e):ct(c,i,t,e)};return r.__proto__=t,r}function ct(t,n,r,e){var o=ot(r,e,n);return o===sn&&O(t,o.value),t}function ft(t,n,r,e){return Nt.all(n).then(function(n){var o=ot(r,e,n);return o===sn&&O(t,o.value),t})}function lt(t){return t&&"object"==typeof t?t.constructor===Nt?!0:et(t):!1}function ht(t,n){return Nt.race(t,n)}function pt(t,n){return Nt.reject(t,n)}function _t(t,n){return Nt.resolve(t,n)}function vt(t){throw setTimeout(function(){throw t}),t}function yt(t,n){jt.async(t,n)}function dt(){jt.on.apply(jt,arguments)}function mt(){jt.off.apply(jt,arguments)}var wt;wt=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var gt=wt,bt=Date.now||function(){return(new Date).getTime()},Et=Object.create||function(t){if(arguments.length>1)throw new Error("Second argument not supported");if("object"!=typeof t)throw new TypeError("Argument must be an object");return e.prototype=t,new e},At={mixin:function(t){return t.on=this.on,t.off=this.off,t.trigger=this.trigger,t._promiseCallbacks=void 0,t},on:function(t,n){if("function"!=typeof n)throw new TypeError("Callback must be a function");var r,e=i(this);r=e[t],r||(r=e[t]=[]),-1===o(r,n)&&r.push(n)},off:function(t,n){var r,e,u=i(this);return n?(r=u[t],e=o(r,n),void(-1!==e&&r.splice(e,1))):void(u[t]=[])},trigger:function(t,n,r){var e,o,u=i(this);if(e=u[t])for(var s=0;s<e.length;s++)(o=e[s])(n,r)}},jt={instrument:!1};At.mixin(jt);var Tt=[],St=a,kt=c,Ct=f,Ot=h;h.prototype._validateInput=function(t){return gt(t)},h.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},h.prototype._init=function(){this._result=new Array(this.length)},h.prototype._enumerate=function(){for(var t=this.length,n=this.promise,r=this._input,e=0;n._state===Yt&&t>e;e++)this._eachEntry(r[e],e)},h.prototype._settleMaybeThenable=function(t,n){var r=this._instanceConstructor,e=r.resolve;if(e===Ct){var o=b(t);if(o===kt&&t._state!==Yt)t._onError=null,this._settledAt(t._state,n,t._result);else if("function"!=typeof o)this._remaining--,this._result[n]=this._makeResult(Dt,n,t);else if(r===Nt){var i=new r(g);T(i,t,o),this._willSettleAt(i,n)}else this._willSettleAt(new r(function(n){n(t)}),n)}else this._willSettleAt(e(t),n)},h.prototype._eachEntry=function(t,n){r(t)?this._settleMaybeThenable(t,n):(this._remaining--,this._result[n]=this._makeResult(Dt,n,t))},h.prototype._settledAt=function(t,n,r){var e=this.promise;e._state===Yt&&(this._remaining--,this._abortOnReject&&t===Kt?O(e,r):this._result[n]=this._makeResult(t,n,r)),0===this._remaining&&C(e,this._result)},h.prototype._makeResult=function(t,n,r){return r},h.prototype._willSettleAt=function(t,n){var r=this;R(t,void 0,function(t){r._settledAt(Dt,n,t)},function(t){r._settledAt(Kt,n,t)})};var Rt=p,It=_,Mt=v,Pt="rsvp_"+bt()+"-",xt=0,Nt=m;m.cast=Ct,m.all=Rt,m.race=It,m.resolve=Ct,m.reject=Mt,m.prototype={constructor:m,_guidKey:Pt,_onError:function(t){var n=this;jt.after(function(){n._onError&&jt.trigger("error",t,n._label)})},then:kt,"catch":function(t,n){return this.then(void 0,t,n)},"finally":function(t,n){var r=this,e=r.constructor;return r.then(function(n){return e.resolve(t()).then(function(){return n})},function(n){return e.resolve(t()).then(function(){return e.reject(n)})},n)}};var Yt=void 0,Dt=1,Kt=2,Ut=new M,qt=new M;Y.prototype=Et(Ot.prototype),Y.prototype._superConstructor=Ot,Y.prototype._makeResult=l,Y.prototype._validationError=function(){return new Error("allSettled must be called with an array")};var Ft,Gt,Lt=D,Vt=K,Wt=0,$t=({}.toString,U),zt="undefined"!=typeof window?window:void 0,Bt=zt||{},Ht=Bt.MutationObserver||Bt.WebKitMutationObserver,Jt="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),Qt="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,Xt=new Array(1e3);Gt=Jt?q():Ht?G():Qt?L():void 0===zt&&"function"==typeof require?$():V();var Zt=z,tn=J,nn=Q;Q.prototype=Et(Ot.prototype),Q.prototype._superConstructor=Ot,Q.prototype._init=function(){this._result={}},Q.prototype._validateInput=function(t){return t&&"object"==typeof t},Q.prototype._validationError=function(){return new Error("Promise.hash must be called with an object")},Q.prototype._enumerate=function(){var t=this,n=t.promise,r=t._input,e=[];for(var o in r)n._state===Yt&&Object.prototype.hasOwnProperty.call(r,o)&&e.push({position:o,entry:r[o]});var i=e.length;t._remaining=i;for(var u,s=0;n._state===Yt&&i>s;s++)u=e[s],t._eachEntry(u.entry,u.position)},X.prototype=Et(nn.prototype),X.prototype._superConstructor=Ot,X.prototype._makeResult=l,X.prototype._validationError=function(){return new Error("hashSettled must be called with an object")};var rn,en=Z,on=tt,un=nt,sn=new rt,an=new rt,cn=at;if("object"==typeof self)rn=self;else{if("object"!=typeof global)throw new Error("no global: `self` or `global` found");rn=global}var fn=rn,ln=ht,hn=pt,pn=_t,_n=vt;jt.async=$t,jt.after=function(t){setTimeout(t,0)};if("undefined"!=typeof window&&"object"==typeof window.__PROMISE_INSTRUMENTATION__){var vn=window.__PROMISE_INSTRUMENTATION__;u("instrument",!0);for(var yn in vn)vn.hasOwnProperty(yn)&&dt(yn,vn[yn])}var dn={race:ln,Promise:Nt,allSettled:Lt,hash:on,hashSettled:en,denodeify:cn,on:dt,off:mt,map:un,filter:tn,resolve:pn,reject:hn,all:Vt,rethrow:_n,defer:Zt,EventTarget:At,configure:u,async:yt};"function"==typeof define&&define.amd?define(function(){return dn}):"undefined"!=typeof module&&module.exports?module.exports=dn:"undefined"!=typeof fn&&(fn.RSVP=dn)}).call(this);
Promise = RSVP.Promise;

//Actual toolkit
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};
Object.prototype.getKeys = function() {return Object.keys(this);}
Object.prototype.defineProperty = function(prop, descriptor) {return Object.defineProperty(this, prop, descriptor);}
Object.prototype.getOwnPropertyNames = function() {return Object.getOwnPropertyNames(this);}
Object.prototype.getOwnPropertyDescriptor = function(prop) {return Object.getOwnPropertyDescriptor(this, prop);}
Object.prototype.hasGetOrSet = function(prop) {
  if('get' in this.getOwnPropertyDescriptor(prop)) return true;
  return false;
}
Object.prototype.equals = function (to) {
  if(typeof(to) != qs.to) return null;
  var paths = [this.path(), to.path()];
  var arrs = [];
  var tmp;
  var keys = [paths[0].getKeys(), paths[1].getKeys()];
  //Length Test
  if(keys[0].length != keys[1].length) return false;
  //Key Test
  for(var a=0; a<keys[0].length; a++) {
    if(keys[1].indexOf(keys[0][a]) == -1) return false;
  }
  //Value Tests
  for(var i = 0; i<keys[0].length; i++) {
    //Get array from address
    arrs = [this, to];
    tmp = keys[0][i].split('.');
    for(var a=0; a<tmp.length; a++) {
      console.log(arrs[0]);
      arrs[0] = arrs[0][tmp[a]];
      arrs[1] = arrs[1][tmp[a]];
    }
    for(var a in arrs[0]) {
      if(typeof(arrs[0][a]) != typeof(arrs[1][a])) return false;
      if(typeof(arrs[0][a]) != qs.to &&  arrs[0][a] !== arrs[1][a]) return false;
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
    for(i=0; i<stack.length; i++) ar = ar[stack[i]];

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
          if(a == (badar = badar[stack[j]])) isbad = true;

        if(!isbad) {
          stack.push(keys[i]);
          rm = false;
          break;
        }
      } else {
        //Add current path to output
        // Get text path if it doesn't yet exist
        if(!s) for(var j=0; j<stack.length; j++) s += (j>0?'.':'') + stack[j];
        out[s + (s.length > 0 ? '.' : '') + keys[i]] = a;
        rm = true;
      }
    }
    // Go back a layer in the tree, reached the end
    if(rm) {
      if(stack.length == 0) return out;
      prev = stack.pop();
    }
  }
}
Object.prototype.extend = function(append) {
  if(typeof(append) != qs.to) throw new TypeError('Not a valid Object');
  var keys = append.getKeys(), akey, cur;
  for(var i=0; i<keys.length; i++) {
    if(typeof(cur = append[keys[i]]) == qs.to) {
      akey = cur.getKeys();
      // Allow getters and setters
      if((akey.length == 2 && 'get' in cur && 'set' in cur) || (akey.length == 1 && ('get' in cur || 'set' in cur))) this.defineProperty(keys[i], cur);
      else this[keys[i]] = cur;
    } else this[keys[i]] = cur;
  }
}
Object.prototype.keyOf = function(value) {
  var keys = this.getKeys(), v;
  for(var i=0; i<keys.length; i++) {
    if((v = this[keys[i]]) == value) return keys[i];
  }
  return -1;
}
String.prototype.containsAny = function(find, begin) {
  if(typeof(find) == qs.ts) {
    for(var i=0; i<find.length; i++) {
      if(this.indexOf(find[i], begin) != -1) return true;
    }
  } else if(typeof(find) == qs.to) {
    var keys = find.getKeys();
    for(var i=0; i<keys.length; i++) {
      if(this.indexOf(find[keys[i]], begin) != -1) return true;
    }
  }
  return false;
}
String.prototype.containsOnly = function(find, i) {
  i = i || 0;
  if(typeof(find) == qs.ts) {
    for(; i<this.length; i++) {
      if(find.indexOf(this[i]) != -1) return false;
    }
  } else if(typeof(find) == qs.to) {
    var keys = this.getKeys();
    for(; i<this.length; i++) {
      if(find.indexOf(this[keys[i]]) != -1) return false;
    }
  }
  return true;
}
Object.prototype.if = function(condition, func) {
  if(condition) {
    func(this);
  }
  return this;
}
Object.prototype.for = function(start, end, func) {
  for(var i=start; i<end; i++) {
    func(i, this);
  }
  return this;
}
Object.prototype.foreach = function(func) {
  var keys = this.getKeys();
  for(var i=0; i<keys.length; i++) {
    func(this[keys[i]], this, keys[i]);
  }
  return this;
}
Object.prototype.applyNew = function(args) {
  return new (Function.prototype.bind.apply(this, args));
}
Object.prototype.callNew = function() {
  return new (Function.prototype.bind.apply(this, arguments));
}
KeyboardEvent.prototype.getKey = function(force) {
  if(!force && 'key' in this) return this.key;
  var key = qs.keys[this.which || this.keyCode];
  if(typeof(key) == qs.to) key = key[+this.shiftKey];
  return key;
}
Number.prototype.bound = function(lower, higher) {
  if(lower > higher) {
    var t = higher;
    higher = lower;
    lower = t;
  }
  return Math.min(higher, Math.max(lower, this));
}
window.events = [];
window.on = function(name, func, callNow) {
  if(typeof(name) == qs.to) {
    for(var i=0; i<name.length; i++) {
      this.on(name[i], func, callNow);
    }
    return this;
  }
  if(!(name in this.events)) this.events[name] = new qevent({'attachTo': this, 'name': name});
  if(!q.is(func)) return this.events[name];
  if(callNow) func();
  this.events[name].push(func);
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
(function() {
  var i;
  for(i=1; i<25; i++) qs.keys[111+i] = 'F' + i;
  var letter = '';
  for(i = 65; i<91; i++) qs.keys[i] = [(letter = String.fromCharCode(i)).toLowerCase(), letter];
})();
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
  /*
    Options:
      attachTo - element to attach to
      name - name of event to attach to
      once - trigger only once?
      */
  function qevent(options) {
    options = options || [];
    var handlers = [];
    this.triggered = false;
    if('attachTo' in options) (options['attachTo'].em || options['attachTo']).addEventListener(options['name'], function() {
      this.triggered = true;
    });
    function event(func, vars) {
      if(vars) {
        var a = arguments;
        return new Promise(function(resolve) {
          event.t.apply(event, a);
          resolve();
        });
      } else {
        if(typeof(func) == qs.tf) {
          if(options['once'] && this.triggered) {
            func();
            var ret = function(func2) {func2(); return ret};
            return ret;
          } else {
            var f = function(func1) {
              f.execute = function(args) {
                func1.apply(undefined, args);
                if(next.execute) next.execute(args);
              }
              var set;
              var next = function(func2) {
                var next2 = set.clone();
                set.execute = function(args) {
                  func2.apply(undefined, args);
                  if(next2.execute) next2.execute(args);
                }
                set = next2;
                return next2;
              }
              set = next;
              return next;
            }
            handlers.push(function() {
              var ret = func.apply(undefined, arguments);
              if(f.execute) f.execute(arguments);
              return ret;
            });
            f.id = handlers.length - 1;
            return f;
          }
        } else if(func !== null) {
          var a = arguments;
          return new Promise(function(resolve) {
            event.t.apply(event, a);
            resolve();
          });
        } else return new Promise(function(resolve) {
          event.t();
          resolve();
        })
      }
    }
    event.extend({
      trigger: function() {
        var arr = arguments, t = this;
        return new Promise(function(resolve) {
          for(var i=0; i<handlers.length; i++) {
            if(handlers[i] != null) handlers[i].apply(undefined, arr);
          }
          t.triggered = true;
          resolve();
        });
      },
      //Returns id for handler
      push: function(handler, callNow) {
        if(typeof(handler) != qs.tf) throw new TypeError(qs.eFunc);
        if(options['once'] && this.triggered) {
          handler();
          return null;
        } else {
          var func = handler;
          if(callNow) func();
          var f = function(func1) {
            if(callNow) func1();
            f.execute = function(args) {
              func1.apply(undefined, args);
              if(next.execute) next.execute(args);
            }
            var set;
            var next = function(func2) {
              var next2 = set.clone();
              if(callNow) func2();
              set.execute = function(args) {
                func2.apply(undefined, args);
                if(next2.execute) next2.execute(args);
              }
              set = next2;
              return next2;
            }
            set = next;
            return next;
          }
          handlers.push(function() {
            var ret = func.apply(undefined, arguments);
            if(f.execute) f.execute(arguments);
            return ret;
          });
          if('attachTo' in options) (options['attachTo'].em || options['attachTo']).addEventListener(options['name'], function(e) {
            var ret = func.call(func, e, options['attachTo']);
            if(f.execute) f.execute(e, options['attachTo']);
            if(ret === false) e.preventDefault();
            return ret;
          });
          f.id = handlers.length - 1;
          return f;
        }
      },
      pop: function() {
        var out = handlers.pop();
        if('attachTo' in options) (options['attachTo'].em || options['attachTo']).removeEventListener(options['name'], out);
        return out;
      },
      // TODO: Combine both functions below?
      // TODO: Allow returned extend function to be a valid argumentdf
      remove: function(handler) {
        if(typeof(handler) != qs.tf) throw new TypeError(qs.eFunc);
        if('attachTo' in options) (options['attachTo'].em || options['attachTo']).removeEventListener(options['name'], handlers[handlers.indexOf(handler)]);
        handlers[handlers.indexOf(handler)] = null;
      },
      removeAt: function(index) {
        if(typeof(index) != qs.tn) throw new TypeError(qs.eNum);
        if('attachTo' in options) (options['attachTo'].em || options['attachTo']).removeEventListener(options['name'], handlers[index]);
        handlers[index] = null;
      },
      clear: function() {
        for(var i=0; i<handlers.length; i++) {
          handlers[i] = null;
        }
        return this;
      },
      names: { get: function() {
        var out = {};
        for(var i=0; i<handlers.length; i++) {
          out[handlers[i].name] = handlers[i];
        }
        return out;
      } },
    });
    //Aliases
    event.extend({
      rem: event.remove,
      remAt: event.removeAt,
      t: event.trigger
    });
    return event;
  }
  return qevent;
})();
var qevents = (function() {
  function qevents() {
    this.events = {};
    for(var x=0; x<arguments.length; x++) {
      var tmp = arguments[x];
      if(typeof(tmp) == qs.to) {
        if(tmp instanceof Array) {
          for(var y=0; y<tmp.length; y++) {
            if(typeof(tmp[y]) == qs.ts) this.events[tmp[y]] = new qevent();
          }
        } else {
          var keys = tmp.getKeys();
          for(var y=0; y<keys.length; y++) {
            if(typeof(keys[y]) == qs.ts) this.events[keys[y]] = new qevent(tmp[keys[y]]);
          }
        }
      }
    }
  }
  qevents.prototype.extend({
    on: function(name, func, callNow) {
      if(typeof(name) == qs.to) {
        for(var i=0; i<name.length; i++) {
          this.on(name[i], func, callNow);
        }
        return this;
      }
      if(!(name in this.events)) throw new ReferenceError('Event ' + name + ' does not exist');
      if(!q.is(func)) return this.em.events[name];
      if(callNow) func();
      this.events[name].push(func);
      return this;
    },
    addEvent: function(name, options) {
      this.events[name] = new qevent(name, options);
      return this;
    },
    remEvent: function(name) {
      if(name in this.events) this.events[name].clear();
      this.events[name] = null;
      return this;
    }
  });
  qevents.prototype.extend({
    a: qevents.prototype.addEvent,
    r: qevents.prototype.remEvent
  })
  return qevents;
})();
//Cached selection
var qc = (function() {
  var cache = [];

  function tocache(element, selector, extraTime, searchIn) {
    searchIn = searchIn || document;
    cache.push({element: element, time: Date.now() + extraTime, selector: selector, searchIn: searchIn});
    if(cache.length >= qsettings.cacheLength) cache.splice(0, 1);
    return element;
  }

  function cacheGC() {
    for(var i=0; i<cache.length;) {
      if(i >= qsettings.cacheLength || Date.now() - cache[i].time > qsettings.cacheTimeout) cache.splice(i, 1);
      else i++;
    }
    setTimeout(cacheGC, qsettings.cacheGCInterval);
  }
  setTimeout(cacheGC, qsettings.cacheGCInterval);


  function qc(selector, extraTime, searchIn) {
    extraTime = extraTime || 0;
    //searchIn Validation and Formatting
    var search = ((searchIn instanceof qelement ? searchIn.em : searchIn) || document);
    if(searchIn && !qelement.isem(searchIn)) throw new TypeError(qs.eNd);
    //Cache
    for(var i=0; i<cache.length; i++) {
      if(cache[i].selector == selector && (searchIn || document) == cache[i].searchIn) return cache[i].element;
      // Garbage collector has moved for efficiency
    }
    //Validation and qelement creation
    if(selector instanceof HTMLElement) return tocache(newq(selector), selector, extraTime, searchIn);
    if(qlist.is(selector)) return tocache(new qlist(selector), selector, extraTime, searchIn);
    if(typeof(selector) != qs.ts) throw new TypeError(qs.eSelOrEm);
    //getElementById shortcut
    if(selector[0] == '#' && selector.substr(1).toLowerCase().containsOnly(qs.fId)) return tocache(newq(search.getElementById(selector.substr(1))), selector, extraTime, searchIn);
    //Querying
    var results = search.querySelectorAll(selector);
    if(results.length == 0) return null;
    if(results.length == 1) return tocache(newq(results[0]), selector, extraTime, searchIn);
    return tocache(new qlist(results), selector, extraTime, searchIn);
  }
  qc.extend({
    cClear: function() {
      if(arguments.length > 0) {
        for(var i=0; i<cache.length; i++) {
          for(var a=0; a<arguments.length; a++) {
            if(cache[i].selector == arguments[a]) cache.splice(i, 1);
          }
        }
      } else cache = [];
    }
  });

  return qc;
})();
var q = (function() {
  var sbarWidth, oref = 0;
  function q(selector, searchIn, forceList) {
    //searchIn Validation and Formatting
    var search = ((searchIn instanceof qelement ? searchIn.em : searchIn) || document);
    if(searchIn && !qelement.isem(searchIn)) throw new TypeError(qs.eNd);
    //Validation and qelement creation
    if(selector instanceof HTMLElement) return newq(selector);
    if(qlist.is(selector)) return new qlist(selector);
    if(typeof(selector) != qs.ts) throw new TypeError(qs.eSelorEm);
    //getElementById shortcut
    if(selector[0] == '#' && selector.substr(1).toLowerCase().containsOnly(qs.fId)) return newq(search.getElementById(selector.substr(1)));
    //Querying
    var results = search.querySelectorAll(selector);
    if(forceList) return new qlist(results);
    if(results.length == 0) return null;
    if(results.length == 1) return newq(results[0]);
    return new qlist(results);
  }

  function bezier(t, x1, y1, x2, y2) {
    return {
      x: 3*t*(x1+t*(x2-2*x1+t*(1/3+x1-x2))),
      y: 3*t*(y1+t*(y2-2*y1+t*(1/3+y1-y2)))
    }
  }
  var detect;

  // From ellisbben (StackOverflow)
  q.extend({
    set: function(key, value) {
      localStorage.setItem(key, value || '');
    },
    get: function(key) {
      return localStorage.getItem(key);
    },
    setup: function(options) {
      var keys = options.getKeys();
      for(var i=0; i<keys.length; i++) {
        qsettings[keys[i]] = options[keys[i]];
      }
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
      stackBack += 2;
      stack = (new Error('')).stack.split('\n');
      if(!stackBack in stack) throw new RangeError('Stack index ' + stackBack + ' exceeds stack length');
      call = stack[stackBack];
      clean = call.slice(call.indexOf('at ')+3, call.length);
      isNative = clean.containsAny(['(native)']);
      hasName = /.+ \(.+\)/.test(clean);
      col = clean.lastIndexOf(':');
      line = clean.lastIndexOf(':', col - 1) + 1;
      script = clean.slice(hasName ? clean.indexOf('(') + 1 : 0, line-1); // )
      return {
        isNative: isNative,
        func: clean.slice(0, clean.indexOf(' ')),
        hasName: hasName,
        script: script,
        line: isNative ? '(native)' : clean.slice(line, col),
        col: isNative ? '(native)' : clean.slice(col + 1, hasName ? clean.length - 1 : undefined),
        raw: clean,
        file: script.slice(script.lastIndexOf('/') + 1)
      };
    },
    scrollbarWidth: { get: function() {
      if(sbarWidth) return sbarWidth;
      var inner, outer;
      qc('body').a(outer = newq('div').style('position', 'absolute').style('top', '0').style('left', '0').style('visibility', 'hidden').style('width', '200px').style('height', '150px').style('overflow', 'hidden').a(inner = newq('p').style('width', '100%').style('height', '200px')));
      var w1 = inner.width, w2;
      outer.style('overflow', 'scroll');
      w2 = inner.width;
      if(w1 == w2) w2 = outer.clientWidth;
      outer.detach();
      return sbarWidth = w1-w2;
    } },
    loaded: false,
    onready: new qevent({once: true}),
    onload: new qevent({once: true}),
    registerEventHandlers: function(searchIn) {
      if(!qelement.is(searchIn)) searchIn = null;
      var ems = q('*[qclick]', searchIn);
      if(!ems) return;
      if(ems instanceof qelement) ems.on('click', window[ems.attr('qclick')]);
      else
        for(var i=0; i<ems.length; i++) {
          ems[i].on('click', window[ems[i].attr('qclick')]);
        }
    },
    is: function() {
      var alen = arguments.length;
      for(var i=0; i<alen; i++) {
        if(arguments[i] === undefined) return false;
      }
      return true;
    },
    demoAnimation: function(animations, name) {
      if(name) {
        var s = window.localStorage.getItem('q');
        if(s == null || s == '') s = [];
        if(s[name] == true) return;
        s[name] = false;
        window.localStorage.setItem('q', s);
      }
      var i = 0, len = animations.length - 1, exit = false, t;
      var run = function() {
        var em, styles, tmp;
        for(var p=0; p<animations[i].properties.length; p++) {
          var em = animations[i].properties[p].em;
          var styles = animations[i].properties[p].styles.split(';');
          for(var a=0; a<styles.length; a++) {
            tmp = styles[a].split(':');
            if(tmp != '') em.style(tmp[0], tmp[1]);
          }
        }
        if(!exit) t = q.async(run, animations[i].time);
        i++;
        if(i >= len) i = i % len;
      }
      t = q.async(run, animations[i].time);
      function callback() {
        clearTimeout(t);
        exit = true;
        var tmp;
        if(name) {
          var s = window.localStorage.getItem('q');
          if(s == null || s == '') s = [];
          s[name] = true;
          // window.localStorage.setItem('q', s);
        }
        for(var p=0; p<animations[len].properties.length; p++) {
          var em = animations[len].properties[p].em;
          var styles = animations[len].properties[p].styles.split(';');
          for(var a=0; a<styles.length; a++) {
            tmp = styles[a].split(':');
            if(tmp != '') em.style(tmp[0], tmp[1]);
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
    else if(qelement.is(element)) this.em = element;
    else throw new TypeError(qs.eNdOrTag);
    if(typeof(this.em.events) != qs.to) this.em.events = {};
    if(typeof(this.em.devents) != qs.to) this.em.devents = {};
    // if(typeof(this.em.extensions) == qs.to) this.extend(this.em.extensions);
    // TODO: Make the statement above faster
  }
  function css(a, y) {
    if(!q.is(a)) return '';
    return (typeof(a) == qs.tn ? a.toFixed(3) + qsettings.defaultCSSUnits.length : a.trim());
  }
  qelement.extend({
    fromNodes: function(nodelist) {
      if(nodelist instanceof HTMLElement) return makeq(nodelist);
      if(nodelist instanceof qlist) return nodelist;
      if(!(nodelist instanceof HTMLCollection || nodelist instanceof NodeList || nodelist instanceof Array)) throw new TypeError(qs.eList);
      return new qlist(nodelist);
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
      return (test instanceof HTMLElement || test instanceof qelement || typeof(test) == qs.ts);
    }
  });
  qelement.onextensions = {
    resize: function(me, ev) {
      var style = {
        position: 'absolute',
        left: '0',
        top: '0',
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
        sensor = me.a('div').classes('resize-sensor').style(style).a(
          expand = newq('div').classes('resize-sensor-expand').style(style).a(
            expandChild = newq('div').style(styleChild).style({width: '100000px', height: '100000px'})
          )
        ).a(
          shrink = newq('div').classes('resize-sensor-shrink').style(style).a(
            newq('div').style(styleChild).style({width: '200%', height: '200%'})
          )
        )
      );
      if(me.computedStyle('position') == 'static') me.style('position', 'relative');
      shrink.em.scrollLeft = 100000;
      shrink.em.scrollTop = 100000;
      expand.em.scrollLeft = 100000;
      expand.em.scrollTop = 100000;
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
              height: ph = me.height,
            });
            called = false;
          });
          switch(e.target.className) {
            case 'resize-sensor-expand':
              shrink.em.scrollLeft = 100000;
              shrink.em.scrollTop = 100000;
            break;
            case 'resize-sensor-shrink':
              expand.em.scrollLeft = 100000;
              expand.em.scrollTop = 100000;
            break;
          }
          called = true;
          shouldCall = false;
        }
      }
      expand.on('scroll', onScroll);
      shrink.on('scroll', onScroll);
      style = styleChild = null;
      return function destroy() {
        sensor.detach();
      }
    }
  };
  qelement.prototype.extend({
    //Allows dynamic allocation of events, which is faster
    on: function(name, func, callNow) {
      if(typeof(name) == qs.to) {
        for(var i=0; i<name.length; i++) {
          this.on(name[i], func, callNow);
        }
        return this;
      }
      var isAnExtension = name in qelement.onextensions;
      if(!(name in this.em.events)) {
        this.em.events[name] = new qevent(isAnExtension ? {} : {'attachTo': this, 'name': name});
        if(isAnExtension) this.em.devents[name] = qelement.onextensions[name](this, this.em.events[name]);
      }
      if(!q.is(func)) return this.em.events[name];
      if(callNow) func();
      this.em.events[name].push(func);
      return this;
    },
    // Destroy event
    non: function(name) {
      if(name in this.em.events) {
        if(name in this.em.devents[name]) this.em.devents[name]();
        this.em.events[name].clear();
        this.em.events[name] = null;
      }
    },
    id: function(newid) {
      if(!q.is(newid)) return this.em.id;
      this.em.id = newid;
      return this;
    },
    class: function(add, rem) {
      if(add != null) {
        if(typeof(add) == qs.to) {
          for(var i=0; i<add.length; i++) {
            this.em.classList.add(add[i]);
          }
        } else this.em.classList.add(add);
      }
      if(rem != null) {
        if(typeof(rem) == qs.to) {
          for(var i=0; i<rem.length; i++) {
            this.em.classList.remove(rem[i]);
          }
        } else this.em.classList.remove(rem);
      }
      return this;
    },
    classes: function() {
      if(!(0 in arguments)) return this.em.classList;
      var n = '';
      for(var i=0; i<arguments.length; i++) {
        n += (n.length == 0 ? '' : ' ') + arguments[i];
      }
      this.em.className = n;
      return this;
    },
    hasClass: function(c) {
      return this.em.classList.contains(c);
    },
    addClass: function() {
      for(var i=0; i<arguments.length; i++) this.em.classList.add(arguments[i]);
      return this;
    },
    remClass: function() {
      for(var i=0; i<arguments.length; i++) this.em.classList.remove(arguments[i]);
      return this;
    },
    togClass: function(c) {
      return this.em.classList.toggle(c);
    },
    text: function(t) {
      if(!q.is(t)) return (this.em instanceof HTMLInputElement || this.em instanceof HTMLSelectElement) ? this.em.value : this.em.textContent;
      if(this.em instanceof HTMLInputElement || this.em instanceof HTMLSelectElement) this.em.value = t;
      else this.em.textContent = t;
      return this;
    },
    title: function(t) {
      if(!q.is(t)) return this.em.title;
      this.em.title = t;
      return this;
    },
    html: function(h) {
      if(!q.is(h)) return this.em.innerHTML;
      this.em.innerHTML = h;
      return this;
    },
    appendHtml: function(h) {
      this.em.innerHTML += h;
      return this;
    },
    outerHtml: function(h) {
      if(!q.is(h)) return this.em.outerHTML;
      this.em.outerHTML = h;
      return this;
    },
    children: function(index) {
      // TODO: Update to qlist
      if(!q.is(index)) return qelement.fromNodes(this.em.children);
      if(typeof(index) == qs.tn) {
        if(index >= 0) {
          if(index in this.em.children) return newq(this.em.children[index]);
        } else {
          if((this.childCount + index) in this.em.children) return newq(this.em.children[this.em.children.length + index]);
        }
        return null;
      }
      if(typeof(index) == qs.ts) return qelement.fromNodes(this.em.querySelectorAll(index));
      if(index instanceof Array) {
        var out;
        for(var i=0; i<index.length; i++) {
          out.push(this.children(index[i]));
        }
        return out;
      }
      return null;
    },
    childCount: { get: function() {
      return this.em.children.length;
    } },
    index: { get: function() {
      var t = this.em, i = 0;
      while((t=t.previousElementSibling) != null) i++;
      return i;
    } },
    nodeIndex: { get: function() {
      var t = this.em, i = 0;
      while((t=t.previousSibling) != null) i++;
      return i;
    } },
    append: function(child) {
      var s;
      if(!qelement.isstr(child)) throw new TypeError(qs.eNd);
      this.em.appendChild(child = (child instanceof qelement ? child.em : (typeof(child) == qs.ts ? (s = newq(document.createElement(child))).em : child)));
      return s || this;
    },
    insertAt: function(child, index) {
      var s;
      this.em.insertBefore(child instanceof qelement ? child.em : (typeof(child) == qs.ts ? (s = newq(document.createElement(child))).em : child), this.children(index).em);
      return s || this;
    },
    insertBefore: function(child, before) {
      var s;
      if(!(qelement.isstr(child) || qelement.is(before))) throw new TypeError(qs.eNd);
      this.em.insertBefore(child instanceof qelement ? child.em : (typeof(child) == qs.ts ? (s = newq(document.createElement(child))).em : child), before instanceof qelement ? before.em : before);
      return s || this;
    },
    detach: function() {
      this.em.parentNode.removeChild(this.em);
      return this;
    },
    appendTo: function(parent) {
      var s;
      if(!qelement.isstr(parent)) throw new TypeError(qs.eNd);
      (parent instanceof qelement ? parent.em : (typeof(parent) == qs.ts ? (s = newq(document.createElement(parent))).em : parent)).appendChild(this.em);
      return s || this;
    },
    insertInto: function(parent, index) {
      var s;
      if(!qelement.isstr(parent)) throw new TypeError(qs.eNd);
      (parent instanceof qelement ? (typeof(parent) == qs.ts ? (s = newq(document.createElement(parent))).em : parent) : newq(parent)).insertAt(this, index);
      return s || this;
    },
    insertBeforeIn: function(parent, before) {
      if(!(qelement.is(parent) || qelement.is(before))) throw new TypeError(qs.eNd);
      (parent instanceof qelement ? parent.em : parent).insertBefore(this, before instanceof qelement ? before.em : before);
      return this;
    },
    insertBeforeThis: function(element) {
      var s;
      if(!(qelement.isstr(element))) throw new TypeError(qs.eNd);
      this.em.parentNode.insertBefore(element instanceof qelement ? element.em : (typeof(element) == qs.ts ? (s = newq(document.createElement(element))).em : element), this.em);
      return s || this;
    },
    insertAfterthis: function(element) {
      var s;
      this.em.insertBefore(child instanceof qelement ? child.em : (typeof(child) == qs.ts ? (s = newq(document.createElement(child))).em : child), this.children(this.index + 1).em);
      return s || this;
    },
    previousSibling: { get: function() {
       return newq(this.em.previousElementSibling);
    } },
    nextSibling: { get: function() {
      return newq(this.em.nextElementSibling);
    } },
    remove: function(child) {
      if(qelement.is(child)) {
        this.em.removeChild(child instanceof qelement ? child.em : child);
        return this;
      }
      if(child instanceof Array) {
        for(var i=0; i<child.length; i++) {
          if(!qelement.is(child[i])) throw new TypeError(qs.eNdOrList);
          this.em.removeChild(child[i] instanceof qelement ? child[i].em : child[i]);
        }
        return this;
      }
      if(typeof(child) == qs.tn) {
        this.em.removeChild(this.em.children[child]);
        return this;
      }
      throw new TypeError(qs.eNdOrList);
    },
    hasSelection: function() {
      if(!(this.em instanceof HTMLInputElement)) throw new TypeError(qs.eIn);
      if(this.em.selectionStart == this.em.selectionEnd) return false;
      return true;
    },
    cursor: function(index) {
      if(!(this.em instanceof HTMLInputElement)) throw new TypeError(qs.eIn);
      if(!qs.is(index)) return this.em.selectionStart;
      this.em.setSelectionRange(index, index);
      return this;
    },
    selection: function(begin, end) {
      if(!(this.em instanceof HTMLInputElement)) throw new TypeError(qs.eIn);
      if(!q.is(begin)) return [this.em.selectionStart, this.em.selectionEnd];
      if(!q.is(end)) this.em.setSelectionRange(begin, begin);
      else this.em.setSelectionRange(begin, end);
      return this;
    },
    firstChild: { get: function() {
      return newq(this.em.firstElementChild);
    } },
    firstNodeChild: { get: function() {
      return newq(this.em.firstChild);
    } },
    lastChild: { get: function() {
      return newq(this.em.lastElementChild);
    } },
    lastNodeChild:{ get: function() {
      return newq(this.em.lastChild);
    } },
    parent: { get: function() {
      return newq(this.em.parentElement);
    } },
    parentNode: { get: function() {
      return newq(this.em.parentNode);
    } },
    height: { get: function() {
      return this.em.offsetHeight;
    } },
    width: { get: function() {
      return this.em.offsetWidth;
    } },
    clientHeight: { get: function() {
      return this.em.clientHeight;
    } },
    clientWidth: { get: function() {
      return this.em.clientWidth;
    } },
    outerHeight: { get: function() {
      var c = this.computedStyle(), h = this.em.offsetHeight;
      //Add padding and border
      if(c['box-sizing'] == 'content-box') {
        h += parseFloat(c['padding-top']) + parseFloat(c['padding-bottom']) + parseFloat(c['border-top-width']) + parseFloat(c['border-bottom-width']);
      }
      return h += parseFloat(c['margin-top']) + parseFloat(c['margin-bottom']);
    } },
    outerWidth: { get: function() {
      var c = this.computedStyle(), h = this.em.offsetWidth;
      //Add padding and border
      if(c['box-sizing'] == 'content-box') {
        h += parseFloat(c['padding-left']) + parseFloat(c['padding-right']) + parseFloat(c['border-left-width']) + parseFloat(c['border-right-width']);
      }
      return h += parseFloat(c['margin-left']) + parseFloat(c['margin-right']);
    } },
    style: function(propname) {
      if(!q.is(propname)) return this.em.style;
      if(typeof(propname) == qs.to) {
        var keys = propname.getKeys();
        for(var i=0; i<keys.length; i++) this.em.style[!(keys[i] in qs.styles) && keys[i] in qs.styleAliases ? qs.styleAliases[keys[i]] : keys[i]] = css(propname[keys[i]]);
        return this;
      }
      if(!(1 in arguments)) return this.em.style[propname];
      //TODO: Create structure for every css property, to automate types?
      var str = css(arguments[1]);
      for(var i=2; i<arguments.length; i++) {
        str += ' ' + css(arguments[i]);
      }

      // Use browser-specific alias if property name is not valid, try to use the browser-specific alias if it exists.
      if(!(propname in qs.styles) && (propname in qs.styleAliases)) this.em.style[qs.styleAliases[propname]] = str;
      else this.em.style[propname] = str;
      return this;
    },
    computedStyle: function(propname) {
      if(propname) return getComputedStyle(this.em)[propname];
      return getComputedStyle(this.em);
    },
    validity: function(type) {
      if(!q.is(type)) return this.em.validity;
      this.em.setCustomValidity(type);
      return this;
    },
    selected: function(i) {
      if(!(this.em instanceof HTMLSelectElement)) throw new TypeError(qs.eSe);
      if(!q.is(i)) return this.em.selectedIndex;
      this.em.selectedIndex = i;
      return this;
    },
    clearChildren: function() {
      while(this.em.children.length > 0) {
        this.em.removeChild(this.em.firstChild);
      }
      return this;
    },
    hasChildren: function() {
      if(this.em.children.length > 0) return true;
      return false;
    },
    focus: function() {
      this.em.focus();
      return this;
    },
    blur: function() {
      this.em.blur();
      return this;
    },
    attr: function(key, value) {
      if(!q.is(value)) return this.em.getAttribute(key);
      this.em.setAttribute(key, value);
      return this;
    },
    hasExtension: function(key) {
      if(typeof(this.em.extensions) !== qs.to || !('extensions' in this.em)) return false;
      return key in this.em.extensions;
    },
    extendEm: function(key, value) {
      if(typeof(this.em.extensions) !== qs.to || !('extensions' in this.em)) this.em.extensions = {};
      if(!q.is(value)) return this.em.extensions[key];
      this.em.extensions[key] = value;
      return this;
    },
    href: function(value, addListener) {
      if(!q.is(value)) return this.em.getAttribute('href');
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
      if(!q.is(x) && !q.is(y)) return {x: this.em.scrollLeft, y: this.em.scrollTop};
      if(x != null) this.em.scrollLeft = x;
      if(y != null) this.em.scrollTop = y;
      return this;
    },
    clientRect: { get: function() {
      return this.em.getBoundingClientRect();
    } },
    offsetTop: { get: function() { return this.em.offsetTop; } },
    offsetBottom: { get: function() { return this.em.offsetBottom; } },
    offsetLeft: { get: function() { return this.em.offsetLeft; } },
    offsetRight: { get: function() { return this.em.offsetRight; } },
  });
  //Aliases
  //TODO: finish aliases
  qelement.prototype.extend({
    c: qelement.prototype.children,
    a: qelement.prototype.append,
    cls: qelement.prototype.classes,
    cl: qelement.prototype.class,
    i: qelement.prototype.insertAt,
    t: qelement.prototype.text,
    fc: {get:function(){return newq(this.em.firstElementChild)}},
    lc: {get:function(){return newq(this.em.lastElementChild)}},
    fnc: {get:function(){return newq(this.em.firstChild)}},
    lnc: {get:function(){return newq(this.em.lastChild)}},
    h: {get:function(){return newq(this.em.offsetHeight)}},
    w: {get:function(){return newq(this.em.offsetWidth)}},
    tcl: qelement.prototype.togClass,
    acl: qelement.prototype.addClass,
    rcl: qelement.prototype.remClass,
    p: {get:function(){return newq(this.em.parentElement)}},
    pn: {get:function(){return newq(this.em.parentNode)}},
    d: qelement.prototype.detach,
    rm: qelement.prototype.remove,
    s: qelement.prototype.style,
    sel: qelement.prototype.selected,
  });
  //TODO: add style creator;

  return qelement;
})();

// TODO: Replace custom array with simple array wrapper (much faster)
var qlist = (function() {
  function qlist() {
    var ref = arguments[0];
    if(!(ref instanceof Array || ref instanceof HTMLCollection || ref instanceof NodeList)) ref = Array.prototype.slice.call(arguments);
    var n = 0;
    for(var i=0; i<ref.length; i++) {
      try {
        this[n++] = makeq(ref[i]);
      } catch(e) {
        n--;
        console.log('failed at ' + n + ':', e);
      }
    }
  }
  qlist.extend({
    is: function(list) {
      if(list instanceof Array || list instanceof HTMLCollection || list instanceof NodeList) return true;
      return false;
    }
  });
  qlist.prototype = Object.create(Array.prototype);
  qlist.prototype.extend({
    length: { get: function() {
      var l = -1;
      for(var n in this) {
        if(+n != NaN && +n > l) l = +n; // Find last consecutive number, counts up
        else break;
      }
      return ++l;
    } },
    sum: function(prop) {
      if(!prop in qlist.prototype) throw new ReferenceError('Property or Function ' + prop + ' not defined');
      var it = qlist.prototype.hasGetOrSet(prop) ? this[prop] : this[prop](), out, len = it.length;
      if(0 in it) out = +it[0];
      for(var i=1; i<len; i++) out += +it[i];
      return out;
    },
    concat: function(prop) {
      if(!prop in qlist.prototype) throw new ReferenceError('Property or Function ' + prop + ' not defined');
      var it = qlist.prototype.hasGetOrSet(prop) ? this[prop] : this[prop](), out, len = it.length;
      if(0 in it) out = it[0];
      for(var i=1; i<len; i++) out += it[i].toString;
      return out;
    },
    foreach: function(callfor) {
      var len = this.length;
      for(var i=0; i<len; i++) callfor(this[i]);
      return this;
    }
  });
  // Extend all qelement functions to this
  var names = qelement.prototype.getOwnPropertyNames();
  for(var m=0; m<names.length; m++) {
    (function(m) {
      if(!qelement.prototype.hasGetOrSet(m) && typeof(qelement.prototype[m]) == qs.tf) {
        qlist.prototype[m] = function() {
          var out, tmp, type = 'this', i=0, len = this.length;
          // Check if 'this' needs to be returned
          if(i in this) {
            tmp = qelement.prototype[m].apply(this[i], arguments);
            if(tmp !== this[i]) {
              type = typeof(tmp);
              out = type == qs.tn ? tmp : [tmp];
            }
          } else return null;
          // Run on rest of contained elements
          for(i=1; i<len; i++) {
            tmp = qelement.prototype[m].apply(this[i], arguments);
            if(type == qs.tn) out += tmp;
            else if(type != 'this') out.push(tmp);
          }
          if(type == 'this') return this;
          return !qelement.is(out[0]) ? out : new qlist(out);
        }
      } else if(qelement.prototype.hasGetOrSet(m)) {
        qlist.prototype.defineProperty(m, { get: function() {
          var out, type, tmp, i=0, len = this.length;
          // Determine how to combine outputs
          if(i in this) {
            type = typeof(this[i][m]);
            if(type == qs.tn) out = this[i][m];
            else out = [this[i][m]];
          } else return null;
          // Combine all outputs
          if(type == qs.tn) {
            for(i=1; i<len; i++) {
              out += this[i][m];
            }
          }
          else for(i=1; i<len; i++) out.push(this[i][m]);
          return type == qs.tn || !qelement.is(out[0]) ? out : new qlist(out);
        } });
      }
    })(names[m]);
  }
  return qlist
})();

//TODO: Finish qnet
var qnet = (function() {
  function qnet(path, verb) {
    this.con = new XMLHttpRequest();
    this.open = false;
    this.data = this.path = this.verb = null;
    if(q.is(path)) {
      this.path = path || this.path;
      this.verb = verb || this.verb;
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
        if(!(path || this.path)) throw new ReferenceError('path is not set');
        this.path = path || this.path;
        this.verb = verb || this.verb;
        con.open(this.verb || 'GET', this.path);
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
    },
  });
  qnet.extend({
    getJson: function(url) {
      return new Promise(function(resolve, reject) {
        var client = new XMLHttpRequest;
        client.open("GET", url);
        client.onreadystatechange = function() {
          if(this.readyState == this.DONE) {
            if(this.status == 200) resolve(this.response);
            else reject(this);
          }
        }
        client.responseType = 'json';
        client.setRequestHeader("Accept", "application/json");
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
    if(styles[i][0] == '-') {
      qs.styleAliases[styles[i].substr(styles[i].indexOf('-', 1) + 1)] = styles[i];
    }
  }
})(q.registerEventHandlers);

document.addEventListener('DOMContentLoaded', function() {
  q.onready("DOMContentLoaded");
  q.loaded = true;
});
//Fallback
document.addEventListener('load', function() {
  if(!q.loaded) {
    q.onready("load");
    q.onload();
    q.loaded = true;
  }
});
