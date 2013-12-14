if (!window.XMLHttpRequest && 'ActiveXObject' in window) {
    window.XMLHttpRequest = function() {
        return new ActiveXObject('MSXML2.XMLHttp');
    };
}





window.onload = function() {





    if (routes) {

        var View = routes,
            flag = true,
            frame = document.getElementById(routes.view);
        View.update = function(hashValue, flag) {
            if (routes.method == 'ajax') {
                frame.innerHTML = "";
                var xhr = new XMLHttpRequest();
                xhr.open('GET', routes.exceptions[hashValue], true);
                xhr.onreadystatechange = function() {
                    if (this.readyState !== 4) return;
                    if (this.status !== 200) return; // or whatever error handling you want
                    frame.innerHTML = this.responseText;
                };
                xhr.send();

            } else {
                var temp = document.createElement("iframe");
                parent = frame.parentNode;
                temp.src = routes.exceptions[hashValue];
                temp.id = routes.view;
                parent.replaceChild(temp, frame);
                frame = temp;
            }
            if (flag) {
                View.setHash(hashValue);
            }

        };


        View.getHash = function() {
            return window.location.hash.substring(1);
        }


        View.setHash = function(str) {
            flag = false;
            window.location.hash = str;
        }


        window.onhashchange = function(e) {
            if (flag) {
                View.update(View.getHash(), false);
            } else {
                flag = true;
            }
        };


        var hashValue = View.getHash(),
            handles = document.querySelectorAll('.handle');

        for (var i = 0; i < handles.length; i++) {
            handles[i].addEventListener('click', evTrigger)


        }

        function evTrigger() {
            console.log(this)
            var link = this.getAttribute('data-link')
            View.update(link, true)
            return false;
        }



        if (hashValue == '') {
            View.update(routes.index.name, true);
        }else{
            View.update(View.getHash(), false);   
        }
    }
};