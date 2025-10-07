try{
(()=>{var d=__REACT__,{Children:dr,Component:lr,Fragment:mr,Profiler:fr,PureComponent:cr,StrictMode:hr,Suspense:br,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:gr,act:yr,cloneElement:vr,createContext:xr,createElement:Sr,createFactory:_r,createRef:Tr,forwardRef:wr,isValidElement:Pr,lazy:kr,memo:Cr,startTransition:Er,unstable_act:Rr,useCallback:Ir,useContext:Or,useDebugValue:Fr,useDeferredValue:Hr,useEffect:K,useId:jr,useImperativeHandle:Ar,useInsertionEffect:zr,useLayoutEffect:Br,useMemo:Mr,useReducer:Nr,useRef:Lr,useState:G,useSyncExternalStore:Dr,useTransition:$r,version:qr}=__REACT__;var Ur=__STORYBOOK_COMPONENTS__,{A:Zr,ActionBar:Jr,AddonPanel:U,Badge:Qr,Bar:Xr,Blockquote:Vr,Button:et,ClipboardCode:rt,Code:tt,DL:nt,Div:at,DocumentWrapper:ot,EmptyTabContent:st,ErrorFormatter:it,FlexBar:pt,Form:ut,H1:dt,H2:lt,H3:mt,H4:ft,H5:ct,H6:ht,HR:bt,IconButton:gt,Img:yt,LI:vt,Link:xt,ListItem:St,Loader:_t,Modal:Tt,OL:wt,P:Pt,Placeholder:kt,Pre:Ct,ProgressSpinner:Et,ResetWrapper:Rt,ScrollArea:It,Separator:Ot,Spaced:Ft,Span:Ht,StorybookIcon:jt,StorybookLogo:At,SyntaxHighlighter:Z,TT:zt,TabBar:Bt,TabButton:Mt,TabWrapper:Nt,Table:Lt,Tabs:Dt,TabsState:$t,TooltipLinkList:qt,TooltipMessage:Yt,TooltipNote:Wt,UL:Kt,WithTooltip:Gt,WithTooltipPure:Ut,Zoom:Zt,codeCommon:Jt,components:Qt,createCopyToClipboardFunction:Xt,getStoryHref:Vt,interleaveSeparators:en,nameSpaceClassNames:rn,resetComponents:tn,withReset:J}=__STORYBOOK_COMPONENTS__;var pn=__STORYBOOK_API__,{ActiveTabs:un,Consumer:dn,ManagerContext:ln,Provider:mn,RequestResponseError:fn,addons:H,combineParameters:cn,controlOrMetaKey:hn,controlOrMetaSymbol:bn,eventMatchesShortcut:gn,eventToShortcut:yn,experimental_MockUniversalStore:vn,experimental_UniversalStore:xn,experimental_getStatusStore:Sn,experimental_getTestProviderStore:_n,experimental_requestResponse:Tn,experimental_useStatusStore:wn,experimental_useTestProviderStore:Pn,experimental_useUniversalStore:kn,internal_fullStatusStore:Cn,internal_fullTestProviderStore:En,internal_universalStatusStore:Rn,internal_universalTestProviderStore:In,isMacLike:On,isShortcutTaken:Fn,keyToSymbol:Hn,merge:jn,mockChannel:An,optionOrAltSymbol:zn,shortcutMatchesShortcut:Bn,shortcutToHumanString:Mn,types:Q,useAddonState:Nn,useArgTypes:Ln,useArgs:Dn,useChannel:X,useGlobalTypes:$n,useGlobals:qn,useParameter:V,useSharedState:Yn,useStoryPrepared:Wn,useStorybookApi:Kn,useStorybookState:Gn}=__STORYBOOK_API__;var Xn=__STORYBOOK_THEMING__,{CacheProvider:Vn,ClassNames:ea,Global:ra,ThemeProvider:ee,background:ta,color:na,convert:re,create:aa,createCache:oa,createGlobal:sa,createReset:ia,css:pa,darken:ua,ensure:da,ignoreSsrWarning:j,isPropValid:la,jsx:ma,keyframes:fa,lighten:ca,styled:T,themes:A,typography:ha,useTheme:z,withTheme:ba}=__STORYBOOK_THEMING__;var Y="storybook/docs",de=`${Y}/panel`,te="docs",ne=`${Y}/snippet-rendered`;function l(){return l=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)({}).hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},l.apply(null,arguments)}function le(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function C(e,r){return C=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,n){return t.__proto__=n,t},C(e,r)}function me(e,r){e.prototype=Object.create(r.prototype),e.prototype.constructor=e,C(e,r)}function L(e){return L=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(r){return r.__proto__||Object.getPrototypeOf(r)},L(e)}function fe(e){try{return Function.toString.call(e).indexOf("[native code]")!==-1}catch{return typeof e=="function"}}function oe(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(oe=function(){return!!e})()}function ce(e,r,t){if(oe())return Reflect.construct.apply(null,arguments);var n=[null];n.push.apply(n,r);var a=new(e.bind.apply(e,n));return t&&C(a,t.prototype),a}function D(e){var r=typeof Map=="function"?new Map:void 0;return D=function(t){if(t===null||!fe(t))return t;if(typeof t!="function")throw new TypeError("Super expression must either be null or a function");if(r!==void 0){if(r.has(t))return r.get(t);r.set(t,n)}function n(){return ce(t,arguments,L(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),C(n,t)},D(e)}var he={1:`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).

`,2:`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).

`,3:`Passed an incorrect argument to a color function, please pass a string representation of a color.

`,4:`Couldn't generate valid rgb string from %s, it returned %s.

`,5:`Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,6:`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).

`,7:`Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).

`,8:`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,9:`Please provide a number of steps to the modularScale helper.

`,10:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,11:`Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,12:`Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,13:`Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,14:`Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,15:`Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,16:`You must provide a template to this method.

`,17:`You passed an unsupported selector state to this method.

`,18:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,19:`fromSize and toSize must be provided as stringified numbers with the same units.

`,20:`expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,21:"expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",22:"expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",23:`fontFace expects a name of a font-family.

`,24:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,25:`fontFace expects localFonts to be an array.

`,26:`fontFace expects fileFormats to be an array.

`,27:`radialGradient requries at least 2 color-stops to properly render.

`,28:`Please supply a filename to retinaImage() as the first argument.

`,29:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,30:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",31:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,32:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,33:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,34:`borderRadius expects a radius value as a string or number as the second argument.

`,35:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,36:`Property must be a string value.

`,37:`Syntax Error at %s.

`,38:`Formula contains a function that needs parentheses at %s.

`,39:`Formula is missing closing parenthesis at %s.

`,40:`Formula has too many closing parentheses at %s.

`,41:`All values in a formula must have the same unit or be unitless.

`,42:`Please provide a number of steps to the modularScale helper.

`,43:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,44:`Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,45:`Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,46:`Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,47:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,48:`fromSize and toSize must be provided as stringified numbers with the same units.

`,49:`Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,50:`Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,51:`Expects the first argument object to have the properties prop, fromSize, and toSize.

`,52:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,53:`fontFace expects localFonts to be an array.

`,54:`fontFace expects fileFormats to be an array.

`,55:`fontFace expects a name of a font-family.

`,56:`linearGradient requries at least 2 color-stops to properly render.

`,57:`radialGradient requries at least 2 color-stops to properly render.

`,58:`Please supply a filename to retinaImage() as the first argument.

`,59:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,60:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",61:`Property must be a string value.

`,62:`borderRadius expects a radius value as a string or number as the second argument.

`,63:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,64:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,65:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').

`,66:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,67:`You must provide a template to this method.

`,68:`You passed an unsupported selector state to this method.

`,69:`Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,70:`Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,71:`Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,72:`Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,73:`Please provide a valid CSS variable.

`,74:`CSS variable not found and no default was provided.

`,75:`important requires a valid style object, got a %s instead.

`,76:`fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,77:`remToPx expects a value in "rem" but you provided it in "%s".

`,78:`base must be set in "px" or "%" but you set it in "%s".
`};function be(){for(var e=arguments.length,r=new Array(e),t=0;t<e;t++)r[t]=arguments[t];var n=r[0],a=[],o;for(o=1;o<r.length;o+=1)a.push(r[o]);return a.forEach(function(s){n=n.replace(/%[a-z]/,s)}),n}var b=(function(e){me(r,e);function r(t){for(var n,a=arguments.length,o=new Array(a>1?a-1:0),s=1;s<a;s++)o[s-1]=arguments[s];return n=e.call(this,be.apply(void 0,[he[t]].concat(o)))||this,le(n)}return r})(D(Error));function B(e){return Math.round(e*255)}function ge(e,r,t){return B(e)+","+B(r)+","+B(t)}function E(e,r,t,n){if(n===void 0&&(n=ge),r===0)return n(t,t,t);var a=(e%360+360)%360/60,o=(1-Math.abs(2*t-1))*r,s=o*(1-Math.abs(a%2-1)),i=0,p=0,u=0;a>=0&&a<1?(i=o,p=s):a>=1&&a<2?(i=s,p=o):a>=2&&a<3?(p=o,u=s):a>=3&&a<4?(p=s,u=o):a>=4&&a<5?(i=s,u=o):a>=5&&a<6&&(i=o,u=s);var h=t-o/2,c=i+h,m=p+h,k=u+h;return n(c,m,k)}var ae={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};function ye(e){if(typeof e!="string")return e;var r=e.toLowerCase();return ae[r]?"#"+ae[r]:e}var ve=/^#[a-fA-F0-9]{6}$/,xe=/^#[a-fA-F0-9]{8}$/,Se=/^#[a-fA-F0-9]{3}$/,_e=/^#[a-fA-F0-9]{4}$/,M=/^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,Te=/^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i,we=/^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,Pe=/^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;function w(e){if(typeof e!="string")throw new b(3);var r=ye(e);if(r.match(ve))return{red:parseInt(""+r[1]+r[2],16),green:parseInt(""+r[3]+r[4],16),blue:parseInt(""+r[5]+r[6],16)};if(r.match(xe)){var t=parseFloat((parseInt(""+r[7]+r[8],16)/255).toFixed(2));return{red:parseInt(""+r[1]+r[2],16),green:parseInt(""+r[3]+r[4],16),blue:parseInt(""+r[5]+r[6],16),alpha:t}}if(r.match(Se))return{red:parseInt(""+r[1]+r[1],16),green:parseInt(""+r[2]+r[2],16),blue:parseInt(""+r[3]+r[3],16)};if(r.match(_e)){var n=parseFloat((parseInt(""+r[4]+r[4],16)/255).toFixed(2));return{red:parseInt(""+r[1]+r[1],16),green:parseInt(""+r[2]+r[2],16),blue:parseInt(""+r[3]+r[3],16),alpha:n}}var a=M.exec(r);if(a)return{red:parseInt(""+a[1],10),green:parseInt(""+a[2],10),blue:parseInt(""+a[3],10)};var o=Te.exec(r.substring(0,50));if(o)return{red:parseInt(""+o[1],10),green:parseInt(""+o[2],10),blue:parseInt(""+o[3],10),alpha:parseFloat(""+o[4])>1?parseFloat(""+o[4])/100:parseFloat(""+o[4])};var s=we.exec(r);if(s){var i=parseInt(""+s[1],10),p=parseInt(""+s[2],10)/100,u=parseInt(""+s[3],10)/100,h="rgb("+E(i,p,u)+")",c=M.exec(h);if(!c)throw new b(4,r,h);return{red:parseInt(""+c[1],10),green:parseInt(""+c[2],10),blue:parseInt(""+c[3],10)}}var m=Pe.exec(r.substring(0,50));if(m){var k=parseInt(""+m[1],10),pe=parseInt(""+m[2],10)/100,ue=parseInt(""+m[3],10)/100,W="rgb("+E(k,pe,ue)+")",R=M.exec(W);if(!R)throw new b(4,r,W);return{red:parseInt(""+R[1],10),green:parseInt(""+R[2],10),blue:parseInt(""+R[3],10),alpha:parseFloat(""+m[4])>1?parseFloat(""+m[4])/100:parseFloat(""+m[4])}}throw new b(5)}function ke(e){var r=e.red/255,t=e.green/255,n=e.blue/255,a=Math.max(r,t,n),o=Math.min(r,t,n),s=(a+o)/2;if(a===o)return e.alpha!==void 0?{hue:0,saturation:0,lightness:s,alpha:e.alpha}:{hue:0,saturation:0,lightness:s};var i,p=a-o,u=s>.5?p/(2-a-o):p/(a+o);switch(a){case r:i=(t-n)/p+(t<n?6:0);break;case t:i=(n-r)/p+2;break;default:i=(r-t)/p+4;break}return i*=60,e.alpha!==void 0?{hue:i,saturation:u,lightness:s,alpha:e.alpha}:{hue:i,saturation:u,lightness:s}}function g(e){return ke(w(e))}var Ce=function(e){return e.length===7&&e[1]===e[2]&&e[3]===e[4]&&e[5]===e[6]?"#"+e[1]+e[3]+e[5]:e},$=Ce;function v(e){var r=e.toString(16);return r.length===1?"0"+r:r}function N(e){return v(Math.round(e*255))}function Ee(e,r,t){return $("#"+N(e)+N(r)+N(t))}function O(e,r,t){return E(e,r,t,Ee)}function Re(e,r,t){if(typeof e=="number"&&typeof r=="number"&&typeof t=="number")return O(e,r,t);if(typeof e=="object"&&r===void 0&&t===void 0)return O(e.hue,e.saturation,e.lightness);throw new b(1)}function Ie(e,r,t,n){if(typeof e=="number"&&typeof r=="number"&&typeof t=="number"&&typeof n=="number")return n>=1?O(e,r,t):"rgba("+E(e,r,t)+","+n+")";if(typeof e=="object"&&r===void 0&&t===void 0&&n===void 0)return e.alpha>=1?O(e.hue,e.saturation,e.lightness):"rgba("+E(e.hue,e.saturation,e.lightness)+","+e.alpha+")";throw new b(2)}function q(e,r,t){if(typeof e=="number"&&typeof r=="number"&&typeof t=="number")return $("#"+v(e)+v(r)+v(t));if(typeof e=="object"&&r===void 0&&t===void 0)return $("#"+v(e.red)+v(e.green)+v(e.blue));throw new b(6)}function F(e,r,t,n){if(typeof e=="string"&&typeof r=="number"){var a=w(e);return"rgba("+a.red+","+a.green+","+a.blue+","+r+")"}else{if(typeof e=="number"&&typeof r=="number"&&typeof t=="number"&&typeof n=="number")return n>=1?q(e,r,t):"rgba("+e+","+r+","+t+","+n+")";if(typeof e=="object"&&r===void 0&&t===void 0&&n===void 0)return e.alpha>=1?q(e.red,e.green,e.blue):"rgba("+e.red+","+e.green+","+e.blue+","+e.alpha+")"}throw new b(7)}var Oe=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},Fe=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&typeof e.alpha=="number"},He=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},je=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&typeof e.alpha=="number"};function y(e){if(typeof e!="object")throw new b(8);if(Fe(e))return F(e);if(Oe(e))return q(e);if(je(e))return Ie(e);if(He(e))return Re(e);throw new b(8)}function se(e,r,t){return function(){var n=t.concat(Array.prototype.slice.call(arguments));return n.length>=r?e.apply(this,n):se(e,r,n)}}function f(e){return se(e,e.length,[])}function Ae(e,r){if(r==="transparent")return r;var t=g(r);return y(l({},t,{hue:t.hue+parseFloat(e)}))}f(Ae);function P(e,r,t){return Math.max(e,Math.min(r,t))}function ze(e,r){if(r==="transparent")return r;var t=g(r);return y(l({},t,{lightness:P(0,1,t.lightness-parseFloat(e))}))}f(ze);function Be(e,r){if(r==="transparent")return r;var t=g(r);return y(l({},t,{saturation:P(0,1,t.saturation-parseFloat(e))}))}f(Be);function Me(e,r){if(r==="transparent")return r;var t=g(r);return y(l({},t,{lightness:P(0,1,t.lightness+parseFloat(e))}))}f(Me);function Ne(e,r,t){if(r==="transparent")return t;if(t==="transparent")return r;if(e===0)return t;var n=w(r),a=l({},n,{alpha:typeof n.alpha=="number"?n.alpha:1}),o=w(t),s=l({},o,{alpha:typeof o.alpha=="number"?o.alpha:1}),i=a.alpha-s.alpha,p=parseFloat(e)*2-1,u=p*i===-1?p:p+i,h=1+p*i,c=(u/h+1)/2,m=1-c,k={red:Math.floor(a.red*c+s.red*m),green:Math.floor(a.green*c+s.green*m),blue:Math.floor(a.blue*c+s.blue*m),alpha:a.alpha*parseFloat(e)+s.alpha*(1-parseFloat(e))};return F(k)}var Le=f(Ne),ie=Le;function De(e,r){if(r==="transparent")return r;var t=w(r),n=typeof t.alpha=="number"?t.alpha:1,a=l({},t,{alpha:P(0,1,(n*100+parseFloat(e)*100)/100)});return F(a)}f(De);function $e(e,r){if(r==="transparent")return r;var t=g(r);return y(l({},t,{saturation:P(0,1,t.saturation+parseFloat(e))}))}f($e);function qe(e,r){return r==="transparent"?r:y(l({},g(r),{hue:parseFloat(e)}))}f(qe);function Ye(e,r){return r==="transparent"?r:y(l({},g(r),{lightness:parseFloat(e)}))}f(Ye);function We(e,r){return r==="transparent"?r:y(l({},g(r),{saturation:parseFloat(e)}))}f(We);function Ke(e,r){return r==="transparent"?r:ie(parseFloat(e),"rgb(0, 0, 0)",r)}f(Ke);function Ge(e,r){return r==="transparent"?r:ie(parseFloat(e),"rgb(255, 255, 255)",r)}f(Ge);function Ue(e,r){if(r==="transparent")return r;var t=w(r),n=typeof t.alpha=="number"?t.alpha:1,a=l({},t,{alpha:P(0,1,+(n*100-parseFloat(e)*100).toFixed(2)/100)});return F(a)}var Ze=f(Ue),Je=Ze,Qe=T.div(J,({theme:e})=>({backgroundColor:e.base==="light"?"rgba(0,0,0,.01)":"rgba(255,255,255,.01)",borderRadius:e.appBorderRadius,border:`1px dashed ${e.appBorderColor}`,display:"flex",alignItems:"center",justifyContent:"center",padding:20,margin:"25px 0 40px",color:Je(.3,e.color.defaultText),fontSize:e.typography.size.s2})),Xe=e=>d.createElement(Qe,{...e,className:"docblock-emptyblock sb-unstyled"}),Ve=T(Z)(({theme:e})=>({fontSize:`${e.typography.size.s2-1}px`,lineHeight:"19px",margin:"25px 0 40px",borderRadius:e.appBorderRadius,boxShadow:e.base==="light"?"rgba(0, 0, 0, 0.10) 0 1px 3px 0":"rgba(0, 0, 0, 0.20) 0 2px 5px 0","pre.prismjs":{padding:20,background:"inherit"}})),er=T.div(({theme:e})=>({background:e.background.content,borderRadius:e.appBorderRadius,border:`1px solid ${e.appBorderColor}`,boxShadow:e.base==="light"?"rgba(0, 0, 0, 0.10) 0 1px 3px 0":"rgba(0, 0, 0, 0.20) 0 2px 5px 0",margin:"25px 0 40px",padding:"20px 20px 20px 22px"})),I=T.div(({theme:e})=>({animation:`${e.animation.glow} 1.5s ease-in-out infinite`,background:e.appBorderColor,height:17,marginTop:1,width:"60%",[`&:first-child${j}`]:{margin:0}})),rr=()=>d.createElement(er,null,d.createElement(I,null),d.createElement(I,{style:{width:"80%"}}),d.createElement(I,{style:{width:"30%"}}),d.createElement(I,{style:{width:"80%"}})),tr=({isLoading:e,error:r,language:t,code:n,dark:a,format:o=!0,...s})=>{let{typography:i}=z();if(e)return d.createElement(rr,null);if(r)return d.createElement(Xe,null,r);let p=d.createElement(Ve,{bordered:!0,copyable:!0,format:o,language:t??"jsx",className:"docblock-source sb-unstyled",...s},n);if(typeof a>"u")return p;let u=a?A.dark:A.light;return d.createElement(ee,{theme:re({...u,fontCode:i.fonts.mono,fontBase:i.fonts.base})},p)};H.register(Y,e=>{H.add(de,{title:"Code",type:Q.PANEL,paramKey:te,disabled:r=>!r?.docs?.codePanel,match:({viewMode:r})=>r==="story",render:({active:r})=>{let t=e.getChannel(),n=e.getCurrentStoryData(),a=t?.last(ne)?.[0],[o,s]=G({source:a?.source,format:a?.format??void 0}),i=V(te,{source:{code:""},theme:"dark"});K(()=>{s({source:void 0,format:void 0})},[n?.id]),X({[ne]:({source:u,format:h})=>{s({source:u,format:h})}});let p=z().base!=="light";return d.createElement(U,{active:!!r},d.createElement(nr,null,d.createElement(tr,{...i.source,code:i.source?.code||o.source||i.source?.originalSource,format:o.format,dark:p})))}})});var nr=T.div(()=>({height:"100%",[`> :first-child${j}`]:{margin:0,height:"100%",boxShadow:"none"}}));})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
