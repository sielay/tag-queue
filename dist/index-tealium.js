!function(t){function n(t){"use strict";function n(t,e){if(!t)return null;if(e.indexOf(".")>-1){var o=e.split("."),r=o.shift();return n(t[r],o.join("."))}return t[e]}var e=/^(http|https|):\/\/(.+?)\/(.+)$/,o=console&&console.log?console.error:function(){},r={},i={},c=function(n){if(!i[n]){if(!t.document)throw Error("URL loads are not supported without document");var e=t.document,o=e.getElementsByTagName("head")[0]||e.documentElement,r=e.createElement("script");r.src=n,i[n]=r,r.onload=r.onreadystatechange=function(){i[n]===!0||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(i[n]=!0,r.onload=r.onreadystatechange=null,o&&r.parentNode&&o.removeChild(r),f.got(n))},o.insertBefore(r,o.firstChild)}},a=function(t){return Array.isArray?Array.isArray(t):"[object Array]"===Object.prototype.toString.call(t)},f=function(t,n,o){if(!(n&&n.constructor&&n.call&&n.apply))throw Error("Callback has to be a function.");if(a(t))for(var i,u=i=t.length,s=0;u>s;s++)f(t[s],function(){i--,0===i&&n()},o);else{if(r[t]===!0)return n(f);r[t]=r[t]||[],r[t].push(n),e.test(t)&&c(t),o===!0&&f.t(t)}};return f.got=function(t){if(r[t]!==!0){if(r[t]){r[t]._t&&clearInterval(r[t]._t);for(var n=r[t].shift();n;)try{n(f)}catch(e){o(e)}finally{n=r[t].shift()}}r[t]=!0}},f.t=function(e){function o(){r[e]._t=setTimeout(function(){return n(t,e)?f.got(e):void o()},100)}r[e]=r[e]||[],o()},f.process=function(t,n){if(t||t.length){n||(n=function(t){try{t(f)}catch(n){}});for(var e=t.shift();e;)a(e)?!function(t,n){f(t[0],function(){n(t[1])},t[2])}(e,n):n(e),e=t.shift()}setTimeout(function(){f.process(t,n)},250)},f}!window.tagQueue=n(t)}(window);