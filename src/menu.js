(function () {
    "use strict";

    // S.menu es un menu de navegacíón responsivo y adaptado 
    // para que sirva a personas ciegas con lectores especiales.
    S.menu = function(mainNode) {
		var instance = this;	
		var responsiveMode = false;	
		mainNode = S.get(mainNode);
    	var mainContainer = mainNode.parentNode;
		S.addClass(mainNode, "menu");

		// el panel con las rallitas de menu responsivo.
		var menuIcon = null;

		// el menu tiene que se una lista
		if(mainNode.tagName.toLowerCase() != "ul") {
			throw "Invalid element. Must be a UL";
		}

		// añade eventos a los elementos que tiene submenus.
		function attachEvents(element) {
			var nodes = S.getChildrenByTag(element, "li");
			S.each(nodes, function(node){	
				S.attach(node, "click", function(event) {
					// cancelar en todos para que no se propague al padre.
					// Si no, cuando pinchas en un elemento de un submenu 
					// se propaga y se vuelve a mostrar.
					S.cancelBubble(event);	

					// si tiene submenu, mostrarlo
					if(getSubmenu(node) != null) {
						instance.showSubMenu(node);	
					}
					// si no, ocultar el menu
					else {
						instance.hideSubmenus();
					}
				});	
			});

			// comprobar si hay que minimizar en caso de que se 
			// modifique el tamaño de la ventana.
			S.attach(window, "resize", onSizeChanged);
			S.attach(window, "orientationchange", onSizeChanged);
		}

		var thread;
		function onSizeChanged() {
			if (thread) {
				clearTimeout(thread);
			}

			thread = setTimeout(function() { 					
				setResponsiveIfNeeded(mainNode);
				thread = null;
			}, 100);
		}

		function getSubmenu(element) {
			var nested = S.getChildrenByTag(element, "ul");
			return nested.length > 0 ? nested[0] : null;
		}

		this.hideSubmenus = function () {
			hideSubmenus(mainNode);
		}

		this.setResponsive = function(value) {
			if(responsiveMode == value) {
				// its already in that state, nothing to do.
				return;
			}

			instance.hideSubmenus();
			
			responsiveMode = value;
			if(responsiveMode) {
				S.addClass(mainNode, "responsive");
				showMenuIcon();
			}
			else {
				S.removeClass(mainNode, "responsive");
				hideMenuIcon();
			}
		}

		this.showSubMenu = function (element) {
			var submenu = getSubmenu(element);
			if(!submenu) {
				return;
			}

			hideSubmenus(submenu);
			attachEvents(submenu);

			S.addClass(submenu, "submenu");

			// posicionar absolutamente solo en modo responsivo
			if(!responsiveMode) {
				if(isTopLevel(element)) {
					submenu.style.left = element.offsetLeft + "px";
					submenu.style.top = (element.offsetTop + element.offsetHeight) + "px";
				}
				else {
					// obtener el ancho del submenu que contiene al padre
					submenu.style.left = element.parentNode.offsetWidth + "px";
					submenu.style.top = element.offsetTop + "px";
				}
				submenu.style.position = "absolute";
			}
			else {
				submenu.style.position = "initial";
			}

			if(S.fadeIn) {
				S.fadeIn(submenu, null, 7);	
			}
			else {	    
	    		submenu.style.display = 'block';
			}		
		};

		function isTopLevel(element) {
			return element.parentNode == mainNode;
		}

		function showMenuIcon(){
			mainNode.style.display = "none";
			getMenuIcon().style.display = "block";
		}

		// devuelve el bloque que indica menu responsivo.
		// Si no existe lo crea.
		function getMenuIcon() {
			if(menuIcon) {
				return menuIcon;
			} 

			menuIcon = S.create("div", null, "hamburgerPanel", null, "menu");

			// meterlo delante del menu
			var container = mainNode.parentNode;
			container.insertBefore(menuIcon, mainNode);

			menuIcon.onclick = function() {
				var style = mainNode.style.display;
				if (style == "none") {
					mainNode.style.display = "block";
					S.addClass(container, "expanded");
				}
				else {
					mainNode.style.display = "none";
					S.removeClass(container, "expanded");
				}
			};

			return menuIcon;
		}

		function hideMenuIcon(){
			mainNode.style.display = "block";

			if(menuIcon) {
				menuIcon.style.display = "none";
			}
		}

		function hideSubmenus(node) {
			var nodes = S.getChildrenByTag(node, "li");
			S.each(nodes, function(child){
				// buscar los anidados
				S.each(child.childNodes, function(nested){
					// si tiene tagname es que no es texto
					if(nested.tagName && nested.tagName.toLowerCase() == "ul") {
						nested.style.display = "none";
					}
				});
			});
		}

		function setResponsiveIfNeeded(node) {
			if(overflowing(node)) {
				instance.setResponsive(true);
			}
			else {
				instance.setResponsive(false);
			}
		}


		var nodesWidth = 0;
		// el ancho total de los nodos para calcular si es responsivo
		function getNodesWidth(node) {
			if (nodesWidth > 0) {
				return nodesWidth;
			}			

			var nodes = S.getChildrenByTag(node, "li");
			for (var i = nodes.length - 1; i >= 0; i--) {
				nodesWidth += nodes[i].offsetWidth;
			}

			return nodesWidth;
		}

		// devuelve si se estan montando los elementos
		// del menu porque no caben.
		function overflowing(node) {
			return getNodesWidth(node) > mainContainer.offsetWidth;
		}

		this.init = function() {
			hideSubmenus(mainNode);
			attachEvents(mainNode);	
			setResponsiveIfNeeded(mainNode);	
		}
	    
	    S.attach(window.document.body, "click", instance.hideSubmenus);	
	    instance.init();
	};

})();
   






















