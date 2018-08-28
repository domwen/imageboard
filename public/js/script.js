(function() {
    var app = new Vue({
        el: '#main',
        data: {
            images: [],
            form: {
                title: '',
                username: '',
                description: ''
            }
        },
        mounted: function() {
            axios.get('/images').then(function(res) {
                app.images = res.data;
            });
        },
        methods: {
            uploadFile: function(e) {
                //"e" stands for event handler and refers here to the v-on:click in the html
                e.preventDefault(); // prevent default behaviour of form field ,i.e. page reload
                var file = $('input[type="file"]').get(0).files[0]; //takes care of taking the file
                console.log('file that was uploaded', file);

                // FormData is used when dealing with files
                var formData = new FormData();
                formData.append('file', file);
                formData.append('title', this.form.title); // we need this to refer to the whole data object
                formData.append('description', this.form.description);
                formData.append('username', this.form.username);
                console.log('formData ', formData);

                axios.post('/upload', formData).then(function(resp) {
                    console.log('resp in POST / upload', resp);
                });
            }
        }
    }); // close vue
})(); //close iife
