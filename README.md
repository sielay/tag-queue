tag-queue
=========

This small library aims to organise your scripts using very simplified deferred pattern.

Currenly lib weight only 1.6K (857B gzipped).

<!-- RM-IGNORE -->
Table of contents
-----------------
<!-- /RM-IGNORE -->

<!-- RM -->

* [Namespace Deprecation](#namespace-deprecation)
* [Installation](#installation)
  * [NPM](#npm)
  * [Bower](#bower)
  * [Custom](#custom)
  * [Tealium](#tealium)
* [API](#api)
  * [tagQueue(dependencies, callback, useTimer)](#tagqueuedependencies-callback-usetimer)
  * [tagQueue.t(dependency)](#tagqueuetdependency)
  * [tagQueue.got(dependency)](#tagqueuegotdependency)
  * [tagQueue.process(array, wrapper)](#tagqueueprocessarray-wrapper)
  * [customQueue callback](#customqueue-callback)
  * [customQueue complex callback](#customqueue-complex-callback)
* [Use cases](#use-cases)
  * [Simple promise](#simple-promise)
  * [Observable script loader](#observable-script-loader)
  * [Window observing](#window-observing)
  * [Combined dependencies](#combined-dependencies)
  * [Pre-load queueing](#pre-load-queueing)
* [Credits](#credits)


<!-- /RM -->

Namespace Deprecation
---------------------

In previous versions we maintained `window.tq` as default handle for library. At the moment it will work only, if other script haven't defined it already.

Library will be loaded to window as `window.tagQueue`. I googled for it and no one seems to use it (except `window.TagQueue`, so thanks for case sensitivity in JavaScript).

Installation
------------

### NPM
```
npm install tag-queue
```
### Bower
```
bower install tag-queue
```
### Custom

You can directly load one of files from `dist` folder:

 * `/dist/index.js`
 * `/dist/index.js.gz`
 
### Tealium

You can put `/dist/index.js` verison into Custom Tealium Container 

API
---

### tagQueue(dependencies, callback, useTimer)

Queues callback for given dependencies. It will execute it immediately, if dependencies are already met.

 * dependencies
   * __String__ as __URL__ - string starting with `http://` or `https://` will inject observed loader script
   * __String__ - name of dependency, have to be reported manually using `tagQueue.got`
   * __Array__ - array of mixed dependencies, when all are met callback is fired
 * callback
   * __Function__ - `function(tq)`
     * __Function__ tq - reference to `window.tagQueue`
 * useTimer
   * __Boolean__ - if __true__ will observe `window[dependency]` and will fire `tagQueue.got` once field is defined. Can't be used for dependencies as array.
   * default __false__

### tagQueue.t(dependency)

Tells queue to observe specific dependency on window (`window[dependency`]). It's usefull when you declare combined dependencies and one of them require window observing.

 * dependency
   * __String__ - name of dependency. __URL__ and __Array__ are not supported here

### tagQueue.got(dependency)

Reports specific dependency is met

 * dependency
   * __String__ as __URL__ - URL of dependency from loader
   * __String__ - name of dependency

### tagQueue.process(array, wrapper)

Iterates on array expecting `customQueue callbacks` or `customQueue complex callbacks`. Translate them to calls on `tagQueue`.

 * array
   * __Array__ of `customQueue callbacks` or `customQueue complex callbacks`
 * wrapper
   * __Function__ will be used to wrap callbacks
   * __undefined__ by default

Wrapper is used to handle errors in callbacks. It can be used by you to add extra error reporting or insights to specific callbacks. We inject to each wrapper instance of currently processed `callback`. Default callback replicate behaviour of `tagQueue` so injects instance of it.

Default wrapper:

```
function(callback) {
  try {
    callback(tq);
  } catch(ex) {
    // unheld exception
  }
}
```


### customQueue callback

__Function__ will be exectured immediately - the same as in `tagQueue`

### customQueue complex callback

__Array__ representing followign arguments of `tagQueue`:

 * __String__ or __Array__ for dependencies
 * __Function__ for callback
 * __Boolean__ for useTimer

Use cases
---------

### Simple promise

```
/**
 * Register load listener
 */ 
tq('myLib', function() {
	(…)
});

/**
 * Inform that lib has been loaded
 */
tq.got('myLib');
```

### Observable script loader

```
/**
 * NOW! You can also load some libs with crossbrowser callback. Simply use http:// https:// or ://
 */
tq('https://connect.facebook.net/en_US/sdk.js', function() {
  console.log('got Facebook SDK');
});
```

### Window observing

```
/**
 * Adding true as second parameter makes lib observe window[<LIB_NAME>] and trigger callback once loaded.
 */
tq('jquery', function() {
   console.log('got jQuery');
}, true);
```

### Combined dependencies

```
/**
 * You can also require comined dependencies
 */ 
tq(['jquery', 'myLib'], function(){
	(...)
});

/**
 * And tell that we need to observe one specific lib
 */
tq.t('jquery');

/**
 * As it's deferred you can also attach listeners after load event was triggered
 */
tq('myLib', function() {
	// will work even after lq.got('myLib') was fired
});

```

### Pre-load queueing 

```

var myQueue = myQueue || [];

myQueue.push(function(){
	// my calback
	console.log('A');
});

myQueue.push(['next',function(){
	// got 'next'
	console.log('B');
]);

myQueue.push(['jquery',function(t){
	// i have jQuery
	t.got('next'); // so I can say I am ready
	console.log('C');
}
],true);

…

tagQueue.process(myQueue);

```

will result as

```
A
C
B
```



## Credits

Idea and requirements thanks to [Tomasz Witkowski](http://github.com/salvin).

Code version 0.0.1 [Łukasz Marek Sielski](http://github.com/sielay).


