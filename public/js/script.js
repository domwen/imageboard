(function() {
    Vue.component('image-modal', {
        props: ['id'],
        template: '#image-modal',
        data: function() {
            return {
                info: [],
                comments: [],
                commentTimestamp: '',
                form: {
                    comment: '',
                    username: ''
                }
            };
        },

        mounted: function() {
            var app = this;
            console.log('this id:', this.id);
            axios.get('/images/' + this.id).then(response => {
                console.log(
                    'Response from GET images/imageid',
                    response.data[0]
                );
                app.info = response.data.imageInfo[0];
                app.comments = response.data.comments.concat(response.data);
                console.log('AXIOS GET IMAGES/IMAGEID app.info :', app.info);
                console.log(
                    'AXIOS GET IMAGES/IMAGEID app.comments :',
                    app.comments
                );
                if (app.info.description == null) {
                    app.info.description = 'No description available';
                }
            });
        },

        methods: {
            closePopup: function() {
                this.$emit('close');
            },

            addComments: function(event) {
                event.preventDefault();
                var app = this; // Why do I have to do this here?
                var commentInfo = {
                    image_id: this.id,
                    comment: this.form.comment,
                    username: this.form.username
                };
                console.log('Insider addComments: ', commentInfo);

                axios.post('/comments/' + this.id, commentInfo).then(res => {
                    console.log('resp in POST / upload: ', res.data[0]);
                    app.comments.unshift(res.data[0]);
                    app.form.comment = '';
                });
            }
        } // end of methods
    }); // end of component

    // VUE INSTANCE STARTS HERE //

    var app = new Vue({
        el: '#main',
        data: {
            images: [],
            id: '',
            show: '',
            noMorePics: false,
            form: {
                title: '',
                username: '',
                description: ''
            },
            filename: ''
        },
        mounted: function() {
            axios.get('/images/').then(function(results) {
                app.images = results.data;
                console.log('app.images :', app.images);
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

                app.form.title = '';
                app.form.description = '';
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
            },

            loadMore: function() {
                if (this.noMorePics) {
                    return;
                }
                var app = this;
                var idOfLastImg = this.images[this.images.length - 1].id;

                axios.get('/getMoreImages/' + idOfLastImg).then(res => {
                    if (res.data.length < 12) {
                        app.noMorePics = true;
                    }
                    console.log('res: ', res);
                    app.images = app.images.concat(res.data);
                });
            }
        }
    }); // close vue
})(); //close iife
