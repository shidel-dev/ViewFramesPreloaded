var view = {
    create: function(setup) {
        view.setup = setup;
        var readyStateCheckInterval = setInterval(function() {
            if (document.readyState === "complete") {
                clearInterval(readyStateCheckInterval);
                var hashValue = view.getHash(),
                    handles = document.querySelectorAll('.handle'),
                    i,
                    flag = false;
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
            frame = document.getElementById(view.setup.view),
            parent = frame.parentNode;
        if (view.setup.exceptions[hashValue]) {
            temp.src = view.setup.exceptions[hashValue];
        } else {
            temp.src = view.setup.path + '/' + hashValue + '.html' || view.setup.index.location
        }
        temp.id = view.setup.view;

        parent.replaceChild(temp, frame);

        if (view.setup.autoSize == true) {
            temp.contentWindow.onresize = function() {
                view.sizeFrame(view.setup.view);
            };
            if (temp.contentWindow.readyState == "complete") {
                view.sizeFrame(view.setup.view);
            } else {
                if (temp.addEventListener) {
                    temp.contentWindow.addEventListener("load", function() {
                        setTimeout(view.sizeFrame(view.setup.view), 0);
                    });
                } else if (temp.attachEvent) {
                    temp.contentWindow.attachEvent("onload", function() {
                        view.sizeFrame(view.setup.view)
                    });
                }

            }
        }
        if (flag) {
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
        flag = false;
        window.location.hash = str;
    },

    sizeFrame: function(elem) {
        var el = document.getElementById(elem);
        el.height = (el.contentWindow.document.body.scrollHeight) + "px";
    }

};