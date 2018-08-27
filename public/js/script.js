(function() {
    var app = new Vue({
        el: '.imageboard-wrap',
        data: {
            images: []
        },
        mounted: function() {
            axios.get('/images').then(function(res) {
                app.images = res.data;
            });
        }
    });
})();
