(function() {
    Vue.component('image-modal', {
        props: ['id'],
        template: '#image-modal',
        data: function() {
            return {
                info: []
            };
        },

        mounted: function() {
            var app = this;
            console.log('this id:', this.id);
            axios.get('/images/' + this.id).then(response => {
                console.log('response.data[0] :', response.data[0]);
                app.info = response.data[0];
                console.log('info.url :', app.info.url);
                if (app.info.description == null) {
                    app.info.description = 'No description available';
                }
            });
        },

        methods: {
            closePopup: function() {
                this.$emit('close');
            }
        } // end of methods
    }); // end of component

    var app = new Vue({
        el: '#main',
        data: {
            images: [],
            id: '',
            show: '',
            form: {
                title: '',
                username: '',
                description: ''
            }
        },
        mounted: function() {
            axios.get('/images/').then(function(results) {
                app.images = results.data;
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

                axios.post('/upload', formData).then(function(res) {
                    console.log('resp in POST / upload', res);
                    app.images.unshift(res.data.image);
                    console.log(
                        'res data image after image upload :',
                        res.data.image
                    );
                });
            }, // end of uploadFile

            hide: function() {
                if (this.show === true) {
                    this.show = false;
                }
            },
            setCurrentImage: function(image_id) {
                this.id = image_id;
                this.show = true; // WHAT DOES THIS MEAN?
                console.log('Our Id is here: ', image_id);
                console.log('this.show :', this.show);
            }
        }
    }); // close vue
})(); //close iife
