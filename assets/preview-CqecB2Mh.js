import{ao as i,ai as p,ap as j}from"./chunk-NUUEMKO5-iAcXjgRO.js";import{g as T}from"./_commonjsHelpers-CqkleIqs.js";import"./iframe-DQx2lrVP.js";import"../sb-preview/runtime.js";import"./index-D-8MO0q_.js";import"./index-DPS9-N-h.js";import"./index-DrFu-skq.js";var b="DARK_MODE",y,E;function M(){return E||(E=1,y=function t(r,e){if(r===e)return!0;if(r&&e&&typeof r=="object"&&typeof e=="object"){if(r.constructor!==e.constructor)return!1;var a,n,o;if(Array.isArray(r)){if(a=r.length,a!=e.length)return!1;for(n=a;n--!==0;)if(!t(r[n],e[n]))return!1;return!0}if(r.constructor===RegExp)return r.source===e.source&&r.flags===e.flags;if(r.valueOf!==Object.prototype.valueOf)return r.valueOf()===e.valueOf();if(r.toString!==Object.prototype.toString)return r.toString()===e.toString();if(o=Object.keys(r),a=o.length,a!==Object.keys(e).length)return!1;for(n=a;n--!==0;)if(!Object.prototype.hasOwnProperty.call(e,o[n]))return!1;for(n=a;n--!==0;){var u=o[n];if(!t(r[u],e[u]))return!1}return!0}return r!==r&&e!==e}),y}var I=M();const w=T(I);function l(t){"@babel/helpers - typeof";return l=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},l(t)}var m;function P(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);r&&(a=a.filter(function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable})),e.push.apply(e,a)}return e}function k(t){for(var r=1;r<arguments.length;r++){var e=arguments[r]!=null?arguments[r]:{};r%2?P(Object(e),!0).forEach(function(a){R(t,a,e[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):P(Object(e)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(e,a))})}return t}function R(t,r,e){return r=q(r),r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function q(t){var r=x(t,"string");return l(r)==="symbol"?r:String(r)}function x(t,r){if(l(t)!=="object"||t===null)return t;var e=t[Symbol.toPrimitive];if(e!==void 0){var a=e.call(t,r||"default");if(l(a)!=="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(t)}function s(t){return L(t)||B(t)||N(t)||K()}function K(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function N(t,r){if(t){if(typeof t=="string")return g(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);if(e==="Object"&&t.constructor&&(e=t.constructor.name),e==="Map"||e==="Set")return Array.from(t);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return g(t,r)}}function B(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function L(t){if(Array.isArray(t))return g(t)}function g(t,r){(r==null||r>t.length)&&(r=t.length);for(var e=0,a=new Array(r);e<r;e++)a[e]=t[e];return a}const{global:U}=__STORYBOOK_MODULE_GLOBAL__;__STORYBOOK_MODULE_CORE_EVENTS__;var A=U,Y=A.document,c=A.window,C="sb-addon-themes-3";(m=c.matchMedia)===null||m===void 0||m.call(c,"(prefers-color-scheme: dark)");var d={classTarget:"body",dark:i.dark,darkClass:["dark"],light:i.light,lightClass:["light"],stylePreview:!1,userHasExplicitlySetTheTheme:!1},D=function(r){c.localStorage.setItem(C,JSON.stringify(r))},F=function(r,e){var a=e.current,n=e.darkClass,o=n===void 0?d.darkClass:n,u=e.lightClass,v=u===void 0?d.lightClass:u;if(a==="dark"){var O,h;(O=r.classList).remove.apply(O,s(f(v))),(h=r.classList).add.apply(h,s(f(o)))}else{var S,_;(S=r.classList).remove.apply(S,s(f(o))),(_=r.classList).add.apply(_,s(f(v)))}},f=function(r){var e=[];return e.concat(r).map(function(a){return a})},V=function(r){var e=Y.querySelector(r.classTarget);e&&F(e,r)},G=function(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=c.localStorage.getItem(C);if(typeof e=="string"){var a=JSON.parse(e);return r&&(r.dark&&!w(a.dark,r.dark)&&(a.dark=r.dark,D(a)),r.light&&!w(a.light,r.light)&&(a.light=r.light,D(a))),a}return k(k({},d),r)};V(G());__STORYBOOK_MODULE_PREVIEW_API__;const Z={parameters:{controls:{matchers:{color:/(background|color)$/i,date:/Date$/i}},darkMode:{current:"light",darkClass:"dark",lightClass:"light",dark:{...i.dark,appPreviewBg:"transparent"},light:{...i.light,appPreviewBg:"transparent"},stylePreview:!0},docs:{container:t=>{const[r,e]=p.useState(!0);p.useEffect(()=>(t.context.channel.on(b,e),()=>t.context.channel.removeListener(b,e)),[t.context.channel]);const a={...t};return a.theme=r?i.dark:i.light,p.createElement(j,a)}}}};export{Z as default};