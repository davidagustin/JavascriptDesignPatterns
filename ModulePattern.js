/*
Modules are an integral piece of any robust application's architecture and typically help in keeping the units of
code for a project both cleanly separated and organized.
*/

/*
In JavaScript, there are several options for implementing modules. These include:

The Module pattern
Object literal notation
AMD modules
CommonJS modules
ECMAScript Harmony modules
We will be exploring the latter three of these options later on in the book in the section Modern Modular JavaScript Design Patterns.

The Module pattern is based in part on object literals and so it makes sense to refresh our knowledge of them first.
*/

var myObjectLiteral = {

  variableKey: variableValue,

  functionKey: function () {
    // ...
  }
};

var myModule = {

  myProperty: "someValue",

  // object literals can contain properties and methods.
  // e.g we can define a further object for module configuration:
  myConfig: {
    useCaching: true,
    language: "en"
  },

  // a very basic method
  saySomething: function () {
    console.log( "Where in the world is Paul Irish today?" );
  },

  // output a value based on the current configuration
  reportMyConfig: function () {
    console.log( "Caching is: " + ( this.myConfig.useCaching ? "enabled" : "disabled") );
  },

  // override the current configuration
  updateMyConfig: function( newConfig ) {

    if ( typeof newConfig === "object" ) {
      this.myConfig = newConfig;
      console.log( this.myConfig.language );
    }
  }
};

// Outputs: Where in the world is Paul Irish today?
myModule.saySomething();

// Outputs: Caching is: enabled
myModule.reportMyConfig();

// Outputs: fr
myModule.updateMyConfig({
  language: "fr",
  useCaching: false
});

// Outputs: Caching is: disabled
myModule.reportMyConfig();

/*
In JavaScript, the Module pattern is used to further emulate the concept of classes in such a way that we're able to
include both public/private methods and variables inside a single object, thus shielding particular parts from the
global scope. What this results in is a reduction in the likelihood of our function names conflicting with other
functions defined in additional scripts on the page.

Privacy
The Module pattern encapsulates "privacy", state and organization using closures. It provides a way of wrapping a mix
of public and private methods and variables, protecting pieces from leaking into the global scope and accidentally
colliding with another developer's interface. With this pattern, only a public API is returned, keeping everything
else within the closure private.

This gives us a clean solution for shielding logic doing the heavy lifting whilst only exposing an interface we wish
other parts of our application to use. The pattern utilizes an immediately-invoked function expression (IIFE - see the
section on namespacing patterns for more on this) where an object is returned.

It should be noted that there isn't really an explicitly true sense of "privacy" inside JavaScript because unlike some
 traditional languages, it doesn't have access modifiers. Variables can't technically be declared as being public nor
  private and so we use function scope to simulate this concept. Within the Module pattern, variables or methods declared
  are only available inside the module itself thanks to closure. Variables or methods defined within the returning object
   however are available to everyone.

History
From a historical perspective, the Module pattern was originally developed by a number of people including Richard
 Cornford in 2003. It was later popularized by Douglas Crockford in his lectures. Another piece of trivia is that if
  you've ever played with Yahoo's YUI library, some of its features may appear quite familiar and the reason for this is
   that the Module pattern was a strong influence for YUI when creating their components.

Examples
Let's begin looking at an implementation of the Module pattern by creating a module which is self-contained.
 */

var testModule = (function () {

  var counter = 0;

  return {

    incrementCounter: function () {
      return counter++;
    },

    resetCounter: function () {
      console.log( "counter value prior to reset: " + counter );
      counter = 0;
    }
  };

})();

// Usage:

// Increment our counter
testModule.incrementCounter();

// Check the counter value and reset
// Outputs: counter value prior to reset: 1
testModule.resetCounter();

