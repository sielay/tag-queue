# tag-queue

This small library aims to organise your scripts using very simplified deferred pattern.

Currenly lib weight only 741B (422B gzipped).

```javascript
/**
 * Register load listener
 */ 
lq('myLib', function() {
	(…)
});

/**
 * Inform that lib has been loaded
 */
lq.got('myLib'); 

/**
 * Adding true as second parameter makes lib observe window[<LIB_NAME>] and trigger callback once loaded.
 */
lq('jquery', function() {
   console.log('got jQuery');
}, true);

/**
 * You can also require comined dependencies
 */ 
lq(['jquery', 'myLib'], function(){
	(...)
});

/**
 * And tell that we need to observe one specific lib
 */
lq.t('jquery');

/**
 * As it's deferred you can also attach listeners after load event was triggered
 */
lq('myLib', function() {
	// will work even after lq.got('myLib') was fired
});

```

## Credits

Idea and requirements thanks to [Tomasz Witkowski](http://github.com/salvin).

Code version 0.0.1 [Łukasz Marek Sielski](http://github.com/sielay).


