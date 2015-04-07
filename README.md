# tag-queue

This small library aims to organise your scripts using very simplified deferred pattern.

Currenly lib weight only 1378B (751B gzipped).

```javascript
/**
 * Register load listener
 */ 
tq('myLib', function() {
	(…)
});


/**
 * NOW! You can also load some libs with crossbrowser callback. Simply use http:// https:// or ://
 */
tq('https://connect.facebook.net/en_US/sdk.js', function() {
  console.log('got Facebook SDK');
});


/**
 * Inform that lib has been loaded
 */
tq.got('myLib');

/**
 * Adding true as second parameter makes lib observe window[<LIB_NAME>] and trigger callback once loaded.
 */
tq('jquery', function() {
   console.log('got jQuery');
}, true);

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

## Credits

Idea and requirements thanks to [Tomasz Witkowski](http://github.com/salvin).

Code version 0.0.1 [Łukasz Marek Sielski](http://github.com/sielay).


