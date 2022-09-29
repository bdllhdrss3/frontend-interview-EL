/*global NodeList */
(function (window) {
	'use strict';

	// Get element(s) by CSS selector:
	window.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};
	window.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	// addEventListener wrapper:
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	// Attach a handler to event for all elements that match the selector,
	// now or in the future, based on a root element
	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			if (hasMatch) {
				handler.call(targetElement, event);
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		var useCapture = type === 'blur' || type === 'focus';

		window.$on(target, type, dispatchEvent, useCapture);
	};

	// Find the element's parent with the given tag name:
	// $parent(qs('a'), 'div');
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Allow for looping on nodes by chaining:
	// qsa('.foo').forEach(function () {})
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);

//my js
$on(window, 'load', function(){
  
  categories = []
  
  categories = JSON.parse(localStorage.getItem('todos-vanillajs_categories'))
   categories.forEach(function(x){
    let option = `<option>${x}</option>`
    document.getElementById("options").innerHTML += option
  })

})


var categoryInput = document.getElementById("category")
$on(categoryInput, 'change', function(){
  categories = []

  categories = JSON.parse(localStorage.getItem('todos-vanillajs_categories'))
  if(categoryInput.value !== '' && !categories.includes(categoryInput.value)){
      let option = `<option>${categoryInput.value}</option>`
      document.getElementById("options").innerHTML += option
      categories.push(categoryInput.value)
      localStorage.setItem('todos-vanillajs_categories', JSON.stringify(categories))
  }

})