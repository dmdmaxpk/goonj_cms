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
	postData.topics 	= postData.topics.split(',').map( item => item.trim() );		// Spliting on , for Array and then trim spaces
	postData.guests 	= postData.guests.split(',').map( item => item.trim() );		// Spliting on , for Array and then trim spaces
	postData.thumbnail 	= postData.thumbnail.split('.')[0].replace(/ /g,"-") + '.webp';	// Replacing spaces with - and Adding webp extension
	postData.file_name 	= postData.file_name.replace(/ /g,"-");							// Replacing spaces with -
	console.log('Video Add: ', postData);

	// Post to Video Service
	axios.post(`${config.videoServiceUrl}/video`, postData);
	
	res.redirect('/video');
}

exports.view = async (req, res) => {

	const { _id } = req.params;
	console.log(`Video View: ${_id}`);

	let { data: result } = await axios.get(`${config.videoServiceUrl}/video?_id=${_id}`);

	// Getting filename without extension for player
	result.file_name_short = result.file_name.split('.')[0];
	result.slug = result.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s/g,'-');	// Making slug from title by lower case, replacing special characters and spaces with -
	console.log(result);

	res.render('./video/view', {title: 'View Video', video:result});
}

exports.editView = async (req, res) => {
	const { _id } = req.params;
	console.log(`Video Edit View: ${_id}`);

	let { data: result } = await axios.get(`${config.videoServiceUrl}/video?_id=${_id}`);

	// <<<Tuples for dropdown boxes
	let topicsHtml = [];
	let guestsHtml = [];

	// Checking if the Array is not empty
	if (result.topics[0] !== '')	result.topics.forEach( el => topicsHtml.push( { "text": el, "value": el } ));
	// Checking if the Array is not empty
	if (result.guests[0] !== '') 	result.guests.forEach( el => guestsHtml.push( { "text": el, "value": el } ));

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

	let postData = req.body;
	if (postData.topics) postData.topics = postData.topics.split(',').map( item => item.trim() );	// Spliting on , for Array and then trim spaces
	if (postData.guests) postData.guests = postData.guests.split(',').map( item => item.trim() );	// Spliting on , for Array and then trim spaces
	
	// For updating the thumbs and filenames
	if (postData.file_name == '') postData.file_name = postData.old_file_name;
	if (postData.thumbnail == '') postData.thumbnail = postData.old_thumbnail;
	
	if (postData.thumbnail) postData.thumbnail = postData.thumbnail.split('.')[0].replace(/ /g,"-") + '.webp';	// Replacing spaces with - and Adding webp extension
	if (postData.file_name) postData.file_name 	= postData.file_name.replace(/ /g,"-");							// Replacing spaces with -

	console.log("Video Edit Post:", postData);

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

	// Posting to transcoding service for re-transcode:
	axios.post(`${config.transcodeServiceUrl}/transcode`, result)
	.then( response => console.log(response.data) )
	.catch( error => console.log(error) );

	// Setting transcoding status to false
	axios.put(`${config.videoServiceUrl}/video?_id=${result._id}`, {transcoding_status: false});
	
	res.send('Re-transcoding Started!');
}

exports.transcodeStatus = async (req, res) => {
	let { _id } = req.query;

	let { data } = await axios.get(`${config.transcodeServiceUrl}/transcode/status?_id=${_id}`);
	console.log(`Transcode Progress: ${data}%`);
	res.send(`${data} %`);
}

exports.uploadVideoFile = async (req, res) => {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    console.log("Uploading Video..");

    form.uploadDir = config.video_dir; 		// Setting upload dir for video files
    form.maxFileSize = 6000 * 1024 * 1024;	// 6GB
	
    // when the file uploads it sets a random temp name e.g upload_3083a46a8d6a94b4db5fbb49140db2b8, rename it to the orignal file name
    form.on('file', function (field, file) {
		fs.renameSync(file.path, path.join(form.uploadDir, file.name.replace(/ /g,"-") ));
    });

    // log errors
    form.on('error', err => { console.log('An error has occured: \n' + err) });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => { res.end('success') });

    // parse the incoming request containing the form data
    form.parse(req);

};

exports.uploadThumbnail = async (req, res) => {
	
    // create an incoming form object
    let form = new formidable.IncomingForm();

    console.log("Uploading Thumb..");

    form.uploadDir = config.thumb_dir;		// Setting upload dir for video files
    form.maxFileSize = 20 * 1024 * 1024;	// 20MB size limit

    // rename thumbnail to its orignal name
    form.on('file', function (field, file) {
		let short_thumbnail = file.name.split('.')[0].replace(/ /g,"-");	// Without extension

		// Converting temp file into webp and moving it in /compressed folder
		webp.cwebp(`${file.path}`,`${form.uploadDir}/compressed/${short_thumbnail}.webp`,"-q 60", status => {
			fs.unlinkSync(file.path);	// Deleting the temp file. e.g: upload_3083a46a8d6a94b4db5fbb49140db2b8
		});
    });

    // log errors
    form.on('error', err => { console.log('An error has occured: \n' + err) });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => { res.end('success') });

    // parse the incoming request containing the form data
    form.parse(req);

};