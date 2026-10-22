(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(a){if(a.ep)return;a.ep=!0;const l=n(a);fetch(a.href,l)}})();function ad(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Is={exports:{}},Da={},Bs={exports:{}},U={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cr=Symbol.for("react.element"),id=Symbol.for("react.portal"),ld=Symbol.for("react.fragment"),od=Symbol.for("react.strict_mode"),sd=Symbol.for("react.profiler"),cd=Symbol.for("react.provider"),ud=Symbol.for("react.context"),dd=Symbol.for("react.forward_ref"),pd=Symbol.for("react.suspense"),fd=Symbol.for("react.memo"),md=Symbol.for("react.lazy"),_o=Symbol.iterator;function hd(e){return e===null||typeof e!="object"?null:(e=_o&&e[_o]||e["@@iterator"],typeof e=="function"?e:null)}var Us={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Ks=Object.assign,Vs={};function On(e,t,n){this.props=e,this.context=t,this.refs=Vs,this.updater=n||Us}On.prototype.isReactComponent={};On.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};On.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Hs(){}Hs.prototype=On.prototype;function Nl(e,t,n){this.props=e,this.context=t,this.refs=Vs,this.updater=n||Us}var Cl=Nl.prototype=new Hs;Cl.constructor=Nl;Ks(Cl,On.prototype);Cl.isPureReactComponent=!0;var So=Array.isArray,Ws=Object.prototype.hasOwnProperty,zl={current:null},Gs={key:!0,ref:!0,__self:!0,__source:!0};function Qs(e,t,n){var r,a={},l=null,o=null;if(t!=null)for(r in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(l=""+t.key),t)Ws.call(t,r)&&!Gs.hasOwnProperty(r)&&(a[r]=t[r]);var s=arguments.length-2;if(s===1)a.children=n;else if(1<s){for(var c=Array(s),d=0;d<s;d++)c[d]=arguments[d+2];a.children=c}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)a[r]===void 0&&(a[r]=s[r]);return{$$typeof:Cr,type:e,key:l,ref:o,props:a,_owner:zl.current}}function gd(e,t){return{$$typeof:Cr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function El(e){return typeof e=="object"&&e!==null&&e.$$typeof===Cr}function vd(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var No=/\/+/g;function ri(e,t){return typeof e=="object"&&e!==null&&e.key!=null?vd(""+e.key):t.toString(36)}function Zr(e,t,n,r,a){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(l){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Cr:case id:o=!0}}if(o)return o=e,a=a(o),e=r===""?"."+ri(o,0):r,So(a)?(n="",e!=null&&(n=e.replace(No,"$&/")+"/"),Zr(a,t,n,"",function(d){return d})):a!=null&&(El(a)&&(a=gd(a,n+(!a.key||o&&o.key===a.key?"":(""+a.key).replace(No,"$&/")+"/")+e)),t.push(a)),1;if(o=0,r=r===""?".":r+":",So(e))for(var s=0;s<e.length;s++){l=e[s];var c=r+ri(l,s);o+=Zr(l,t,n,c,a)}else if(c=hd(e),typeof c=="function")for(e=c.call(e),s=0;!(l=e.next()).done;)l=l.value,c=r+ri(l,s++),o+=Zr(l,t,n,c,a);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function Rr(e,t,n){if(e==null)return e;var r=[],a=0;return Zr(e,r,"","",function(l){return t.call(n,l,a++)}),r}function xd(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Ce={current:null},ea={transition:null},yd={ReactCurrentDispatcher:Ce,ReactCurrentBatchConfig:ea,ReactCurrentOwner:zl};function Js(){throw Error("act(...) is not supported in production builds of React.")}U.Children={map:Rr,forEach:function(e,t,n){Rr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Rr(e,function(){t++}),t},toArray:function(e){return Rr(e,function(t){return t})||[]},only:function(e){if(!El(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};U.Component=On;U.Fragment=ld;U.Profiler=sd;U.PureComponent=Nl;U.StrictMode=od;U.Suspense=pd;U.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yd;U.act=Js;U.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Ks({},e.props),a=e.key,l=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,o=zl.current),t.key!==void 0&&(a=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(c in t)Ws.call(t,c)&&!Gs.hasOwnProperty(c)&&(r[c]=t[c]===void 0&&s!==void 0?s[c]:t[c])}var c=arguments.length-2;if(c===1)r.children=n;else if(1<c){s=Array(c);for(var d=0;d<c;d++)s[d]=arguments[d+2];r.children=s}return{$$typeof:Cr,type:e.type,key:a,ref:l,props:r,_owner:o}};U.createContext=function(e){return e={$$typeof:ud,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:cd,_context:e},e.Consumer=e};U.createElement=Qs;U.createFactory=function(e){var t=Qs.bind(null,e);return t.type=e,t};U.createRef=function(){return{current:null}};U.forwardRef=function(e){return{$$typeof:dd,render:e}};U.isValidElement=El;U.lazy=function(e){return{$$typeof:md,_payload:{_status:-1,_result:e},_init:xd}};U.memo=function(e,t){return{$$typeof:fd,type:e,compare:t===void 0?null:t}};U.startTransition=function(e){var t=ea.transition;ea.transition={};try{e()}finally{ea.transition=t}};U.unstable_act=Js;U.useCallback=function(e,t){return Ce.current.useCallback(e,t)};U.useContext=function(e){return Ce.current.useContext(e)};U.useDebugValue=function(){};U.useDeferredValue=function(e){return Ce.current.useDeferredValue(e)};U.useEffect=function(e,t){return Ce.current.useEffect(e,t)};U.useId=function(){return Ce.current.useId()};U.useImperativeHandle=function(e,t,n){return Ce.current.useImperativeHandle(e,t,n)};U.useInsertionEffect=function(e,t){return Ce.current.useInsertionEffect(e,t)};U.useLayoutEffect=function(e,t){return Ce.current.useLayoutEffect(e,t)};U.useMemo=function(e,t){return Ce.current.useMemo(e,t)};U.useReducer=function(e,t,n){return Ce.current.useReducer(e,t,n)};U.useRef=function(e){return Ce.current.useRef(e)};U.useState=function(e){return Ce.current.useState(e)};U.useSyncExternalStore=function(e,t,n){return Ce.current.useSyncExternalStore(e,t,n)};U.useTransition=function(){return Ce.current.useTransition()};U.version="18.3.1";Bs.exports=U;var k=Bs.exports;const kd=ad(k);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bd=k,wd=Symbol.for("react.element"),jd=Symbol.for("react.fragment"),_d=Object.prototype.hasOwnProperty,Sd=bd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Nd={key:!0,ref:!0,__self:!0,__source:!0};function qs(e,t,n){var r,a={},l=null,o=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(o=t.ref);for(r in t)_d.call(t,r)&&!Nd.hasOwnProperty(r)&&(a[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)a[r]===void 0&&(a[r]=t[r]);return{$$typeof:wd,type:e,key:l,ref:o,props:a,_owner:Sd.current}}Da.Fragment=jd;Da.jsx=qs;Da.jsxs=qs;Is.exports=Da;var i=Is.exports,Li={},Ys={exports:{}},Ue={},Xs={exports:{}},Zs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(b,R){var _=b.length;b.push(R);e:for(;0<_;){var D=_-1>>>1,B=b[D];if(0<a(B,R))b[D]=R,b[_]=B,_=D;else break e}}function n(b){return b.length===0?null:b[0]}function r(b){if(b.length===0)return null;var R=b[0],_=b.pop();if(_!==R){b[0]=_;e:for(var D=0,B=b.length,Ae=B>>>1;D<Ae;){var se=2*(D+1)-1,ce=b[se],fe=se+1,z=b[fe];if(0>a(ce,_))fe<B&&0>a(z,ce)?(b[D]=z,b[fe]=_,D=fe):(b[D]=ce,b[se]=_,D=se);else if(fe<B&&0>a(z,_))b[D]=z,b[fe]=_,D=fe;else break e}}return R}function a(b,R){var _=b.sortIndex-R.sortIndex;return _!==0?_:b.id-R.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],d=[],g=1,h=null,m=3,x=!1,y=!1,w=!1,O=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function p(b){for(var R=n(d);R!==null;){if(R.callback===null)r(d);else if(R.startTime<=b)r(d),R.sortIndex=R.expirationTime,t(c,R);else break;R=n(d)}}function v(b){if(w=!1,p(b),!y)if(n(c)!==null)y=!0,L(S);else{var R=n(d);R!==null&&P(v,R.startTime-b)}}function S(b,R){y=!1,w&&(w=!1,f(E),E=-1),x=!0;var _=m;try{for(p(R),h=n(c);h!==null&&(!(h.expirationTime>R)||b&&!$());){var D=h.callback;if(typeof D=="function"){h.callback=null,m=h.priorityLevel;var B=D(h.expirationTime<=R);R=e.unstable_now(),typeof B=="function"?h.callback=B:h===n(c)&&r(c),p(R)}else r(c);h=n(c)}if(h!==null)var Ae=!0;else{var se=n(d);se!==null&&P(v,se.startTime-R),Ae=!1}return Ae}finally{h=null,m=_,x=!1}}var C=!1,N=null,E=-1,I=5,M=-1;function $(){return!(e.unstable_now()-M<I)}function X(){if(N!==null){var b=e.unstable_now();M=b;var R=!0;try{R=N(!0,b)}finally{R?oe():(C=!1,N=null)}}else C=!1}var oe;if(typeof u=="function")oe=function(){u(X)};else if(typeof MessageChannel<"u"){var A=new MessageChannel,ee=A.port2;A.port1.onmessage=X,oe=function(){ee.postMessage(null)}}else oe=function(){O(X,0)};function L(b){N=b,C||(C=!0,oe())}function P(b,R){E=O(function(){b(e.unstable_now())},R)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(b){b.callback=null},e.unstable_continueExecution=function(){y||x||(y=!0,L(S))},e.unstable_forceFrameRate=function(b){0>b||125<b?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):I=0<b?Math.floor(1e3/b):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return n(c)},e.unstable_next=function(b){switch(m){case 1:case 2:case 3:var R=3;break;default:R=m}var _=m;m=R;try{return b()}finally{m=_}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(b,R){switch(b){case 1:case 2:case 3:case 4:case 5:break;default:b=3}var _=m;m=b;try{return R()}finally{m=_}},e.unstable_scheduleCallback=function(b,R,_){var D=e.unstable_now();switch(typeof _=="object"&&_!==null?(_=_.delay,_=typeof _=="number"&&0<_?D+_:D):_=D,b){case 1:var B=-1;break;case 2:B=250;break;case 5:B=1073741823;break;case 4:B=1e4;break;default:B=5e3}return B=_+B,b={id:g++,callback:R,priorityLevel:b,startTime:_,expirationTime:B,sortIndex:-1},_>D?(b.sortIndex=_,t(d,b),n(c)===null&&b===n(d)&&(w?(f(E),E=-1):w=!0,P(v,_-D))):(b.sortIndex=B,t(c,b),y||x||(y=!0,L(S))),b},e.unstable_shouldYield=$,e.unstable_wrapCallback=function(b){var R=m;return function(){var _=m;m=R;try{return b.apply(this,arguments)}finally{m=_}}}})(Zs);Xs.exports=Zs;var Cd=Xs.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zd=k,Be=Cd;function j(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var ec=new Set,cr={};function an(e,t){zn(e,t),zn(e+"Capture",t)}function zn(e,t){for(cr[e]=t,e=0;e<t.length;e++)ec.add(t[e])}var vt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ti=Object.prototype.hasOwnProperty,Ed=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Co={},zo={};function Pd(e){return Ti.call(zo,e)?!0:Ti.call(Co,e)?!1:Ed.test(e)?zo[e]=!0:(Co[e]=!0,!1)}function Md(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Ld(e,t,n,r){if(t===null||typeof t>"u"||Md(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ze(e,t,n,r,a,l,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=a,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=o}var xe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){xe[e]=new ze(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];xe[t]=new ze(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){xe[e]=new ze(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){xe[e]=new ze(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){xe[e]=new ze(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){xe[e]=new ze(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){xe[e]=new ze(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){xe[e]=new ze(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){xe[e]=new ze(e,5,!1,e.toLowerCase(),null,!1,!1)});var Pl=/[\-:]([a-z])/g;function Ml(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Pl,Ml);xe[t]=new ze(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Pl,Ml);xe[t]=new ze(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Pl,Ml);xe[t]=new ze(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){xe[e]=new ze(e,1,!1,e.toLowerCase(),null,!1,!1)});xe.xlinkHref=new ze("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){xe[e]=new ze(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ll(e,t,n,r){var a=xe.hasOwnProperty(t)?xe[t]:null;(a!==null?a.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Ld(t,n,a,r)&&(n=null),r||a===null?Pd(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):a.mustUseProperty?e[a.propertyName]=n===null?a.type===3?!1:"":n:(t=a.attributeName,r=a.attributeNamespace,n===null?e.removeAttribute(t):(a=a.type,n=a===3||a===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var wt=zd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Or=Symbol.for("react.element"),cn=Symbol.for("react.portal"),un=Symbol.for("react.fragment"),Tl=Symbol.for("react.strict_mode"),Ai=Symbol.for("react.profiler"),tc=Symbol.for("react.provider"),nc=Symbol.for("react.context"),Al=Symbol.for("react.forward_ref"),Ri=Symbol.for("react.suspense"),Oi=Symbol.for("react.suspense_list"),Rl=Symbol.for("react.memo"),St=Symbol.for("react.lazy"),rc=Symbol.for("react.offscreen"),Eo=Symbol.iterator;function Bn(e){return e===null||typeof e!="object"?null:(e=Eo&&e[Eo]||e["@@iterator"],typeof e=="function"?e:null)}var re=Object.assign,ai;function Jn(e){if(ai===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ai=t&&t[1]||""}return`
`+ai+e}var ii=!1;function li(e,t){if(!e||ii)return"";ii=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var a=d.stack.split(`
`),l=r.stack.split(`
`),o=a.length-1,s=l.length-1;1<=o&&0<=s&&a[o]!==l[s];)s--;for(;1<=o&&0<=s;o--,s--)if(a[o]!==l[s]){if(o!==1||s!==1)do if(o--,s--,0>s||a[o]!==l[s]){var c=`
`+a[o].replace(" at new "," at ");return e.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",e.displayName)),c}while(1<=o&&0<=s);break}}}finally{ii=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Jn(e):""}function Td(e){switch(e.tag){case 5:return Jn(e.type);case 16:return Jn("Lazy");case 13:return Jn("Suspense");case 19:return Jn("SuspenseList");case 0:case 2:case 15:return e=li(e.type,!1),e;case 11:return e=li(e.type.render,!1),e;case 1:return e=li(e.type,!0),e;default:return""}}function Fi(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case un:return"Fragment";case cn:return"Portal";case Ai:return"Profiler";case Tl:return"StrictMode";case Ri:return"Suspense";case Oi:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case nc:return(e.displayName||"Context")+".Consumer";case tc:return(e._context.displayName||"Context")+".Provider";case Al:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Rl:return t=e.displayName||null,t!==null?t:Fi(e.type)||"Memo";case St:t=e._payload,e=e._init;try{return Fi(e(t))}catch{}}return null}function Ad(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Fi(t);case 8:return t===Tl?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function $t(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ac(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Rd(e){var t=ac(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var a=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(o){r=""+o,l.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Fr(e){e._valueTracker||(e._valueTracker=Rd(e))}function ic(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=ac(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function pa(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Di(e,t){var n=t.checked;return re({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Po(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=$t(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function lc(e,t){t=t.checked,t!=null&&Ll(e,"checked",t,!1)}function $i(e,t){lc(e,t);var n=$t(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Ii(e,t.type,n):t.hasOwnProperty("defaultValue")&&Ii(e,t.type,$t(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Mo(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Ii(e,t,n){(t!=="number"||pa(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var qn=Array.isArray;function wn(e,t,n,r){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&r&&(e[n].defaultSelected=!0)}else{for(n=""+$t(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,r&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function Bi(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(j(91));return re({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Lo(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(j(92));if(qn(n)){if(1<n.length)throw Error(j(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:$t(n)}}function oc(e,t){var n=$t(t.value),r=$t(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function To(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function sc(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ui(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?sc(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Dr,cc=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,a){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,a)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Dr=Dr||document.createElement("div"),Dr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Dr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ur(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var er={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Od=["Webkit","ms","Moz","O"];Object.keys(er).forEach(function(e){Od.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),er[t]=er[e]})});function uc(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||er.hasOwnProperty(e)&&er[e]?(""+t).trim():t+"px"}function dc(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,a=uc(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,a):e[n]=a}}var Fd=re({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ki(e,t){if(t){if(Fd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(j(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(j(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(j(61))}if(t.style!=null&&typeof t.style!="object")throw Error(j(62))}}function Vi(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Hi=null;function Ol(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Wi=null,jn=null,_n=null;function Ao(e){if(e=Pr(e)){if(typeof Wi!="function")throw Error(j(280));var t=e.stateNode;t&&(t=Ka(t),Wi(e.stateNode,e.type,t))}}function pc(e){jn?_n?_n.push(e):_n=[e]:jn=e}function fc(){if(jn){var e=jn,t=_n;if(_n=jn=null,Ao(e),t)for(e=0;e<t.length;e++)Ao(t[e])}}function mc(e,t){return e(t)}function hc(){}var oi=!1;function gc(e,t,n){if(oi)return e(t,n);oi=!0;try{return mc(e,t,n)}finally{oi=!1,(jn!==null||_n!==null)&&(hc(),fc())}}function dr(e,t){var n=e.stateNode;if(n===null)return null;var r=Ka(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(j(231,t,typeof n));return n}var Gi=!1;if(vt)try{var Un={};Object.defineProperty(Un,"passive",{get:function(){Gi=!0}}),window.addEventListener("test",Un,Un),window.removeEventListener("test",Un,Un)}catch{Gi=!1}function Dd(e,t,n,r,a,l,o,s,c){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(g){this.onError(g)}}var tr=!1,fa=null,ma=!1,Qi=null,$d={onError:function(e){tr=!0,fa=e}};function Id(e,t,n,r,a,l,o,s,c){tr=!1,fa=null,Dd.apply($d,arguments)}function Bd(e,t,n,r,a,l,o,s,c){if(Id.apply(this,arguments),tr){if(tr){var d=fa;tr=!1,fa=null}else throw Error(j(198));ma||(ma=!0,Qi=d)}}function ln(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function vc(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ro(e){if(ln(e)!==e)throw Error(j(188))}function Ud(e){var t=e.alternate;if(!t){if(t=ln(e),t===null)throw Error(j(188));return t!==e?null:e}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var l=a.alternate;if(l===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===l.child){for(l=a.child;l;){if(l===n)return Ro(a),e;if(l===r)return Ro(a),t;l=l.sibling}throw Error(j(188))}if(n.return!==r.return)n=a,r=l;else{for(var o=!1,s=a.child;s;){if(s===n){o=!0,n=a,r=l;break}if(s===r){o=!0,r=a,n=l;break}s=s.sibling}if(!o){for(s=l.child;s;){if(s===n){o=!0,n=l,r=a;break}if(s===r){o=!0,r=l,n=a;break}s=s.sibling}if(!o)throw Error(j(189))}}if(n.alternate!==r)throw Error(j(190))}if(n.tag!==3)throw Error(j(188));return n.stateNode.current===n?e:t}function xc(e){return e=Ud(e),e!==null?yc(e):null}function yc(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=yc(e);if(t!==null)return t;e=e.sibling}return null}var kc=Be.unstable_scheduleCallback,Oo=Be.unstable_cancelCallback,Kd=Be.unstable_shouldYield,Vd=Be.unstable_requestPaint,ie=Be.unstable_now,Hd=Be.unstable_getCurrentPriorityLevel,Fl=Be.unstable_ImmediatePriority,bc=Be.unstable_UserBlockingPriority,ha=Be.unstable_NormalPriority,Wd=Be.unstable_LowPriority,wc=Be.unstable_IdlePriority,$a=null,ct=null;function Gd(e){if(ct&&typeof ct.onCommitFiberRoot=="function")try{ct.onCommitFiberRoot($a,e,void 0,(e.current.flags&128)===128)}catch{}}var nt=Math.clz32?Math.clz32:qd,Qd=Math.log,Jd=Math.LN2;function qd(e){return e>>>=0,e===0?32:31-(Qd(e)/Jd|0)|0}var $r=64,Ir=4194304;function Yn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function ga(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,a=e.suspendedLanes,l=e.pingedLanes,o=n&268435455;if(o!==0){var s=o&~a;s!==0?r=Yn(s):(l&=o,l!==0&&(r=Yn(l)))}else o=n&~a,o!==0?r=Yn(o):l!==0&&(r=Yn(l));if(r===0)return 0;if(t!==0&&t!==r&&!(t&a)&&(a=r&-r,l=t&-t,a>=l||a===16&&(l&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-nt(t),a=1<<n,r|=e[n],t&=~a;return r}function Yd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Xd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,a=e.expirationTimes,l=e.pendingLanes;0<l;){var o=31-nt(l),s=1<<o,c=a[o];c===-1?(!(s&n)||s&r)&&(a[o]=Yd(s,t)):c<=t&&(e.expiredLanes|=s),l&=~s}}function Ji(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function jc(){var e=$r;return $r<<=1,!($r&4194240)&&($r=64),e}function si(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function zr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-nt(t),e[t]=n}function Zd(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var a=31-nt(n),l=1<<a;t[a]=0,r[a]=-1,e[a]=-1,n&=~l}}function Dl(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-nt(n),a=1<<r;a&t|e[r]&t&&(e[r]|=t),n&=~a}}var Q=0;function _c(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Sc,$l,Nc,Cc,zc,qi=!1,Br=[],Mt=null,Lt=null,Tt=null,pr=new Map,fr=new Map,Ct=[],ep="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Fo(e,t){switch(e){case"focusin":case"focusout":Mt=null;break;case"dragenter":case"dragleave":Lt=null;break;case"mouseover":case"mouseout":Tt=null;break;case"pointerover":case"pointerout":pr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":fr.delete(t.pointerId)}}function Kn(e,t,n,r,a,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:l,targetContainers:[a]},t!==null&&(t=Pr(t),t!==null&&$l(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function tp(e,t,n,r,a){switch(t){case"focusin":return Mt=Kn(Mt,e,t,n,r,a),!0;case"dragenter":return Lt=Kn(Lt,e,t,n,r,a),!0;case"mouseover":return Tt=Kn(Tt,e,t,n,r,a),!0;case"pointerover":var l=a.pointerId;return pr.set(l,Kn(pr.get(l)||null,e,t,n,r,a)),!0;case"gotpointercapture":return l=a.pointerId,fr.set(l,Kn(fr.get(l)||null,e,t,n,r,a)),!0}return!1}function Ec(e){var t=Qt(e.target);if(t!==null){var n=ln(t);if(n!==null){if(t=n.tag,t===13){if(t=vc(n),t!==null){e.blockedOn=t,zc(e.priority,function(){Nc(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ta(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Yi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Hi=r,n.target.dispatchEvent(r),Hi=null}else return t=Pr(n),t!==null&&$l(t),e.blockedOn=n,!1;t.shift()}return!0}function Do(e,t,n){ta(e)&&n.delete(t)}function np(){qi=!1,Mt!==null&&ta(Mt)&&(Mt=null),Lt!==null&&ta(Lt)&&(Lt=null),Tt!==null&&ta(Tt)&&(Tt=null),pr.forEach(Do),fr.forEach(Do)}function Vn(e,t){e.blockedOn===t&&(e.blockedOn=null,qi||(qi=!0,Be.unstable_scheduleCallback(Be.unstable_NormalPriority,np)))}function mr(e){function t(a){return Vn(a,e)}if(0<Br.length){Vn(Br[0],e);for(var n=1;n<Br.length;n++){var r=Br[n];r.blockedOn===e&&(r.blockedOn=null)}}for(Mt!==null&&Vn(Mt,e),Lt!==null&&Vn(Lt,e),Tt!==null&&Vn(Tt,e),pr.forEach(t),fr.forEach(t),n=0;n<Ct.length;n++)r=Ct[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<Ct.length&&(n=Ct[0],n.blockedOn===null);)Ec(n),n.blockedOn===null&&Ct.shift()}var Sn=wt.ReactCurrentBatchConfig,va=!0;function rp(e,t,n,r){var a=Q,l=Sn.transition;Sn.transition=null;try{Q=1,Il(e,t,n,r)}finally{Q=a,Sn.transition=l}}function ap(e,t,n,r){var a=Q,l=Sn.transition;Sn.transition=null;try{Q=4,Il(e,t,n,r)}finally{Q=a,Sn.transition=l}}function Il(e,t,n,r){if(va){var a=Yi(e,t,n,r);if(a===null)xi(e,t,r,xa,n),Fo(e,r);else if(tp(a,e,t,n,r))r.stopPropagation();else if(Fo(e,r),t&4&&-1<ep.indexOf(e)){for(;a!==null;){var l=Pr(a);if(l!==null&&Sc(l),l=Yi(e,t,n,r),l===null&&xi(e,t,r,xa,n),l===a)break;a=l}a!==null&&r.stopPropagation()}else xi(e,t,r,null,n)}}var xa=null;function Yi(e,t,n,r){if(xa=null,e=Ol(r),e=Qt(e),e!==null)if(t=ln(e),t===null)e=null;else if(n=t.tag,n===13){if(e=vc(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return xa=e,null}function Pc(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Hd()){case Fl:return 1;case bc:return 4;case ha:case Wd:return 16;case wc:return 536870912;default:return 16}default:return 16}}var Et=null,Bl=null,na=null;function Mc(){if(na)return na;var e,t=Bl,n=t.length,r,a="value"in Et?Et.value:Et.textContent,l=a.length;for(e=0;e<n&&t[e]===a[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===a[l-r];r++);return na=a.slice(e,1<r?1-r:void 0)}function ra(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ur(){return!0}function $o(){return!1}function Ke(e){function t(n,r,a,l,o){this._reactName=n,this._targetInst=a,this.type=r,this.nativeEvent=l,this.target=o,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(l):l[s]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Ur:$o,this.isPropagationStopped=$o,this}return re(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ur)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ur)},persist:function(){},isPersistent:Ur}),t}var Fn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ul=Ke(Fn),Er=re({},Fn,{view:0,detail:0}),ip=Ke(Er),ci,ui,Hn,Ia=re({},Er,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Kl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Hn&&(Hn&&e.type==="mousemove"?(ci=e.screenX-Hn.screenX,ui=e.screenY-Hn.screenY):ui=ci=0,Hn=e),ci)},movementY:function(e){return"movementY"in e?e.movementY:ui}}),Io=Ke(Ia),lp=re({},Ia,{dataTransfer:0}),op=Ke(lp),sp=re({},Er,{relatedTarget:0}),di=Ke(sp),cp=re({},Fn,{animationName:0,elapsedTime:0,pseudoElement:0}),up=Ke(cp),dp=re({},Fn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),pp=Ke(dp),fp=re({},Fn,{data:0}),Bo=Ke(fp),mp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},gp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function vp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=gp[e])?!!t[e]:!1}function Kl(){return vp}var xp=re({},Er,{key:function(e){if(e.key){var t=mp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ra(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?hp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Kl,charCode:function(e){return e.type==="keypress"?ra(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ra(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),yp=Ke(xp),kp=re({},Ia,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Uo=Ke(kp),bp=re({},Er,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Kl}),wp=Ke(bp),jp=re({},Fn,{propertyName:0,elapsedTime:0,pseudoElement:0}),_p=Ke(jp),Sp=re({},Ia,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Np=Ke(Sp),Cp=[9,13,27,32],Vl=vt&&"CompositionEvent"in window,nr=null;vt&&"documentMode"in document&&(nr=document.documentMode);var zp=vt&&"TextEvent"in window&&!nr,Lc=vt&&(!Vl||nr&&8<nr&&11>=nr),Ko=" ",Vo=!1;function Tc(e,t){switch(e){case"keyup":return Cp.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ac(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var dn=!1;function Ep(e,t){switch(e){case"compositionend":return Ac(t);case"keypress":return t.which!==32?null:(Vo=!0,Ko);case"textInput":return e=t.data,e===Ko&&Vo?null:e;default:return null}}function Pp(e,t){if(dn)return e==="compositionend"||!Vl&&Tc(e,t)?(e=Mc(),na=Bl=Et=null,dn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Lc&&t.locale!=="ko"?null:t.data;default:return null}}var Mp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ho(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Mp[e.type]:t==="textarea"}function Rc(e,t,n,r){pc(r),t=ya(t,"onChange"),0<t.length&&(n=new Ul("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var rr=null,hr=null;function Lp(e){Wc(e,0)}function Ba(e){var t=mn(e);if(ic(t))return e}function Tp(e,t){if(e==="change")return t}var Oc=!1;if(vt){var pi;if(vt){var fi="oninput"in document;if(!fi){var Wo=document.createElement("div");Wo.setAttribute("oninput","return;"),fi=typeof Wo.oninput=="function"}pi=fi}else pi=!1;Oc=pi&&(!document.documentMode||9<document.documentMode)}function Go(){rr&&(rr.detachEvent("onpropertychange",Fc),hr=rr=null)}function Fc(e){if(e.propertyName==="value"&&Ba(hr)){var t=[];Rc(t,hr,e,Ol(e)),gc(Lp,t)}}function Ap(e,t,n){e==="focusin"?(Go(),rr=t,hr=n,rr.attachEvent("onpropertychange",Fc)):e==="focusout"&&Go()}function Rp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ba(hr)}function Op(e,t){if(e==="click")return Ba(t)}function Fp(e,t){if(e==="input"||e==="change")return Ba(t)}function Dp(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var at=typeof Object.is=="function"?Object.is:Dp;function gr(e,t){if(at(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var a=n[r];if(!Ti.call(t,a)||!at(e[a],t[a]))return!1}return!0}function Qo(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Jo(e,t){var n=Qo(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Qo(n)}}function Dc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Dc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function $c(){for(var e=window,t=pa();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=pa(e.document)}return t}function Hl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function $p(e){var t=$c(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Dc(n.ownerDocument.documentElement,n)){if(r!==null&&Hl(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var a=n.textContent.length,l=Math.min(r.start,a);r=r.end===void 0?l:Math.min(r.end,a),!e.extend&&l>r&&(a=r,r=l,l=a),a=Jo(n,l);var o=Jo(n,r);a&&o&&(e.rangeCount!==1||e.anchorNode!==a.node||e.anchorOffset!==a.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(a.node,a.offset),e.removeAllRanges(),l>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Ip=vt&&"documentMode"in document&&11>=document.documentMode,pn=null,Xi=null,ar=null,Zi=!1;function qo(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zi||pn==null||pn!==pa(r)||(r=pn,"selectionStart"in r&&Hl(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ar&&gr(ar,r)||(ar=r,r=ya(Xi,"onSelect"),0<r.length&&(t=new Ul("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=pn)))}function Kr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var fn={animationend:Kr("Animation","AnimationEnd"),animationiteration:Kr("Animation","AnimationIteration"),animationstart:Kr("Animation","AnimationStart"),transitionend:Kr("Transition","TransitionEnd")},mi={},Ic={};vt&&(Ic=document.createElement("div").style,"AnimationEvent"in window||(delete fn.animationend.animation,delete fn.animationiteration.animation,delete fn.animationstart.animation),"TransitionEvent"in window||delete fn.transitionend.transition);function Ua(e){if(mi[e])return mi[e];if(!fn[e])return e;var t=fn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Ic)return mi[e]=t[n];return e}var Bc=Ua("animationend"),Uc=Ua("animationiteration"),Kc=Ua("animationstart"),Vc=Ua("transitionend"),Hc=new Map,Yo="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Bt(e,t){Hc.set(e,t),an(t,[e])}for(var hi=0;hi<Yo.length;hi++){var gi=Yo[hi],Bp=gi.toLowerCase(),Up=gi[0].toUpperCase()+gi.slice(1);Bt(Bp,"on"+Up)}Bt(Bc,"onAnimationEnd");Bt(Uc,"onAnimationIteration");Bt(Kc,"onAnimationStart");Bt("dblclick","onDoubleClick");Bt("focusin","onFocus");Bt("focusout","onBlur");Bt(Vc,"onTransitionEnd");zn("onMouseEnter",["mouseout","mouseover"]);zn("onMouseLeave",["mouseout","mouseover"]);zn("onPointerEnter",["pointerout","pointerover"]);zn("onPointerLeave",["pointerout","pointerover"]);an("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));an("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));an("onBeforeInput",["compositionend","keypress","textInput","paste"]);an("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));an("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));an("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Kp=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xn));function Xo(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Bd(r,t,void 0,e),e.currentTarget=null}function Wc(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],a=r.event;r=r.listeners;e:{var l=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,d=s.currentTarget;if(s=s.listener,c!==l&&a.isPropagationStopped())break e;Xo(a,s,d),l=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,d=s.currentTarget,s=s.listener,c!==l&&a.isPropagationStopped())break e;Xo(a,s,d),l=c}}}if(ma)throw e=Qi,ma=!1,Qi=null,e}function q(e,t){var n=t[al];n===void 0&&(n=t[al]=new Set);var r=e+"__bubble";n.has(r)||(Gc(t,e,2,!1),n.add(r))}function vi(e,t,n){var r=0;t&&(r|=4),Gc(n,e,r,t)}var Vr="_reactListening"+Math.random().toString(36).slice(2);function vr(e){if(!e[Vr]){e[Vr]=!0,ec.forEach(function(n){n!=="selectionchange"&&(Kp.has(n)||vi(n,!1,e),vi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Vr]||(t[Vr]=!0,vi("selectionchange",!1,t))}}function Gc(e,t,n,r){switch(Pc(t)){case 1:var a=rp;break;case 4:a=ap;break;default:a=Il}n=a.bind(null,t,n,e),a=void 0,!Gi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),r?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function xi(e,t,n,r,a){var l=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===a||s.nodeType===8&&s.parentNode===a)break;if(o===4)for(o=r.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===a||c.nodeType===8&&c.parentNode===a))return;o=o.return}for(;s!==null;){if(o=Qt(s),o===null)return;if(c=o.tag,c===5||c===6){r=l=o;continue e}s=s.parentNode}}r=r.return}gc(function(){var d=l,g=Ol(n),h=[];e:{var m=Hc.get(e);if(m!==void 0){var x=Ul,y=e;switch(e){case"keypress":if(ra(n)===0)break e;case"keydown":case"keyup":x=yp;break;case"focusin":y="focus",x=di;break;case"focusout":y="blur",x=di;break;case"beforeblur":case"afterblur":x=di;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":x=Io;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":x=op;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":x=wp;break;case Bc:case Uc:case Kc:x=up;break;case Vc:x=_p;break;case"scroll":x=ip;break;case"wheel":x=Np;break;case"copy":case"cut":case"paste":x=pp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":x=Uo}var w=(t&4)!==0,O=!w&&e==="scroll",f=w?m!==null?m+"Capture":null:m;w=[];for(var u=d,p;u!==null;){p=u;var v=p.stateNode;if(p.tag===5&&v!==null&&(p=v,f!==null&&(v=dr(u,f),v!=null&&w.push(xr(u,v,p)))),O)break;u=u.return}0<w.length&&(m=new x(m,y,null,n,g),h.push({event:m,listeners:w}))}}if(!(t&7)){e:{if(m=e==="mouseover"||e==="pointerover",x=e==="mouseout"||e==="pointerout",m&&n!==Hi&&(y=n.relatedTarget||n.fromElement)&&(Qt(y)||y[xt]))break e;if((x||m)&&(m=g.window===g?g:(m=g.ownerDocument)?m.defaultView||m.parentWindow:window,x?(y=n.relatedTarget||n.toElement,x=d,y=y?Qt(y):null,y!==null&&(O=ln(y),y!==O||y.tag!==5&&y.tag!==6)&&(y=null)):(x=null,y=d),x!==y)){if(w=Io,v="onMouseLeave",f="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(w=Uo,v="onPointerLeave",f="onPointerEnter",u="pointer"),O=x==null?m:mn(x),p=y==null?m:mn(y),m=new w(v,u+"leave",x,n,g),m.target=O,m.relatedTarget=p,v=null,Qt(g)===d&&(w=new w(f,u+"enter",y,n,g),w.target=p,w.relatedTarget=O,v=w),O=v,x&&y)t:{for(w=x,f=y,u=0,p=w;p;p=on(p))u++;for(p=0,v=f;v;v=on(v))p++;for(;0<u-p;)w=on(w),u--;for(;0<p-u;)f=on(f),p--;for(;u--;){if(w===f||f!==null&&w===f.alternate)break t;w=on(w),f=on(f)}w=null}else w=null;x!==null&&Zo(h,m,x,w,!1),y!==null&&O!==null&&Zo(h,O,y,w,!0)}}e:{if(m=d?mn(d):window,x=m.nodeName&&m.nodeName.toLowerCase(),x==="select"||x==="input"&&m.type==="file")var S=Tp;else if(Ho(m))if(Oc)S=Fp;else{S=Rp;var C=Ap}else(x=m.nodeName)&&x.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(S=Op);if(S&&(S=S(e,d))){Rc(h,S,n,g);break e}C&&C(e,m,d),e==="focusout"&&(C=m._wrapperState)&&C.controlled&&m.type==="number"&&Ii(m,"number",m.value)}switch(C=d?mn(d):window,e){case"focusin":(Ho(C)||C.contentEditable==="true")&&(pn=C,Xi=d,ar=null);break;case"focusout":ar=Xi=pn=null;break;case"mousedown":Zi=!0;break;case"contextmenu":case"mouseup":case"dragend":Zi=!1,qo(h,n,g);break;case"selectionchange":if(Ip)break;case"keydown":case"keyup":qo(h,n,g)}var N;if(Vl)e:{switch(e){case"compositionstart":var E="onCompositionStart";break e;case"compositionend":E="onCompositionEnd";break e;case"compositionupdate":E="onCompositionUpdate";break e}E=void 0}else dn?Tc(e,n)&&(E="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(E="onCompositionStart");E&&(Lc&&n.locale!=="ko"&&(dn||E!=="onCompositionStart"?E==="onCompositionEnd"&&dn&&(N=Mc()):(Et=g,Bl="value"in Et?Et.value:Et.textContent,dn=!0)),C=ya(d,E),0<C.length&&(E=new Bo(E,e,null,n,g),h.push({event:E,listeners:C}),N?E.data=N:(N=Ac(n),N!==null&&(E.data=N)))),(N=zp?Ep(e,n):Pp(e,n))&&(d=ya(d,"onBeforeInput"),0<d.length&&(g=new Bo("onBeforeInput","beforeinput",null,n,g),h.push({event:g,listeners:d}),g.data=N))}Wc(h,t)})}function xr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ya(e,t){for(var n=t+"Capture",r=[];e!==null;){var a=e,l=a.stateNode;a.tag===5&&l!==null&&(a=l,l=dr(e,n),l!=null&&r.unshift(xr(e,l,a)),l=dr(e,t),l!=null&&r.push(xr(e,l,a))),e=e.return}return r}function on(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Zo(e,t,n,r,a){for(var l=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,d=s.stateNode;if(c!==null&&c===r)break;s.tag===5&&d!==null&&(s=d,a?(c=dr(n,l),c!=null&&o.unshift(xr(n,c,s))):a||(c=dr(n,l),c!=null&&o.push(xr(n,c,s)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Vp=/\r\n?/g,Hp=/\u0000|\uFFFD/g;function es(e){return(typeof e=="string"?e:""+e).replace(Vp,`
`).replace(Hp,"")}function Hr(e,t,n){if(t=es(t),es(e)!==t&&n)throw Error(j(425))}function ka(){}var el=null,tl=null;function nl(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var rl=typeof setTimeout=="function"?setTimeout:void 0,Wp=typeof clearTimeout=="function"?clearTimeout:void 0,ts=typeof Promise=="function"?Promise:void 0,Gp=typeof queueMicrotask=="function"?queueMicrotask:typeof ts<"u"?function(e){return ts.resolve(null).then(e).catch(Qp)}:rl;function Qp(e){setTimeout(function(){throw e})}function yi(e,t){var n=t,r=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"){if(r===0){e.removeChild(a),mr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=a}while(n);mr(t)}function At(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ns(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Dn=Math.random().toString(36).slice(2),st="__reactFiber$"+Dn,yr="__reactProps$"+Dn,xt="__reactContainer$"+Dn,al="__reactEvents$"+Dn,Jp="__reactListeners$"+Dn,qp="__reactHandles$"+Dn;function Qt(e){var t=e[st];if(t)return t;for(var n=e.parentNode;n;){if(t=n[xt]||n[st]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ns(e);e!==null;){if(n=e[st])return n;e=ns(e)}return t}e=n,n=e.parentNode}return null}function Pr(e){return e=e[st]||e[xt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function mn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(j(33))}function Ka(e){return e[yr]||null}var il=[],hn=-1;function Ut(e){return{current:e}}function Y(e){0>hn||(e.current=il[hn],il[hn]=null,hn--)}function J(e,t){hn++,il[hn]=e.current,e.current=t}var It={},_e=Ut(It),Me=Ut(!1),Zt=It;function En(e,t){var n=e.type.contextTypes;if(!n)return It;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var a={},l;for(l in n)a[l]=t[l];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=a),a}function Le(e){return e=e.childContextTypes,e!=null}function ba(){Y(Me),Y(_e)}function rs(e,t,n){if(_e.current!==It)throw Error(j(168));J(_e,t),J(Me,n)}function Qc(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var a in r)if(!(a in t))throw Error(j(108,Ad(e)||"Unknown",a));return re({},n,r)}function wa(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||It,Zt=_e.current,J(_e,e),J(Me,Me.current),!0}function as(e,t,n){var r=e.stateNode;if(!r)throw Error(j(169));n?(e=Qc(e,t,Zt),r.__reactInternalMemoizedMergedChildContext=e,Y(Me),Y(_e),J(_e,e)):Y(Me),J(Me,n)}var ft=null,Va=!1,ki=!1;function Jc(e){ft===null?ft=[e]:ft.push(e)}function Yp(e){Va=!0,Jc(e)}function Kt(){if(!ki&&ft!==null){ki=!0;var e=0,t=Q;try{var n=ft;for(Q=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}ft=null,Va=!1}catch(a){throw ft!==null&&(ft=ft.slice(e+1)),kc(Fl,Kt),a}finally{Q=t,ki=!1}}return null}var gn=[],vn=0,ja=null,_a=0,Ve=[],He=0,en=null,mt=1,ht="";function Wt(e,t){gn[vn++]=_a,gn[vn++]=ja,ja=e,_a=t}function qc(e,t,n){Ve[He++]=mt,Ve[He++]=ht,Ve[He++]=en,en=e;var r=mt;e=ht;var a=32-nt(r)-1;r&=~(1<<a),n+=1;var l=32-nt(t)+a;if(30<l){var o=a-a%5;l=(r&(1<<o)-1).toString(32),r>>=o,a-=o,mt=1<<32-nt(t)+a|n<<a|r,ht=l+e}else mt=1<<l|n<<a|r,ht=e}function Wl(e){e.return!==null&&(Wt(e,1),qc(e,1,0))}function Gl(e){for(;e===ja;)ja=gn[--vn],gn[vn]=null,_a=gn[--vn],gn[vn]=null;for(;e===en;)en=Ve[--He],Ve[He]=null,ht=Ve[--He],Ve[He]=null,mt=Ve[--He],Ve[He]=null}var Ie=null,$e=null,Z=!1,tt=null;function Yc(e,t){var n=We(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function is(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ie=e,$e=At(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ie=e,$e=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=en!==null?{id:mt,overflow:ht}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=We(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Ie=e,$e=null,!0):!1;default:return!1}}function ll(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ol(e){if(Z){var t=$e;if(t){var n=t;if(!is(e,t)){if(ll(e))throw Error(j(418));t=At(n.nextSibling);var r=Ie;t&&is(e,t)?Yc(r,n):(e.flags=e.flags&-4097|2,Z=!1,Ie=e)}}else{if(ll(e))throw Error(j(418));e.flags=e.flags&-4097|2,Z=!1,Ie=e}}}function ls(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ie=e}function Wr(e){if(e!==Ie)return!1;if(!Z)return ls(e),Z=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!nl(e.type,e.memoizedProps)),t&&(t=$e)){if(ll(e))throw Xc(),Error(j(418));for(;t;)Yc(e,t),t=At(t.nextSibling)}if(ls(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(j(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){$e=At(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}$e=null}}else $e=Ie?At(e.stateNode.nextSibling):null;return!0}function Xc(){for(var e=$e;e;)e=At(e.nextSibling)}function Pn(){$e=Ie=null,Z=!1}function Ql(e){tt===null?tt=[e]:tt.push(e)}var Xp=wt.ReactCurrentBatchConfig;function Wn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(j(309));var r=n.stateNode}if(!r)throw Error(j(147,e));var a=r,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(o){var s=a.refs;o===null?delete s[l]:s[l]=o},t._stringRef=l,t)}if(typeof e!="string")throw Error(j(284));if(!n._owner)throw Error(j(290,e))}return e}function Gr(e,t){throw e=Object.prototype.toString.call(t),Error(j(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function os(e){var t=e._init;return t(e._payload)}function Zc(e){function t(f,u){if(e){var p=f.deletions;p===null?(f.deletions=[u],f.flags|=16):p.push(u)}}function n(f,u){if(!e)return null;for(;u!==null;)t(f,u),u=u.sibling;return null}function r(f,u){for(f=new Map;u!==null;)u.key!==null?f.set(u.key,u):f.set(u.index,u),u=u.sibling;return f}function a(f,u){return f=Dt(f,u),f.index=0,f.sibling=null,f}function l(f,u,p){return f.index=p,e?(p=f.alternate,p!==null?(p=p.index,p<u?(f.flags|=2,u):p):(f.flags|=2,u)):(f.flags|=1048576,u)}function o(f){return e&&f.alternate===null&&(f.flags|=2),f}function s(f,u,p,v){return u===null||u.tag!==6?(u=Ci(p,f.mode,v),u.return=f,u):(u=a(u,p),u.return=f,u)}function c(f,u,p,v){var S=p.type;return S===un?g(f,u,p.props.children,v,p.key):u!==null&&(u.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===St&&os(S)===u.type)?(v=a(u,p.props),v.ref=Wn(f,u,p),v.return=f,v):(v=ua(p.type,p.key,p.props,null,f.mode,v),v.ref=Wn(f,u,p),v.return=f,v)}function d(f,u,p,v){return u===null||u.tag!==4||u.stateNode.containerInfo!==p.containerInfo||u.stateNode.implementation!==p.implementation?(u=zi(p,f.mode,v),u.return=f,u):(u=a(u,p.children||[]),u.return=f,u)}function g(f,u,p,v,S){return u===null||u.tag!==7?(u=Xt(p,f.mode,v,S),u.return=f,u):(u=a(u,p),u.return=f,u)}function h(f,u,p){if(typeof u=="string"&&u!==""||typeof u=="number")return u=Ci(""+u,f.mode,p),u.return=f,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Or:return p=ua(u.type,u.key,u.props,null,f.mode,p),p.ref=Wn(f,null,u),p.return=f,p;case cn:return u=zi(u,f.mode,p),u.return=f,u;case St:var v=u._init;return h(f,v(u._payload),p)}if(qn(u)||Bn(u))return u=Xt(u,f.mode,p,null),u.return=f,u;Gr(f,u)}return null}function m(f,u,p,v){var S=u!==null?u.key:null;if(typeof p=="string"&&p!==""||typeof p=="number")return S!==null?null:s(f,u,""+p,v);if(typeof p=="object"&&p!==null){switch(p.$$typeof){case Or:return p.key===S?c(f,u,p,v):null;case cn:return p.key===S?d(f,u,p,v):null;case St:return S=p._init,m(f,u,S(p._payload),v)}if(qn(p)||Bn(p))return S!==null?null:g(f,u,p,v,null);Gr(f,p)}return null}function x(f,u,p,v,S){if(typeof v=="string"&&v!==""||typeof v=="number")return f=f.get(p)||null,s(u,f,""+v,S);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Or:return f=f.get(v.key===null?p:v.key)||null,c(u,f,v,S);case cn:return f=f.get(v.key===null?p:v.key)||null,d(u,f,v,S);case St:var C=v._init;return x(f,u,p,C(v._payload),S)}if(qn(v)||Bn(v))return f=f.get(p)||null,g(u,f,v,S,null);Gr(u,v)}return null}function y(f,u,p,v){for(var S=null,C=null,N=u,E=u=0,I=null;N!==null&&E<p.length;E++){N.index>E?(I=N,N=null):I=N.sibling;var M=m(f,N,p[E],v);if(M===null){N===null&&(N=I);break}e&&N&&M.alternate===null&&t(f,N),u=l(M,u,E),C===null?S=M:C.sibling=M,C=M,N=I}if(E===p.length)return n(f,N),Z&&Wt(f,E),S;if(N===null){for(;E<p.length;E++)N=h(f,p[E],v),N!==null&&(u=l(N,u,E),C===null?S=N:C.sibling=N,C=N);return Z&&Wt(f,E),S}for(N=r(f,N);E<p.length;E++)I=x(N,f,E,p[E],v),I!==null&&(e&&I.alternate!==null&&N.delete(I.key===null?E:I.key),u=l(I,u,E),C===null?S=I:C.sibling=I,C=I);return e&&N.forEach(function($){return t(f,$)}),Z&&Wt(f,E),S}function w(f,u,p,v){var S=Bn(p);if(typeof S!="function")throw Error(j(150));if(p=S.call(p),p==null)throw Error(j(151));for(var C=S=null,N=u,E=u=0,I=null,M=p.next();N!==null&&!M.done;E++,M=p.next()){N.index>E?(I=N,N=null):I=N.sibling;var $=m(f,N,M.value,v);if($===null){N===null&&(N=I);break}e&&N&&$.alternate===null&&t(f,N),u=l($,u,E),C===null?S=$:C.sibling=$,C=$,N=I}if(M.done)return n(f,N),Z&&Wt(f,E),S;if(N===null){for(;!M.done;E++,M=p.next())M=h(f,M.value,v),M!==null&&(u=l(M,u,E),C===null?S=M:C.sibling=M,C=M);return Z&&Wt(f,E),S}for(N=r(f,N);!M.done;E++,M=p.next())M=x(N,f,E,M.value,v),M!==null&&(e&&M.alternate!==null&&N.delete(M.key===null?E:M.key),u=l(M,u,E),C===null?S=M:C.sibling=M,C=M);return e&&N.forEach(function(X){return t(f,X)}),Z&&Wt(f,E),S}function O(f,u,p,v){if(typeof p=="object"&&p!==null&&p.type===un&&p.key===null&&(p=p.props.children),typeof p=="object"&&p!==null){switch(p.$$typeof){case Or:e:{for(var S=p.key,C=u;C!==null;){if(C.key===S){if(S=p.type,S===un){if(C.tag===7){n(f,C.sibling),u=a(C,p.props.children),u.return=f,f=u;break e}}else if(C.elementType===S||typeof S=="object"&&S!==null&&S.$$typeof===St&&os(S)===C.type){n(f,C.sibling),u=a(C,p.props),u.ref=Wn(f,C,p),u.return=f,f=u;break e}n(f,C);break}else t(f,C);C=C.sibling}p.type===un?(u=Xt(p.props.children,f.mode,v,p.key),u.return=f,f=u):(v=ua(p.type,p.key,p.props,null,f.mode,v),v.ref=Wn(f,u,p),v.return=f,f=v)}return o(f);case cn:e:{for(C=p.key;u!==null;){if(u.key===C)if(u.tag===4&&u.stateNode.containerInfo===p.containerInfo&&u.stateNode.implementation===p.implementation){n(f,u.sibling),u=a(u,p.children||[]),u.return=f,f=u;break e}else{n(f,u);break}else t(f,u);u=u.sibling}u=zi(p,f.mode,v),u.return=f,f=u}return o(f);case St:return C=p._init,O(f,u,C(p._payload),v)}if(qn(p))return y(f,u,p,v);if(Bn(p))return w(f,u,p,v);Gr(f,p)}return typeof p=="string"&&p!==""||typeof p=="number"?(p=""+p,u!==null&&u.tag===6?(n(f,u.sibling),u=a(u,p),u.return=f,f=u):(n(f,u),u=Ci(p,f.mode,v),u.return=f,f=u),o(f)):n(f,u)}return O}var Mn=Zc(!0),eu=Zc(!1),Sa=Ut(null),Na=null,xn=null,Jl=null;function ql(){Jl=xn=Na=null}function Yl(e){var t=Sa.current;Y(Sa),e._currentValue=t}function sl(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Nn(e,t){Na=e,Jl=xn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Pe=!0),e.firstContext=null)}function Je(e){var t=e._currentValue;if(Jl!==e)if(e={context:e,memoizedValue:t,next:null},xn===null){if(Na===null)throw Error(j(308));xn=e,Na.dependencies={lanes:0,firstContext:e}}else xn=xn.next=e;return t}var Jt=null;function Xl(e){Jt===null?Jt=[e]:Jt.push(e)}function tu(e,t,n,r){var a=t.interleaved;return a===null?(n.next=n,Xl(t)):(n.next=a.next,a.next=n),t.interleaved=n,yt(e,r)}function yt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Nt=!1;function Zl(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function nu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function gt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Rt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,W&2){var a=r.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),r.pending=t,yt(e,n)}return a=r.interleaved,a===null?(t.next=t,Xl(r)):(t.next=a.next,a.next=t),r.interleaved=t,yt(e,n)}function aa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Dl(e,n)}}function ss(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var a=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?a=l=o:l=l.next=o,n=n.next}while(n!==null);l===null?a=l=t:l=l.next=t}else a=l=t;n={baseState:r.baseState,firstBaseUpdate:a,lastBaseUpdate:l,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Ca(e,t,n,r){var a=e.updateQueue;Nt=!1;var l=a.firstBaseUpdate,o=a.lastBaseUpdate,s=a.shared.pending;if(s!==null){a.shared.pending=null;var c=s,d=c.next;c.next=null,o===null?l=d:o.next=d,o=c;var g=e.alternate;g!==null&&(g=g.updateQueue,s=g.lastBaseUpdate,s!==o&&(s===null?g.firstBaseUpdate=d:s.next=d,g.lastBaseUpdate=c))}if(l!==null){var h=a.baseState;o=0,g=d=c=null,s=l;do{var m=s.lane,x=s.eventTime;if((r&m)===m){g!==null&&(g=g.next={eventTime:x,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var y=e,w=s;switch(m=t,x=n,w.tag){case 1:if(y=w.payload,typeof y=="function"){h=y.call(x,h,m);break e}h=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=w.payload,m=typeof y=="function"?y.call(x,h,m):y,m==null)break e;h=re({},h,m);break e;case 2:Nt=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,m=a.effects,m===null?a.effects=[s]:m.push(s))}else x={eventTime:x,lane:m,tag:s.tag,payload:s.payload,callback:s.callback,next:null},g===null?(d=g=x,c=h):g=g.next=x,o|=m;if(s=s.next,s===null){if(s=a.shared.pending,s===null)break;m=s,s=m.next,m.next=null,a.lastBaseUpdate=m,a.shared.pending=null}}while(!0);if(g===null&&(c=h),a.baseState=c,a.firstBaseUpdate=d,a.lastBaseUpdate=g,t=a.shared.interleaved,t!==null){a=t;do o|=a.lane,a=a.next;while(a!==t)}else l===null&&(a.shared.lanes=0);nn|=o,e.lanes=o,e.memoizedState=h}}function cs(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],a=r.callback;if(a!==null){if(r.callback=null,r=n,typeof a!="function")throw Error(j(191,a));a.call(r)}}}var Mr={},ut=Ut(Mr),kr=Ut(Mr),br=Ut(Mr);function qt(e){if(e===Mr)throw Error(j(174));return e}function eo(e,t){switch(J(br,t),J(kr,e),J(ut,Mr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Ui(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Ui(t,e)}Y(ut),J(ut,t)}function Ln(){Y(ut),Y(kr),Y(br)}function ru(e){qt(br.current);var t=qt(ut.current),n=Ui(t,e.type);t!==n&&(J(kr,e),J(ut,n))}function to(e){kr.current===e&&(Y(ut),Y(kr))}var te=Ut(0);function za(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var bi=[];function no(){for(var e=0;e<bi.length;e++)bi[e]._workInProgressVersionPrimary=null;bi.length=0}var ia=wt.ReactCurrentDispatcher,wi=wt.ReactCurrentBatchConfig,tn=0,ne=null,de=null,me=null,Ea=!1,ir=!1,wr=0,Zp=0;function be(){throw Error(j(321))}function ro(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!at(e[n],t[n]))return!1;return!0}function ao(e,t,n,r,a,l){if(tn=l,ne=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ia.current=e===null||e.memoizedState===null?rf:af,e=n(r,a),ir){l=0;do{if(ir=!1,wr=0,25<=l)throw Error(j(301));l+=1,me=de=null,t.updateQueue=null,ia.current=lf,e=n(r,a)}while(ir)}if(ia.current=Pa,t=de!==null&&de.next!==null,tn=0,me=de=ne=null,Ea=!1,t)throw Error(j(300));return e}function io(){var e=wr!==0;return wr=0,e}function ot(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return me===null?ne.memoizedState=me=e:me=me.next=e,me}function qe(){if(de===null){var e=ne.alternate;e=e!==null?e.memoizedState:null}else e=de.next;var t=me===null?ne.memoizedState:me.next;if(t!==null)me=t,de=e;else{if(e===null)throw Error(j(310));de=e,e={memoizedState:de.memoizedState,baseState:de.baseState,baseQueue:de.baseQueue,queue:de.queue,next:null},me===null?ne.memoizedState=me=e:me=me.next=e}return me}function jr(e,t){return typeof t=="function"?t(e):t}function ji(e){var t=qe(),n=t.queue;if(n===null)throw Error(j(311));n.lastRenderedReducer=e;var r=de,a=r.baseQueue,l=n.pending;if(l!==null){if(a!==null){var o=a.next;a.next=l.next,l.next=o}r.baseQueue=a=l,n.pending=null}if(a!==null){l=a.next,r=r.baseState;var s=o=null,c=null,d=l;do{var g=d.lane;if((tn&g)===g)c!==null&&(c=c.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var h={lane:g,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};c===null?(s=c=h,o=r):c=c.next=h,ne.lanes|=g,nn|=g}d=d.next}while(d!==null&&d!==l);c===null?o=r:c.next=s,at(r,t.memoizedState)||(Pe=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=c,n.lastRenderedState=r}if(e=n.interleaved,e!==null){a=e;do l=a.lane,ne.lanes|=l,nn|=l,a=a.next;while(a!==e)}else a===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function _i(e){var t=qe(),n=t.queue;if(n===null)throw Error(j(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,l=t.memoizedState;if(a!==null){n.pending=null;var o=a=a.next;do l=e(l,o.action),o=o.next;while(o!==a);at(l,t.memoizedState)||(Pe=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,r]}function au(){}function iu(e,t){var n=ne,r=qe(),a=t(),l=!at(r.memoizedState,a);if(l&&(r.memoizedState=a,Pe=!0),r=r.queue,lo(su.bind(null,n,r,e),[e]),r.getSnapshot!==t||l||me!==null&&me.memoizedState.tag&1){if(n.flags|=2048,_r(9,ou.bind(null,n,r,a,t),void 0,null),he===null)throw Error(j(349));tn&30||lu(n,t,a)}return a}function lu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ne.updateQueue,t===null?(t={lastEffect:null,stores:null},ne.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ou(e,t,n,r){t.value=n,t.getSnapshot=r,cu(t)&&uu(e)}function su(e,t,n){return n(function(){cu(t)&&uu(e)})}function cu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!at(e,n)}catch{return!0}}function uu(e){var t=yt(e,1);t!==null&&rt(t,e,1,-1)}function us(e){var t=ot();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:jr,lastRenderedState:e},t.queue=e,e=e.dispatch=nf.bind(null,ne,e),[t.memoizedState,e]}function _r(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=ne.updateQueue,t===null?(t={lastEffect:null,stores:null},ne.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function du(){return qe().memoizedState}function la(e,t,n,r){var a=ot();ne.flags|=e,a.memoizedState=_r(1|t,n,void 0,r===void 0?null:r)}function Ha(e,t,n,r){var a=qe();r=r===void 0?null:r;var l=void 0;if(de!==null){var o=de.memoizedState;if(l=o.destroy,r!==null&&ro(r,o.deps)){a.memoizedState=_r(t,n,l,r);return}}ne.flags|=e,a.memoizedState=_r(1|t,n,l,r)}function ds(e,t){return la(8390656,8,e,t)}function lo(e,t){return Ha(2048,8,e,t)}function pu(e,t){return Ha(4,2,e,t)}function fu(e,t){return Ha(4,4,e,t)}function mu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function hu(e,t,n){return n=n!=null?n.concat([e]):null,Ha(4,4,mu.bind(null,t,e),n)}function oo(){}function gu(e,t){var n=qe();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ro(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function vu(e,t){var n=qe();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ro(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function xu(e,t,n){return tn&21?(at(n,t)||(n=jc(),ne.lanes|=n,nn|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Pe=!0),e.memoizedState=n)}function ef(e,t){var n=Q;Q=n!==0&&4>n?n:4,e(!0);var r=wi.transition;wi.transition={};try{e(!1),t()}finally{Q=n,wi.transition=r}}function yu(){return qe().memoizedState}function tf(e,t,n){var r=Ft(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},ku(e))bu(t,n);else if(n=tu(e,t,n,r),n!==null){var a=Ne();rt(n,e,r,a),wu(n,t,r)}}function nf(e,t,n){var r=Ft(e),a={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(ku(e))bu(t,a);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var o=t.lastRenderedState,s=l(o,n);if(a.hasEagerState=!0,a.eagerState=s,at(s,o)){var c=t.interleaved;c===null?(a.next=a,Xl(t)):(a.next=c.next,c.next=a),t.interleaved=a;return}}catch{}finally{}n=tu(e,t,a,r),n!==null&&(a=Ne(),rt(n,e,r,a),wu(n,t,r))}}function ku(e){var t=e.alternate;return e===ne||t!==null&&t===ne}function bu(e,t){ir=Ea=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function wu(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Dl(e,n)}}var Pa={readContext:Je,useCallback:be,useContext:be,useEffect:be,useImperativeHandle:be,useInsertionEffect:be,useLayoutEffect:be,useMemo:be,useReducer:be,useRef:be,useState:be,useDebugValue:be,useDeferredValue:be,useTransition:be,useMutableSource:be,useSyncExternalStore:be,useId:be,unstable_isNewReconciler:!1},rf={readContext:Je,useCallback:function(e,t){return ot().memoizedState=[e,t===void 0?null:t],e},useContext:Je,useEffect:ds,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,la(4194308,4,mu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return la(4194308,4,e,t)},useInsertionEffect:function(e,t){return la(4,2,e,t)},useMemo:function(e,t){var n=ot();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=ot();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=tf.bind(null,ne,e),[r.memoizedState,e]},useRef:function(e){var t=ot();return e={current:e},t.memoizedState=e},useState:us,useDebugValue:oo,useDeferredValue:function(e){return ot().memoizedState=e},useTransition:function(){var e=us(!1),t=e[0];return e=ef.bind(null,e[1]),ot().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=ne,a=ot();if(Z){if(n===void 0)throw Error(j(407));n=n()}else{if(n=t(),he===null)throw Error(j(349));tn&30||lu(r,t,n)}a.memoizedState=n;var l={value:n,getSnapshot:t};return a.queue=l,ds(su.bind(null,r,l,e),[e]),r.flags|=2048,_r(9,ou.bind(null,r,l,n,t),void 0,null),n},useId:function(){var e=ot(),t=he.identifierPrefix;if(Z){var n=ht,r=mt;n=(r&~(1<<32-nt(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=wr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Zp++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},af={readContext:Je,useCallback:gu,useContext:Je,useEffect:lo,useImperativeHandle:hu,useInsertionEffect:pu,useLayoutEffect:fu,useMemo:vu,useReducer:ji,useRef:du,useState:function(){return ji(jr)},useDebugValue:oo,useDeferredValue:function(e){var t=qe();return xu(t,de.memoizedState,e)},useTransition:function(){var e=ji(jr)[0],t=qe().memoizedState;return[e,t]},useMutableSource:au,useSyncExternalStore:iu,useId:yu,unstable_isNewReconciler:!1},lf={readContext:Je,useCallback:gu,useContext:Je,useEffect:lo,useImperativeHandle:hu,useInsertionEffect:pu,useLayoutEffect:fu,useMemo:vu,useReducer:_i,useRef:du,useState:function(){return _i(jr)},useDebugValue:oo,useDeferredValue:function(e){var t=qe();return de===null?t.memoizedState=e:xu(t,de.memoizedState,e)},useTransition:function(){var e=_i(jr)[0],t=qe().memoizedState;return[e,t]},useMutableSource:au,useSyncExternalStore:iu,useId:yu,unstable_isNewReconciler:!1};function Ze(e,t){if(e&&e.defaultProps){t=re({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function cl(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:re({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Wa={isMounted:function(e){return(e=e._reactInternals)?ln(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Ne(),a=Ft(e),l=gt(r,a);l.payload=t,n!=null&&(l.callback=n),t=Rt(e,l,a),t!==null&&(rt(t,e,a,r),aa(t,e,a))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Ne(),a=Ft(e),l=gt(r,a);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=Rt(e,l,a),t!==null&&(rt(t,e,a,r),aa(t,e,a))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ne(),r=Ft(e),a=gt(n,r);a.tag=2,t!=null&&(a.callback=t),t=Rt(e,a,r),t!==null&&(rt(t,e,r,n),aa(t,e,r))}};function ps(e,t,n,r,a,l,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,l,o):t.prototype&&t.prototype.isPureReactComponent?!gr(n,r)||!gr(a,l):!0}function ju(e,t,n){var r=!1,a=It,l=t.contextType;return typeof l=="object"&&l!==null?l=Je(l):(a=Le(t)?Zt:_e.current,r=t.contextTypes,l=(r=r!=null)?En(e,a):It),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Wa,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=a,e.__reactInternalMemoizedMaskedChildContext=l),t}function fs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Wa.enqueueReplaceState(t,t.state,null)}function ul(e,t,n,r){var a=e.stateNode;a.props=n,a.state=e.memoizedState,a.refs={},Zl(e);var l=t.contextType;typeof l=="object"&&l!==null?a.context=Je(l):(l=Le(t)?Zt:_e.current,a.context=En(e,l)),a.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(cl(e,t,l,n),a.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(t=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),t!==a.state&&Wa.enqueueReplaceState(a,a.state,null),Ca(e,n,a,r),a.state=e.memoizedState),typeof a.componentDidMount=="function"&&(e.flags|=4194308)}function Tn(e,t){try{var n="",r=t;do n+=Td(r),r=r.return;while(r);var a=n}catch(l){a=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:a,digest:null}}function Si(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function dl(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var of=typeof WeakMap=="function"?WeakMap:Map;function _u(e,t,n){n=gt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){La||(La=!0,bl=r),dl(e,t)},n}function Su(e,t,n){n=gt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var a=t.value;n.payload=function(){return r(a)},n.callback=function(){dl(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){dl(e,t),typeof r!="function"&&(Ot===null?Ot=new Set([this]):Ot.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function ms(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new of;var a=new Set;r.set(t,a)}else a=r.get(t),a===void 0&&(a=new Set,r.set(t,a));a.has(n)||(a.add(n),e=bf.bind(null,e,t,n),t.then(e,e))}function hs(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function gs(e,t,n,r,a){return e.mode&1?(e.flags|=65536,e.lanes=a,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=gt(-1,1),t.tag=2,Rt(n,t,1))),n.lanes|=1),e)}var sf=wt.ReactCurrentOwner,Pe=!1;function Se(e,t,n,r){t.child=e===null?eu(t,null,n,r):Mn(t,e.child,n,r)}function vs(e,t,n,r,a){n=n.render;var l=t.ref;return Nn(t,a),r=ao(e,t,n,r,l,a),n=io(),e!==null&&!Pe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a,kt(e,t,a)):(Z&&n&&Wl(t),t.flags|=1,Se(e,t,r,a),t.child)}function xs(e,t,n,r,a){if(e===null){var l=n.type;return typeof l=="function"&&!go(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,Nu(e,t,l,r,a)):(e=ua(n.type,null,r,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&a)){var o=l.memoizedProps;if(n=n.compare,n=n!==null?n:gr,n(o,r)&&e.ref===t.ref)return kt(e,t,a)}return t.flags|=1,e=Dt(l,r),e.ref=t.ref,e.return=t,t.child=e}function Nu(e,t,n,r,a){if(e!==null){var l=e.memoizedProps;if(gr(l,r)&&e.ref===t.ref)if(Pe=!1,t.pendingProps=r=l,(e.lanes&a)!==0)e.flags&131072&&(Pe=!0);else return t.lanes=e.lanes,kt(e,t,a)}return pl(e,t,n,r,a)}function Cu(e,t,n){var r=t.pendingProps,a=r.children,l=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},J(kn,De),De|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,J(kn,De),De|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=l!==null?l.baseLanes:n,J(kn,De),De|=r}else l!==null?(r=l.baseLanes|n,t.memoizedState=null):r=n,J(kn,De),De|=r;return Se(e,t,a,n),t.child}function zu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function pl(e,t,n,r,a){var l=Le(n)?Zt:_e.current;return l=En(t,l),Nn(t,a),n=ao(e,t,n,r,l,a),r=io(),e!==null&&!Pe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a,kt(e,t,a)):(Z&&r&&Wl(t),t.flags|=1,Se(e,t,n,a),t.child)}function ys(e,t,n,r,a){if(Le(n)){var l=!0;wa(t)}else l=!1;if(Nn(t,a),t.stateNode===null)oa(e,t),ju(t,n,r),ul(t,n,r,a),r=!0;else if(e===null){var o=t.stateNode,s=t.memoizedProps;o.props=s;var c=o.context,d=n.contextType;typeof d=="object"&&d!==null?d=Je(d):(d=Le(n)?Zt:_e.current,d=En(t,d));var g=n.getDerivedStateFromProps,h=typeof g=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(s!==r||c!==d)&&fs(t,o,r,d),Nt=!1;var m=t.memoizedState;o.state=m,Ca(t,r,o,a),c=t.memoizedState,s!==r||m!==c||Me.current||Nt?(typeof g=="function"&&(cl(t,n,g,r),c=t.memoizedState),(s=Nt||ps(t,n,s,r,m,c,d))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=c),o.props=r,o.state=c,o.context=d,r=s):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,nu(e,t),s=t.memoizedProps,d=t.type===t.elementType?s:Ze(t.type,s),o.props=d,h=t.pendingProps,m=o.context,c=n.contextType,typeof c=="object"&&c!==null?c=Je(c):(c=Le(n)?Zt:_e.current,c=En(t,c));var x=n.getDerivedStateFromProps;(g=typeof x=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(s!==h||m!==c)&&fs(t,o,r,c),Nt=!1,m=t.memoizedState,o.state=m,Ca(t,r,o,a);var y=t.memoizedState;s!==h||m!==y||Me.current||Nt?(typeof x=="function"&&(cl(t,n,x,r),y=t.memoizedState),(d=Nt||ps(t,n,d,r,m,y,c)||!1)?(g||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,y,c),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,y,c)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=y),o.props=r,o.state=y,o.context=c,r=d):(typeof o.componentDidUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),r=!1)}return fl(e,t,n,r,l,a)}function fl(e,t,n,r,a,l){zu(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return a&&as(t,n,!1),kt(e,t,l);r=t.stateNode,sf.current=t;var s=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=Mn(t,e.child,null,l),t.child=Mn(t,null,s,l)):Se(e,t,s,l),t.memoizedState=r.state,a&&as(t,n,!0),t.child}function Eu(e){var t=e.stateNode;t.pendingContext?rs(e,t.pendingContext,t.pendingContext!==t.context):t.context&&rs(e,t.context,!1),eo(e,t.containerInfo)}function ks(e,t,n,r,a){return Pn(),Ql(a),t.flags|=256,Se(e,t,n,r),t.child}var ml={dehydrated:null,treeContext:null,retryLane:0};function hl(e){return{baseLanes:e,cachePool:null,transitions:null}}function Pu(e,t,n){var r=t.pendingProps,a=te.current,l=!1,o=(t.flags&128)!==0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(a&2)!==0),s?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(a|=1),J(te,a&1),e===null)return ol(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,l?(r=t.mode,l=t.child,o={mode:"hidden",children:o},!(r&1)&&l!==null?(l.childLanes=0,l.pendingProps=o):l=Ja(o,r,0,null),e=Xt(e,r,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=hl(n),t.memoizedState=ml,e):so(t,o));if(a=e.memoizedState,a!==null&&(s=a.dehydrated,s!==null))return cf(e,t,o,r,s,a,n);if(l){l=r.fallback,o=t.mode,a=e.child,s=a.sibling;var c={mode:"hidden",children:r.children};return!(o&1)&&t.child!==a?(r=t.child,r.childLanes=0,r.pendingProps=c,t.deletions=null):(r=Dt(a,c),r.subtreeFlags=a.subtreeFlags&14680064),s!==null?l=Dt(s,l):(l=Xt(l,o,n,null),l.flags|=2),l.return=t,r.return=t,r.sibling=l,t.child=r,r=l,l=t.child,o=e.child.memoizedState,o=o===null?hl(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},l.memoizedState=o,l.childLanes=e.childLanes&~n,t.memoizedState=ml,r}return l=e.child,e=l.sibling,r=Dt(l,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function so(e,t){return t=Ja({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Qr(e,t,n,r){return r!==null&&Ql(r),Mn(t,e.child,null,n),e=so(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function cf(e,t,n,r,a,l,o){if(n)return t.flags&256?(t.flags&=-257,r=Si(Error(j(422))),Qr(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=r.fallback,a=t.mode,r=Ja({mode:"visible",children:r.children},a,0,null),l=Xt(l,a,o,null),l.flags|=2,r.return=t,l.return=t,r.sibling=l,t.child=r,t.mode&1&&Mn(t,e.child,null,o),t.child.memoizedState=hl(o),t.memoizedState=ml,l);if(!(t.mode&1))return Qr(e,t,o,null);if(a.data==="$!"){if(r=a.nextSibling&&a.nextSibling.dataset,r)var s=r.dgst;return r=s,l=Error(j(419)),r=Si(l,r,void 0),Qr(e,t,o,r)}if(s=(o&e.childLanes)!==0,Pe||s){if(r=he,r!==null){switch(o&-o){case 4:a=2;break;case 16:a=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:a=32;break;case 536870912:a=268435456;break;default:a=0}a=a&(r.suspendedLanes|o)?0:a,a!==0&&a!==l.retryLane&&(l.retryLane=a,yt(e,a),rt(r,e,a,-1))}return ho(),r=Si(Error(j(421))),Qr(e,t,o,r)}return a.data==="$?"?(t.flags|=128,t.child=e.child,t=wf.bind(null,e),a._reactRetry=t,null):(e=l.treeContext,$e=At(a.nextSibling),Ie=t,Z=!0,tt=null,e!==null&&(Ve[He++]=mt,Ve[He++]=ht,Ve[He++]=en,mt=e.id,ht=e.overflow,en=t),t=so(t,r.children),t.flags|=4096,t)}function bs(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),sl(e.return,t,n)}function Ni(e,t,n,r,a){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:a}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=r,l.tail=n,l.tailMode=a)}function Mu(e,t,n){var r=t.pendingProps,a=r.revealOrder,l=r.tail;if(Se(e,t,r.children,n),r=te.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&bs(e,n,t);else if(e.tag===19)bs(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(J(te,r),!(t.mode&1))t.memoizedState=null;else switch(a){case"forwards":for(n=t.child,a=null;n!==null;)e=n.alternate,e!==null&&za(e)===null&&(a=n),n=n.sibling;n=a,n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Ni(t,!1,a,n,l);break;case"backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&za(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Ni(t,!0,n,null,l);break;case"together":Ni(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function oa(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function kt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),nn|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(j(153));if(t.child!==null){for(e=t.child,n=Dt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Dt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function uf(e,t,n){switch(t.tag){case 3:Eu(t),Pn();break;case 5:ru(t);break;case 1:Le(t.type)&&wa(t);break;case 4:eo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,a=t.memoizedProps.value;J(Sa,r._currentValue),r._currentValue=a;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(J(te,te.current&1),t.flags|=128,null):n&t.child.childLanes?Pu(e,t,n):(J(te,te.current&1),e=kt(e,t,n),e!==null?e.sibling:null);J(te,te.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Mu(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),J(te,te.current),r)break;return null;case 22:case 23:return t.lanes=0,Cu(e,t,n)}return kt(e,t,n)}var Lu,gl,Tu,Au;Lu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};gl=function(){};Tu=function(e,t,n,r){var a=e.memoizedProps;if(a!==r){e=t.stateNode,qt(ut.current);var l=null;switch(n){case"input":a=Di(e,a),r=Di(e,r),l=[];break;case"select":a=re({},a,{value:void 0}),r=re({},r,{value:void 0}),l=[];break;case"textarea":a=Bi(e,a),r=Bi(e,r),l=[];break;default:typeof a.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=ka)}Ki(n,r);var o;n=null;for(d in a)if(!r.hasOwnProperty(d)&&a.hasOwnProperty(d)&&a[d]!=null)if(d==="style"){var s=a[d];for(o in s)s.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(cr.hasOwnProperty(d)?l||(l=[]):(l=l||[]).push(d,null));for(d in r){var c=r[d];if(s=a!=null?a[d]:void 0,r.hasOwnProperty(d)&&c!==s&&(c!=null||s!=null))if(d==="style")if(s){for(o in s)!s.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in c)c.hasOwnProperty(o)&&s[o]!==c[o]&&(n||(n={}),n[o]=c[o])}else n||(l||(l=[]),l.push(d,n)),n=c;else d==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,s=s?s.__html:void 0,c!=null&&s!==c&&(l=l||[]).push(d,c)):d==="children"?typeof c!="string"&&typeof c!="number"||(l=l||[]).push(d,""+c):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(cr.hasOwnProperty(d)?(c!=null&&d==="onScroll"&&q("scroll",e),l||s===c||(l=[])):(l=l||[]).push(d,c))}n&&(l=l||[]).push("style",n);var d=l;(t.updateQueue=d)&&(t.flags|=4)}};Au=function(e,t,n,r){n!==r&&(t.flags|=4)};function Gn(e,t){if(!Z)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function we(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,r|=a.subtreeFlags&14680064,r|=a.flags&14680064,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,r|=a.subtreeFlags,r|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function df(e,t,n){var r=t.pendingProps;switch(Gl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return we(t),null;case 1:return Le(t.type)&&ba(),we(t),null;case 3:return r=t.stateNode,Ln(),Y(Me),Y(_e),no(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Wr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,tt!==null&&(_l(tt),tt=null))),gl(e,t),we(t),null;case 5:to(t);var a=qt(br.current);if(n=t.type,e!==null&&t.stateNode!=null)Tu(e,t,n,r,a),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(j(166));return we(t),null}if(e=qt(ut.current),Wr(t)){r=t.stateNode,n=t.type;var l=t.memoizedProps;switch(r[st]=t,r[yr]=l,e=(t.mode&1)!==0,n){case"dialog":q("cancel",r),q("close",r);break;case"iframe":case"object":case"embed":q("load",r);break;case"video":case"audio":for(a=0;a<Xn.length;a++)q(Xn[a],r);break;case"source":q("error",r);break;case"img":case"image":case"link":q("error",r),q("load",r);break;case"details":q("toggle",r);break;case"input":Po(r,l),q("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!l.multiple},q("invalid",r);break;case"textarea":Lo(r,l),q("invalid",r)}Ki(n,l),a=null;for(var o in l)if(l.hasOwnProperty(o)){var s=l[o];o==="children"?typeof s=="string"?r.textContent!==s&&(l.suppressHydrationWarning!==!0&&Hr(r.textContent,s,e),a=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(l.suppressHydrationWarning!==!0&&Hr(r.textContent,s,e),a=["children",""+s]):cr.hasOwnProperty(o)&&s!=null&&o==="onScroll"&&q("scroll",r)}switch(n){case"input":Fr(r),Mo(r,l,!0);break;case"textarea":Fr(r),To(r);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(r.onclick=ka)}r=a,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=a.nodeType===9?a:a.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=sc(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[st]=t,e[yr]=r,Lu(e,t,!1,!1),t.stateNode=e;e:{switch(o=Vi(n,r),n){case"dialog":q("cancel",e),q("close",e),a=r;break;case"iframe":case"object":case"embed":q("load",e),a=r;break;case"video":case"audio":for(a=0;a<Xn.length;a++)q(Xn[a],e);a=r;break;case"source":q("error",e),a=r;break;case"img":case"image":case"link":q("error",e),q("load",e),a=r;break;case"details":q("toggle",e),a=r;break;case"input":Po(e,r),a=Di(e,r),q("invalid",e);break;case"option":a=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},a=re({},r,{value:void 0}),q("invalid",e);break;case"textarea":Lo(e,r),a=Bi(e,r),q("invalid",e);break;default:a=r}Ki(n,a),s=a;for(l in s)if(s.hasOwnProperty(l)){var c=s[l];l==="style"?dc(e,c):l==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&cc(e,c)):l==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&ur(e,c):typeof c=="number"&&ur(e,""+c):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(cr.hasOwnProperty(l)?c!=null&&l==="onScroll"&&q("scroll",e):c!=null&&Ll(e,l,c,o))}switch(n){case"input":Fr(e),Mo(e,r,!1);break;case"textarea":Fr(e),To(e);break;case"option":r.value!=null&&e.setAttribute("value",""+$t(r.value));break;case"select":e.multiple=!!r.multiple,l=r.value,l!=null?wn(e,!!r.multiple,l,!1):r.defaultValue!=null&&wn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof a.onClick=="function"&&(e.onclick=ka)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return we(t),null;case 6:if(e&&t.stateNode!=null)Au(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(j(166));if(n=qt(br.current),qt(ut.current),Wr(t)){if(r=t.stateNode,n=t.memoizedProps,r[st]=t,(l=r.nodeValue!==n)&&(e=Ie,e!==null))switch(e.tag){case 3:Hr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Hr(r.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[st]=t,t.stateNode=r}return we(t),null;case 13:if(Y(te),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Z&&$e!==null&&t.mode&1&&!(t.flags&128))Xc(),Pn(),t.flags|=98560,l=!1;else if(l=Wr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!l)throw Error(j(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(j(317));l[st]=t}else Pn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;we(t),l=!1}else tt!==null&&(_l(tt),tt=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||te.current&1?pe===0&&(pe=3):ho())),t.updateQueue!==null&&(t.flags|=4),we(t),null);case 4:return Ln(),gl(e,t),e===null&&vr(t.stateNode.containerInfo),we(t),null;case 10:return Yl(t.type._context),we(t),null;case 17:return Le(t.type)&&ba(),we(t),null;case 19:if(Y(te),l=t.memoizedState,l===null)return we(t),null;if(r=(t.flags&128)!==0,o=l.rendering,o===null)if(r)Gn(l,!1);else{if(pe!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=za(e),o!==null){for(t.flags|=128,Gn(l,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)l=n,e=r,l.flags&=14680066,o=l.alternate,o===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=o.childLanes,l.lanes=o.lanes,l.child=o.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=o.memoizedProps,l.memoizedState=o.memoizedState,l.updateQueue=o.updateQueue,l.type=o.type,e=o.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return J(te,te.current&1|2),t.child}e=e.sibling}l.tail!==null&&ie()>An&&(t.flags|=128,r=!0,Gn(l,!1),t.lanes=4194304)}else{if(!r)if(e=za(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Gn(l,!0),l.tail===null&&l.tailMode==="hidden"&&!o.alternate&&!Z)return we(t),null}else 2*ie()-l.renderingStartTime>An&&n!==1073741824&&(t.flags|=128,r=!0,Gn(l,!1),t.lanes=4194304);l.isBackwards?(o.sibling=t.child,t.child=o):(n=l.last,n!==null?n.sibling=o:t.child=o,l.last=o)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=ie(),t.sibling=null,n=te.current,J(te,r?n&1|2:n&1),t):(we(t),null);case 22:case 23:return mo(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?De&1073741824&&(we(t),t.subtreeFlags&6&&(t.flags|=8192)):we(t),null;case 24:return null;case 25:return null}throw Error(j(156,t.tag))}function pf(e,t){switch(Gl(t),t.tag){case 1:return Le(t.type)&&ba(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ln(),Y(Me),Y(_e),no(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return to(t),null;case 13:if(Y(te),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(j(340));Pn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Y(te),null;case 4:return Ln(),null;case 10:return Yl(t.type._context),null;case 22:case 23:return mo(),null;case 24:return null;default:return null}}var Jr=!1,je=!1,ff=typeof WeakSet=="function"?WeakSet:Set,T=null;function yn(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){ae(e,t,r)}else n.current=null}function vl(e,t,n){try{n()}catch(r){ae(e,t,r)}}var ws=!1;function mf(e,t){if(el=va,e=$c(),Hl(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,l=r.focusNode;r=r.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var o=0,s=-1,c=-1,d=0,g=0,h=e,m=null;t:for(;;){for(var x;h!==n||a!==0&&h.nodeType!==3||(s=o+a),h!==l||r!==0&&h.nodeType!==3||(c=o+r),h.nodeType===3&&(o+=h.nodeValue.length),(x=h.firstChild)!==null;)m=h,h=x;for(;;){if(h===e)break t;if(m===n&&++d===a&&(s=o),m===l&&++g===r&&(c=o),(x=h.nextSibling)!==null)break;h=m,m=h.parentNode}h=x}n=s===-1||c===-1?null:{start:s,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(tl={focusedElem:e,selectionRange:n},va=!1,T=t;T!==null;)if(t=T,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,T=e;else for(;T!==null;){t=T;try{var y=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(y!==null){var w=y.memoizedProps,O=y.memoizedState,f=t.stateNode,u=f.getSnapshotBeforeUpdate(t.elementType===t.type?w:Ze(t.type,w),O);f.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var p=t.stateNode.containerInfo;p.nodeType===1?p.textContent="":p.nodeType===9&&p.documentElement&&p.removeChild(p.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(j(163))}}catch(v){ae(t,t.return,v)}if(e=t.sibling,e!==null){e.return=t.return,T=e;break}T=t.return}return y=ws,ws=!1,y}function lr(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var a=r=r.next;do{if((a.tag&e)===e){var l=a.destroy;a.destroy=void 0,l!==void 0&&vl(t,n,l)}a=a.next}while(a!==r)}}function Ga(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function xl(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Ru(e){var t=e.alternate;t!==null&&(e.alternate=null,Ru(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[st],delete t[yr],delete t[al],delete t[Jp],delete t[qp])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Ou(e){return e.tag===5||e.tag===3||e.tag===4}function js(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Ou(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function yl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ka));else if(r!==4&&(e=e.child,e!==null))for(yl(e,t,n),e=e.sibling;e!==null;)yl(e,t,n),e=e.sibling}function kl(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(kl(e,t,n),e=e.sibling;e!==null;)kl(e,t,n),e=e.sibling}var ge=null,et=!1;function _t(e,t,n){for(n=n.child;n!==null;)Fu(e,t,n),n=n.sibling}function Fu(e,t,n){if(ct&&typeof ct.onCommitFiberUnmount=="function")try{ct.onCommitFiberUnmount($a,n)}catch{}switch(n.tag){case 5:je||yn(n,t);case 6:var r=ge,a=et;ge=null,_t(e,t,n),ge=r,et=a,ge!==null&&(et?(e=ge,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):ge.removeChild(n.stateNode));break;case 18:ge!==null&&(et?(e=ge,n=n.stateNode,e.nodeType===8?yi(e.parentNode,n):e.nodeType===1&&yi(e,n),mr(e)):yi(ge,n.stateNode));break;case 4:r=ge,a=et,ge=n.stateNode.containerInfo,et=!0,_t(e,t,n),ge=r,et=a;break;case 0:case 11:case 14:case 15:if(!je&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){a=r=r.next;do{var l=a,o=l.destroy;l=l.tag,o!==void 0&&(l&2||l&4)&&vl(n,t,o),a=a.next}while(a!==r)}_t(e,t,n);break;case 1:if(!je&&(yn(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){ae(n,t,s)}_t(e,t,n);break;case 21:_t(e,t,n);break;case 22:n.mode&1?(je=(r=je)||n.memoizedState!==null,_t(e,t,n),je=r):_t(e,t,n);break;default:_t(e,t,n)}}function _s(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new ff),t.forEach(function(r){var a=jf.bind(null,e,r);n.has(r)||(n.add(r),r.then(a,a))})}}function Xe(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r];try{var l=e,o=t,s=o;e:for(;s!==null;){switch(s.tag){case 5:ge=s.stateNode,et=!1;break e;case 3:ge=s.stateNode.containerInfo,et=!0;break e;case 4:ge=s.stateNode.containerInfo,et=!0;break e}s=s.return}if(ge===null)throw Error(j(160));Fu(l,o,a),ge=null,et=!1;var c=a.alternate;c!==null&&(c.return=null),a.return=null}catch(d){ae(a,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Du(t,e),t=t.sibling}function Du(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Xe(t,e),lt(e),r&4){try{lr(3,e,e.return),Ga(3,e)}catch(w){ae(e,e.return,w)}try{lr(5,e,e.return)}catch(w){ae(e,e.return,w)}}break;case 1:Xe(t,e),lt(e),r&512&&n!==null&&yn(n,n.return);break;case 5:if(Xe(t,e),lt(e),r&512&&n!==null&&yn(n,n.return),e.flags&32){var a=e.stateNode;try{ur(a,"")}catch(w){ae(e,e.return,w)}}if(r&4&&(a=e.stateNode,a!=null)){var l=e.memoizedProps,o=n!==null?n.memoizedProps:l,s=e.type,c=e.updateQueue;if(e.updateQueue=null,c!==null)try{s==="input"&&l.type==="radio"&&l.name!=null&&lc(a,l),Vi(s,o);var d=Vi(s,l);for(o=0;o<c.length;o+=2){var g=c[o],h=c[o+1];g==="style"?dc(a,h):g==="dangerouslySetInnerHTML"?cc(a,h):g==="children"?ur(a,h):Ll(a,g,h,d)}switch(s){case"input":$i(a,l);break;case"textarea":oc(a,l);break;case"select":var m=a._wrapperState.wasMultiple;a._wrapperState.wasMultiple=!!l.multiple;var x=l.value;x!=null?wn(a,!!l.multiple,x,!1):m!==!!l.multiple&&(l.defaultValue!=null?wn(a,!!l.multiple,l.defaultValue,!0):wn(a,!!l.multiple,l.multiple?[]:"",!1))}a[yr]=l}catch(w){ae(e,e.return,w)}}break;case 6:if(Xe(t,e),lt(e),r&4){if(e.stateNode===null)throw Error(j(162));a=e.stateNode,l=e.memoizedProps;try{a.nodeValue=l}catch(w){ae(e,e.return,w)}}break;case 3:if(Xe(t,e),lt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{mr(t.containerInfo)}catch(w){ae(e,e.return,w)}break;case 4:Xe(t,e),lt(e);break;case 13:Xe(t,e),lt(e),a=e.child,a.flags&8192&&(l=a.memoizedState!==null,a.stateNode.isHidden=l,!l||a.alternate!==null&&a.alternate.memoizedState!==null||(po=ie())),r&4&&_s(e);break;case 22:if(g=n!==null&&n.memoizedState!==null,e.mode&1?(je=(d=je)||g,Xe(t,e),je=d):Xe(t,e),lt(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!g&&e.mode&1)for(T=e,g=e.child;g!==null;){for(h=T=g;T!==null;){switch(m=T,x=m.child,m.tag){case 0:case 11:case 14:case 15:lr(4,m,m.return);break;case 1:yn(m,m.return);var y=m.stateNode;if(typeof y.componentWillUnmount=="function"){r=m,n=m.return;try{t=r,y.props=t.memoizedProps,y.state=t.memoizedState,y.componentWillUnmount()}catch(w){ae(r,n,w)}}break;case 5:yn(m,m.return);break;case 22:if(m.memoizedState!==null){Ns(h);continue}}x!==null?(x.return=m,T=x):Ns(h)}g=g.sibling}e:for(g=null,h=e;;){if(h.tag===5){if(g===null){g=h;try{a=h.stateNode,d?(l=a.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(s=h.stateNode,c=h.memoizedProps.style,o=c!=null&&c.hasOwnProperty("display")?c.display:null,s.style.display=uc("display",o))}catch(w){ae(e,e.return,w)}}}else if(h.tag===6){if(g===null)try{h.stateNode.nodeValue=d?"":h.memoizedProps}catch(w){ae(e,e.return,w)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===e)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===e)break e;for(;h.sibling===null;){if(h.return===null||h.return===e)break e;g===h&&(g=null),h=h.return}g===h&&(g=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Xe(t,e),lt(e),r&4&&_s(e);break;case 21:break;default:Xe(t,e),lt(e)}}function lt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Ou(n)){var r=n;break e}n=n.return}throw Error(j(160))}switch(r.tag){case 5:var a=r.stateNode;r.flags&32&&(ur(a,""),r.flags&=-33);var l=js(e);kl(e,l,a);break;case 3:case 4:var o=r.stateNode.containerInfo,s=js(e);yl(e,s,o);break;default:throw Error(j(161))}}catch(c){ae(e,e.return,c)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function hf(e,t,n){T=e,$u(e)}function $u(e,t,n){for(var r=(e.mode&1)!==0;T!==null;){var a=T,l=a.child;if(a.tag===22&&r){var o=a.memoizedState!==null||Jr;if(!o){var s=a.alternate,c=s!==null&&s.memoizedState!==null||je;s=Jr;var d=je;if(Jr=o,(je=c)&&!d)for(T=a;T!==null;)o=T,c=o.child,o.tag===22&&o.memoizedState!==null?Cs(a):c!==null?(c.return=o,T=c):Cs(a);for(;l!==null;)T=l,$u(l),l=l.sibling;T=a,Jr=s,je=d}Ss(e)}else a.subtreeFlags&8772&&l!==null?(l.return=a,T=l):Ss(e)}}function Ss(e){for(;T!==null;){var t=T;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:je||Ga(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!je)if(n===null)r.componentDidMount();else{var a=t.elementType===t.type?n.memoizedProps:Ze(t.type,n.memoizedProps);r.componentDidUpdate(a,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&cs(t,l,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}cs(t,o,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var c=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var g=d.memoizedState;if(g!==null){var h=g.dehydrated;h!==null&&mr(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(j(163))}je||t.flags&512&&xl(t)}catch(m){ae(t,t.return,m)}}if(t===e){T=null;break}if(n=t.sibling,n!==null){n.return=t.return,T=n;break}T=t.return}}function Ns(e){for(;T!==null;){var t=T;if(t===e){T=null;break}var n=t.sibling;if(n!==null){n.return=t.return,T=n;break}T=t.return}}function Cs(e){for(;T!==null;){var t=T;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ga(4,t)}catch(c){ae(t,n,c)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var a=t.return;try{r.componentDidMount()}catch(c){ae(t,a,c)}}var l=t.return;try{xl(t)}catch(c){ae(t,l,c)}break;case 5:var o=t.return;try{xl(t)}catch(c){ae(t,o,c)}}}catch(c){ae(t,t.return,c)}if(t===e){T=null;break}var s=t.sibling;if(s!==null){s.return=t.return,T=s;break}T=t.return}}var gf=Math.ceil,Ma=wt.ReactCurrentDispatcher,co=wt.ReactCurrentOwner,Ge=wt.ReactCurrentBatchConfig,W=0,he=null,le=null,ve=0,De=0,kn=Ut(0),pe=0,Sr=null,nn=0,Qa=0,uo=0,or=null,Ee=null,po=0,An=1/0,pt=null,La=!1,bl=null,Ot=null,qr=!1,Pt=null,Ta=0,sr=0,wl=null,sa=-1,ca=0;function Ne(){return W&6?ie():sa!==-1?sa:sa=ie()}function Ft(e){return e.mode&1?W&2&&ve!==0?ve&-ve:Xp.transition!==null?(ca===0&&(ca=jc()),ca):(e=Q,e!==0||(e=window.event,e=e===void 0?16:Pc(e.type)),e):1}function rt(e,t,n,r){if(50<sr)throw sr=0,wl=null,Error(j(185));zr(e,n,r),(!(W&2)||e!==he)&&(e===he&&(!(W&2)&&(Qa|=n),pe===4&&zt(e,ve)),Te(e,r),n===1&&W===0&&!(t.mode&1)&&(An=ie()+500,Va&&Kt()))}function Te(e,t){var n=e.callbackNode;Xd(e,t);var r=ga(e,e===he?ve:0);if(r===0)n!==null&&Oo(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Oo(n),t===1)e.tag===0?Yp(zs.bind(null,e)):Jc(zs.bind(null,e)),Gp(function(){!(W&6)&&Kt()}),n=null;else{switch(_c(r)){case 1:n=Fl;break;case 4:n=bc;break;case 16:n=ha;break;case 536870912:n=wc;break;default:n=ha}n=Gu(n,Iu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Iu(e,t){if(sa=-1,ca=0,W&6)throw Error(j(327));var n=e.callbackNode;if(Cn()&&e.callbackNode!==n)return null;var r=ga(e,e===he?ve:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=Aa(e,r);else{t=r;var a=W;W|=2;var l=Uu();(he!==e||ve!==t)&&(pt=null,An=ie()+500,Yt(e,t));do try{yf();break}catch(s){Bu(e,s)}while(!0);ql(),Ma.current=l,W=a,le!==null?t=0:(he=null,ve=0,t=pe)}if(t!==0){if(t===2&&(a=Ji(e),a!==0&&(r=a,t=jl(e,a))),t===1)throw n=Sr,Yt(e,0),zt(e,r),Te(e,ie()),n;if(t===6)zt(e,r);else{if(a=e.current.alternate,!(r&30)&&!vf(a)&&(t=Aa(e,r),t===2&&(l=Ji(e),l!==0&&(r=l,t=jl(e,l))),t===1))throw n=Sr,Yt(e,0),zt(e,r),Te(e,ie()),n;switch(e.finishedWork=a,e.finishedLanes=r,t){case 0:case 1:throw Error(j(345));case 2:Gt(e,Ee,pt);break;case 3:if(zt(e,r),(r&130023424)===r&&(t=po+500-ie(),10<t)){if(ga(e,0)!==0)break;if(a=e.suspendedLanes,(a&r)!==r){Ne(),e.pingedLanes|=e.suspendedLanes&a;break}e.timeoutHandle=rl(Gt.bind(null,e,Ee,pt),t);break}Gt(e,Ee,pt);break;case 4:if(zt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,a=-1;0<r;){var o=31-nt(r);l=1<<o,o=t[o],o>a&&(a=o),r&=~l}if(r=a,r=ie()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*gf(r/1960))-r,10<r){e.timeoutHandle=rl(Gt.bind(null,e,Ee,pt),r);break}Gt(e,Ee,pt);break;case 5:Gt(e,Ee,pt);break;default:throw Error(j(329))}}}return Te(e,ie()),e.callbackNode===n?Iu.bind(null,e):null}function jl(e,t){var n=or;return e.current.memoizedState.isDehydrated&&(Yt(e,t).flags|=256),e=Aa(e,t),e!==2&&(t=Ee,Ee=n,t!==null&&_l(t)),e}function _l(e){Ee===null?Ee=e:Ee.push.apply(Ee,e)}function vf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var a=n[r],l=a.getSnapshot;a=a.value;try{if(!at(l(),a))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function zt(e,t){for(t&=~uo,t&=~Qa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-nt(t),r=1<<n;e[n]=-1,t&=~r}}function zs(e){if(W&6)throw Error(j(327));Cn();var t=ga(e,0);if(!(t&1))return Te(e,ie()),null;var n=Aa(e,t);if(e.tag!==0&&n===2){var r=Ji(e);r!==0&&(t=r,n=jl(e,r))}if(n===1)throw n=Sr,Yt(e,0),zt(e,t),Te(e,ie()),n;if(n===6)throw Error(j(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Gt(e,Ee,pt),Te(e,ie()),null}function fo(e,t){var n=W;W|=1;try{return e(t)}finally{W=n,W===0&&(An=ie()+500,Va&&Kt())}}function rn(e){Pt!==null&&Pt.tag===0&&!(W&6)&&Cn();var t=W;W|=1;var n=Ge.transition,r=Q;try{if(Ge.transition=null,Q=1,e)return e()}finally{Q=r,Ge.transition=n,W=t,!(W&6)&&Kt()}}function mo(){De=kn.current,Y(kn)}function Yt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Wp(n)),le!==null)for(n=le.return;n!==null;){var r=n;switch(Gl(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ba();break;case 3:Ln(),Y(Me),Y(_e),no();break;case 5:to(r);break;case 4:Ln();break;case 13:Y(te);break;case 19:Y(te);break;case 10:Yl(r.type._context);break;case 22:case 23:mo()}n=n.return}if(he=e,le=e=Dt(e.current,null),ve=De=t,pe=0,Sr=null,uo=Qa=nn=0,Ee=or=null,Jt!==null){for(t=0;t<Jt.length;t++)if(n=Jt[t],r=n.interleaved,r!==null){n.interleaved=null;var a=r.next,l=n.pending;if(l!==null){var o=l.next;l.next=a,r.next=o}n.pending=r}Jt=null}return e}function Bu(e,t){do{var n=le;try{if(ql(),ia.current=Pa,Ea){for(var r=ne.memoizedState;r!==null;){var a=r.queue;a!==null&&(a.pending=null),r=r.next}Ea=!1}if(tn=0,me=de=ne=null,ir=!1,wr=0,co.current=null,n===null||n.return===null){pe=1,Sr=t,le=null;break}e:{var l=e,o=n.return,s=n,c=t;if(t=ve,s.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var d=c,g=s,h=g.tag;if(!(g.mode&1)&&(h===0||h===11||h===15)){var m=g.alternate;m?(g.updateQueue=m.updateQueue,g.memoizedState=m.memoizedState,g.lanes=m.lanes):(g.updateQueue=null,g.memoizedState=null)}var x=hs(o);if(x!==null){x.flags&=-257,gs(x,o,s,l,t),x.mode&1&&ms(l,d,t),t=x,c=d;var y=t.updateQueue;if(y===null){var w=new Set;w.add(c),t.updateQueue=w}else y.add(c);break e}else{if(!(t&1)){ms(l,d,t),ho();break e}c=Error(j(426))}}else if(Z&&s.mode&1){var O=hs(o);if(O!==null){!(O.flags&65536)&&(O.flags|=256),gs(O,o,s,l,t),Ql(Tn(c,s));break e}}l=c=Tn(c,s),pe!==4&&(pe=2),or===null?or=[l]:or.push(l),l=o;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var f=_u(l,c,t);ss(l,f);break e;case 1:s=c;var u=l.type,p=l.stateNode;if(!(l.flags&128)&&(typeof u.getDerivedStateFromError=="function"||p!==null&&typeof p.componentDidCatch=="function"&&(Ot===null||!Ot.has(p)))){l.flags|=65536,t&=-t,l.lanes|=t;var v=Su(l,s,t);ss(l,v);break e}}l=l.return}while(l!==null)}Vu(n)}catch(S){t=S,le===n&&n!==null&&(le=n=n.return);continue}break}while(!0)}function Uu(){var e=Ma.current;return Ma.current=Pa,e===null?Pa:e}function ho(){(pe===0||pe===3||pe===2)&&(pe=4),he===null||!(nn&268435455)&&!(Qa&268435455)||zt(he,ve)}function Aa(e,t){var n=W;W|=2;var r=Uu();(he!==e||ve!==t)&&(pt=null,Yt(e,t));do try{xf();break}catch(a){Bu(e,a)}while(!0);if(ql(),W=n,Ma.current=r,le!==null)throw Error(j(261));return he=null,ve=0,pe}function xf(){for(;le!==null;)Ku(le)}function yf(){for(;le!==null&&!Kd();)Ku(le)}function Ku(e){var t=Wu(e.alternate,e,De);e.memoizedProps=e.pendingProps,t===null?Vu(e):le=t,co.current=null}function Vu(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=pf(n,t),n!==null){n.flags&=32767,le=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{pe=6,le=null;return}}else if(n=df(n,t,De),n!==null){le=n;return}if(t=t.sibling,t!==null){le=t;return}le=t=e}while(t!==null);pe===0&&(pe=5)}function Gt(e,t,n){var r=Q,a=Ge.transition;try{Ge.transition=null,Q=1,kf(e,t,n,r)}finally{Ge.transition=a,Q=r}return null}function kf(e,t,n,r){do Cn();while(Pt!==null);if(W&6)throw Error(j(327));n=e.finishedWork;var a=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(j(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(Zd(e,l),e===he&&(le=he=null,ve=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||qr||(qr=!0,Gu(ha,function(){return Cn(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=Ge.transition,Ge.transition=null;var o=Q;Q=1;var s=W;W|=4,co.current=null,mf(e,n),Du(n,e),$p(tl),va=!!el,tl=el=null,e.current=n,hf(n),Vd(),W=s,Q=o,Ge.transition=l}else e.current=n;if(qr&&(qr=!1,Pt=e,Ta=a),l=e.pendingLanes,l===0&&(Ot=null),Gd(n.stateNode),Te(e,ie()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)a=t[n],r(a.value,{componentStack:a.stack,digest:a.digest});if(La)throw La=!1,e=bl,bl=null,e;return Ta&1&&e.tag!==0&&Cn(),l=e.pendingLanes,l&1?e===wl?sr++:(sr=0,wl=e):sr=0,Kt(),null}function Cn(){if(Pt!==null){var e=_c(Ta),t=Ge.transition,n=Q;try{if(Ge.transition=null,Q=16>e?16:e,Pt===null)var r=!1;else{if(e=Pt,Pt=null,Ta=0,W&6)throw Error(j(331));var a=W;for(W|=4,T=e.current;T!==null;){var l=T,o=l.child;if(T.flags&16){var s=l.deletions;if(s!==null){for(var c=0;c<s.length;c++){var d=s[c];for(T=d;T!==null;){var g=T;switch(g.tag){case 0:case 11:case 15:lr(8,g,l)}var h=g.child;if(h!==null)h.return=g,T=h;else for(;T!==null;){g=T;var m=g.sibling,x=g.return;if(Ru(g),g===d){T=null;break}if(m!==null){m.return=x,T=m;break}T=x}}}var y=l.alternate;if(y!==null){var w=y.child;if(w!==null){y.child=null;do{var O=w.sibling;w.sibling=null,w=O}while(w!==null)}}T=l}}if(l.subtreeFlags&2064&&o!==null)o.return=l,T=o;else e:for(;T!==null;){if(l=T,l.flags&2048)switch(l.tag){case 0:case 11:case 15:lr(9,l,l.return)}var f=l.sibling;if(f!==null){f.return=l.return,T=f;break e}T=l.return}}var u=e.current;for(T=u;T!==null;){o=T;var p=o.child;if(o.subtreeFlags&2064&&p!==null)p.return=o,T=p;else e:for(o=u;T!==null;){if(s=T,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:Ga(9,s)}}catch(S){ae(s,s.return,S)}if(s===o){T=null;break e}var v=s.sibling;if(v!==null){v.return=s.return,T=v;break e}T=s.return}}if(W=a,Kt(),ct&&typeof ct.onPostCommitFiberRoot=="function")try{ct.onPostCommitFiberRoot($a,e)}catch{}r=!0}return r}finally{Q=n,Ge.transition=t}}return!1}function Es(e,t,n){t=Tn(n,t),t=_u(e,t,1),e=Rt(e,t,1),t=Ne(),e!==null&&(zr(e,1,t),Te(e,t))}function ae(e,t,n){if(e.tag===3)Es(e,e,n);else for(;t!==null;){if(t.tag===3){Es(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Ot===null||!Ot.has(r))){e=Tn(n,e),e=Su(t,e,1),t=Rt(t,e,1),e=Ne(),t!==null&&(zr(t,1,e),Te(t,e));break}}t=t.return}}function bf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Ne(),e.pingedLanes|=e.suspendedLanes&n,he===e&&(ve&n)===n&&(pe===4||pe===3&&(ve&130023424)===ve&&500>ie()-po?Yt(e,0):uo|=n),Te(e,t)}function Hu(e,t){t===0&&(e.mode&1?(t=Ir,Ir<<=1,!(Ir&130023424)&&(Ir=4194304)):t=1);var n=Ne();e=yt(e,t),e!==null&&(zr(e,t,n),Te(e,n))}function wf(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Hu(e,n)}function jf(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(j(314))}r!==null&&r.delete(t),Hu(e,n)}var Wu;Wu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Me.current)Pe=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return Pe=!1,uf(e,t,n);Pe=!!(e.flags&131072)}else Pe=!1,Z&&t.flags&1048576&&qc(t,_a,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;oa(e,t),e=t.pendingProps;var a=En(t,_e.current);Nn(t,n),a=ao(null,t,r,e,a,n);var l=io();return t.flags|=1,typeof a=="object"&&a!==null&&typeof a.render=="function"&&a.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Le(r)?(l=!0,wa(t)):l=!1,t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,Zl(t),a.updater=Wa,t.stateNode=a,a._reactInternals=t,ul(t,r,e,n),t=fl(null,t,r,!0,l,n)):(t.tag=0,Z&&l&&Wl(t),Se(null,t,a,n),t=t.child),t;case 16:r=t.elementType;e:{switch(oa(e,t),e=t.pendingProps,a=r._init,r=a(r._payload),t.type=r,a=t.tag=Sf(r),e=Ze(r,e),a){case 0:t=pl(null,t,r,e,n);break e;case 1:t=ys(null,t,r,e,n);break e;case 11:t=vs(null,t,r,e,n);break e;case 14:t=xs(null,t,r,Ze(r.type,e),n);break e}throw Error(j(306,r,""))}return t;case 0:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Ze(r,a),pl(e,t,r,a,n);case 1:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Ze(r,a),ys(e,t,r,a,n);case 3:e:{if(Eu(t),e===null)throw Error(j(387));r=t.pendingProps,l=t.memoizedState,a=l.element,nu(e,t),Ca(t,r,null,n);var o=t.memoizedState;if(r=o.element,l.isDehydrated)if(l={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){a=Tn(Error(j(423)),t),t=ks(e,t,r,n,a);break e}else if(r!==a){a=Tn(Error(j(424)),t),t=ks(e,t,r,n,a);break e}else for($e=At(t.stateNode.containerInfo.firstChild),Ie=t,Z=!0,tt=null,n=eu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Pn(),r===a){t=kt(e,t,n);break e}Se(e,t,r,n)}t=t.child}return t;case 5:return ru(t),e===null&&ol(t),r=t.type,a=t.pendingProps,l=e!==null?e.memoizedProps:null,o=a.children,nl(r,a)?o=null:l!==null&&nl(r,l)&&(t.flags|=32),zu(e,t),Se(e,t,o,n),t.child;case 6:return e===null&&ol(t),null;case 13:return Pu(e,t,n);case 4:return eo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Mn(t,null,r,n):Se(e,t,r,n),t.child;case 11:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Ze(r,a),vs(e,t,r,a,n);case 7:return Se(e,t,t.pendingProps,n),t.child;case 8:return Se(e,t,t.pendingProps.children,n),t.child;case 12:return Se(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,a=t.pendingProps,l=t.memoizedProps,o=a.value,J(Sa,r._currentValue),r._currentValue=o,l!==null)if(at(l.value,o)){if(l.children===a.children&&!Me.current){t=kt(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var s=l.dependencies;if(s!==null){o=l.child;for(var c=s.firstContext;c!==null;){if(c.context===r){if(l.tag===1){c=gt(-1,n&-n),c.tag=2;var d=l.updateQueue;if(d!==null){d=d.shared;var g=d.pending;g===null?c.next=c:(c.next=g.next,g.next=c),d.pending=c}}l.lanes|=n,c=l.alternate,c!==null&&(c.lanes|=n),sl(l.return,n,t),s.lanes|=n;break}c=c.next}}else if(l.tag===10)o=l.type===t.type?null:l.child;else if(l.tag===18){if(o=l.return,o===null)throw Error(j(341));o.lanes|=n,s=o.alternate,s!==null&&(s.lanes|=n),sl(o,n,t),o=l.sibling}else o=l.child;if(o!==null)o.return=l;else for(o=l;o!==null;){if(o===t){o=null;break}if(l=o.sibling,l!==null){l.return=o.return,o=l;break}o=o.return}l=o}Se(e,t,a.children,n),t=t.child}return t;case 9:return a=t.type,r=t.pendingProps.children,Nn(t,n),a=Je(a),r=r(a),t.flags|=1,Se(e,t,r,n),t.child;case 14:return r=t.type,a=Ze(r,t.pendingProps),a=Ze(r.type,a),xs(e,t,r,a,n);case 15:return Nu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,a=t.pendingProps,a=t.elementType===r?a:Ze(r,a),oa(e,t),t.tag=1,Le(r)?(e=!0,wa(t)):e=!1,Nn(t,n),ju(t,r,a),ul(t,r,a,n),fl(null,t,r,!0,e,n);case 19:return Mu(e,t,n);case 22:return Cu(e,t,n)}throw Error(j(156,t.tag))};function Gu(e,t){return kc(e,t)}function _f(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function We(e,t,n,r){return new _f(e,t,n,r)}function go(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Sf(e){if(typeof e=="function")return go(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Al)return 11;if(e===Rl)return 14}return 2}function Dt(e,t){var n=e.alternate;return n===null?(n=We(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ua(e,t,n,r,a,l){var o=2;if(r=e,typeof e=="function")go(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case un:return Xt(n.children,a,l,t);case Tl:o=8,a|=8;break;case Ai:return e=We(12,n,t,a|2),e.elementType=Ai,e.lanes=l,e;case Ri:return e=We(13,n,t,a),e.elementType=Ri,e.lanes=l,e;case Oi:return e=We(19,n,t,a),e.elementType=Oi,e.lanes=l,e;case rc:return Ja(n,a,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case tc:o=10;break e;case nc:o=9;break e;case Al:o=11;break e;case Rl:o=14;break e;case St:o=16,r=null;break e}throw Error(j(130,e==null?e:typeof e,""))}return t=We(o,n,t,a),t.elementType=e,t.type=r,t.lanes=l,t}function Xt(e,t,n,r){return e=We(7,e,r,t),e.lanes=n,e}function Ja(e,t,n,r){return e=We(22,e,r,t),e.elementType=rc,e.lanes=n,e.stateNode={isHidden:!1},e}function Ci(e,t,n){return e=We(6,e,null,t),e.lanes=n,e}function zi(e,t,n){return t=We(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Nf(e,t,n,r,a){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=si(0),this.expirationTimes=si(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=si(0),this.identifierPrefix=r,this.onRecoverableError=a,this.mutableSourceEagerHydrationData=null}function vo(e,t,n,r,a,l,o,s,c){return e=new Nf(e,t,n,s,c),t===1?(t=1,l===!0&&(t|=8)):t=0,l=We(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Zl(l),e}function Cf(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:cn,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Qu(e){if(!e)return It;e=e._reactInternals;e:{if(ln(e)!==e||e.tag!==1)throw Error(j(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Le(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(j(171))}if(e.tag===1){var n=e.type;if(Le(n))return Qc(e,n,t)}return t}function Ju(e,t,n,r,a,l,o,s,c){return e=vo(n,r,!0,e,a,l,o,s,c),e.context=Qu(null),n=e.current,r=Ne(),a=Ft(n),l=gt(r,a),l.callback=t??null,Rt(n,l,a),e.current.lanes=a,zr(e,a,r),Te(e,r),e}function qa(e,t,n,r){var a=t.current,l=Ne(),o=Ft(a);return n=Qu(n),t.context===null?t.context=n:t.pendingContext=n,t=gt(l,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Rt(a,t,o),e!==null&&(rt(e,a,o,l),aa(e,a,o)),o}function Ra(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ps(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function xo(e,t){Ps(e,t),(e=e.alternate)&&Ps(e,t)}function zf(){return null}var qu=typeof reportError=="function"?reportError:function(e){console.error(e)};function yo(e){this._internalRoot=e}Ya.prototype.render=yo.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(j(409));qa(e,t,null,null)};Ya.prototype.unmount=yo.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;rn(function(){qa(null,e,null,null)}),t[xt]=null}};function Ya(e){this._internalRoot=e}Ya.prototype.unstable_scheduleHydration=function(e){if(e){var t=Cc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ct.length&&t!==0&&t<Ct[n].priority;n++);Ct.splice(n,0,e),n===0&&Ec(e)}};function ko(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Xa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ms(){}function Ef(e,t,n,r,a){if(a){if(typeof r=="function"){var l=r;r=function(){var d=Ra(o);l.call(d)}}var o=Ju(t,r,e,0,null,!1,!1,"",Ms);return e._reactRootContainer=o,e[xt]=o.current,vr(e.nodeType===8?e.parentNode:e),rn(),o}for(;a=e.lastChild;)e.removeChild(a);if(typeof r=="function"){var s=r;r=function(){var d=Ra(c);s.call(d)}}var c=vo(e,0,!1,null,null,!1,!1,"",Ms);return e._reactRootContainer=c,e[xt]=c.current,vr(e.nodeType===8?e.parentNode:e),rn(function(){qa(t,c,n,r)}),c}function Za(e,t,n,r,a){var l=n._reactRootContainer;if(l){var o=l;if(typeof a=="function"){var s=a;a=function(){var c=Ra(o);s.call(c)}}qa(t,o,e,a)}else o=Ef(n,t,e,a,r);return Ra(o)}Sc=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Yn(t.pendingLanes);n!==0&&(Dl(t,n|1),Te(t,ie()),!(W&6)&&(An=ie()+500,Kt()))}break;case 13:rn(function(){var r=yt(e,1);if(r!==null){var a=Ne();rt(r,e,1,a)}}),xo(e,1)}};$l=function(e){if(e.tag===13){var t=yt(e,134217728);if(t!==null){var n=Ne();rt(t,e,134217728,n)}xo(e,134217728)}};Nc=function(e){if(e.tag===13){var t=Ft(e),n=yt(e,t);if(n!==null){var r=Ne();rt(n,e,t,r)}xo(e,t)}};Cc=function(){return Q};zc=function(e,t){var n=Q;try{return Q=e,t()}finally{Q=n}};Wi=function(e,t,n){switch(t){case"input":if($i(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=Ka(r);if(!a)throw Error(j(90));ic(r),$i(r,a)}}}break;case"textarea":oc(e,n);break;case"select":t=n.value,t!=null&&wn(e,!!n.multiple,t,!1)}};mc=fo;hc=rn;var Pf={usingClientEntryPoint:!1,Events:[Pr,mn,Ka,pc,fc,fo]},Qn={findFiberByHostInstance:Qt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Mf={bundleType:Qn.bundleType,version:Qn.version,rendererPackageName:Qn.rendererPackageName,rendererConfig:Qn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:wt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=xc(e),e===null?null:e.stateNode},findFiberByHostInstance:Qn.findFiberByHostInstance||zf,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Yr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Yr.isDisabled&&Yr.supportsFiber)try{$a=Yr.inject(Mf),ct=Yr}catch{}}Ue.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Pf;Ue.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ko(t))throw Error(j(200));return Cf(e,t,null,n)};Ue.createRoot=function(e,t){if(!ko(e))throw Error(j(299));var n=!1,r="",a=qu;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),t=vo(e,1,!1,null,null,n,!1,r,a),e[xt]=t.current,vr(e.nodeType===8?e.parentNode:e),new yo(t)};Ue.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(j(188)):(e=Object.keys(e).join(","),Error(j(268,e)));return e=xc(t),e=e===null?null:e.stateNode,e};Ue.flushSync=function(e){return rn(e)};Ue.hydrate=function(e,t,n){if(!Xa(t))throw Error(j(200));return Za(null,e,t,!0,n)};Ue.hydrateRoot=function(e,t,n){if(!ko(e))throw Error(j(405));var r=n!=null&&n.hydratedSources||null,a=!1,l="",o=qu;if(n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=Ju(t,null,e,1,n??null,a,!1,l,o),e[xt]=t.current,vr(e),r)for(e=0;e<r.length;e++)n=r[e],a=n._getVersion,a=a(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,a]:t.mutableSourceEagerHydrationData.push(n,a);return new Ya(t)};Ue.render=function(e,t,n){if(!Xa(t))throw Error(j(200));return Za(null,e,t,!1,n)};Ue.unmountComponentAtNode=function(e){if(!Xa(e))throw Error(j(40));return e._reactRootContainer?(rn(function(){Za(null,null,e,!1,function(){e._reactRootContainer=null,e[xt]=null})}),!0):!1};Ue.unstable_batchedUpdates=fo;Ue.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Xa(n))throw Error(j(200));if(e==null||e._reactInternals===void 0)throw Error(j(38));return Za(e,t,n,!1,r)};Ue.version="18.3.1-next-f1338f8080-20240426";function Yu(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Yu)}catch(e){console.error(e)}}Yu(),Ys.exports=Ue;var Lf=Ys.exports,Ls=Lf;Li.createRoot=Ls.createRoot,Li.hydrateRoot=Ls.hydrateRoot;/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tf=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Xu=(...e)=>e.filter((t,n,r)=>!!t&&r.indexOf(t)===n).join(" ");/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Af={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rf=k.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:a="",children:l,iconNode:o,...s},c)=>k.createElement("svg",{ref:c,...Af,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:Xu("lucide",a),...s},[...o.map(([d,g])=>k.createElement(d,g)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=(e,t)=>{const n=k.forwardRef(({className:r,...a},l)=>k.createElement(Rf,{ref:l,iconNode:t,className:Xu(`lucide-${Tf(e)}`,r),...a}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Of=K("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ff=K("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=K("Building2",[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bo=K("Calculator",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bn=K("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zu=K("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Df=K("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lr=K("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $f=K("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const If=K("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bf=K("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uf=K("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wo=K("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kf=K("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vf=K("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rn=K("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ts=K("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hf=K("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wf=K("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gf=K("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qf=K("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=K("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sl=K("Navigation",[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const As=K("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",key:"ymcmye"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ed=K("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nr=K("Pill",[["path",{d:"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",key:"wa1lgi"}],["path",{d:"m8.5 8.5 7 7",key:"rvfmvr"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zn=K("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rs=K("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jf=K("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oa=K("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tr=K("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qf=K("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ei=K("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fa=K("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const td=K("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Os=K("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=K("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),ye="/api";async function ke(e){var r;const n=((r=e.headers.get("content-type"))==null?void 0:r.includes("application/json"))?await e.json().catch(()=>({})):null;if(!e.ok){const a=(n==null?void 0:n.error)||(Array.isArray(n==null?void 0:n.details)?n.details.join(", "):null)||`Request failed with status ${e.status}`,l=new Error(a);throw l.status=e.status,l.details=n==null?void 0:n.details,l}return n}function dt(e){return e?{Authorization:`Bearer ${e}`}:{}}function Yf(e,t){return fetch(`${ye}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}).then(ke)}function Xf(e,t,n,r,a="user"){return fetch(`${ye}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,state:n,password:r,role:a})}).then(ke)}function Zf(e,t){return fetch(`${ye}/auth/state`,{method:"PUT",headers:{"Content-Type":"application/json",...dt(t)},body:JSON.stringify({state:e})}).then(ke)}function em(e="admin"){return fetch(`${ye}/auth/quick-demo`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({role:e})}).then(ke)}function tm(e){return fetch(`${ye}/auth/me`,{headers:{...dt(e)}}).then(ke)}function nm(e,t){return fetch(`${ye}/auth/saved-medicines/${e}`,{method:"POST",headers:{...dt(t)}}).then(ke)}function rm(e){return fetch(`${ye}/auth/saved-medicines`,{headers:{...dt(e)}}).then(ke)}function am(e){return fetch(`${ye}/medicines/search?q=${encodeURIComponent(e)}`).then(ke)}function nd(){return fetch(`${ye}/medicines`).then(ke)}function im(e,t){return fetch(`${ye}/medicines`,{method:"POST",headers:{"Content-Type":"application/json",...dt(t)},body:JSON.stringify(e)}).then(ke)}function lm(e,t,n){return fetch(`${ye}/medicines/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",...dt(n)},body:JSON.stringify(t)}).then(ke)}function om(e,t){return fetch(`${ye}/medicines/${e}`,{method:"DELETE",headers:{...dt(t)}}).then(ke)}function sm(e){return fetch(`${ye}/stores`).then(ke)}function Ei(e,t,n,r=50){const a=[];e!=null&&t!==null&&t!==void 0&&(a.push(`lat=${e}`),a.push(`lng=${t}`)),n&&a.push(`state=${encodeURIComponent(n)}`),r&&a.push(`limit=${r}`);const l=a.length?`?${a.join("&")}`:"";return fetch(`${ye}/stores/nearby${l}`).then(ke)}function cm(e,t){return fetch(`${ye}/stores`,{method:"POST",headers:{"Content-Type":"application/json",...dt(t)},body:JSON.stringify(e)}).then(ke)}function um(e,t,n){return fetch(`${ye}/stores/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",...dt(n)},body:JSON.stringify(t)}).then(ke)}function dm(e,t){return fetch(`${ye}/stores/${e}`,{method:"DELETE",headers:{...dt(t)}}).then(ke)}const rd=k.createContext(null),Pi="rxcompare_auth_token",sn="rxcompare_auth_user",Mi="rxcompare_guest_saved",Xr="rxcompare_user_state";function pm({children:e}){const[t,n]=k.useState(()=>localStorage.getItem(Pi)||null),[r,a]=k.useState(()=>{try{const L=localStorage.getItem(sn);return L?JSON.parse(L):null}catch{return null}}),[l,o]=k.useState(()=>{try{const L=localStorage.getItem(sn);if(L){const P=JSON.parse(L);if(P!=null&&P.state)return P.state}return localStorage.getItem(Xr)||"Kerala"}catch{return"Kerala"}}),[s,c]=k.useState([]),[d,g]=k.useState(!0),[h,m]=k.useState(!1),[x,y]=k.useState("login"),[w,O]=k.useState(null),f=k.useCallback((L,P="info")=>{O({id:Date.now(),message:L,type:P})},[]),u=k.useCallback(()=>{O(null)},[]),p=k.useCallback(async L=>{if(!L||!L.trim())return;const P=L.trim();if(o(P),localStorage.setItem(Xr,P),r){const b={...r,state:P};a(b),localStorage.setItem(sn,JSON.stringify(b))}if(t)try{await Zf(P,t)}catch(b){console.warn("Could not sync state to backend:",b.message)}f(`Showing Jan Aushadhi Kendras in ${P}`,"info")},[r,t,f]);k.useEffect(()=>{async function L(){if(!t){try{const P=JSON.parse(localStorage.getItem(Mi)||"[]");c(P)}catch{c([])}g(!1);return}try{const P=await tm(t);P.success&&P.user?(a(P.user),P.user.state&&(o(P.user.state),localStorage.setItem(Xr,P.user.state)),c(P.user.savedMedicines||[]),localStorage.setItem(sn,JSON.stringify(P.user))):M()}catch(P){console.warn("Session check failed:",P.message),P.status===401&&M()}finally{g(!1)}}L()},[t]);const v=k.useCallback((L="login")=>{y(L),m(!0)},[]),S=k.useCallback(()=>{m(!1)},[]),C=(L,P,b)=>{n(L),a(P),P.state&&(o(P.state),localStorage.setItem(Xr,P.state)),c(P.savedMedicines||[]),localStorage.setItem(Pi,L),localStorage.setItem(sn,JSON.stringify(P)),m(!1),f(b||`Welcome, ${P.name}!`,"success")},N=async(L,P)=>{const b=await Yf(L,P);return C(b.token,b.user,b.message||`Welcome back, ${b.user.name}!`),b},E=async(L,P,b,R,_="user")=>{const D=await Xf(L,P,b,R,_);return C(D.token,D.user,`Account created successfully! Welcome, ${D.user.name}.`),D},I=async(L="admin")=>{const P=await em(L);return C(P.token,P.user,`Signed in as Demo ${P.user.role==="admin"?"Admin":"Patient"}!`),P},M=()=>{n(null),a(null),localStorage.removeItem(Pi),localStorage.removeItem(sn);try{const L=JSON.parse(localStorage.getItem(Mi)||"[]");c(L)}catch{c([])}f("Signed out successfully","info")},$=async L=>{if(!L||!L._id)return;const P=L._id;if(t)try{const b=await nm(P,t);c(b.savedMedicines||[]),f(b.message,b.saved?"success":"info")}catch(b){f(b.message||"Failed to update saved medicine","error")}else{const b=s.some(_=>(_._id||_)===P);let R;b?(R=s.filter(_=>(_._id||_)!==P),f(`Removed "${L.genericName}" from cabinet`,"info")):(R=[...s,L],f(`Saved "${L.genericName}" to cabinet (Sign in to sync across devices)`,"success")),c(R),localStorage.setItem(Mi,JSON.stringify(R))}},X=L=>L?s.some(P=>(typeof P=="string"?P:P._id)===L):!1,oe=async()=>{if(t)try{const L=await rm(t);c(L||[])}catch(L){console.warn("Failed to refresh saved medicines:",L)}},A=(r==null?void 0:r.role)==="admin",ee=!!(r&&t);return i.jsx(rd.Provider,{value:{user:r,userState:l,setUserState:p,token:t,isAuthenticated:ee,isAdmin:A,savedMedicines:s,loadingAuth:d,authModalOpen:h,authModalTab:x,toast:w,showToast:f,clearToast:u,openAuthModal:v,closeAuthModal:S,login:N,register:E,quickLogin:I,logout:M,toggleSave:$,isSaved:X,refreshSavedMedicines:oe},children:e})}function jt(){const e=k.useContext(rd);if(!e)throw new Error("useAuth must be used within an AuthProvider");return e}const jo=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];function fm({open:e,stores:t=[],medicineName:n,locating:r=!1,currentState:a="Kerala",onStateChange:l,onRefreshLocation:o,hasGps:s=!1,onClose:c}){const[d,g]=k.useState("");if(!e)return null;const h=(t||[]).filter(m=>{var y,w,O,f,u;if(!d.trim())return!0;const x=d.toLowerCase();return((y=m.name)==null?void 0:y.toLowerCase().includes(x))||((w=m.city)==null?void 0:w.toLowerCase().includes(x))||((O=m.state)==null?void 0:O.toLowerCase().includes(x))||((f=m.address)==null?void 0:f.toLowerCase().includes(x))||((u=m.pincode)==null?void 0:u.includes(x))});return i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"drawer-backdrop is-open",onClick:c}),i.jsxs("aside",{className:"drawer is-open","aria-hidden":!e,role:"dialog","aria-modal":"true",children:[i.jsxs("div",{className:"drawer__header",children:[i.jsxs("div",{children:[i.jsx("span",{className:"drawer__eyebrow",children:"Jan Aushadhi Kendra Locator"}),i.jsx("h4",{className:"drawer__title",children:n?`Pharmacies for ${n}`:`Kendras in ${a}`})]}),i.jsx("button",{className:"drawer__close",onClick:c,"aria-label":"Close pharmacy drawer",children:i.jsx(bt,{size:18})})]}),i.jsxs("div",{className:"drawer__state-strip",children:[i.jsxs("div",{className:"state-picker-group",children:[i.jsxs("label",{htmlFor:"drawer-state-select",children:[i.jsx(Qe,{size:13,className:"state-pin-icon"}),i.jsx("span",{children:"Target State:"})]}),i.jsx("select",{id:"drawer-state-select",value:a,onChange:m=>l&&l(m.target.value),className:"drawer__state-select",children:jo.map(m=>i.jsx("option",{value:m,children:m},m))})]}),o&&i.jsxs("button",{type:"button",className:"refresh-gps-btn",onClick:o,title:"Recalculate distance using device GPS",children:[i.jsx(Jf,{size:12,className:r?"locating-spin":""}),i.jsx("span",{children:"GPS Sync"})]})]}),i.jsxs("div",{className:"drawer__search-box",children:[i.jsx(Oa,{size:14,className:"drawer__search-icon"}),i.jsx("input",{type:"text",placeholder:`Filter ${t.length} Kendras in ${a}...`,value:d,onChange:m=>g(m.target.value),className:"drawer__search-input"}),d&&i.jsx("button",{type:"button",className:"drawer__search-clear",onClick:()=>g(""),children:i.jsx(bt,{size:12})})]}),i.jsx("div",{className:"drawer__gps-status",children:r?i.jsxs("div",{className:"gps-msg locating",children:[i.jsx(Sl,{size:13,className:"locating-spin"}),i.jsx("span",{children:"Acquiring live GPS coordinates for nearest distance calculation..."})]}):s?i.jsxs("div",{className:"gps-msg active",children:[i.jsx($f,{size:13}),i.jsx("span",{children:"Ranked by verified distance from your current location"})]}):i.jsxs("div",{className:"gps-msg fallback",children:[i.jsxs("span",{children:["Displaying Jan Aushadhi Kendras in ",i.jsx("strong",{children:a}),"."]}),o&&i.jsx("button",{type:"button",onClick:o,className:"enable-gps-inline",children:"Enable GPS for live distance"})]})}),i.jsxs("div",{className:"drawer__body",children:[!r&&h.length===0&&i.jsxs("div",{className:"drawer__empty",children:[i.jsxs("p",{children:['No Jan Aushadhi Kendras found matching "',d,'" in ',a,"."]}),i.jsx("button",{type:"button",className:"btn-clear-filter",onClick:()=>g(""),children:"Clear Search Filter"})]}),i.jsx("ul",{className:"drawer__list",children:h.map(m=>{var x,y;return i.jsxs("li",{className:"store-item",children:[i.jsx("div",{className:"store-item__icon",children:i.jsx(Qe,{size:16,strokeWidth:2.2})}),i.jsxs("div",{className:"store-item__body",children:[i.jsxs("div",{className:"store-item__header-row",children:[i.jsxs("div",{className:"store-title-wrap",children:[i.jsx("h5",{className:"store-item__name",children:m.name}),i.jsx("span",{className:"pmbjk-tag",children:"PMBJP Kendra"})]}),typeof m.distanceKm=="number"&&i.jsxs("span",{className:"store-item__distance",children:[m.distanceKm," km away"]})]}),i.jsxs("p",{className:"store-item__address",children:[m.address,", ",m.city,", ",m.state," ",m.pincode?`- ${m.pincode}`:""]}),i.jsxs("div",{className:"store-item__actions-row",children:[((x=m.location)==null?void 0:x.lat)&&((y=m.location)==null?void 0:y.lng)&&i.jsxs("a",{href:`https://www.google.com/maps/dir/?api=1&destination=${m.location.lat},${m.location.lng}`,target:"_blank",rel:"noopener noreferrer",className:"store-action-btn map directions",title:`Get directions to ${m.name} on Google Maps`,children:[i.jsx(Sl,{size:12})," Directions ",i.jsx(wo,{size:10})]}),i.jsxs("a",{href:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.name}, ${m.address}, ${m.city}, ${m.state}`)}`,target:"_blank",rel:"noopener noreferrer",className:"store-action-btn view-map",title:"View store listing and reviews on Google Maps",children:[i.jsx(Qe,{size:11})," View Map"]}),m.phone&&i.jsxs("a",{href:`tel:${m.phone}`,className:"store-action-btn phone",children:[i.jsx(ed,{size:11})," ",m.phone]})]})]})]},m._id||m.name)})})]})]}),i.jsx("style",{children:`
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.45);
          backdrop-filter: blur(2px);
          z-index: 100;
          animation: fade-in 180ms ease-out;
        }

        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(480px, 100%);
          background: var(--surface, #ffffff);
          box-shadow: 0 10px 40px rgba(10, 38, 33, 0.25);
          z-index: 101;
          display: flex;
          flex-direction: column;
          animation: slide-in 220ms var(--ease, ease-out);
        }

        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 22px 14px;
          border-bottom: 1px solid var(--line);
        }
        .drawer__eyebrow {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--brass);
          font-weight: 600;
        }
        .drawer__title {
          margin: 4px 0 0;
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .drawer__close {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 6px;
          color: var(--ink-soft);
          cursor: pointer;
          display: flex;
        }
        .drawer__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .drawer__state-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 18px;
          background: #f4f8f6;
          border-bottom: 1px solid var(--line);
        }
        .state-picker-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        .state-picker-group label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .state-pin-icon {
          color: var(--emerald);
        }
        .drawer__state-select {
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          background: #ffffff;
          padding: 4px 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--navy-deep);
          cursor: pointer;
          outline: none;
        }
        .drawer__state-select:focus {
          border-color: var(--navy);
        }
        .refresh-gps-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          transition: background 120ms ease;
        }
        .refresh-gps-btn:hover {
          background: var(--bg-subtle);
        }

        .drawer__search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-bottom: 1px solid var(--line);
          background: #ffffff;
        }
        .drawer__search-icon {
          color: var(--ink-faint);
        }
        .drawer__search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.84rem;
          color: var(--ink);
          outline: none;
        }
        .drawer__search-clear {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
        }

        .drawer__gps-status {
          padding: 6px 18px;
          border-bottom: 1px solid var(--line);
          font-size: 0.73rem;
          background: var(--bg-subtle);
        }
        .gps-msg {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .gps-msg.active {
          color: var(--emerald);
          font-weight: 600;
        }
        .gps-msg.locating {
          color: var(--navy);
          font-weight: 500;
        }
        .gps-msg.fallback {
          color: var(--ink-soft);
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
        }
        .enable-gps-inline {
          background: none;
          border: none;
          color: var(--navy);
          text-decoration: underline;
          cursor: pointer;
          font-weight: 600;
          padding: 0;
          font-size: 0.73rem;
        }

        .locating-spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .drawer__body {
          overflow-y: auto;
          padding: 16px 18px 24px;
          flex: 1;
        }
        .drawer__empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--ink-soft);
          font-size: 0.86rem;
        }
        .btn-clear-filter {
          margin-top: 10px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          cursor: pointer;
        }

        .drawer__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .store-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: #ffffff;
          transition: border-color 140ms ease, box-shadow 140ms ease;
        }
        .store-item:hover {
          border-color: var(--line-strong);
          box-shadow: var(--shadow-sm);
        }

        .store-item__icon {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: var(--emerald-bg);
          color: var(--emerald);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
        }
        .store-item__body {
          flex: 1;
          min-width: 0;
        }
        .store-item__header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 4px;
        }
        .store-title-wrap {
          flex: 1;
        }
        .store-item__name {
          margin: 0 0 2px;
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--navy-deep);
          line-height: 1.3;
        }
        .pmbjk-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          background: var(--brass-soft);
          color: var(--navy);
          padding: 1px 5px;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .store-item__distance {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--emerald);
          background: var(--emerald-bg);
          border-radius: 999px;
          padding: 2px 8px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .store-item__address {
          margin: 6px 0 10px;
          font-size: 0.78rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        .store-item__actions-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .store-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          padding: 5px 10px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 120ms ease;
        }
        .store-action-btn.map.directions {
          background: var(--navy);
          border: 1px solid var(--navy);
          color: #ffffff;
        }
        .store-action-btn.map.directions:hover {
          background: var(--navy-deep);
        }
        .store-action-btn.view-map {
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
        }
        .store-action-btn.view-map:hover {
          background: var(--line);
        }
        .store-action-btn.phone {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          color: var(--ink-soft);
        }
        .store-action-btn.phone:hover {
          background: var(--line);
          color: var(--ink);
        }
      `})]})}function Fs({activeView:e,onViewChange:t,onOpenCabinet:n}){const{user:r,isAuthenticated:a,isAdmin:l,savedMedicines:o,openAuthModal:s,logout:c,userState:d,setUserState:g}=jt(),[h,m]=k.useState(!1),x=(o||[]).length;return i.jsxs("header",{className:"nav",children:[i.jsxs("div",{className:"nav__inner",children:[i.jsxs("div",{className:"nav__brand",onClick:()=>t("app"),role:"button",tabIndex:0,children:[i.jsx("span",{className:"nav__mark",children:i.jsx("img",{src:"/logo.png",alt:"RxCompare logo",className:"nav__logo-img"})}),i.jsxs("div",{className:"nav__title-group",children:[i.jsx("span",{className:"nav__word",children:"RxCompare"}),i.jsx("span",{className:"nav__subword",children:"SDG 3 · Good Health"})]})]}),i.jsxs("nav",{className:"nav__links",children:[i.jsxs("button",{type:"button",className:`nav__link ${e==="app"?"is-active":""}`,onClick:()=>t("app"),children:[i.jsx(Nr,{size:15}),i.jsx("span",{children:"Compare Prices"})]}),l&&i.jsxs("button",{type:"button",className:`nav__link nav__link--admin ${e==="admin"?"is-active":""}`,onClick:()=>t("admin"),children:[i.jsx(Ts,{size:15}),i.jsx("span",{children:"Admin Portal"}),i.jsx("span",{className:"nav__admin-badge",children:"Admin"})]})]}),i.jsxs("div",{className:"nav__actions",children:[i.jsxs("div",{className:"nav-state-picker",title:"Active State for nearest Jan Aushadhi Kendras",children:[i.jsx(Qe,{size:13,className:"nav-state-icon"}),i.jsx("select",{value:d,onChange:y=>g(y.target.value),className:"nav-state-select","aria-label":"Active Indian State",children:jo.map(y=>i.jsx("option",{value:y,children:y},y))})]}),i.jsxs("button",{type:"button",className:"cabinet-trigger-btn",onClick:n,title:"Open Saved Prescription Cabinet",children:[i.jsx(Rn,{size:16,fill:x>0?"var(--rust)":"none",color:x>0?"var(--rust)":"currentColor"}),i.jsx("span",{className:"cabinet-lbl",children:"Cabinet"}),x>0&&i.jsx("span",{className:"cabinet-counter",children:x})]}),a?i.jsxs("div",{className:"user-profile-menu",children:[i.jsxs("button",{type:"button",className:"user-profile-btn",onClick:()=>m(!h),children:[i.jsx("div",{className:"user-avatar",children:r.name?r.name[0].toUpperCase():"U"}),i.jsxs("div",{className:"user-meta-wrap",children:[i.jsx("span",{className:"user-name",children:r.name}),i.jsx("span",{className:`user-role-badge ${l?"is-admin":"is-user"}`,children:l?"Admin":"Patient"})]}),i.jsx(Zu,{size:14,className:"user-caret"})]}),h&&i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"menu-backdrop",onClick:()=>m(!1)}),i.jsxs("div",{className:"user-dropdown",children:[i.jsxs("div",{className:"dropdown-header",children:[i.jsx("strong",{children:r.name}),i.jsx("span",{className:"dropdown-email",children:r.email}),i.jsxs("span",{className:"dropdown-state-pill",children:[i.jsx(Qe,{size:11})," ",r.state||d]})]}),i.jsxs("div",{className:"dropdown-links",children:[i.jsxs("button",{type:"button",className:"dropdown-item",onClick:()=>{m(!1),n()},children:[i.jsx(Rn,{size:15}),i.jsxs("span",{children:["Saved Cabinet (",x,")"]})]}),l&&i.jsxs("button",{type:"button",className:"dropdown-item",onClick:()=>{m(!1),t("admin")},children:[i.jsx(Ts,{size:15}),i.jsx("span",{children:"Admin Authority Console"})]}),i.jsxs("button",{type:"button",className:"dropdown-item logout",onClick:()=>{m(!1),c()},children:[i.jsx(Gf,{size:15}),i.jsx("span",{children:"Sign Out"})]})]})]})]})]}):i.jsxs("button",{type:"button",className:"signin-nav-btn",onClick:()=>s("login"),children:[i.jsx(Wf,{size:15}),i.jsx("span",{children:"Sign In"})]})]})]}),i.jsx("style",{children:`
        .nav {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .nav__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }
        .nav__mark {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .nav__logo-img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }
        .nav__title-group {
          display: flex;
          flex-direction: column;
        }
        .nav__word {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.01em;
          color: var(--navy-deep);
          line-height: 1.1;
        }
        .nav__subword {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav__links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav__link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 500;
          color: var(--ink-soft);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .nav__link:hover {
          color: var(--navy-deep);
          background: var(--bg-subtle);
        }
        .nav__link.is-active {
          color: var(--navy);
          background: #ffffff;
          border-color: var(--line-strong);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .nav__link--admin {
          color: var(--navy);
        }
        .nav__admin-badge {
          background: var(--brass-soft);
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 999px;
          font-weight: 600;
        }

        .nav__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-state-picker {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f4f8f6;
          border: 1px solid var(--emerald);
          border-radius: 8px;
          padding: 3px 8px;
        }
        .nav-state-icon {
          color: var(--emerald);
          flex-shrink: 0;
        }
        .nav-state-select {
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--navy-deep);
          cursor: pointer;
          outline: none;
          max-width: 130px;
        }

        .cabinet-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy-deep);
          cursor: pointer;
          transition: all 140ms ease;
        }
        .cabinet-trigger-btn:hover {
          background: var(--line);
        }
        .cabinet-counter {
          background: var(--rust);
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          padding: 1px 6px;
          border-radius: 999px;
          font-weight: 700;
        }

        .signin-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 120ms ease;
        }
        .signin-nav-btn:hover {
          background: var(--navy-deep);
        }

        .user-profile-menu {
          position: relative;
        }
        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 4px 10px 4px 4px;
          cursor: pointer;
          transition: border-color 140ms ease;
        }
        .user-profile-btn:hover {
          border-color: var(--line-strong);
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--navy);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .user-meta-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy-deep);
          max-width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 999px;
        }
        .user-role-badge.is-admin {
          background: var(--brass-soft);
          color: var(--navy);
        }
        .user-role-badge.is-user {
          background: var(--emerald-bg);
          color: var(--emerald);
        }
        .user-caret {
          color: var(--ink-faint);
        }

        .menu-backdrop {
          position: fixed;
          inset: 0;
          z-index: 40;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(10, 38, 33, 0.15);
          width: 220px;
          z-index: 41;
          padding: 8px 0;
          animation: modal-scale 120ms ease-out;
        }
        .dropdown-header {
          padding: 8px 16px 10px;
          border-bottom: 1px solid var(--line);
        }
        .dropdown-header strong {
          display: block;
          font-size: 0.86rem;
          color: var(--navy-deep);
        }
        .dropdown-email {
          display: block;
          font-size: 0.74rem;
          color: var(--ink-faint);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-state-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-top: 4px;
          background: var(--emerald-bg);
          color: var(--emerald);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 999px;
        }
        .dropdown-links {
          padding: 6px 0 0;
        }
        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: none;
          border: none;
          font-size: 0.84rem;
          color: var(--ink-soft);
          cursor: pointer;
          transition: background 120ms ease;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--bg-subtle);
          color: var(--ink);
        }
        .dropdown-item.logout {
          color: var(--rust);
          border-top: 1px solid var(--line);
          margin-top: 4px;
          padding-top: 10px;
        }
        .dropdown-item.logout:hover {
          background: #fdf2ef;
        }

        @media (max-width: 640px) {
          .nav__subword { display: none; }
          .cabinet-lbl { display: none; }
          .user-name { display: none; }
        }
      `})]})}function mm({onSearch:e,loading:t,initialValue:n=""}){const[r,a]=k.useState(n);k.useEffect(()=>{a(n)},[n]);function l(s){s.preventDefault(),e(r.trim())}function o(){a(""),e("")}return i.jsxs("form",{className:"search-bar",onSubmit:l,children:[i.jsx(Oa,{size:18,strokeWidth:2,className:"search-bar__icon"}),i.jsx("input",{id:"med-search",type:"text",placeholder:"Type branded or generic name: “Crocin”, “Storvas”, “Glycomet”, “Azithral”...",value:r,onChange:s=>a(s.target.value),autoComplete:"off",className:"search-bar__input"}),r&&i.jsx("button",{type:"button",className:"search-bar__clear",onClick:o,"aria-label":"Clear search query",children:i.jsx(bt,{size:15})}),i.jsx("button",{type:"submit",className:"search-bar__button",disabled:t,children:t?"Comparing...":"Compare price"}),i.jsx("style",{children:`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-lg, 12px);
          padding: 6px 6px 6px 16px;
          box-shadow: 0 4px 16px rgba(10, 38, 33, 0.06);
          transition: box-shadow 150ms ease, border-color 150ms ease;
        }
        .search-bar:focus-within {
          border-color: var(--navy);
          box-shadow: 0 6px 24px rgba(10, 38, 33, 0.12);
        }
        .search-bar__icon {
          color: var(--ink-faint);
          flex-shrink: 0;
        }
        .search-bar__input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.98rem;
          padding: 10px 0;
          color: var(--ink);
        }
        .search-bar__input::placeholder {
          color: var(--ink-faint);
        }
        .search-bar__input:focus {
          outline: none;
        }

        .search-bar__clear {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .search-bar__clear:hover {
          color: var(--ink);
          background: var(--bg-subtle);
        }

        .search-bar__button {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 11px 22px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 120ms ease;
          flex-shrink: 0;
        }
        .search-bar__button:hover:not(:disabled) {
          background: var(--navy-deep);
        }
        .search-bar__button:disabled {
          opacity: 0.6;
          cursor: default;
        }
        @media (max-width: 480px) {
          .search-bar { flex-wrap: wrap; padding: 10px 12px; }
          .search-bar__button { width: 100%; margin-top: 6px; }
        }
      `})]})}const hm=["Crocin","Storvas","Glycomet","Azithral","Combiflam","Pantocid","Telma","Augmentin"],gm=["All","Pain Relief","Cardiovascular","Diabetes","Antibiotics","Gastrointestinal"];function vm({onSearch:e,loading:t,stats:n,searchQuery:r,selectedCategory:a,onSelectCategory:l,sortBy:o,onSortChange:s}){return i.jsxs("section",{className:"hero",children:[i.jsxs("div",{className:"hero__inner",children:[i.jsxs("div",{className:"hero__badge-strip",children:[i.jsx("span",{className:"hero__eyebrow",children:"Pradhan Mantri Bhartiya Janaushadhi Pariyojana"}),i.jsx("span",{className:"hero__sdg-tag",children:"SDG 3"})]}),i.jsxs("h1",{className:"hero__title",children:["The same medicine, ",i.jsx("em",{children:"a fraction"})," of the price."]}),i.jsxs("p",{className:"hero__subtitle",children:["Type the ",i.jsx("strong",{children:"branded medicine name"})," prescribed by your doctor. We match it to the government-listed Jan Aushadhi generic equivalent, verify identical composition, and locate nearest stocking Kendras."]}),i.jsx("div",{className:"hero__search",children:i.jsx(mm,{onSearch:e,loading:t,initialValue:r})}),i.jsxs("div",{className:"hero__quick-chips",children:[i.jsxs("span",{className:"quick-chips__lbl",children:[i.jsx(ei,{size:13})," Popular Inquiries:"]}),i.jsx("div",{className:"quick-chips__list",children:hm.map(c=>i.jsx("button",{type:"button",className:`quick-chip ${r.toLowerCase()===c.toLowerCase()?"is-active":""}`,onClick:()=>e(c),children:c},c))})]}),i.jsxs("div",{className:"hero__filter-bar",children:[i.jsx("div",{className:"category-chips",children:gm.map(c=>i.jsx("button",{type:"button",className:`category-chip ${a===c?"is-active":""}`,onClick:()=>l(c),children:c},c))}),i.jsxs("div",{className:"sort-dropdown-wrap",children:[i.jsx(qf,{size:14,className:"sort-icon"}),i.jsxs("select",{value:o,onChange:c=>s(c.target.value),className:"sort-select","aria-label":"Sort medicines by",children:[i.jsx("option",{value:"savings-desc",children:"Highest Savings %"}),i.jsx("option",{value:"price-asc",children:"Lowest Generic Price"}),i.jsx("option",{value:"name-asc",children:"Alphabetical (A-Z)"})]})]})]}),n&&i.jsxs("dl",{className:"hero__stats",children:[i.jsxs("div",{className:"hero__stat",children:[i.jsx("dt",{children:"Formulations Indexed"}),i.jsx("dd",{children:n.medicineCount})]}),i.jsxs("div",{className:"hero__stat",children:[i.jsx("dt",{children:"Average Patient Saving"}),i.jsxs("dd",{children:[n.avgSavingsPct,"%"]})]}),i.jsxs("div",{className:"hero__stat",children:[i.jsx("dt",{children:"Jan Aushadhi Kendras"}),i.jsx("dd",{children:n.storeCount})]})]})]}),i.jsx("style",{children:`
        .hero {
          background: radial-gradient(circle at top left, #ffffff 0%, var(--bg-subtle) 70%);
          border-bottom: 1px solid var(--line);
        }
        .hero__inner {
          max-width: 820px;
          margin: 0 auto;
          padding: 48px 24px 36px;
        }

        .hero__badge-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .hero__eyebrow {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brass);
          font-weight: 600;
        }
        .hero__sdg-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          background: var(--emerald-bg);
          color: var(--emerald);
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
        }

        .hero__title {
          margin: 0 0 16px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.1;
          letter-spacing: -0.015em;
          color: var(--navy-deep);
        }
        .hero__title em {
          font-style: italic;
          color: var(--navy);
          text-decoration: underline;
          text-decoration-color: var(--brass-soft);
          text-underline-offset: 6px;
        }
        .hero__subtitle {
          margin: 0 0 28px;
          color: var(--ink-soft);
          font-size: 1.02rem;
          max-width: 58ch;
          line-height: 1.6;
        }

        .hero__search {
          margin-bottom: 16px;
        }

        .hero__quick-chips {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .quick-chips__lbl {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .quick-chips__list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .quick-chip {
          background: #ffffff;
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 0.76rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 120ms ease;
        }
        .quick-chip:hover {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }
        .quick-chip.is-active {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }

        .hero__filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .category-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .category-chip {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 5px 11px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 120ms ease;
        }
        .category-chip:hover {
          border-color: var(--line-strong);
          color: var(--ink);
        }
        .category-chip.is-active {
          background: #ffffff;
          border-color: var(--navy);
          color: var(--navy);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .sort-dropdown-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          padding: 4px 10px;
        }
        .sort-icon {
          color: var(--ink-faint);
        }
        .sort-select {
          border: none;
          background: transparent;
          font-size: 0.78rem;
          color: var(--ink-soft);
          outline: none;
          font-weight: 500;
          cursor: pointer;
        }

        .hero__stats {
          display: flex;
          gap: 0;
          margin: 0;
          border-top: 1px solid var(--line-strong);
          padding-top: 22px;
        }
        .hero__stat {
          flex: 1;
          padding-right: 20px;
        }
        .hero__stat:not(:last-child) {
          border-right: 1px solid var(--line);
          margin-right: 20px;
        }
        .hero__stat dt {
          font-size: 0.74rem;
          color: var(--ink-faint);
          margin-bottom: 4px;
        }
        .hero__stat dd {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.65rem;
          color: var(--navy-deep);
        }

        @media (max-width: 600px) {
          .hero__stats { flex-direction: column; gap: 14px; }
          .hero__stat { border-right: none !important; margin-right: 0 !important; padding-right: 0; }
          .hero__filter-bar { flex-direction: column; align-items: flex-start; }
        }
      `})]})}function xm({medicine:e,onLocateStores:t,onOpenCalculator:n,index:r=0}){const{toggleSave:a,isSaved:l}=jt(),[o,s]=k.useState(!1),c=e.cheapestBrandedMrp,d=c?c-e.genericMrp:null,g=c&&c>e.genericMrp?Math.round(d/c*100):null,h=l(e._id),m=e.brandedEquivalents||[],x=o?m:m.slice(0,3);return i.jsxs("article",{className:"med-card",style:{animationDelay:`${r*50}ms`},children:[g!==null&&i.jsx("div",{className:"med-card__ribbon","aria-label":`Save ${g} percent`,children:i.jsxs("span",{children:["SAVE ",g,"%"]})}),i.jsxs("div",{className:"med-card__top",children:[i.jsxs("div",{className:"med-card__header-info",children:[i.jsx("span",{className:"med-card__category",children:e.category||"General"}),i.jsx("h3",{className:"med-card__title",children:e.genericName}),i.jsxs("p",{className:"med-card__composition",children:[e.composition," · ",e.packSize]})]}),i.jsx("button",{type:"button",className:`med-card__fav-btn ${h?"is-saved":""}`,onClick:()=>a(e),title:h?"Remove from prescription cabinet":"Save to prescription cabinet","aria-label":h?"Remove from cabinet":"Save to cabinet",children:i.jsx(Rn,{size:18,fill:h?"var(--rust)":"none"})})]}),i.jsxs("div",{className:"med-card__badges",children:[i.jsx("span",{className:"med-code-badge",children:e.drugCode}),i.jsxs("span",{className:"med-who-badge",children:[i.jsx(Tr,{size:12})," WHO-GMP Certified"]})]}),i.jsxs("div",{className:"med-card__prices",children:[i.jsxs("div",{className:"price-block price-block--generic",children:[i.jsx("span",{className:"price-block__label",children:"Jan Aushadhi Generic"}),i.jsxs("span",{className:"price-block__value",children:["₹",e.genericMrp.toFixed(2)]}),i.jsx("span",{className:"price-block__sub",children:"Affordable healthcare rate"})]}),i.jsx("div",{className:"price-divider"}),i.jsxs("div",{className:"price-block price-block--branded",children:[i.jsx("span",{className:"price-block__label",children:"Market Retail, from"}),i.jsxs("span",{className:"price-block__value price-block__value--strike",children:["₹",c?c.toFixed(2):"—"]}),d!==null&&d>0&&i.jsxs("span",{className:"price-block__diff",children:["Save ₹",d.toFixed(2),"/pack"]})]})]}),m.length>0&&i.jsxs("div",{className:"med-card__brands-wrap",children:[i.jsx("span",{className:"brands-title",children:"Common Prescribed Brands:"}),i.jsx("ul",{className:"brands-list",children:x.map(y=>i.jsxs("li",{className:"brand-item",children:[i.jsxs("div",{className:"brand-item__info",children:[i.jsx("span",{className:"brand-name",children:y.brandName}),y.manufacturer&&i.jsxs("span",{className:"brand-maker",children:["(",y.manufacturer,")"]})]}),i.jsxs("span",{className:"brand-mrp",children:["₹",y.mrp.toFixed(2)]})]},y.brandName))}),m.length>3&&i.jsx("button",{type:"button",className:"toggle-brands-btn",onClick:()=>s(!o),children:o?i.jsxs(i.Fragment,{children:[i.jsx(Df,{size:14})," Show less"]}):i.jsxs(i.Fragment,{children:[i.jsx(Zu,{size:14})," +",m.length-3," more brands"]})})]}),i.jsxs("div",{className:"med-card__footer",children:[i.jsxs("button",{type:"button",className:"card-act-btn card-act-btn--calc",onClick:()=>n&&n(e),title:"Calculate monthly & annual savings",children:[i.jsx(bo,{size:15}),i.jsx("span",{children:"Savings Calculator"})]}),i.jsxs("button",{type:"button",className:"card-act-btn card-act-btn--locate",onClick:()=>t(e),title:"Find nearest Jan Aushadhi Kendra",children:[i.jsx(Qe,{size:15}),i.jsx("span",{children:"Find Kendra"})]})]}),i.jsx("style",{children:`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .med-card {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg, 12px);
          padding: 20px 20px 18px;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 180ms ease, transform 180ms ease, border-color 180ms ease;
          animation: card-in 220ms ease backwards;
          display: flex;
          flex-direction: column;
        }
        .med-card:hover {
          box-shadow: 0 10px 28px rgba(10, 38, 33, 0.1);
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }

        .med-card__ribbon {
          position: absolute;
          top: 18px;
          right: -1px;
          background: linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 100%);
          color: #a4e5c4;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          font-weight: 700;
          padding: 3px 12px 3px 14px;
          border-radius: 999px 0 0 999px;
          box-shadow: 0 2px 6px rgba(10, 38, 33, 0.12);
        }

        .med-card__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 10px;
        }
        .med-card__header-info {
          flex: 1;
          padding-right: 50px; /* space for ribbon */
        }
        .med-card__category {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--brass);
          font-weight: 600;
          margin-bottom: 3px;
        }
        .med-card__title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.22rem;
          font-weight: 600;
          color: var(--navy-deep);
          line-height: 1.25;
        }
        .med-card__composition {
          margin: 0;
          font-size: 0.8rem;
          color: var(--ink-soft);
          line-height: 1.35;
        }

        .med-card__fav-btn {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-faint);
          cursor: pointer;
          transition: all 140ms ease;
          flex-shrink: 0;
        }
        .med-card__fav-btn:hover {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }
        .med-card__fav-btn.is-saved {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }

        .med-card__badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .med-code-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          background: var(--brass-soft);
          color: var(--navy);
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .med-who-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--emerald);
          background: var(--emerald-bg);
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }

        .med-card__prices {
          display: flex;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 16px;
          align-items: center;
        }
        .price-block {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .price-divider {
          width: 1px;
          height: 38px;
          background: var(--line);
          margin: 0 12px;
        }
        .price-block__label {
          font-size: 0.7rem;
          color: var(--ink-faint);
          margin-bottom: 2px;
        }
        .price-block__value {
          font-family: var(--font-mono);
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.1;
        }
        .price-block--generic .price-block__value {
          color: var(--emerald);
        }
        .price-block--branded .price-block__value--strike {
          color: var(--rust);
          text-decoration: line-through;
          font-size: 1.05rem;
        }
        .price-block__sub {
          font-size: 0.68rem;
          color: var(--ink-faint);
          margin-top: 2px;
        }
        .price-block__diff {
          font-size: 0.72rem;
          color: var(--navy);
          font-weight: 600;
          margin-top: 2px;
        }

        .med-card__brands-wrap {
          margin-bottom: 16px;
          flex: 1;
        }
        .brands-title {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .brands-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .brand-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.8rem;
          padding: 4px 6px;
          border-radius: 4px;
          transition: background 120ms ease;
        }
        .brand-item:hover {
          background: var(--bg-subtle);
        }
        .brand-name {
          font-weight: 500;
          color: var(--ink);
        }
        .brand-maker {
          font-size: 0.72rem;
          color: var(--ink-faint);
          margin-left: 4px;
        }
        .brand-mrp {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--ink-soft);
          font-weight: 500;
        }
        .toggle-brands-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--navy);
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 0;
          margin-top: 4px;
        }
        .toggle-brands-btn:hover {
          text-decoration: underline;
        }

        .med-card__footer {
          display: flex;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--line);
        }
        .card-act-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .card-act-btn--calc {
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
        }
        .card-act-btn--calc:hover {
          background: var(--brass-soft);
          border-color: var(--brass);
          color: var(--navy);
        }
        .card-act-btn--locate {
          background: var(--navy);
          border: 1px solid var(--navy);
          color: #ffffff;
        }
        .card-act-btn--locate:hover {
          background: var(--navy-deep);
        }
      `})]})}function ym(){return i.jsx("div",{className:"skeleton-card","aria-hidden":"true",children:i.jsx("style",{children:`
        .skeleton-card {
          height: 280px;
          border-radius: var(--radius-lg, 12px);
          border: 1px solid var(--line);
          background: linear-gradient(90deg, var(--bg-subtle) 25%, var(--line) 50%, var(--bg-subtle) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
      `})})}function km(){return i.jsxs("footer",{className:"footer",children:[i.jsxs("div",{className:"footer__inner",children:[i.jsx("p",{className:"footer__disclaimer",children:"Generic pricing shown here is sample/demo data — swap in the live PMBJP price list from data.gov.in before relying on this for real purchases."}),i.jsx("p",{className:"footer__meta",children:"Built for SDG 3 · Good Health & Well-Being"})]}),i.jsx("style",{children:`
        .footer {
          border-top: 1px solid var(--line);
          background: var(--bg-subtle);
        }
        .footer__inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 24px 32px;
        }
        .footer__disclaimer {
          margin: 0 0 8px;
          font-size: 0.78rem;
          color: var(--ink-soft);
          line-height: 1.6;
          max-width: 60ch;
        }
        .footer__meta {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
      `})]})}const bm=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];function wm(){const{authModalOpen:e,authModalTab:t,closeAuthModal:n,login:r,register:a,quickLogin:l,userState:o}=jt(),[s,c]=k.useState("login"),[d,g]=k.useState(""),[h,m]=k.useState(""),[x,y]=k.useState(o||"Kerala"),[w,O]=k.useState(""),[f,u]=k.useState("user"),[p,v]=k.useState(!1),[S,C]=k.useState(!1),[N,E]=k.useState(null);if(k.useEffect(()=>{t&&(c(t),E(null)),o&&y(o)},[t,e,o]),k.useEffect(()=>{const $=X=>{X.key==="Escape"&&e&&n()};return window.addEventListener("keydown",$),()=>window.removeEventListener("keydown",$)},[e,n]),!e)return null;async function I($){$.preventDefault(),E(null),C(!0);try{s==="login"?await r(h.trim(),w):await a(d.trim(),h.trim(),x.trim(),w,f)}catch(X){E(X.message||"Authentication failed. Please check your credentials.")}finally{C(!1)}}async function M($){E(null),C(!0);try{await l($)}catch(X){E(X.message||"Failed to login with demo credentials")}finally{C(!1)}}return i.jsxs("div",{className:"auth-overlay",onClick:n,children:[i.jsxs("div",{className:"auth-modal",onClick:$=>$.stopPropagation(),role:"dialog","aria-modal":"true",children:[i.jsx("button",{className:"auth-modal__close",onClick:n,"aria-label":"Close dialog",children:i.jsx(bt,{size:18})}),i.jsxs("div",{className:"auth-modal__header",children:[i.jsxs("div",{className:"auth-modal__badge",children:[i.jsx(Tr,{size:16,strokeWidth:2.2}),i.jsx("span",{children:"Secure Access"})]}),i.jsx("h2",{className:"auth-modal__title",children:s==="login"?"Welcome back to RxCompare":"Create your RxCompare Account"}),i.jsx("p",{className:"auth-modal__subtitle",children:s==="login"?"Access your saved prescriptions and manage generic medicine comparisons.":"Compare branded vs generic Jan Aushadhi prices, save prescription cabinets, and locate Kendras."})]}),i.jsxs("div",{className:"demo-shortcuts",children:[i.jsx("span",{className:"demo-shortcuts__label",children:"Quick 1-Click Access:"}),i.jsxs("div",{className:"demo-shortcuts__buttons",children:[i.jsxs("button",{type:"button",className:"demo-btn demo-btn--admin",onClick:()=>M("admin"),disabled:S,children:[i.jsx(ei,{size:14}),i.jsx("span",{children:"Demo Admin (Full CRUD)"})]}),i.jsxs("button",{type:"button",className:"demo-btn demo-btn--patient",onClick:()=>M("user"),disabled:S,children:[i.jsx(Os,{size:14}),i.jsx("span",{children:"Demo Patient"})]})]})]}),i.jsx("div",{className:"auth-divider",children:i.jsx("span",{children:"or continue with email"})}),i.jsxs("div",{className:"auth-tabs",role:"tablist",children:[i.jsx("button",{type:"button",className:`auth-tab ${s==="login"?"is-active":""}`,onClick:()=>{c("login"),E(null)},children:"Sign In"}),i.jsx("button",{type:"button",className:`auth-tab ${s==="register"?"is-active":""}`,onClick:()=>{c("register"),E(null)},children:"Create Account"})]}),N&&i.jsxs("div",{className:"auth-error",role:"alert",children:[i.jsx(Lr,{size:16}),i.jsx("span",{children:N})]}),i.jsxs("form",{onSubmit:I,className:"auth-form",children:[s==="register"&&i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"auth-name",children:"Full Name"}),i.jsxs("div",{className:"input-wrap",children:[i.jsx(Os,{size:16,className:"input-icon"}),i.jsx("input",{id:"auth-name",type:"text",placeholder:"e.g. Dr. Priya Nair or Rahul",value:d,onChange:$=>g($.target.value),required:!0})]})]}),i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"auth-email",children:"Email Address"}),i.jsxs("div",{className:"input-wrap",children:[i.jsx(Qf,{size:16,className:"input-icon"}),i.jsx("input",{id:"auth-email",type:"email",placeholder:"name@example.com",value:h,onChange:$=>m($.target.value),required:!0})]})]}),s==="register"&&i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"auth-state",children:"Your State (Jan Aushadhi Locator)"}),i.jsxs("div",{className:"input-wrap",children:[i.jsx(Qe,{size:16,className:"input-icon"}),i.jsx("select",{id:"auth-state",value:x,onChange:$=>y($.target.value),className:"state-select",required:!0,children:bm.map($=>i.jsx("option",{value:$,children:$},$))})]}),i.jsxs("span",{className:"state-help-text",children:["Nearby Jan Aushadhi Kendras in ",x," will be prioritized with exact Google Maps directions."]})]}),i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"auth-password",children:"Password"}),i.jsxs("div",{className:"input-wrap",children:[i.jsx(Hf,{size:16,className:"input-icon"}),i.jsx("input",{id:"auth-password",type:p?"text":"password",placeholder:"At least 6 characters",value:w,onChange:$=>O($.target.value),minLength:6,required:!0}),i.jsx("button",{type:"button",className:"input-eye",onClick:()=>v(!p),"aria-label":p?"Hide password":"Show password",children:p?i.jsx(Kf,{size:16}):i.jsx(Vf,{size:16})})]})]}),s==="register"&&i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"auth-role",children:"Account Role"}),i.jsxs("select",{id:"auth-role",value:f,onChange:$=>u($.target.value),className:"select-input",children:[i.jsx("option",{value:"user",children:"Patient / Consumer (Compare & Save)"}),i.jsx("option",{value:"admin",children:"Administrator (Manage Catalog & Kendras)"})]})]}),i.jsx("button",{type:"submit",className:"auth-submit-btn",disabled:S,children:S?"Processing...":s==="login"?"Sign In":"Create Account"})]}),i.jsx("div",{className:"auth-footer-note",children:s==="login"?i.jsxs("p",{children:["Don't have an account yet?"," ",i.jsx("button",{type:"button",className:"link-btn",onClick:()=>{c("register"),E(null)},children:"Sign up free"})]}):i.jsxs("p",{children:["Already registered?"," ",i.jsx("button",{type:"button",className:"link-btn",onClick:()=>{c("login"),E(null)},children:"Sign in here"})]})})]}),i.jsx("style",{children:`
        .auth-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.45);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fade-in 180ms ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-scale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .auth-modal {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 460px;
          border-radius: var(--radius-lg, 12px);
          padding: 32px 32px 28px;
          box-shadow: 0 20px 60px rgba(10, 38, 33, 0.22);
          border: 1px solid var(--line);
          animation: modal-scale 220ms var(--ease, ease-out) forwards;
          max-height: 90vh;
          overflow-y: auto;
        }

        .auth-modal__close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          color: var(--ink-soft);
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 120ms ease;
        }
        .auth-modal__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .auth-modal__header {
          margin-bottom: 20px;
        }

        .auth-modal__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--emerald-bg);
          color: var(--emerald);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 12px;
        }

        .auth-modal__title {
          margin: 0 0 6px;
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--navy-deep);
          line-height: 1.25;
        }

        .auth-modal__subtitle {
          margin: 0;
          font-size: 0.86rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        .demo-shortcuts {
          background: var(--bg-subtle);
          border: 1px dashed var(--line-strong);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 18px;
        }
        .demo-shortcuts__label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }
        .demo-shortcuts__buttons {
          display: flex;
          gap: 8px;
        }
        .demo-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          font-size: 0.78rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 150ms ease;
          border: 1px solid var(--line-strong);
          background: #ffffff;
        }
        .demo-btn--admin {
          color: var(--navy);
          border-color: var(--brass);
          background: #fffdf9;
        }
        .demo-btn--admin:hover:not(:disabled) {
          background: var(--brass-soft);
        }
        .demo-btn--patient {
          color: var(--emerald);
          border-color: var(--emerald);
          background: #fbfdfc;
        }
        .demo-btn--patient:hover:not(:disabled) {
          background: var(--emerald-bg);
        }
        .demo-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 16px 0 16px;
          color: var(--ink-faint);
          font-size: 0.74rem;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid var(--line);
        }
        .auth-divider span {
          padding: 0 10px;
        }

        .auth-tabs {
          display: flex;
          background: var(--bg-subtle);
          border-radius: 8px;
          padding: 3px;
          margin-bottom: 20px;
        }
        .auth-tab {
          flex: 1;
          padding: 8px;
          font-size: 0.86rem;
          font-weight: 500;
          color: var(--ink-soft);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .auth-tab.is-active {
          background: #ffffff;
          color: var(--navy-deep);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fdf2ef;
          border: 1px solid var(--rust);
          color: var(--rust);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          margin-bottom: 16px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--ink-soft);
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          transition: border-color 140ms ease, box-shadow 140ms ease;
        }
        .input-wrap:focus-within {
          border-color: var(--navy);
          box-shadow: 0 0 0 2px rgba(18, 60, 51, 0.12);
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--ink-faint);
          pointer-events: none;
        }
        .input-wrap input {
          width: 100%;
          border: none;
          background: transparent;
          padding: 10px 38px 10px 36px;
          font-size: 0.9rem;
          color: var(--ink);
          font-family: inherit;
        }
        .input-wrap input:focus {
          outline: none;
        }
        .input-eye {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          display: flex;
          padding: 4px;
        }
        .input-eye:hover {
          color: var(--ink);
        }

        .select-input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--line-strong);
          background: #ffffff;
          font-family: inherit;
          font-size: 0.88rem;
          color: var(--ink);
          outline: none;
        }
        .select-input:focus {
          border-color: var(--navy);
        }

        .state-select {
          width: 100%;
          border: none;
          background: transparent;
          padding: 10px 12px 10px 36px;
          font-size: 0.88rem;
          color: var(--ink);
          font-family: inherit;
          outline: none;
          cursor: pointer;
        }

        .state-help-text {
          font-size: 0.73rem;
          color: var(--ink-faint);
          line-height: 1.4;
        }

        .auth-submit-btn {
          margin-top: 8px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 140ms ease;
        }
        .auth-submit-btn:hover:not(:disabled) {
          background: var(--navy-deep);
        }
        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer-note {
          margin-top: 20px;
          text-align: center;
          font-size: 0.82rem;
          color: var(--ink-soft);
        }
        .auth-footer-note p {
          margin: 0;
        }
        .link-btn {
          background: none;
          border: none;
          color: var(--navy);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }
      `})]})}function Ds({toast:e,onClose:t}){if(k.useEffect(()=>{if(!e)return;const a=setTimeout(()=>{t()},4e3);return()=>clearTimeout(a)},[e,t]),!e)return null;const n=e.type==="success",r=e.type==="error";return i.jsxs("div",{className:`toast-container toast--${e.type||"info"}`,role:"alert",children:[i.jsxs("div",{className:"toast-icon",children:[n&&i.jsx(bn,{size:16,strokeWidth:2.5}),r&&i.jsx(Lr,{size:16,strokeWidth:2.5}),!n&&!r&&i.jsx(ei,{size:16,strokeWidth:2})]}),i.jsx("div",{className:"toast-message",children:e.message}),i.jsx("button",{className:"toast-close",onClick:t,"aria-label":"Close notification",children:i.jsx(bt,{size:14})}),i.jsx("style",{children:`
        @keyframes toast-enter {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 280px;
          max-width: 440px;
          padding: 12px 16px;
          background: #ffffff;
          border-radius: var(--radius-lg, 12px);
          box-shadow: 0 12px 32px rgba(10, 38, 33, 0.16), 0 2px 6px rgba(10, 38, 33, 0.08);
          border: 1px solid var(--line);
          animation: toast-enter 220ms var(--ease, ease-out) forwards;
        }

        .toast--success {
          border-left: 4px solid var(--emerald);
        }
        .toast--success .toast-icon {
          color: var(--emerald);
          background: var(--emerald-bg);
        }

        .toast--error {
          border-left: 4px solid var(--rust);
        }
        .toast--error .toast-icon {
          color: var(--rust);
          background: #fdeee9;
        }

        .toast--info {
          border-left: 4px solid var(--navy);
        }
        .toast--info .toast-icon {
          color: var(--navy);
          background: var(--bg-subtle);
        }

        .toast-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-message {
          flex: 1;
          font-size: 0.88rem;
          color: var(--ink);
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 150ms ease, background 150ms ease;
        }
        .toast-close:hover {
          color: var(--ink);
          background: var(--bg-subtle);
        }
      `})]})}function jm({medicine:e,onClose:t,onLocateStores:n}){const{toggleSave:r,isSaved:a}=jt(),[l,o]=k.useState(1),[s,c]=k.useState("annual");if(!e)return null;const d=e.genericMrp||0,g=e.cheapestBrandedMrp||d*3,h=Math.max(0,g-d),m=g>0?Math.round(h/g*100):0,x=d*l,y=g*l,w=h*l,O=w*12,f=O*5,u=s==="monthly"?w:s==="annual"?O:f,p=a(e._id);return i.jsxs("div",{className:"calc-overlay",onClick:t,children:[i.jsxs("div",{className:"calc-modal",onClick:v=>v.stopPropagation(),role:"dialog",children:[i.jsx("button",{className:"calc-close",onClick:t,"aria-label":"Close calculator",children:i.jsx(bt,{size:18})}),i.jsxs("div",{className:"calc-header",children:[i.jsxs("div",{className:"calc-badge",children:[i.jsx(bo,{size:15}),i.jsx("span",{children:"Interactive Savings Estimator"})]}),i.jsx("h2",{className:"calc-title",children:e.genericName}),i.jsxs("p",{className:"calc-meta",children:[e.composition," · ",e.packSize]})]}),i.jsxs("div",{className:"dosage-section",children:[i.jsxs("label",{className:"dosage-label",children:[i.jsx("span",{children:"Prescription Consumption:"}),i.jsxs("strong",{children:[l," ",l===1?"pack":"packs"," / month"]})]}),i.jsxs("div",{className:"dosage-slider-wrap",children:[i.jsx("input",{type:"range",min:"1",max:"12",value:l,onChange:v=>o(Number(v.target.value)),className:"dosage-slider"}),i.jsxs("div",{className:"slider-ticks",children:[i.jsx("span",{children:"1 pack (mild)"}),i.jsx("span",{children:"3 packs"}),i.jsx("span",{children:"6 packs"}),i.jsx("span",{children:"12 packs (family)"})]})]})]}),i.jsxs("div",{className:"timeframe-tabs",children:[i.jsx("button",{type:"button",className:`time-tab ${s==="monthly"?"is-active":""}`,onClick:()=>c("monthly"),children:"Monthly"}),i.jsx("button",{type:"button",className:`time-tab ${s==="annual"?"is-active":""}`,onClick:()=>c("annual"),children:"1 Year Savings"}),i.jsx("button",{type:"button",className:`time-tab ${s==="5year"?"is-active":""}`,onClick:()=>c("5year"),children:"5-Year Projection"})]}),i.jsxs("div",{className:"savings-highlight-card",children:[i.jsxs("div",{className:"savings-metric",children:[i.jsxs("span",{className:"metric-tag",children:[i.jsx(td,{size:14})," Total Out-of-Pocket Savings"]}),i.jsxs("div",{className:"metric-figure",children:["₹",u.toLocaleString("en-IN",{maximumFractionDigits:0})]}),i.jsxs("span",{className:"metric-sub",children:["You keep ",m,"% more money in your household health budget"]})]}),i.jsxs("div",{className:"cost-comparison-row",children:[i.jsxs("div",{className:"cost-box cost-box--generic",children:[i.jsx("span",{className:"cost-lbl",children:"Jan Aushadhi Generic"}),i.jsxs("span",{className:"cost-val",children:["₹",(s==="monthly"?x:s==="annual"?x*12:x*60).toLocaleString("en-IN",{maximumFractionDigits:0})]})]}),i.jsx("div",{className:"cost-vs",children:"vs"}),i.jsxs("div",{className:"cost-box cost-box--branded",children:[i.jsx("span",{className:"cost-lbl",children:"Branded Equivalent"}),i.jsxs("span",{className:"cost-val strike",children:["₹",(s==="monthly"?y:s==="annual"?y*12:y*60).toLocaleString("en-IN",{maximumFractionDigits:0})]})]})]})]}),i.jsxs("div",{className:"quality-card",children:[i.jsx(Tr,{size:20,className:"quality-icon"}),i.jsxs("div",{className:"quality-text",children:[i.jsx("strong",{children:"Govt. Certified Quality & Efficacy"}),i.jsx("p",{children:"Pradhan Mantri Bhartiya Janaushadhi Pariyojana medicines are chemically bioequivalent to popular brands, manufactured in WHO-GMP certified facilities, and batch-tested at NABL-accredited national laboratories."})]})]}),i.jsxs("div",{className:"calc-actions",children:[i.jsxs("button",{type:"button",className:`calc-btn calc-btn--save ${p?"is-saved":""}`,onClick:()=>r(e),children:[i.jsx(Rn,{size:16,fill:p?"currentColor":"none"}),i.jsx("span",{children:p?"In Cabinet":"Save to Cabinet"})]}),i.jsxs("button",{type:"button",className:"calc-btn calc-btn--locate",onClick:()=>{t(),n&&n(e)},children:[i.jsx(Qe,{size:16}),i.jsx("span",{children:"Find Nearest Kendra"})]})]})]}),i.jsx("style",{children:`
        .calc-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.48);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .calc-modal {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 520px;
          border-radius: var(--radius-lg, 12px);
          padding: 28px 28px 24px;
          box-shadow: 0 24px 64px rgba(10, 38, 33, 0.22);
          border: 1px solid var(--line);
          animation: modal-scale 200ms ease-out forwards;
          max-height: 90vh;
          overflow-y: auto;
        }

        .calc-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          color: var(--ink-soft);
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .calc-close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .calc-header {
          margin-bottom: 20px;
        }
        .calc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--emerald-bg);
          color: var(--emerald);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .calc-title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .calc-meta {
          margin: 0;
          font-size: 0.86rem;
          color: var(--ink-soft);
        }

        .dosage-section {
          background: var(--bg-subtle);
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 16px;
          border: 1px solid var(--line);
        }
        .dosage-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.86rem;
          color: var(--ink);
          margin-bottom: 10px;
        }
        .dosage-label strong {
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.92rem;
        }
        .dosage-slider {
          width: 100%;
          cursor: pointer;
          accent-color: var(--navy);
        }
        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        .timeframe-tabs {
          display: flex;
          background: var(--bg-subtle);
          border-radius: 8px;
          padding: 3px;
          margin-bottom: 18px;
        }
        .time-tab {
          flex: 1;
          padding: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--ink-soft);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 120ms ease;
        }
        .time-tab.is-active {
          background: #ffffff;
          color: var(--navy-deep);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

        .savings-highlight-card {
          background: linear-gradient(135deg, #0a2621 0%, #123c33 100%);
          color: #ffffff;
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 18px;
          box-shadow: 0 8px 24px rgba(10, 38, 33, 0.18);
        }
        .savings-metric {
          margin-bottom: 16px;
        }
        .metric-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a4e5c4;
          margin-bottom: 6px;
        }
        .metric-figure {
          font-family: var(--font-display);
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.1;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        .metric-sub {
          display: block;
          font-size: 0.8rem;
          color: #d1e7dd;
          margin-top: 4px;
        }

        .cost-comparison-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 14px;
          gap: 12px;
        }
        .cost-box {
          display: flex;
          flex-direction: column;
        }
        .cost-lbl {
          font-size: 0.72rem;
          color: #a0b8af;
          margin-bottom: 2px;
        }
        .cost-val {
          font-family: var(--font-mono);
          font-size: 1.05rem;
          font-weight: 600;
          color: #ffffff;
        }
        .cost-val.strike {
          text-decoration: line-through;
          color: #f7a894;
        }
        .cost-vs {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #8da39b;
        }

        .quality-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: #f8faf8;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }
        .quality-icon {
          color: var(--emerald);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .quality-text strong {
          display: block;
          font-size: 0.82rem;
          color: var(--navy-deep);
          margin-bottom: 2px;
        }
        .quality-text p {
          margin: 0;
          font-size: 0.76rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        .calc-actions {
          display: flex;
          gap: 10px;
        }
        .calc-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .calc-btn--save {
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
        }
        .calc-btn--save:hover {
          background: var(--line);
        }
        .calc-btn--save.is-saved {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }
        .calc-btn--locate {
          background: var(--navy);
          border: 1px solid var(--navy);
          color: #ffffff;
        }
        .calc-btn--locate:hover {
          background: var(--navy-deep);
        }
      `})]})}function $s({open:e,onClose:t,onLocateStores:n,onOpenCalculator:r}){const{savedMedicines:a,toggleSave:l,showToast:o,isAuthenticated:s,openAuthModal:c}=jt(),[d,g]=k.useState(!1);if(!e)return null;const h=(a||[]).filter(u=>u&&typeof u=="object"&&u.genericName);let m=0,x=0;h.forEach(u=>{var S,C;const p=u.genericMrp||0,v=u.cheapestBrandedMrp||((C=(S=u.brandedEquivalents)==null?void 0:S[0])==null?void 0:C.mrp)||p*2.5;m+=p,x+=v});const y=Math.max(0,x-m),w=y*12,O=x>0?Math.round(y/x*100):0,f=()=>{if(h.length===0)return;let u=`🏥 My RxCompare Prescription Cabinet Summary

`;h.forEach((p,v)=>{var N,E,I,M;const S=(N=p.genericMrp)==null?void 0:N.toFixed(2),C=((M=p.cheapestBrandedMrp||((I=(E=p.brandedEquivalents)==null?void 0:E[0])==null?void 0:I.mrp))==null?void 0:M.toFixed(2))||"N/A";u+=`${v+1}. ${p.genericName} (${p.drugCode})
`,u+=`   Composition: ${p.composition} | Pack: ${p.packSize}
`,u+=`   Jan Aushadhi Generic: ₹${S} (Branded: ₹${C})

`}),u+=`💰 Total Routine Generic Cost: ₹${m.toFixed(2)}
`,u+=`💎 Total Routine Branded Cost: ₹${x.toFixed(2)}
`,u+=`🎉 Monthly Savings: ₹${y.toFixed(2)} (${O}% savings)
`,u+=`📈 Annual Savings: ₹${w.toFixed(2)}
`,u+=`
Powered by RxCompare — Aligned with PMBJP & SDG 3`,navigator.clipboard.writeText(u),g(!0),o("Prescription summary copied to clipboard!","success"),setTimeout(()=>g(!1),3e3)};return i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"cabinet-backdrop",onClick:t}),i.jsxs("aside",{className:"cabinet-drawer",role:"dialog","aria-modal":"true",children:[i.jsxs("div",{className:"cabinet__header",children:[i.jsxs("div",{children:[i.jsxs("div",{className:"cabinet__eyebrow",children:[i.jsx(Rn,{size:14,fill:"currentColor",color:"var(--rust)"}),i.jsx("span",{children:"Personal Medicine Cabinet"})]}),i.jsxs("h3",{className:"cabinet__title",children:["Saved Prescriptions (",h.length,")"]})]}),i.jsx("button",{className:"cabinet__close",onClick:t,"aria-label":"Close cabinet",children:i.jsx(bt,{size:18})})]}),!s&&i.jsxs("div",{className:"guest-sync-banner",children:[i.jsxs("p",{children:["Browsing as guest. ",i.jsx("strong",{children:"Sign in"})," to sync your prescriptions across devices."]}),i.jsx("button",{type:"button",className:"guest-sync-btn",onClick:()=>{t(),c("login")},children:"Sign In"})]}),h.length>0&&i.jsxs("div",{className:"cabinet__summary-card",children:[i.jsxs("div",{className:"summary-col",children:[i.jsx("span",{className:"summary-label",children:"Monthly Routine"}),i.jsxs("span",{className:"summary-price generic",children:["₹",m.toFixed(2)]}),i.jsxs("span",{className:"summary-price strike",children:["₹",x.toFixed(2)]})]}),i.jsxs("div",{className:"summary-savings",children:[i.jsxs("span",{className:"savings-badge",children:["Save ",O,"%"]}),i.jsxs("span",{className:"savings-val",children:["₹",y.toFixed(2)," / mo"]}),i.jsxs("span",{className:"savings-ann",children:["₹",w.toFixed(0)," / yr"]})]})]}),i.jsx("div",{className:"cabinet__body",children:h.length===0?i.jsxs("div",{className:"cabinet__empty",children:[i.jsx("div",{className:"empty-icon",children:i.jsx(Rn,{size:28})}),i.jsx("h4",{children:"Your cabinet is empty"}),i.jsx("p",{children:"Search for any medicine and tap the heart icon to save it here for consolidated monthly savings and pharmacy locating."})]}):i.jsx("ul",{className:"cabinet__list",children:h.map(u=>{var C,N;const p=u.genericMrp||0,v=u.cheapestBrandedMrp||((N=(C=u.brandedEquivalents)==null?void 0:C[0])==null?void 0:N.mrp)||p*2.5,S=Math.max(0,v-p);return i.jsxs("li",{className:"cabinet-item",children:[i.jsxs("div",{className:"cabinet-item__info",children:[i.jsx("div",{className:"cabinet-item__tag",children:u.drugCode}),i.jsx("h4",{className:"cabinet-item__title",children:u.genericName}),i.jsxs("p",{className:"cabinet-item__meta",children:[u.composition," · ",u.packSize]}),i.jsxs("div",{className:"cabinet-item__prices",children:[i.jsxs("span",{className:"price-gen",children:["₹",p.toFixed(2)]}),i.jsxs("span",{className:"price-br",children:["₹",v.toFixed(2)]}),i.jsxs("span",{className:"price-sav",children:["Save ₹",S.toFixed(2)]})]})]}),i.jsxs("div",{className:"cabinet-item__actions",children:[i.jsx("button",{type:"button",className:"act-btn locate",title:"Locate Kendra",onClick:()=>{t(),n&&n(u)},children:i.jsx(Qe,{size:15})}),i.jsx("button",{type:"button",className:"act-btn calc",title:"Calculate Savings",onClick:()=>{t(),r&&r(u)},children:i.jsx(bo,{size:15})}),i.jsx("button",{type:"button",className:"act-btn remove",title:"Remove from cabinet",onClick:()=>l(u),children:i.jsx(Fa,{size:15})})]})]},u._id)})})}),h.length>0&&i.jsx("div",{className:"cabinet__footer",children:i.jsxs("button",{type:"button",className:"copy-summary-btn",onClick:f,children:[d?i.jsx(bn,{size:16}):i.jsx(Bf,{size:16}),i.jsx("span",{children:d?"Copied Prescription!":"Copy Cabinet Summary"})]})})]}),i.jsx("style",{children:`
        .cabinet-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.4);
          z-index: 40;
          animation: fade-in 180ms ease-out;
        }

        .cabinet-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(440px, 100%);
          background: #ffffff;
          box-shadow: 0 16px 48px rgba(10, 38, 33, 0.22);
          z-index: 41;
          display: flex;
          flex-direction: column;
          animation: slide-in 220ms var(--ease, ease-out);
        }

        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .cabinet__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 22px 22px 16px;
          border-bottom: 1px solid var(--line);
        }
        .cabinet__eyebrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-faint);
          margin-bottom: 4px;
        }
        .cabinet__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.28rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .cabinet__close {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 6px;
          color: var(--ink-soft);
          cursor: pointer;
          display: flex;
        }
        .cabinet__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .guest-sync-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: #fdfaf3;
          border-bottom: 1px solid #ebd9bf;
          padding: 10px 20px;
          font-size: 0.78rem;
          color: #7d571f;
        }
        .guest-sync-banner p {
          margin: 0;
          line-height: 1.35;
        }
        .guest-sync-btn {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
        }

        .cabinet__summary-card {
          margin: 16px 20px 0;
          background: linear-gradient(135deg, #0a2621 0%, #123c33 100%);
          color: #ffffff;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 14px rgba(10, 38, 33, 0.12);
        }
        .summary-col {
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          text-transform: uppercase;
          color: #a0b8af;
          margin-bottom: 2px;
        }
        .summary-price.generic {
          font-family: var(--font-mono);
          font-size: 1.25rem;
          font-weight: 700;
          color: #a4e5c4;
        }
        .summary-price.strike {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          text-decoration: line-through;
          color: #f7a894;
        }

        .summary-savings {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .savings-badge {
          background: rgba(164, 229, 196, 0.2);
          color: #a4e5c4;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          margin-bottom: 2px;
        }
        .savings-val {
          font-family: var(--font-mono);
          font-size: 0.96rem;
          font-weight: 600;
          color: #ffffff;
        }
        .savings-ann {
          font-size: 0.7rem;
          color: #c7ded4;
        }

        .cabinet__body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
        }

        .cabinet__empty {
          text-align: center;
          padding: 60px 16px;
          color: var(--ink-soft);
        }
        .empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--bg-subtle);
          color: var(--ink-faint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .cabinet__empty h4 {
          margin: 0 0 8px;
          font-size: 1.05rem;
          color: var(--navy-deep);
        }
        .cabinet__empty p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          max-width: 32ch;
          margin: 0 auto;
        }

        .cabinet__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cabinet-item {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          transition: box-shadow 150ms ease, border-color 150ms ease;
        }
        .cabinet-item:hover {
          border-color: var(--line-strong);
          box-shadow: var(--shadow-sm);
        }

        .cabinet-item__info {
          flex: 1;
          min-width: 0;
        }
        .cabinet-item__tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--brass);
          font-weight: 600;
          margin-bottom: 2px;
        }
        .cabinet-item__title {
          margin: 0 0 3px;
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 600;
          color: var(--navy-deep);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cabinet-item__meta {
          margin: 0 0 6px;
          font-size: 0.74rem;
          color: var(--ink-soft);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cabinet-item__prices {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
        }
        .price-gen {
          color: var(--emerald);
          font-weight: 700;
        }
        .price-br {
          color: var(--rust);
          text-decoration: line-through;
        }
        .price-sav {
          color: var(--navy);
          background: var(--bg-subtle);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.68rem;
        }

        .cabinet-item__actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .act-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--line);
          background: var(--bg-subtle);
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 120ms ease;
        }
        .act-btn.locate:hover {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }
        .act-btn.calc:hover {
          background: var(--brass-soft);
          border-color: var(--brass);
          color: var(--brass);
        }
        .act-btn.remove:hover {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }

        .cabinet__footer {
          padding: 14px 20px;
          border-top: 1px solid var(--line);
          background: var(--bg-subtle);
        }
        .copy-summary-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 11px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 140ms ease;
        }
        .copy-summary-btn:hover {
          background: var(--navy-deep);
        }
      `})]})}const _m=["General","Pain Relief","Cardiovascular","Diabetes","Antibiotics","Gastrointestinal","Respiratory","Neurology","Vitamins & Supplements"];function Sm({open:e,medicine:t,onClose:n,onSuccess:r}){const{token:a,showToast:l}=jt(),o=!!(t&&t._id),[s,c]=k.useState(""),[d,g]=k.useState(""),[h,m]=k.useState(""),[x,y]=k.useState("General"),[w,O]=k.useState("10 tablets"),[f,u]=k.useState(""),[p,v]=k.useState([{brandName:"",manufacturer:"",mrp:""}]),[S,C]=k.useState(""),[N,E]=k.useState(!1),[I,M]=k.useState(null);if(k.useEffect(()=>{var _;t?(c(t.drugCode||""),g(t.genericName||""),m(t.composition||""),y(t.category||"General"),O(t.packSize||"10 tablets"),u(((_=t.genericMrp)==null?void 0:_.toString())||""),v(t.brandedEquivalents&&t.brandedEquivalents.length>0?t.brandedEquivalents.map(D=>{var B;return{brandName:D.brandName||"",manufacturer:D.manufacturer||"",mrp:((B=D.mrp)==null?void 0:B.toString())||""}}):[{brandName:"",manufacturer:"",mrp:""}]),C(t.searchKeywords&&Array.isArray(t.searchKeywords)?t.searchKeywords.join(", "):"")):(c(`JAS-${Math.floor(100+Math.random()*900)}`),g(""),m(""),y("General"),O("10 tablets"),u(""),v([{brandName:"",manufacturer:"",mrp:""}]),C("")),M(null)},[t,e]),!e)return null;const $=()=>{v([...p,{brandName:"",manufacturer:"",mrp:""}])},X=_=>{p.length<=1||v(p.filter((D,B)=>B!==_))},oe=(_,D,B)=>{const Ae=[...p];Ae[_][D]=B,v(Ae)},A=parseFloat(f)||0,ee=p.map(_=>parseFloat(_.mrp)).filter(_=>!isNaN(_)&&_>0),L=ee.length>0?Math.min(...ee):0,P=L>A?L-A:0,b=L>0?Math.round(P/L*100):0,R=async _=>{_.preventDefault(),M(null),E(!0);try{const D=parseFloat(f);if(isNaN(D)||D<=0)throw new Error("Jan Aushadhi Generic MRP must be a positive number");const B=p.filter(ce=>ce.brandName&&ce.brandName.trim()).map(ce=>{const fe=parseFloat(ce.mrp);if(isNaN(fe)||fe<=0)throw new Error(`Branded equivalent "${ce.brandName}" must have a valid positive MRP`);return{brandName:ce.brandName.trim(),manufacturer:ce.manufacturer?ce.manufacturer.trim():"Unknown",mrp:fe}}),Ae=S.split(",").map(ce=>ce.trim().toLowerCase()).filter(Boolean),se={drugCode:s.trim(),genericName:d.trim(),composition:h.trim(),category:x.trim(),packSize:w.trim(),genericMrp:D,brandedEquivalents:B,searchKeywords:Ae};o?(await lm(t._id,se,a),l(`Successfully updated "${se.genericName}"`,"success")):(await im(se,a),l(`Added new formulation "${se.genericName}" to PMBJP catalog`,"success")),r&&r(),n()}catch(D){M(D.message||"Failed to save medicine entry")}finally{E(!1)}};return i.jsxs("div",{className:"admin-overlay",onClick:n,children:[i.jsxs("div",{className:"admin-modal",onClick:_=>_.stopPropagation(),role:"dialog",children:[i.jsx("button",{className:"admin-modal__close",onClick:n,"aria-label":"Close",children:i.jsx(bt,{size:18})}),i.jsxs("div",{className:"admin-modal__header",children:[i.jsxs("div",{className:"admin-badge",children:[i.jsx(Nr,{size:14}),i.jsx("span",{children:o?"Edit Formulation":"Add New Formulation"})]}),i.jsx("h2",{className:"admin-title",children:o?`Update ${t.genericName}`:"Register Jan Aushadhi Formulation"}),i.jsx("p",{className:"admin-subtitle",children:"Cataloged medicines are searchable by patients and compared against market brand names."})]}),L>0&&i.jsxs("div",{className:"live-preview-banner",children:[i.jsx(ei,{size:16}),i.jsxs("div",{className:"preview-stat",children:[i.jsxs("span",{children:["Generic Price: ",i.jsxs("strong",{children:["₹",A.toFixed(2)]})]}),i.jsxs("span",{children:["Cheapest Branded: ",i.jsxs("strong",{children:["₹",L.toFixed(2)]})]}),i.jsxs("span",{children:["Patient Savings: ",i.jsxs("strong",{className:"preview-green",children:["₹",P.toFixed(2)," (",b,"%)"]})]})]})]}),I&&i.jsxs("div",{className:"admin-error",children:[i.jsx(Lr,{size:16}),i.jsx("span",{children:I})]}),i.jsxs("form",{onSubmit:R,className:"admin-form",children:[i.jsxs("div",{className:"form-row form-row--2",children:[i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"PMBJP Drug Code *"}),i.jsx("input",{type:"text",placeholder:"e.g. JAS-017",value:s,onChange:_=>c(_.target.value),required:!0})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Therapeutic Category *"}),i.jsx("select",{value:x,onChange:_=>y(_.target.value),children:_m.map(_=>i.jsx("option",{value:_,children:_},_))})]})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Generic Name & Strength *"}),i.jsx("input",{type:"text",placeholder:"e.g. Paracetamol 650mg or Atorvastatin 10mg",value:d,onChange:_=>g(_.target.value),required:!0})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Active Chemical Composition *"}),i.jsx("input",{type:"text",placeholder:"e.g. Paracetamol IP 650mg",value:h,onChange:_=>m(_.target.value),required:!0})]}),i.jsxs("div",{className:"form-row form-row--2",children:[i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Standard Pack Size *"}),i.jsx("input",{type:"text",placeholder:"e.g. 10 tablets, 15 capsules, 100ml",value:w,onChange:_=>O(_.target.value),required:!0})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Jan Aushadhi Generic MRP (₹) *"}),i.jsx("input",{type:"number",step:"0.01",min:"0.1",placeholder:"e.g. 18.50",value:f,onChange:_=>u(_.target.value),required:!0})]})]}),i.jsxs("div",{className:"branded-section",children:[i.jsxs("div",{className:"branded-section__header",children:[i.jsxs("div",{children:[i.jsx("label",{className:"branded-title",children:"Branded Competitor Equivalents"}),i.jsx("p",{className:"branded-desc",children:"Add popular commercial brand names prescribed by doctors"})]}),i.jsxs("button",{type:"button",className:"add-brand-btn",onClick:$,children:[i.jsx(Zn,{size:14})," Add Brand"]})]}),i.jsx("div",{className:"branded-list",children:p.map((_,D)=>i.jsxs("div",{className:"brand-row",children:[i.jsx("div",{className:"brand-col flex-2",children:i.jsx("input",{type:"text",placeholder:"Brand Name (e.g. Dolo 650)",value:_.brandName,onChange:B=>oe(D,"brandName",B.target.value)})}),i.jsx("div",{className:"brand-col flex-2",children:i.jsx("input",{type:"text",placeholder:"Manufacturer (e.g. Micro Labs)",value:_.manufacturer,onChange:B=>oe(D,"manufacturer",B.target.value)})}),i.jsx("div",{className:"brand-col flex-1",children:i.jsx("input",{type:"number",step:"0.01",min:"0.1",placeholder:"MRP (₹)",value:_.mrp,onChange:B=>oe(D,"mrp",B.target.value)})}),p.length>1&&i.jsx("button",{type:"button",className:"brand-del-btn",onClick:()=>X(D),title:"Remove Brand",children:i.jsx(Fa,{size:15})})]},D))})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Search Keywords (Comma Separated)"}),i.jsx("input",{type:"text",placeholder:"e.g. dolo, crocin, fever, pain, calpol",value:S,onChange:_=>C(_.target.value)}),i.jsx("small",{className:"field-hint",children:"Entering keywords allows patients to find this formulation even if they type common nicknames."})]}),i.jsxs("div",{className:"modal-actions",children:[i.jsx("button",{type:"button",className:"btn-cancel",onClick:n,disabled:N,children:"Cancel"}),i.jsx("button",{type:"submit",className:"btn-save",disabled:N,children:N?"Saving Formulation...":o?"Save Changes":"Create Formulation"})]})]})]}),i.jsx("style",{children:`
        .admin-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 38, 33, 0.45);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .admin-modal {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 620px;
          border-radius: var(--radius-lg, 12px);
          padding: 30px;
          box-shadow: 0 20px 60px rgba(10, 38, 33, 0.22);
          border: 1px solid var(--line);
          max-height: 90vh;
          overflow-y: auto;
          animation: modal-scale 180ms ease-out;
        }

        .admin-modal__close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 8px;
          color: var(--ink-soft);
          padding: 6px;
          cursor: pointer;
        }
        .admin-modal__close:hover {
          background: var(--line);
          color: var(--ink);
        }

        .admin-modal__header {
          margin-bottom: 20px;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--brass-soft);
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .admin-title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .admin-subtitle {
          margin: 0;
          font-size: 0.84rem;
          color: var(--ink-soft);
        }

        .live-preview-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f1f8f4;
          border: 1px solid #cce8d8;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 18px;
          color: var(--emerald);
        }
        .preview-stat {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 0.8rem;
          color: var(--ink);
        }
        .preview-green {
          color: var(--emerald);
        }

        .admin-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fdf2ef;
          border: 1px solid var(--rust);
          color: var(--rust);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          margin-bottom: 16px;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: flex;
          gap: 14px;
        }
        .form-row--2 > * {
          flex: 1;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink);
        }
        .form-field input,
        .form-field select {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid var(--line-strong);
          background: #ffffff;
          font-family: inherit;
          font-size: 0.88rem;
          color: var(--ink);
          outline: none;
        }
        .form-field input:focus,
        .form-field select:focus {
          border-color: var(--navy);
          box-shadow: 0 0 0 2px rgba(18, 60, 51, 0.1);
        }
        .field-hint {
          font-size: 0.74rem;
          color: var(--ink-faint);
          margin-top: 2px;
        }

        .branded-section {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px;
        }
        .branded-section__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .branded-title {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .branded-desc {
          margin: 2px 0 0;
          font-size: 0.74rem;
          color: var(--ink-soft);
        }
        .add-brand-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          border: 1px solid var(--line-strong);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
        }
        .add-brand-btn:hover {
          background: var(--brass-soft);
        }

        .branded-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .brand-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .brand-col.flex-2 {
          flex: 2;
        }
        .brand-col.flex-1 {
          flex: 1;
        }
        .brand-col input {
          width: 100%;
          padding: 8px 10px;
          font-size: 0.84rem;
          border-radius: 6px;
          border: 1px solid var(--line-strong);
          outline: none;
        }
        .brand-col input:focus {
          border-color: var(--navy);
        }
        .brand-del-btn {
          background: none;
          border: none;
          color: var(--ink-faint);
          cursor: pointer;
          padding: 6px;
        }
        .brand-del-btn:hover {
          color: var(--rust);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }
        .btn-cancel {
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
        }
        .btn-cancel:hover {
          background: var(--line);
        }
        .btn-save {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 22px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 120ms ease;
        }
        .btn-save:hover:not(:disabled) {
          background: var(--navy-deep);
        }
        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `})]})}const Nm=[{name:"Delhi",state:"Delhi",lat:28.6139,lng:77.209},{name:"Bengaluru",state:"Karnataka",lat:12.9716,lng:77.5946},{name:"Mumbai",state:"Maharashtra",lat:19.076,lng:72.8777},{name:"Thiruvananthapuram",state:"Kerala",lat:8.5241,lng:76.9366},{name:"Hyderabad",state:"Telangana",lat:17.385,lng:78.4867},{name:"Kolkata",state:"West Bengal",lat:22.5726,lng:88.3639},{name:"Chennai",state:"Tamil Nadu",lat:13.0827,lng:80.2707}];function Cm({open:e,store:t,onClose:n,onSuccess:r}){const{token:a,showToast:l}=jt(),o=!!(t&&t._id),[s,c]=k.useState(""),[d,g]=k.useState(""),[h,m]=k.useState(""),[x,y]=k.useState(""),[w,O]=k.useState(""),[f,u]=k.useState(""),[p,v]=k.useState(""),[S,C]=k.useState(""),[N,E]=k.useState(!1),[I,M]=k.useState(null);if(k.useEffect(()=>{var A,ee,L,P;t?(c(t.name||""),g(t.address||""),m(t.city||""),y(t.state||""),O(t.pincode||""),u(t.phone||""),v(((ee=(A=t.location)==null?void 0:A.lat)==null?void 0:ee.toString())||""),C(((P=(L=t.location)==null?void 0:L.lng)==null?void 0:P.toString())||"")):(c(""),g(""),m("Bengaluru"),y("Karnataka"),O(""),u(""),v("12.9716"),C("77.5946")),M(null)},[t,e]),!e)return null;const $=A=>{m(A.name),y(A.state),v(A.lat.toString()),C(A.lng.toString())},X=()=>{if(!navigator.geolocation){M("Geolocation is not supported by your browser");return}navigator.geolocation.getCurrentPosition(A=>{v(A.coords.latitude.toFixed(4)),C(A.coords.longitude.toFixed(4)),l("Fetched your device coordinates","info")},()=>{M("Location permission denied or timed out")})},oe=async A=>{A.preventDefault(),M(null),E(!0);try{const ee=parseFloat(p),L=parseFloat(S);if(isNaN(ee)||ee<-90||ee>90)throw new Error("Latitude must be a valid number between -90 and 90");if(isNaN(L)||L<-180||L>180)throw new Error("Longitude must be a valid number between -180 and 180");const P={name:s.trim(),address:d.trim(),city:h.trim(),state:x.trim(),pincode:w.trim(),phone:f.trim(),location:{lat:ee,lng:L}};o?(await um(t._id,P,a),l(`Successfully updated "${P.name}"`,"success")):(await cm(P,a),l(`Successfully registered "${P.name}"`,"success")),r&&r(),n()}catch(ee){M(ee.message||"Failed to save store location")}finally{E(!1)}};return i.jsxs("div",{className:"admin-overlay",onClick:n,children:[i.jsxs("div",{className:"admin-modal",onClick:A=>A.stopPropagation(),role:"dialog",children:[i.jsx("button",{className:"admin-modal__close",onClick:n,"aria-label":"Close",children:i.jsx(bt,{size:18})}),i.jsxs("div",{className:"admin-modal__header",children:[i.jsxs("div",{className:"admin-badge",children:[i.jsx(da,{size:14}),i.jsx("span",{children:o?"Edit Kendra Store":"Register Jan Aushadhi Kendra"})]}),i.jsx("h2",{className:"admin-title",children:o?`Update ${t.name}`:"New Jan Aushadhi Kendra"}),i.jsx("p",{className:"admin-subtitle",children:"Stores appear in the nearby pharmacy locator for patients seeking low-cost generic drugs."})]}),I&&i.jsxs("div",{className:"admin-error",children:[i.jsx(Lr,{size:16}),i.jsx("span",{children:I})]}),i.jsxs("div",{className:"presets-wrap",children:[i.jsx("span",{className:"presets-lbl",children:"Quick Presets:"}),i.jsxs("div",{className:"presets-btns",children:[Nm.map(A=>i.jsx("button",{type:"button",className:"preset-chip",onClick:()=>$(A),children:A.name},A.name)),i.jsxs("button",{type:"button",className:"preset-chip preset-chip--gps",onClick:X,children:[i.jsx(If,{size:12})," My GPS"]})]})]}),i.jsxs("form",{onSubmit:oe,className:"admin-form",children:[i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Kendra Store Name *"}),i.jsx("input",{type:"text",placeholder:"e.g. PMBJP Kendra - Government General Hospital",value:s,onChange:A=>c(A.target.value),required:!0})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Full Physical Address *"}),i.jsx("input",{type:"text",placeholder:"e.g. Shop 12, Ground Floor, Civic Centre",value:d,onChange:A=>g(A.target.value),required:!0})]}),i.jsxs("div",{className:"form-row form-row--2",children:[i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"City *"}),i.jsx("input",{type:"text",placeholder:"e.g. Bengaluru",value:h,onChange:A=>m(A.target.value),required:!0})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"State *"}),i.jsx("select",{value:x,onChange:A=>y(A.target.value),className:"select-input",required:!0,children:jo.map(A=>i.jsx("option",{value:A,children:A},A))})]})]}),i.jsxs("div",{className:"form-row form-row--2",children:[i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Pincode"}),i.jsx("input",{type:"text",placeholder:"e.g. 560001",value:w,onChange:A=>O(A.target.value)})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Contact Phone"}),i.jsx("input",{type:"text",placeholder:"e.g. 080-22998877",value:f,onChange:A=>u(A.target.value)})]})]}),i.jsxs("div",{className:"form-row form-row--2",children:[i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Geographic Latitude (-90 to 90) *"}),i.jsx("input",{type:"number",step:"0.0001",placeholder:"e.g. 12.9716",value:p,onChange:A=>v(A.target.value),required:!0})]}),i.jsxs("div",{className:"form-field",children:[i.jsx("label",{children:"Geographic Longitude (-180 to 180) *"}),i.jsx("input",{type:"number",step:"0.0001",placeholder:"e.g. 77.5946",value:S,onChange:A=>C(A.target.value),required:!0})]})]}),i.jsxs("div",{className:"modal-actions",children:[i.jsx("button",{type:"button",className:"btn-cancel",onClick:n,disabled:N,children:"Cancel"}),i.jsx("button",{type:"submit",className:"btn-save",disabled:N,children:N?"Saving Kendra...":o?"Save Changes":"Register Kendra"})]})]})]}),i.jsx("style",{children:`
        .presets-wrap {
          background: var(--bg-subtle);
          border: 1px dashed var(--line-strong);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }
        .presets-lbl {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--ink-faint);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .presets-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .preset-chip {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 0.74rem;
          color: var(--ink-soft);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .preset-chip:hover {
          border-color: var(--navy);
          color: var(--navy);
        }
        .preset-chip--gps {
          color: var(--emerald);
          border-color: var(--emerald);
          font-weight: 600;
        }
      `})]})}function zm({onBackToUserView:e}){const{user:t,token:n,showToast:r}=jt(),[a,l]=k.useState("overview"),[o,s]=k.useState([]),[c,d]=k.useState([]),[g,h]=k.useState(!0),[m,x]=k.useState(""),[y,w]=k.useState("All"),[O,f]=k.useState(""),[u,p]=k.useState(!1),[v,S]=k.useState(null),[C,N]=k.useState(!1),[E,I]=k.useState(null),[M,$]=k.useState(null),[X,oe]=k.useState(!1),A=async()=>{h(!0);try{const[z,H]=await Promise.all([nd(),sm()]);s(z),d(H)}catch(z){r(z.message||"Failed to load management data","error")}finally{h(!1)}};k.useEffect(()=>{A()},[]);const ee=o.reduce((z,H)=>{var G;return z+(((G=H.brandedEquivalents)==null?void 0:G.length)||0)},0),L=o.filter(z=>z.cheapestBrandedMrp&&z.cheapestBrandedMrp>z.genericMrp).map(z=>Math.round((z.cheapestBrandedMrp-z.genericMrp)/z.cheapestBrandedMrp*100)),P=L.length?Math.round(L.reduce((z,H)=>z+H,0)/L.length):0,b=o.reduce((z,H)=>{const G=H.category||"General";return z[G]=(z[G]||0)+1,z},{}),R=["All",...Object.keys(b)],_=o.filter(z=>{var Oe,Ye,it,Vt;const H=y==="All"||z.category===y,G=m.toLowerCase(),Re=!G||((Oe=z.genericName)==null?void 0:Oe.toLowerCase().includes(G))||((Ye=z.drugCode)==null?void 0:Ye.toLowerCase().includes(G))||((it=z.composition)==null?void 0:it.toLowerCase().includes(G))||((Vt=z.brandedEquivalents)==null?void 0:Vt.some(ti=>{var $n;return($n=ti.brandName)==null?void 0:$n.toLowerCase().includes(G)}));return H&&Re}),D=c.filter(z=>{var G,Re,Oe,Ye;const H=O.toLowerCase();return!H||((G=z.name)==null?void 0:G.toLowerCase().includes(H))||((Re=z.city)==null?void 0:Re.toLowerCase().includes(H))||((Oe=z.state)==null?void 0:Oe.toLowerCase().includes(H))||((Ye=z.address)==null?void 0:Ye.toLowerCase().includes(H))}),B=()=>{S(null),p(!0)},Ae=z=>{S(z),p(!0)},se=()=>{I(null),N(!0)},ce=z=>{I(z),N(!0)},fe=async()=>{if(M){oe(!0);try{M.type==="medicine"?(await om(M.item._id,n),r(`Deleted formulation "${M.item.genericName}"`,"success")):(await dm(M.item._id,n),r(`Deleted store "${M.item.name}"`,"success")),$(null),await A()}catch(z){r(z.message||"Failed to delete item","error")}finally{oe(!1)}}};return i.jsxs("div",{className:"admin-portal",children:[i.jsx("header",{className:"portal-header",children:i.jsxs("div",{className:"portal-header__inner",children:[i.jsxs("div",{className:"portal-header__left",children:[i.jsxs("button",{type:"button",className:"back-btn",onClick:e,title:"Return to patient search",children:[i.jsx(Of,{size:16}),i.jsx("span",{children:"Back to App"})]}),i.jsxs("div",{className:"portal-title-wrap",children:[i.jsxs("div",{className:"admin-badge-strip",children:[i.jsx(Tr,{size:14}),i.jsx("span",{children:"Admin Authority Console"})]}),i.jsx("h1",{className:"portal-title",children:"Platform & PMBJP Catalog Control"})]})]}),i.jsxs("div",{className:"portal-header__actions",children:[i.jsxs("button",{type:"button",className:"portal-act-btn portal-act-btn--med",onClick:B,children:[i.jsx(Zn,{size:16}),i.jsx("span",{children:"Add Formulation"})]}),i.jsxs("button",{type:"button",className:"portal-act-btn portal-act-btn--store",onClick:se,children:[i.jsx(Zn,{size:16}),i.jsx("span",{children:"Add Kendra"})]})]})]})}),i.jsx("div",{className:"portal-nav-tabs",children:i.jsxs("div",{className:"portal-nav-tabs__inner",children:[i.jsxs("button",{type:"button",className:`tab-btn ${a==="overview"?"is-active":""}`,onClick:()=>l("overview"),children:[i.jsx(Ff,{size:16}),i.jsx("span",{children:"Overview & Analytics"})]}),i.jsxs("button",{type:"button",className:`tab-btn ${a==="medicines"?"is-active":""}`,onClick:()=>l("medicines"),children:[i.jsx(Nr,{size:16}),i.jsxs("span",{children:["Medicines Catalog (",o.length,")"]})]}),i.jsxs("button",{type:"button",className:`tab-btn ${a==="stores"?"is-active":""}`,onClick:()=>l("stores"),children:[i.jsx(da,{size:16}),i.jsxs("span",{children:["Jan Aushadhi Kendras (",c.length,")"]})]})]})}),i.jsxs("main",{className:"portal-main",children:[a==="overview"&&i.jsxs("div",{className:"overview-section",children:[i.jsxs("div",{className:"kpi-grid",children:[i.jsxs("div",{className:"kpi-card",children:[i.jsx("div",{className:"kpi-card__icon kpi-card__icon--blue",children:i.jsx(Nr,{size:20})}),i.jsxs("div",{className:"kpi-card__data",children:[i.jsx("span",{className:"kpi-label",children:"Formulations Indexed"}),i.jsx("span",{className:"kpi-val",children:o.length}),i.jsx("span",{className:"kpi-sub",children:"Standard Jan Aushadhi generic products"})]})]}),i.jsxs("div",{className:"kpi-card",children:[i.jsx("div",{className:"kpi-card__icon kpi-card__icon--emerald",children:i.jsx(td,{size:20})}),i.jsxs("div",{className:"kpi-card__data",children:[i.jsx("span",{className:"kpi-label",children:"Average Catalog Savings"}),i.jsxs("span",{className:"kpi-val",children:[P,"%"]}),i.jsx("span",{className:"kpi-sub",children:"Direct patient discount vs retail brands"})]})]}),i.jsxs("div",{className:"kpi-card",children:[i.jsx("div",{className:"kpi-card__icon kpi-card__icon--amber",children:i.jsx(da,{size:20})}),i.jsxs("div",{className:"kpi-card__data",children:[i.jsx("span",{className:"kpi-label",children:"Active Kendra Stores"}),i.jsx("span",{className:"kpi-val",children:c.length}),i.jsx("span",{className:"kpi-sub",children:"Across major Indian metropolitan centers"})]})]}),i.jsxs("div",{className:"kpi-card",children:[i.jsx("div",{className:"kpi-card__icon kpi-card__icon--purple",children:i.jsx(Uf,{size:20})}),i.jsxs("div",{className:"kpi-card__data",children:[i.jsx("span",{className:"kpi-label",children:"Branded Competitors Tracked"}),i.jsx("span",{className:"kpi-val",children:ee}),i.jsx("span",{className:"kpi-sub",children:"Prescription equivalents monitored"})]})]})]}),i.jsxs("div",{className:"overview-split",children:[i.jsxs("div",{className:"overview-panel",children:[i.jsxs("div",{className:"panel-header",children:[i.jsx("h3",{className:"panel-title",children:"Therapeutic Categories Breakdown"}),i.jsxs("span",{className:"panel-badge",children:[Object.keys(b).length," Classes"]})]}),i.jsx("div",{className:"category-bars",children:Object.entries(b).map(([z,H])=>{const G=Math.round(H/(o.length||1)*100);return i.jsxs("div",{className:"category-bar-row",children:[i.jsxs("div",{className:"bar-labels",children:[i.jsx("span",{className:"cat-name",children:z}),i.jsxs("span",{className:"cat-count",children:[H," formulation",H>1?"s":""," (",G,"%)"]})]}),i.jsx("div",{className:"bar-track",children:i.jsx("div",{className:"bar-fill",style:{width:`${G}%`}})})]},z)})})]}),i.jsxs("div",{className:"overview-panel",children:[i.jsxs("div",{className:"panel-header",children:[i.jsx("h3",{className:"panel-title",children:"Standards & Regulatory Conformance"}),i.jsx("span",{className:"panel-badge panel-badge--green",children:"SDG 3 Compliant"})]}),i.jsxs("div",{className:"regulatory-items",children:[i.jsxs("div",{className:"reg-item",children:[i.jsx(bn,{size:18,className:"reg-icon"}),i.jsxs("div",{children:[i.jsx("strong",{children:"WHO-GMP Certified Facilities"}),i.jsx("p",{children:"All catalog formulations adhere to WHO Good Manufacturing Practices."})]})]}),i.jsxs("div",{className:"reg-item",children:[i.jsx(bn,{size:18,className:"reg-icon"}),i.jsxs("div",{children:[i.jsx("strong",{children:"NABL Batch Accreditation"}),i.jsx("p",{children:"Every generic lot tested by independent accredited testing laboratories."})]})]}),i.jsxs("div",{className:"reg-item",children:[i.jsx(bn,{size:18,className:"reg-icon"}),i.jsxs("div",{children:[i.jsx("strong",{children:"Offline Haversine Distance Engine"}),i.jsx("p",{children:"GPS calculations run completely client-side without paid third-party dependencies."})]})]}),i.jsxs("div",{className:"reg-item",children:[i.jsx(bn,{size:18,className:"reg-icon"}),i.jsxs("div",{children:[i.jsx("strong",{children:"Full REST CRUD & JWT Auth Enabled"}),i.jsx("p",{children:"Authenticated role-based access for catalog modifications."})]})]})]})]})]})]}),a==="medicines"&&i.jsxs("div",{className:"crud-section",children:[i.jsxs("div",{className:"crud-toolbar",children:[i.jsxs("div",{className:"search-input-wrap",children:[i.jsx(Oa,{size:16}),i.jsx("input",{type:"text",placeholder:"Filter by drug code, generic name, brand, or composition...",value:m,onChange:z=>x(z.target.value)})]}),i.jsxs("div",{className:"filter-select-wrap",children:[i.jsx("label",{children:"Category:"}),i.jsx("select",{value:y,onChange:z=>w(z.target.value),children:R.map(z=>i.jsx("option",{value:z,children:z},z))})]}),i.jsxs("button",{type:"button",className:"add-table-btn",onClick:B,children:[i.jsx(Zn,{size:16})," Add Formulation"]})]}),i.jsx("div",{className:"table-responsive",children:i.jsxs("table",{className:"crud-table",children:[i.jsx("thead",{children:i.jsxs("tr",{children:[i.jsx("th",{children:"Drug Code"}),i.jsx("th",{children:"Generic Name & Composition"}),i.jsx("th",{children:"Category"}),i.jsx("th",{children:"Pack Size"}),i.jsx("th",{children:"Generic MRP"}),i.jsx("th",{children:"Branded MRP"}),i.jsx("th",{children:"Savings %"}),i.jsx("th",{children:"Actions"})]})}),i.jsx("tbody",{children:_.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:"8",className:"empty-table-cell",children:"No medicine formulations matched your filters."})}):_.map(z=>{var Oe;const H=z.cheapestBrandedMrp,G=H?H-z.genericMrp:0,Re=H?Math.round(G/H*100):0;return i.jsxs("tr",{children:[i.jsx("td",{children:i.jsx("span",{className:"code-badge",children:z.drugCode})}),i.jsxs("td",{children:[i.jsx("strong",{className:"table-med-name",children:z.genericName}),i.jsx("span",{className:"table-med-sub",children:z.composition})]}),i.jsx("td",{children:i.jsx("span",{className:"category-pill",children:z.category||"General"})}),i.jsx("td",{children:z.packSize}),i.jsx("td",{children:i.jsxs("span",{className:"table-price-gen",children:["₹",(Oe=z.genericMrp)==null?void 0:Oe.toFixed(2)]})}),i.jsx("td",{children:i.jsxs("span",{className:"table-price-br",children:["₹",H?H.toFixed(2):"—"]})}),i.jsx("td",{children:Re>0?i.jsxs("span",{className:"table-savings-badge",children:["Save ",Re,"%"]}):i.jsx("span",{className:"table-savings-zero",children:"—"})}),i.jsx("td",{children:i.jsxs("div",{className:"table-actions",children:[i.jsx("button",{type:"button",className:"action-btn action-btn--edit",onClick:()=>Ae(z),title:"Edit formulation",children:i.jsx(As,{size:15})}),i.jsx("button",{type:"button",className:"action-btn action-btn--delete",onClick:()=>$({type:"medicine",item:z}),title:"Delete formulation",children:i.jsx(Fa,{size:15})})]})})]},z._id)})})]})})]}),a==="stores"&&i.jsxs("div",{className:"crud-section",children:[i.jsxs("div",{className:"crud-toolbar",children:[i.jsxs("div",{className:"search-input-wrap",children:[i.jsx(Oa,{size:16}),i.jsx("input",{type:"text",placeholder:"Filter by Kendra name, city, state, or address...",value:O,onChange:z=>f(z.target.value)})]}),i.jsxs("button",{type:"button",className:"add-table-btn",onClick:se,children:[i.jsx(Zn,{size:16})," Register Kendra"]})]}),i.jsx("div",{className:"table-responsive",children:i.jsxs("table",{className:"crud-table",children:[i.jsx("thead",{children:i.jsxs("tr",{children:[i.jsx("th",{children:"Kendra Store Name"}),i.jsx("th",{children:"Address"}),i.jsx("th",{children:"City & State"}),i.jsx("th",{children:"Pincode"}),i.jsx("th",{children:"Contact Phone"}),i.jsx("th",{children:"Coordinates"}),i.jsx("th",{children:"Actions"})]})}),i.jsx("tbody",{children:D.length===0?i.jsx("tr",{children:i.jsx("td",{colSpan:"7",className:"empty-table-cell",children:"No Jan Aushadhi Kendras found matching your search."})}):D.map(z=>{var H,G,Re,Oe,Ye,it;return i.jsxs("tr",{children:[i.jsx("td",{children:i.jsxs("div",{className:"store-name-cell",children:[i.jsx(da,{size:15,className:"store-icon"}),i.jsx("strong",{children:z.name})]})}),i.jsx("td",{children:i.jsx("span",{className:"table-address",children:z.address})}),i.jsxs("td",{children:[z.city,", ",z.state]}),i.jsx("td",{children:i.jsx("span",{className:"code-badge",children:z.pincode||"—"})}),i.jsx("td",{children:z.phone||"—"}),i.jsx("td",{children:i.jsxs("a",{href:`https://www.google.com/maps/search/?api=1&query=${(H=z.location)==null?void 0:H.lat},${(G=z.location)==null?void 0:G.lng}`,target:"_blank",rel:"noopener noreferrer",className:"coords-link",title:"Open in Google Maps",children:[i.jsxs("span",{children:[(Oe=(Re=z.location)==null?void 0:Re.lat)==null?void 0:Oe.toFixed(4),", ",(it=(Ye=z.location)==null?void 0:Ye.lng)==null?void 0:it.toFixed(4)]}),i.jsx(wo,{size:12})]})}),i.jsx("td",{children:i.jsxs("div",{className:"table-actions",children:[i.jsx("button",{type:"button",className:"action-btn action-btn--edit",onClick:()=>ce(z),title:"Edit Kendra",children:i.jsx(As,{size:15})}),i.jsx("button",{type:"button",className:"action-btn action-btn--delete",onClick:()=>$({type:"store",item:z}),title:"Delete Kendra",children:i.jsx(Fa,{size:15})})]})})]},z._id)})})]})})]})]}),i.jsx(Sm,{open:u,medicine:v,onClose:()=>p(!1),onSuccess:A}),i.jsx(Cm,{open:C,store:E,onClose:()=>N(!1),onSuccess:A}),M&&i.jsx("div",{className:"admin-overlay",onClick:()=>$(null),children:i.jsxs("div",{className:"delete-modal",onClick:z=>z.stopPropagation(),role:"alertdialog",children:[i.jsx("div",{className:"delete-icon",children:i.jsx(Lr,{size:28})}),i.jsx("h3",{className:"delete-title",children:"Confirm Deletion"}),i.jsxs("p",{className:"delete-msg",children:["Are you sure you want to permanently delete"," ",i.jsx("strong",{children:M.type==="medicine"?M.item.genericName:M.item.name}),"? This action cannot be undone."]}),i.jsxs("div",{className:"delete-actions",children:[i.jsx("button",{type:"button",className:"btn-cancel",onClick:()=>$(null),disabled:X,children:"Cancel"}),i.jsx("button",{type:"button",className:"btn-delete",onClick:fe,disabled:X,children:X?"Deleting...":"Permanently Delete"})]})]})}),i.jsx("style",{children:`
        .admin-portal {
          min-height: 100vh;
          background: #f8faf8;
          display: flex;
          flex-direction: column;
        }

        .portal-header {
          background: #ffffff;
          border-bottom: 1px solid var(--line);
          padding: 20px 24px;
        }
        .portal-header__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .portal-header__left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy-deep);
          cursor: pointer;
          transition: all 140ms ease;
        }
        .back-btn:hover {
          background: var(--line);
        }

        .admin-badge-strip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--brass-soft);
          color: var(--navy);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          margin-bottom: 4px;
        }
        .portal-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--navy-deep);
        }

        .portal-header__actions {
          display: flex;
          gap: 10px;
        }
        .portal-act-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 8px;
          padding: 9px 15px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 140ms ease;
        }
        .portal-act-btn--med {
          background: var(--navy);
          color: #ffffff;
        }
        .portal-act-btn--med:hover {
          background: var(--navy-deep);
        }
        .portal-act-btn--store {
          background: #ffffff;
          border: 1px solid var(--line-strong);
          color: var(--navy-deep);
        }
        .portal-act-btn--store:hover {
          background: var(--bg-subtle);
        }

        .portal-nav-tabs {
          background: #ffffff;
          border-bottom: 1px solid var(--line);
        }
        .portal-nav-tabs__inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 4px;
          padding: 0 24px;
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 18px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 140ms ease;
        }
        .tab-btn:hover {
          color: var(--navy);
        }
        .tab-btn.is-active {
          color: var(--navy);
          font-weight: 600;
          border-bottom-color: var(--navy);
        }

        .portal-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 60px;
          width: 100%;
          flex: 1;
        }

        /* KPI Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .kpi-card {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          box-shadow: var(--shadow-sm);
        }
        .kpi-card__icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-card__icon--blue {
          background: #eaf1fb;
          color: #1a56db;
        }
        .kpi-card__icon--emerald {
          background: var(--emerald-bg);
          color: var(--emerald);
        }
        .kpi-card__icon--amber {
          background: #fdf5e8;
          color: #b45309;
        }
        .kpi-card__icon--purple {
          background: #f3e8ff;
          color: #7e22ce;
        }
        .kpi-card__data {
          display: flex;
          flex-direction: column;
        }
        .kpi-label {
          font-size: 0.78rem;
          color: var(--ink-soft);
          margin-bottom: 2px;
        }
        .kpi-val {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--navy-deep);
          line-height: 1.1;
        }
        .kpi-sub {
          font-size: 0.72rem;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        .overview-split {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 20px;
        }
        .overview-panel {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--line);
        }
        .panel-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .panel-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          background: var(--bg-subtle);
          color: var(--ink-soft);
          padding: 3px 8px;
          border-radius: 999px;
        }
        .panel-badge--green {
          background: var(--emerald-bg);
          color: var(--emerald);
          font-weight: 600;
        }

        .category-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 4px;
        }
        .cat-name {
          font-weight: 600;
          color: var(--navy-deep);
        }
        .cat-count {
          color: var(--ink-soft);
          font-family: var(--font-mono);
          font-size: 0.74rem;
        }
        .bar-track {
          height: 7px;
          background: var(--bg-subtle);
          border-radius: 999px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: var(--navy);
          border-radius: 999px;
          transition: width 400ms ease-out;
        }

        .regulatory-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .reg-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .reg-icon {
          color: var(--emerald);
          background: var(--emerald-bg);
          border-radius: 50%;
          padding: 2px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .reg-item strong {
          display: block;
          font-size: 0.84rem;
          color: var(--navy-deep);
          margin-bottom: 2px;
        }
        .reg-item p {
          margin: 0;
          font-size: 0.78rem;
          color: var(--ink-soft);
          line-height: 1.45;
        }

        /* CRUD Tables & Toolbar */
        .crud-section {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        .crud-toolbar {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .search-input-wrap {
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-subtle);
          border: 1px solid var(--line-strong);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--ink-faint);
        }
        .search-input-wrap input {
          border: none;
          background: transparent;
          width: 100%;
          font-size: 0.88rem;
          color: var(--ink);
          outline: none;
        }

        .filter-select-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--ink-soft);
        }
        .filter-select-wrap select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--line-strong);
          background: #ffffff;
          font-size: 0.84rem;
          color: var(--ink);
          outline: none;
        }

        .add-table-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 9px 16px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
        }
        .add-table-btn:hover {
          background: var(--navy-deep);
        }

        .table-responsive {
          overflow-x: auto;
        }
        .crud-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
          text-align: left;
        }
        .crud-table th {
          background: var(--bg-subtle);
          padding: 12px 14px;
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--ink-soft);
          border-bottom: 1px solid var(--line-strong);
          font-family: var(--font-mono);
        }
        .crud-table td {
          padding: 14px;
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }
        .crud-table tr:hover td {
          background: #fbfdfc;
        }

        .code-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: var(--brass-soft);
          color: var(--navy);
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 4px;
        }
        .table-med-name {
          display: block;
          color: var(--navy-deep);
          font-size: 0.9rem;
        }
        .table-med-sub {
          display: block;
          font-size: 0.74rem;
          color: var(--ink-soft);
          margin-top: 2px;
        }
        .category-pill {
          font-size: 0.74rem;
          background: var(--bg-subtle);
          color: var(--ink);
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid var(--line);
        }
        .table-price-gen {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--emerald);
        }
        .table-price-br {
          font-family: var(--font-mono);
          color: var(--rust);
          text-decoration: line-through;
        }
        .table-savings-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          background: var(--emerald-bg);
          color: var(--emerald);
          padding: 3px 8px;
          border-radius: 999px;
        }
        .table-savings-zero {
          color: var(--ink-faint);
        }

        .store-name-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--navy-deep);
        }
        .store-icon {
          color: var(--brass);
          flex-shrink: 0;
        }
        .table-address {
          font-size: 0.8rem;
          color: var(--ink-soft);
          max-width: 280px;
          display: block;
        }
        .coords-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--navy);
          text-decoration: none;
        }
        .coords-link:hover {
          text-decoration: underline;
        }

        .table-actions {
          display: flex;
          gap: 6px;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--line);
          background: var(--bg-subtle);
          color: var(--ink-soft);
          cursor: pointer;
          transition: all 120ms ease;
        }
        .action-btn--edit:hover {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
        }
        .action-btn--delete:hover {
          background: #fdeee9;
          border-color: var(--rust);
          color: var(--rust);
        }

        .empty-table-cell {
          text-align: center;
          padding: 40px;
          color: var(--ink-soft);
          font-style: italic;
        }

        /* Delete Modal */
        .delete-modal {
          background: #ffffff;
          border-radius: 12px;
          padding: 28px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(10, 38, 33, 0.25);
        }
        .delete-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #fdf2ef;
          color: var(--rust);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .delete-title {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--navy-deep);
        }
        .delete-msg {
          margin: 0 0 24px;
          font-size: 0.88rem;
          color: var(--ink-soft);
          line-height: 1.5;
        }
        .delete-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .btn-delete {
          background: var(--rust);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-delete:hover:not(:disabled) {
          background: #8e351d;
        }
        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `})]})}function Em(){const{user:e,userState:t,setUserState:n,toast:r,clearToast:a,isAdmin:l,isAuthenticated:o}=jt(),[s,c]=k.useState("app"),[d,g]=k.useState([]),[h,m]=k.useState([]),[x,y]=k.useState(""),[w,O]=k.useState(!1),[f,u]=k.useState(!1),[p,v]=k.useState(null),[S,C]=k.useState(null),[N,E]=k.useState("All"),[I,M]=k.useState("savings-desc"),[$,X]=k.useState(null),[oe,A]=k.useState(!1),[ee,L]=k.useState([]),[P,b]=k.useState(!1),[R,_]=k.useState([]),[D,B]=k.useState(null),[Ae,se]=k.useState(!1),[ce,fe]=k.useState(!1),[z,H]=k.useState(null);k.useEffect(()=>{s==="admin"&&!l&&c("app")},[l,s]);const G=async(F,V)=>{try{const ue=F||t||"Kerala",Ht=await Ei((V==null?void 0:V.lat)??null,(V==null?void 0:V.lng)??null,ue,100);return L(Ht),_(Ht),Ht}catch(ue){return console.warn("Failed to load stores for state:",ue),[]}},Re=()=>{if(!navigator.geolocation){G(t,null);return}se(!0),navigator.geolocation.getCurrentPosition(F=>{const V={lat:F.coords.latitude,lng:F.coords.longitude};X(V),A(!0),se(!1),G(t,V)},F=>{console.warn("GPS access denied or timed out:",F.message),se(!1),G(t,null)},{timeout:7e3})},Oe=async()=>{u(!0);try{const F=t||"Kerala",[V,ue,Ht]=await Promise.all([nd(),Ei(null,null,F,100),Ei(null,null,null,500)]);g(V),m(V),L(ue),_(ue);const In=V.filter(Fe=>Fe.cheapestBrandedMrp&&Fe.cheapestBrandedMrp>Fe.genericMrp).map(Fe=>Math.round((Fe.cheapestBrandedMrp-Fe.genericMrp)/Fe.cheapestBrandedMrp*100)),ni=In.length?Math.round(In.reduce((Fe,Ar)=>Fe+Ar,0)/In.length):0;C({medicineCount:V.length,avgSavingsPct:ni,storeCount:Ht.length}),navigator.geolocation&&navigator.geolocation.getCurrentPosition(Fe=>{const Ar={lat:Fe.coords.latitude,lng:Fe.coords.longitude};X(Ar),A(!0),G(F,Ar)},()=>{},{timeout:6e3})}catch(F){v(F.message||"Failed to connect to RxCompare API")}finally{u(!1)}};k.useEffect(()=>{Oe()},[]),k.useEffect(()=>{t&&G(t,$)},[t]);async function Ye(F){if(y(F),v(null),!F||!F.trim()){O(!1),m(d);return}u(!0),O(!0);try{const V=await am(F.trim());m(V)}catch(V){v(V.message),m([])}finally{u(!1)}}const it=k.useMemo(()=>{let F=[...h];return N&&N!=="All"&&(F=F.filter(V=>(V.category||"").toLowerCase()===N.toLowerCase())),F.sort((V,ue)=>{if(I==="price-asc")return(V.genericMrp||0)-(ue.genericMrp||0);if(I==="name-asc")return(V.genericName||"").localeCompare(ue.genericName||"");const Ht=V.cheapestBrandedMrp?V.cheapestBrandedMrp-V.genericMrp:0,In=V.cheapestBrandedMrp?Ht/V.cheapestBrandedMrp:0,ni=ue.cheapestBrandedMrp?ue.cheapestBrandedMrp-ue.genericMrp:0;return(ue.cheapestBrandedMrp?ni/ue.cheapestBrandedMrp:0)-In}),F},[h,N,I]);function Vt(F){B(F||null),b(!0),$?G(t,$):Re()}function ti(F){n(F),G(F,$)}function $n(){y(""),E("All"),M("savings-desc"),O(!1),m(d)}return s==="admin"&&l?i.jsxs("div",{className:"app",children:[i.jsx(Fs,{activeView:s,onViewChange:c,onOpenCabinet:()=>fe(!0)}),i.jsx(zm,{onBackToUserView:()=>c("app")}),i.jsx(Ds,{toast:r,onClose:a}),i.jsx($s,{open:ce,onClose:()=>fe(!1),onLocateStores:Vt,onOpenCalculator:F=>H(F)})]}):i.jsxs("div",{className:"app",children:[i.jsx(Fs,{activeView:s,onViewChange:c,onOpenCabinet:()=>fe(!0)}),i.jsx(vm,{onSearch:Ye,loading:f,stats:S,searchQuery:x,selectedCategory:N,onSelectCategory:E,sortBy:I,onSortChange:M}),i.jsxs("main",{className:"app__main",children:[p&&i.jsxs("div",{className:"app__error-banner",role:"alert",children:[i.jsx("p",{children:p}),i.jsxs("button",{type:"button",onClick:()=>Ye(x),className:"retry-btn",children:[i.jsx(Rs,{size:14})," Retry"]})]}),i.jsxs("section",{className:"state-locator-strip","aria-label":"Jan Aushadhi Kendras in your state",children:[i.jsxs("div",{className:"state-locator-strip__header",children:[i.jsxs("div",{className:"state-locator-strip__info",children:[i.jsxs("span",{className:"state-badge-label",children:[i.jsx(Qe,{size:13,className:"pin-icon"}),o?`Your Registered State: ${(e==null?void 0:e.state)||t}`:`Jan Aushadhi Centres · ${t}`]}),i.jsxs("h2",{className:"state-banner-title",children:["Jan Aushadhi Kendras in ",t,i.jsxs("span",{className:"state-stores-pill",children:[ee.length," Stores"]})]}),i.jsx("p",{className:"state-banner-desc",children:oe?"Live distances computed from your current device GPS position.":`Displaying all certified Kendras within ${t}. Click Directions to navigate to the real store.`})]}),i.jsx("div",{className:"state-locator-strip__ctrls",children:i.jsxs("button",{type:"button",className:"btn-open-kendra-drawer",onClick:()=>{B(null),b(!0)},children:[i.jsx(Qe,{size:14}),i.jsxs("span",{children:["View All ",ee.length," Kendras in ",t]})]})})]}),ee.length>0&&i.jsx("div",{className:"state-stores-grid",children:ee.slice(0,3).map(F=>{var V,ue;return i.jsxs("div",{className:"kendra-card",children:[i.jsxs("div",{className:"kendra-card__top",children:[i.jsx("h4",{className:"kendra-card__name",children:F.name}),typeof F.distanceKm=="number"&&i.jsxs("span",{className:"kendra-card__distance",children:[F.distanceKm," km away"]})]}),i.jsxs("p",{className:"kendra-card__address",children:[F.address,", ",F.city," ",F.pincode?`- ${F.pincode}`:""]}),i.jsxs("div",{className:"kendra-card__actions",children:[i.jsxs("a",{href:`https://www.google.com/maps/dir/?api=1&destination=${(V=F.location)==null?void 0:V.lat},${(ue=F.location)==null?void 0:ue.lng}`,target:"_blank",rel:"noopener noreferrer",className:"kendra-action-btn directions",title:"Open turn-by-turn Google Maps navigation",children:[i.jsx(Sl,{size:12})," Directions ",i.jsx(wo,{size:10})]}),i.jsxs("a",{href:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${F.name}, ${F.address}, ${F.city}, ${F.state}`)}`,target:"_blank",rel:"noopener noreferrer",className:"kendra-action-btn map",title:"View store details on Google Maps",children:[i.jsx(Qe,{size:11})," View Map"]}),F.phone&&i.jsxs("a",{href:`tel:${F.phone}`,className:"kendra-action-btn phone",children:[i.jsx(ed,{size:11})," ",F.phone]})]})]},F._id||F.name)})})]}),i.jsxs("div",{className:"results-header-strip",children:[i.jsxs("div",{className:"results-count-group",children:[i.jsx("span",{className:"results-title",children:w?`Results for "${x}"`:N!=="All"?`${N} Formulations`:"Jan Aushadhi Generic Catalog"}),i.jsxs("span",{className:"results-badge",children:[it.length," formulation",it.length!==1?"s":""]})]}),(w||N!=="All")&&i.jsxs("button",{type:"button",className:"reset-filters-btn",onClick:$n,children:[i.jsx(Rs,{size:13})," View Full Catalog"]})]}),!f&&it.length===0&&!p&&i.jsxs("div",{className:"app__empty-card",children:[i.jsx("div",{className:"empty-pill-icon",children:i.jsx(Nr,{size:32})}),i.jsx("h3",{children:"No direct formulation matches found"}),i.jsxs("p",{children:[`We couldn't find a medicine matching "`,x,'". Try typing common brand names like ',i.jsx("strong",{children:"“Crocin”"}),", ",i.jsx("strong",{children:"“Storvas”"}),","," ",i.jsx("strong",{children:"“Glycomet”"}),", or ",i.jsx("strong",{children:"“Azithral”"}),"."]}),i.jsx("div",{className:"empty-actions",children:i.jsx("button",{type:"button",className:"btn-browse-all",onClick:$n,children:"Browse Full Catalog"})})]}),i.jsxs("div",{className:"app__results",children:[f&&Array.from({length:6}).map((F,V)=>i.jsx(ym,{},V)),!f&&it.map((F,V)=>i.jsx(xm,{medicine:F,onLocateStores:Vt,onOpenCalculator:ue=>H(ue),index:V},F._id))]}),i.jsxs("div",{className:"mission-banner",children:[i.jsx("div",{className:"mission-icon",children:i.jsx(Tr,{size:28})}),i.jsxs("div",{className:"mission-content",children:[i.jsx("h4",{children:"Aligned with United Nations Sustainable Development Goal 3"}),i.jsx("p",{children:"RxCompare bridges prescription brand costs with government Jan Aushadhi generic counterparts. Our goal is universal healthcare affordability — identical quality, verified compositions, and direct pharmacy location."})]})]})]}),i.jsx(km,{}),i.jsx(fm,{open:P,stores:R,medicineName:D==null?void 0:D.genericName,locating:Ae,currentState:t,onStateChange:ti,onRefreshLocation:Re,hasGps:oe,onClose:()=>b(!1)}),i.jsx($s,{open:ce,onClose:()=>fe(!1),onLocateStores:Vt,onOpenCalculator:F=>H(F)}),z&&i.jsx(jm,{medicine:z,onClose:()=>H(null),onLocateStores:Vt}),i.jsx(wm,{}),i.jsx(Ds,{toast:r,onClose:a}),i.jsx("style",{children:`
        .app__main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 60px;
          min-height: 40vh;
        }

        .app__error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fdf2ef;
          border: 1px solid var(--rust);
          color: var(--rust);
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 0.88rem;
          margin-bottom: 24px;
        }
        .app__error-banner p {
          margin: 0;
        }
        .retry-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid var(--rust);
          color: var(--rust);
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* State Locator Banner */
        .state-locator-strip {
          background: #ffffff;
          border: 1px solid var(--line);
          border-left: 4px solid var(--emerald);
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
        }
        .state-locator-strip__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .state-badge-label {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--emerald);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .state-banner-title {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 1.28rem;
          font-weight: 600;
          color: var(--navy-deep);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .state-stores-pill {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: var(--emerald-bg);
          color: var(--emerald);
          padding: 2px 8px;
          border-radius: 999px;
          font-weight: 700;
        }
        .state-banner-desc {
          margin: 0;
          font-size: 0.82rem;
          color: var(--ink-soft);
        }

        .btn-open-kendra-drawer {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--navy);
          color: #ffffff;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 120ms ease;
          white-space: nowrap;
        }
        .btn-open-kendra-drawer:hover {
          background: var(--navy-deep);
        }

        .state-stores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }
        .kendra-card {
          background: var(--bg-subtle);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: border-color 140ms ease, box-shadow 140ms ease;
        }
        .kendra-card:hover {
          border-color: var(--emerald);
          box-shadow: 0 4px 12px rgba(10, 38, 33, 0.08);
        }
        .kendra-card__top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }
        .kendra-card__name {
          margin: 0;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--navy-deep);
          line-height: 1.3;
        }
        .kendra-card__distance {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--emerald);
          background: #ffffff;
          border: 1px solid var(--emerald);
          padding: 1px 7px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .kendra-card__address {
          margin: 0 0 12px;
          font-size: 0.78rem;
          color: var(--ink-soft);
          line-height: 1.4;
          flex: 1;
        }
        .kendra-card__actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .kendra-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          padding: 4px 8px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 120ms ease;
        }
        .kendra-action-btn.directions {
          background: var(--navy);
          color: #ffffff;
        }
        .kendra-action-btn.directions:hover {
          background: var(--navy-deep);
        }
        .kendra-action-btn.map {
          background: #ffffff;
          border: 1px solid var(--line-strong);
          color: var(--navy);
        }
        .kendra-action-btn.map:hover {
          background: var(--line);
        }
        .kendra-action-btn.phone {
          background: #ffffff;
          border: 1px solid var(--line);
          color: var(--ink-soft);
        }

        .results-header-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .results-count-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .results-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .results-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          background: var(--bg-subtle);
          color: var(--ink-soft);
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid var(--line);
        }

        .reset-filters-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          transition: background 140ms ease;
        }
        .reset-filters-btn:hover {
          background: var(--bg-subtle);
        }

        .app__empty-card {
          text-align: center;
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 48px 24px;
          max-width: 520px;
          margin: 32px auto;
        }
        .empty-pill-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--bg-subtle);
          color: var(--ink-faint);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .app__empty-card h3 {
          margin: 0 0 8px;
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--navy-deep);
        }
        .app__empty-card p {
          margin: 0 0 20px;
          font-size: 0.88rem;
          color: var(--ink-soft);
          line-height: 1.5;
        }
        .btn-browse-all {
          background: var(--navy);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
        }

        .app__results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .mission-banner {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          background: linear-gradient(135deg, #f5f8f6 0%, #eaf4ee 100%);
          border: 1px solid #cce5d6;
          border-radius: 12px;
          padding: 24px 28px;
          margin-top: 20px;
        }
        .mission-icon {
          color: var(--emerald);
          flex-shrink: 0;
          margin-top: 4px;
        }
        .mission-content h4 {
          margin: 0 0 6px;
          font-family: var(--font-display);
          font-size: 1.12rem;
          font-weight: 600;
          color: var(--navy-deep);
        }
        .mission-content p {
          margin: 0;
          font-size: 0.84rem;
          color: var(--ink-soft);
          line-height: 1.6;
        }
      `})]})}Li.createRoot(document.getElementById("root")).render(i.jsx(kd.StrictMode,{children:i.jsx(pm,{children:i.jsx(Em,{})})}));
