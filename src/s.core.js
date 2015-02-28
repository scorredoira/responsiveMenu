
if (typeof S === 'undefined') {
	// Define las funciones básicas que son utilizadas por los demás módulos.
	// Santiago Corredoira Lascaray.
    var S = {};
}

(function () {   
    "use strict";
       
    S.isDefined = function (o) {
        return typeof (o) !== 'undefined';
    }

    S.isArray = function (o) {
        if (o) {
            return S.isNumber(o.length) && S.isFunction(o.splice);
        }
        return false;
    };

    S.isNumber = function (o) {
        return typeof (o) === 'number' && isFinite(o);
    };

    S.isFunction = function (o) {
        return typeof (o) === 'function';
    };

    // Añade una traza en la consola de depuración.
    S.log = function (args) {
        console.log(args);
    };  

    S.each = function (collection, functionName) {
        if (!collection) {
            return;
        }
        
        for (var i = 0, l = collection.length; i < l; i++) {
            functionName(collection[i]);
        }
    };

    // implementación básica para que no falle si no esta el 
    // modulo de traducciones.
    S.t = function (text) {
        return text
    };  

    /**
    Obtiene el elemento HTML si se pasa el nombre o devuelve el mismo si es objeto.
    */
    S.get = function (element) {
        if (typeof (element) == 'string') {
            element = document.getElementById(element);
        }
        return element;
    };

    // Devuelve los elementos de primer nivel que tienen el tag
    S.getChildrenByTag = function(element, tag) {
        var nodes = [];

        S.each(element.childNodes, function(child){
            if(child.tagName && child.tagName.toLowerCase() == tag) {
                nodes.push(child);
            }
        });

        return nodes;
    };

    // Sets the inner text of an Html element
    S.setText = function (element, text) {
        if (text == null) {
            text = "";
        }

        element = S.get(element);

        if (S.isDefined(element.innerText)) {
            element.innerText = text;
        }
        else {
            element.textContent = text;
        }
    };

    S.create = function (type, id, className, parent, text) {
        var element = document.createElement(type);

        if(id) {
            element.id = id;
        }

        if(className) {
            element.className = className;
        }

        if(parent) {
            parent.appendChild(element);
        }

        if(text) {
            S.setText(element, text)
        }
        
        return element;
    };

    /**
    Devuelve true en caso de que el elemento tenga establecido el className.
    */
    S.hasClass = function (element, className) {
        if (typeof (element) == 'string') {
            element = document.getElementById(element);
        }
        return new RegExp('\\b' + className + '\\b').test(element.className);
    };

    /**
    Elimina el className del elemento.
    */
    S.removeClass = function (element, className) {
        if(S.isArray(element)) {
            S.each(element, function(item){
                S.removeClass(item, className);
            });
            return;
        }

        if (typeof (element) == 'string') {
            element = document.getElementById(element);
        }
        var regEx = new RegExp('\\b' + className + '\\b');
        element.className = element.className.replace(regEx, ' ');
    };

    /**
    Añade el className al elemento.
    */
    S.addClass = function (element, className) {
        if(S.isArray(element)) {
            S.each(element, function(item){
                S.addClass(item, className);
            });
            return;
        }

        if (typeof (element) == 'string') {
            element = document.getElementById(element);
        }
        if (!S.hasClass(element, className)) {
            element.className += " " + className;
        }
    };

    
    S.setStyle = function (element, property, value) {
        if (property.toLowerCase() == 'opacity') {
            if (typeof (element.style.filter) === 'string') {
                element.style.filter = 'alpha(opacity=' + value * 100 + ')';

                if (!element.currentStyle || !element.currentStyle.hasLayout) {
                    element.style.zoom = 1; // when no layout or cant tell
                }
            }
        }

        element.style[property] = value;
    };

    /**   
    Attaches an event to an Html element
    */
    S.attach = function (element, evType, func, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(evType, func, useCapture);
        }
        else if (element.attachEvent) {
            element.attachEvent('on' + evType, func);
        }
        else {
            element['on' + evType] = func;
        }
    };

    //Prevents further propagation of the current event.
    S.cancelBubble = function (event) {
        if (!event) {
            event = event || window.event;
        }
        /*ojo en firefox event y window.event siempre es  null*/
            //if (!event) return;
        if (event.cancelBubble) {
            event.cancelBubble = true;
        }

        if (S.isDefined(event.stopPropagation)) {
            event.stopPropagation();
        }
    };
            
})();
   


