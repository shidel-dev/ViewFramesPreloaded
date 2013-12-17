var view = {
    create: function(routes) {
        view.routes = routes;
        var readyStateCheckInterval = setInterval(function() {
            if (document.readyState === "complete") {
                clearInterval(readyStateCheckInterval);
                var hashValue = view.getHash(),
                    handles = document.querySelectorAll('.handle'),
                    i,
                    flag = false;
                if (hashValue === '') {
                    view.update(routes.index.name, true);
                } else {
                    view.update(view.getHash(), false);
                }
                for (i = 0; i < handles.length; i += 1) {
                    handles[i].addEventListener('click', view.trigger);
                }

                window.onhashchange = function() {
                    if (flag) {
                        view.update(view.getHash(), false);
                    } else {
                        flag = true;
                    }
                };



            }
        }, 10);
    },

    update: function(hashValue, flag) {
        var temp = document.createElement("iframe"),
            frame = document.getElementById(view.routes.view),
            parent = frame.parentNode;
        temp.src = view.routes.exceptions[hashValue];
        temp.id = view.routes.view;

        parent.replaceChild(temp, frame);
        temp.contentWindow.onresize = function() {
            view.sizeFrame(view.routes.view);
            console.log('ok')
        };
        if (temp.contentWindow.readyState == "complete") {
            view.sizeFrame(view.routes.view);
        } else {
            temp.contentWindow.addEventListener("load", function() {
                setTimeout(view.sizeFrame(view.routes.view), 0);
            });
        }

        if (flag) {
            view.setHash(hashValue);
        }



    },

    trigger: function() {
        var link = this.getAttribute('data-link');
        view.update(link, true);
    },

    getHash: function() {
        return window.location.hash.substring(1);
    },

    setHash: function(str) {
        flag = false;
        window.location.hash = str;
    },

    sizeFrame: function(elem) {
        var el = document.getElementById(elem);
        el.height = (el.contentWindow.document.body.offsetHeight) + "px";
    }

};