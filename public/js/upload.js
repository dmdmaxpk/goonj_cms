$('#upload-input').on('click', function () {
    $('#progress-bar').text('0%');
    $('#progress-bar').width('0%');
});

$('#upload-input').on('change', function () {

    var files = $(this).get(0).files;
    console.log(files);

    var vid = document.createElement('video');
    var fileURL = URL.createObjectURL(this.files[0]);
    vid.src = fileURL;
    // wait for duration to change from NaN to the actual duration
    vid.ondurationchange = function () {
        // alert(this.duration);
        $('#duration').val(this.duration);
    };
    if (files.length > 0) {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // add the files to formData object for the data payload
            formData.append('uploads', file, file.name);
        }

        $.ajax({
            url: '/video/uploadvideofile',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('upload successful!\n' + data);
            },
            error: function (err) {
                console.log(err);
            },
            xhr: function () {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function (evt) {
                    console.log('uploading....');
                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        console.log(percentComplete);
                        // update the Bootstrap progress bar with the new percentage
                        $('#progress-bar').text(percentComplete + '%');
                        $('#progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('#progress-bar').html('Done');
                            $('#btnSubmit').removeAttr('disabled');
                            $('#btnSubmit').css("backgroundColor", '#F89406');
                        }

                    }

                }, false);

                return xhr;
            }
        });

    }
});


$('#upload-input2').on('click', function () {
    $('#progress-bar2').text('0%');
    $('#progress-bar2').width('0%');
});

$('#upload-input2').on('change', function () {

    var files = $(this).get(0).files;

    if (files.length > 0) {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // add the files to formData object for the data payload
            formData.append('uploads', file, file.name);
        }

        $.ajax({
            url: '/video/uploadThumbnail',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('upload successful!\n' + data);
            },
            xhr: function () {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function (evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('#progress-bar2').text(percentComplete + '%');
                        $('#progress-bar2').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('#progress-bar2').html('Done');
                            // $('#btnSubmit').removeAttr('disabled');
                            // $('#btnSubmit').css("backgroundColor",'#F89406');
                        }

                    }

                }, false);

                return xhr;
            }
        });

    }
});
