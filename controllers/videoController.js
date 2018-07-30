const axios = require('axios');
const formidable = require('formidable');


exports.getAllVideos = async (req, res) => {

	const { limit } = req.query;

	let { data: videoList } = await axios.get(`http://localhost:3000/video?limit=${limit || 50}`);
	res.render('./video/list', {title: 'Video', videoList});
}

exports.videoAddScreen = async (req, res) => {

	res.render('./video/add', {title: 'Add Video'});
}

exports.postVideo = async (req, res) => {
	
	let postData = req.body;
	postData.topics = postData.topics.split(',');
	postData.guests = postData.guests.split(',');
	console.log(postData);

	// Step 1: Post to MongoDB
	axios.post('http://localhost:3000/video', postData);
	// Step 2: Send to transcode from here or video service?
	
	res.send("Video Added!");
}

exports.view = async (req, res) => {

	const { _id } = req.params;
	console.log(_id);

	let resp = await axios.get(`http://localhost:3000/video?_id=${_id}`);
	let result = resp.data;
	// Getting filename without extension for player
	result.file_name_short = result.file_name.split('.')[0];
	console.log(result);

	res.render('./video/view', {title: 'View Video', video:result});
}

exports.editView = async (req, res) => {
	const { _id } = req.params;
	console.log(_id);

	let resp = await axios.get(`http://localhost:3000/video?_id=${_id}`);
	let result = resp.data;
	// console.log(result);

	// TODO: If empty then dont make the htmls
	// Making tuples for dropdown boxes:

	let topicsHtml = [];
	result.topics.forEach( el => topicsHtml.push( { "text": el, "value": el } ));

	let guestsHtml = [];
	result.guests.forEach( el => guestsHtml.push( { "text": el, "value": el} ));

	result.topics = result.topics.toString();
	result.topicsHtml = JSON.stringify(topicsHtml);

	result.guests = result.guests.toString();
	result.guestsHtml = JSON.stringify(guestsHtml);

	console.log(result);
	res.render('./video/edit', {title: 'Edit Video', video:result});
}

exports.editPost = async (req, res) => {

	const { _id } = req.params;
	console.log("Edit Post ID: ", _id);

	let postData = req.body;
	if (postData.topics) postData.topics.split(',');
	if (postData.guests) postData.guests.split(',');
	console.log(postData);

	// For updating the thumbs and filenames
	if (postData.file_name == '') postData.file_name = postData.old_file_name;
	if (postData.thumbnail == '') postData.thumbnail = postData.old_thumbnail;
	let { data: result } = await axios.put(`http://localhost:3000/video?_id=${_id}`, postData);
	console.log(result);

	// Send to Recommendation Service
	// if (postData.active = true) {
	// 	axios.post()
	// }
	res.send("Video Updated!");
}

exports.pinned = async (req, res) => {
	
	let respPinned = await axios.get(`http://localhost:3000/video?pinned=true`);
	let respAll = axios.get(`http://localhost:3000/video`);
	
	let [pinnedVideo, allVideos] = await Promise.all([respPinned, respAll]);

	console.log(pinnedVideo.data);
	let pinned = pinnedVideo.data;
	res.render('./video/pinned', {title: 'Pinned Videos', videoList: allVideos.data, pinned});
	
}
// TODO: Pending
exports.delete = async (req, res) => {

	const query = { _id: req.query._id };

	let resp = await axios.delete(`http://localhost:3000/video`);
	let videos = resp.data;
	
	if (result) {
		console.log(`Video _id: ${query._id} Deleted!`);
		res.send(`Video _id: ${query._id} Deleted!`);
	}
	else {
		console.log('No video with this ID found!');
		res.send('No video with this ID found!');
	}
}


exports.uploadVideoFile = async (req, res) => {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    console.log("parsing done");


    // store all uploads in the /uploads directory
    form.uploadDir = config.videodir; //path.join(__dirname, '/uploads');
    form.maxFileSize = 6000 * 1024 * 1024
    console.log(form.uploadDir);
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
		var filename = file.name;
        // var dateTime = new Date().getTime();
        // var timestamp = Math.floor(dateTime / 1000);
        // filename = filename.split('.')[0] + "_" + ts.split('.')[0] + "." + filename.split('.')[1];
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

};

exports.uploadThumbnail = async (req, res) => {
    console.log("THUMB!!");
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    console.log("parsing done");


    // store all uploads in the /uploads directory
    form.uploadDir = config.avatardir; //path.join(__dirname, '/uploads');
    // form.uploadDir = 'C:\\aaa'; //path.join(__dirname, '/uploads');
    form.maxFileSize = 20 * 1024 * 1024

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
		var filename = file.name;
		// console.log("finemame", filename);
		// console.log("filE", file);
        // var dateTime = new Date().getTime();
        // var timestamp = Math.floor(dateTime / 1000);
        // filename = filename.split('.')[0] + "_" + ts.split('.')[0] + "." + filename.split('.')[1];
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

};