const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const webp=require('webp-converter');
const config = require('../config/config');

exports.getAllVideos = async (req, res) => {

	const { limit } = req.query;

	let { data: videoList } = await axios.get(`${config.videoServiceUrl}/video?limit=${limit || 50}`);
	res.render('./video/list', {title: 'Video', videoList});
}

exports.videoAddScreen = async (req, res) => {

	res.render('./video/add', {title: 'Add Video'});
}

exports.postVideo = async (req, res) => {
	
	let postData = req.body;
	postData.topics = postData.topics.split(',');
	postData.guests = postData.guests.split(',');
	postData.thumbnail = postData.thumbnail.split('.')[0] + '.webp';	// Adding webp extension
	console.log(postData);

	// Post to Video Service
	axios.post(`${config.videoServiceUrl}/video`, postData);
	
	res.redirect('/video');
}

exports.view = async (req, res) => {

	const { _id } = req.params;
	console.log(`Video view: ${_id}`);

	let { data: result } = await axios.get(`${config.videoServiceUrl}/video?_id=${_id}`);

	// Getting filename without extension for player
	result.file_name_short = result.file_name.split('.')[0];
	result.slug = result.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s/g,'-');	// Making slug from title by lower case, replacing special characters and spaces with -
	console.log(result);

	res.render('./video/view', {title: 'View Video', video:result});
}

exports.editView = async (req, res) => {
	const { _id } = req.params;
	console.log(_id);

	let { data: result } = await axios.get(`${config.videoServiceUrl}/video?_id=${_id}`);

	// <<<Tuples for dropdown boxes
	let topicsHtml = [];
	let guestsHtml = [];

	// Checking if the Array is not empty
	if (result.topics[0] !== '')	result.topics.forEach( el => topicsHtml.push( { "text": el, "value": el } ));
	// Checking if the Array is not empty
	if (result.guests[0]) result.guests.forEach( el => guestsHtml.push( { "text": el, "value": el} ));

	result.topics = result.topics.toString();
	result.topicsHtml = JSON.stringify(topicsHtml);

	result.guests = result.guests.toString();
	result.guestsHtml = JSON.stringify(guestsHtml);
	// Tuples for dropdown boxes>>>

	console.log(result);
	res.render('./video/edit', {title: 'Edit Video', video:result});
}

exports.editPost = async (req, res) => {

	const { _id } = req.params;
	console.log("Edit Post ID: ", _id);

	let postData = req.body;
	if (postData.topics) postData.topics = postData.topics.split(',');
	if (postData.guests) postData.guests = postData.guests.split(',');
	
	// For updating the thumbs and filenames
	if (postData.file_name == '') postData.file_name = postData.old_file_name;
	if (postData.thumbnail == '') postData.thumbnail = postData.old_thumbnail;
	
	postData.thumbnail = postData.thumbnail.split('.')[0] + '.webp';	// Adding webp extension
	
	console.log("EDIT POST DATA:", postData);

	let { data: result } = await axios.put(`${config.videoServiceUrl}/video?_id=${_id}`, postData);
	console.log(result);

	// Send to Recommendation Service
	// if (postData.active = true) {
	// 	axios.post()
	// }
	res.redirect('/video');
}

exports.pinned = async (req, res) => {
	
	let respPinned = await axios.get(`${config.videoServiceUrl}/video?pinned=true`);
	let respAll = axios.get(`${config.videoServiceUrl}/video`);
	
	let [pinnedVideo, allVideos] = await Promise.all([respPinned, respAll]);

	console.log(pinnedVideo.data);
	let pinned = pinnedVideo.data;
	res.render('./video/pinned', {title: 'Pinned Videos', videoList: allVideos.data, pinned});
}

exports.delete = async (req, res) => {

	const { _id } = req.query;

	let { data: result } = await axios.delete(`${config.videoServiceUrl}/video?_id=${_id}`);
	
	console.log(result);
	res.send(result);
}

exports.retranscode = async (req, res) => {
	
	let result = req.body;

	// Adding operator name for transcoding service:
	result.operator = 'telenor';

	console.log(`Retranscode for video started: ${result._id}`);

	// Posting to transcoding service:
	axios.post(config.transcodeServiceUrl, result)
	.then( response => console.log(response.data) )
	.catch( error => console.log(error) );
	
	res.send('Re-transcoding Started!');
}

exports.uploadVideoFile = async (req, res) => {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    console.log("Uploading Video..");

	// store all uploads in the /uploads directory
	console.log(config.video_dir);
    form.uploadDir = config.video_dir; //path.join(__dirname, '/uploads');
    form.maxFileSize = 6000 * 1024 * 1024;	// 6GB
	
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
		var filename = file.name;
        // var dateTime = new Date().getTime();
        // var timestamp = Math.floor(dateTime / 1000);
		// filename = filename.split('.')[0] + "_" + ts.split('.')[0] + "." + filename.split('.')[1];
		fs.renameSync(file.path, path.join(form.uploadDir, file.name));
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
	
    // create an incoming form object
    let form = new formidable.IncomingForm();

    console.log("Uploading Thumb..");

    form.uploadDir = config.thumb_dir;
    form.maxFileSize = 20 * 1024 * 1024;	// 20MB

    // rename thumbnail to its orignal name
    form.on('file', function (field, file) {
		let short_thumbnail = file.name.split('.')[0];	// Without extension

		// Converting temp file into webp and moving it in /compressed folder
		webp.cwebp(`${file.path}`,`${form.uploadDir}/compressed/${short_thumbnail}.webp`,"-q 60", status => {
			fs.unlinkSync(file.path);	// Deleting the temp file. e.g: upload_3083a46a8d6a94b4db5fbb49140db2b8
		});
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function (name, value) {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

};