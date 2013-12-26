var view = {

    create: function(setup) {
        view.setup = setup;
		view.buffered = false;
        view.preHash = "main";
        var readyStateCheckInterval = setInterval(function() {
            if (document.readyState === "complete") {
                clearInterval(readyStateCheckInterval);
                var hashValue = view.getHash(),
                    handles = document.querySelectorAll('.handle'),
                    i;
                view.flag = false;
                if (hashValue === '') {
                    view.update(setup.index.name, true);
                } else {
                    view.update(view.getHash(), false);
                }
                for (i = 0; i < handles.length; i += 1) {
                    if (handles[i].addEventListener) {
                        handles[i].addEventListener('click', view.trigger)
                    } else if (handles[i].attachEvent) {
                        handles[i].attachEvent('onclick', view.trigger);
                    }
                }

                window.onhashchange = function() {
                    if (view.flag) {
                        view.update(view.getHash(), false);
                    } else {
                        view.flag = true;
                    }
                };
				
				//Wait until the main frame is finished loading before loading sub-pages.
				document.getElementById(routes.view).onload = function() {
					view.buffered = true;
        			for (var i = 0; i < handles.length; i++){						
						var mainFrame = document.getElementById(routes.view),
							frame = mainFrame.cloneNode(true),
							hash = handles[i].getAttribute('data-link');
							
						frame.id = hash;
						frame.class = "hiddenFrame"
						frame.src = routes.exceptions[hash];
						frame.style.display = "none";
						frame.style.width = "100%" //Temporary solution!
						frame.style.height = "100vh"; //Temporary solution! 
						document.body.appendChild(frame);					
					}    
    			};
				
            }
        }, 10);
    },

    update: function(hashValue, bool) {
		
		if (!flag && view.buffered) return;
		
		//If frames should be pre-buffered, and the Iframe is loaded.
    	if (view.routes.buffer && view.buffered && flag){
    		if (typeof(hashValue) != 'undefined' && hashValue != null){
    			console.log("Hashed Url: " + view.routes.exceptions[hashValue]);
				var newFrame = document.getElementById(hashValue);
				console.log(view.routes.view);
				document.getElementById(view.routes.view).style.display = "none";
				document.getElementById(view.routes.view).id = view.preHash;								
				view.preHash = hashValue;
				newFrame.style.display = "block";
				newFrame.id = view.routes.view;
				view.setHash(hashValue);
				return;    		
    		}
    	}
		
	
        var temp = document.createElement("IFRAME"),
            frame = document.getElementById(view.setup.view),
            parent = frame.parentNode;
        if (view.setup.exceptions[hashValue]) {
            temp.src = view.setup.exceptions[hashValue];
        } else {
            temp.src = view.setup.path + '/' + hashValue + '.html' || view.setup.index.location
        }
        var src = temp.src;
        temp.id = view.setup.view;

        temp.frameBorder = "no";



        parent.replaceChild(temp, frame);

        if (view.setup["autoSize"] == true) {
            temp.contentWindow.addEventListener('resize', function(event) {
                view.sizeFrame(view.setup.view);
            });
        }

        if (temp.addEventListener) {
            temp.addEventListener("load", function() {
                view.sizeFrame(view.setup.view);
                var cur_url = temp.contentWindow.location.href;
                if (cur_url != src) {
                    view.flag = false;
                    view.setHash(cur_url.match(/([^\/]+)(?=\.\w+$)/)[0]);
                }

            }, false);
        } else if (temp.attachEvent) {
            temp.attachEvent("onload", function() {
                view.sizeFrame(view.setup.view)
                var cur_url = temp.contentWindow.location.href;
                if (cur_url!= src) {
                    view.flag = false;
                    view.setHash(cur_url.match(/([^\/]+)(?=\.\w+$)/)[0]);
                }
            });
        }



        if (bool) {
            view.setHash(hashValue);
        }
    },

    trigger: function(event) {
        if (!event) {
            event = window.event;
        }

        var caller = event.target || event.srcElement,
            link = caller.getAttribute('data-link');

        view.update(link, true);
    },

    getHash: function() {
        return window.location.hash.substring(1);
    },

    setHash: function(str) {
        view.flag = false;
        window.location.hash = str;
    },

    sizeFrame: function(elem) {

        var el = document.getElementById(elem);
        el.height = (el.contentWindow.document.body.scrollHeight) + "px";
    }
};