var myNamespace = (function () {

  var myPrivateVar, myPrivateMethod;

  // A private counter variable
  myPrivateVar = 0;

  // A private function which logs any arguments
  myPrivateMethod = function( foo ) {
    console.log( foo );
  };

  return {

    // A public variable
    myPublicVar: "foo",

    // A public function utilizing privates
    myPublicFunction: function( bar ) {

      // Increment our private counter
      myPrivateVar++;

      // Call our private method using bar
      myPrivateMethod( bar );

    }
  };

})();

var basketModule = (function () {

  // privates

  var basket = [];

  function doSomethingPrivate() {
    //...
  }

  function doSomethingElsePrivate() {
    //...
  }

  // Return an object exposed to the public
  return {

    // Add items to our basket
    addItem: function( values ) {
      basket.push(values);
    },

    // Get the count of items in the basket
    getItemCount: function () {
      return basket.length;
    },

    // Public alias to a private function
    doSomething: doSomethingPrivate,

    // Get the total value of items in the basket
    getTotal: function () {

      var q = this.getItemCount(),
        p = 0;

      while (q--) {
        p += basket[q].price;
      }

      return p;
    }
  };
})();

// basketModule returns an object with a public API we can use

basketModule.addItem({
  item: "bread",
  price: 0.5
});

basketModule.addItem({
  item: "butter",
  price: 0.3
});

// Outputs: 2
console.log( basketModule.getItemCount() );

// Outputs: 0.8
console.log( basketModule.getTotal() );

// However, the following will not work:

// Outputs: undefined
// This is because the basket itself is not exposed as a part of our
// public API
console.log( basketModule.basket );

// This also won't work as it only exists within the scope of our
// basketModule closure, but not in the returned public object
console.log( basket );

// Global module
var myModule = (function ( jQ, _ ) {

  function privateMethod1(){
    jQ(".container").html("test");
  }

  function privateMethod2(){
    console.log( _.min([10, 5, 100, 2, 1000]) );
  }

  return{
    publicMethod: function(){
      privateMethod1();
    }
  };

// Pull in jQuery and Underscore
})( jQuery, _ );

myModule.publicMethod();

// Global module
var myModule = (function () {

  // Module object
  var module = {},
    privateVariable = "Hello World";

  function privateMethod() {
    // ...
  }

  module.publicProperty = "Foobar";
  module.publicMethod = function () {
    console.log( privateVariable );
  };

  return module;

})();

var store = window.store || {};

if ( !store["basket"] ) {
  store.basket = {};
}

if ( !store.basket["core"] ) {
  store.basket.core = {};
}

store.basket.core = {
  // ...rest of our logic
};

require(["dojo/_base/customStore"], function( store ){

  // using dojo.setObject()
  store.setObject( "basket.core", (function() {

    var basket = [];

    function privateMethod() {
      console.log(basket);
    }

    return {
      publicMethod: function(){
        privateMethod();
      }
    };

  })());

});

function library( module ) {

  $( function() {
    if ( module.init ) {
      module.init();
    }
  });

  return module;
}

var myLibrary = library(function () {

  return {
    init: function () {
      // module implementation
    }
  };
}());

var myRevealingModule = (function () {

  var privateVar = "Ben Cherry",
    publicVar = "Hey there!";

  function privateFunction() {
    console.log( "Name:" + privateVar );
  }

  function publicSetName( strName ) {
    privateVar = strName;
  }

  function publicGetName() {
    privateFunction();
  }


  // Reveal public pointers to
  // private functions and properties

  return {
    setName: publicSetName,
    greeting: publicVar,
    getName: publicGetName
  };

})();

myRevealingModule.setName( "Paul Kinlan" );

var myRevealingModule = (function () {

  var privateCounter = 0;

  function privateFunction() {
    privateCounter++;
  }

  function publicFunction() {
    publicIncrement();
  }

  function publicIncrement() {
    privateFunction();
  }

  function publicGetCount(){
    return privateCounter;
  }

  // Reveal public pointers to
  // private functions and properties

  return {
    start: publicFunction,
    increment: publicIncrement,
    count: publicGetCount
  };

})();

myRevealingModule.start();
