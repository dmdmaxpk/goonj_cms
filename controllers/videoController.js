const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const webp = require('webp-converter');
const config = require('../config/config');

// Main Video Homepage
exports.getAllVideos = async (req, res) => {
	const { limit } = req.query;

	try {
		let { data } = await axios.get(`${config.videoServiceUrl}/video?limit=${limit || 50}`);
		console.log("data recived from video service",data);
		res.render('./video/list', {title: 'Video', data});
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// Video Add Page
exports.videoAddScreen = async (req, res) => {

	res.render('./video/add', {title: 'Add Video'});
}

// POST function
exports.postVideo = async (req, res) => {
	
	let postData = req.body;
	postData.title		= postData.title.trim();
	postData.topics 	= postData.topics.split(',').map( item => item.trim() );			// Spliting on , for Array and then trim spaces
	postData.is_premium	= postData.is_premium;
	postData.is_mta_only	= postData.is_mta_only;
	// postData.guests 	= postData.guests.split(',').map( item => item.trim() );			// Spliting on , for Array and then trim spaces (REMOVED)
	postData.thumbnail 	= postData.thumbnail.split('.')[0].replace(/ /g,"-") + '.webp';		// Replacing spaces with - and Adding webp extension
	postData.file_name 	= postData.file_name.replace(/ /g,"-");								// Replacing spaces with -
	console.log('Video Add: ', postData);

	try {
		// POST: Video Service
		axios.post(`${config.videoServiceUrl}/video`, postData);
		res.redirect('/video');
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// View page for video
exports.view = async (req, res) => {

	const { _id } = req.params;
	console.log(`Video View: ${_id}`);

	try {
		let { data } = await axios.get(`${config.videoServiceUrl}/video?_id=${_id}`);

		// Getting filename without extension for player
		data.file_name_short = data.file_name.split('.')[0];
		data.slug = data.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s/g,'-');	// Making slug from title by lower case, replacing special characters and spaces with - (Used for Website)
		console.log(data);

		res.render('./video/view', {title: 'View Video', video: data});
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// EDIT GET PAGE
exports.editView = async (req, res) => {

	const { _id } = req.params;
	console.log(`Video Edit View: ${_id}`);

	try {
		let { data } = await axios.get(`${config.videoServiceUrl}/video?_id=${_id}`);

		// <<<Tuples for dropdown boxes
		let topicsHtml = [];
		// let guestsHtml = [];

		// Checking if the Array is not empty
		if (data.topics[0] !== '')	data.topics.forEach( el => topicsHtml.push( { "text": el, "value": el } ));
		// Checking if the Array is not empty (REMOVED)
		// if (data.guests[0] !== '') 	data.guests.forEach( el => guestsHtml.push( { "text": el, "value": el } ));

		data.topics = data.topics.toString();
		data.topicsHtml = JSON.stringify(topicsHtml);

		// GUESTS REMOVED
		// data.guests = data.guests.toString();
		// data.guestsHtml = JSON.stringify(guestsHtml);
		// Tuples for dropdown boxes>>>

		console.log(data);
		res.render('./video/edit', {title: 'Edit Video', video: data});
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// EDIT POST PAGE
exports.editPost = async (req, res) => {

	const { _id } = req.params;

	let postData = req.body;
	console.log(postData)
	if (postData.topics) postData.topics = postData.topics.split(',').map( item => item.trim() );	// Spliting on , for Array and then trim spaces
	if (postData.is_premium) postData.is_premium = postData.is_premium;
	// if (postData.guests) postData.guests = postData.guests.split(',').map( item => item.trim() );	// Spliting on , for Array and then trim spaces (REMOVED)
	
	// For updating the thumbs and filenames
	if (postData.file_name == '') postData.file_name = postData.old_file_name;
	if (postData.thumbnail == '') postData.thumbnail = postData.old_thumbnail;
	
	if (postData.thumbnail) postData.thumbnail = postData.thumbnail.split('.')[0].replace(/ /g,"-") + '.webp';	// Replacing spaces with - and adding webp extension
	if (postData.file_name) postData.file_name 	= postData.file_name.replace(/ /g,"-");							// Replacing spaces with -

	console.log("Video Edit Post:", postData);

	try {
		// PUT: Video Service
		let { data } = await axios.put(`${config.videoServiceUrl}/video?_id=${_id}`, postData);
		console.log(data);
		res.redirect('/video');
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

exports.pinned = async (req, res) => {
	
	try {
		let {data: pinned} = await axios.get(`${config.videoServiceUrl}/video?pinned=true`);
		let {data: videoList} = await axios.get(`${config.videoServiceUrl}/video?limit=500`);

		res.render('./video/pinned', {title: 'Pinned Videos', videoList, pinned});
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

exports.delete = async (req, res) => {

	const { _id } = req.query;

	try {
		let { data } = await axios.delete(`${config.videoServiceUrl}/video?_id=${_id}`);
		console.log(data);
		res.send(data);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

exports.retranscode = async (req, res) => {
	
	let result = req.body;

	// Adding operator name for transcoding service:
	result.operator = 'telenor';

	console.log(`Retranscode for video started: ${result._id}`);

	// Posting to transcoding service for re-transcode:
	axios.post(`${config.transcodeServiceUrl}/transcode`, result)
		.then( response => console.log(response.data) )
		.catch( error => console.log(error.code) );

	// Setting transcoding status to false
	axios.put(`${config.videoServiceUrl}/video?_id=${result._id}`, { transcoding_status: false })
		.catch( error => console.log(error.code) );
	
	res.send('Re-transcoding Started!');
}

exports.transcodeStatus = async (req, res) => {

	let { _id } = req.query;

	try {
		let { data } = await axios.get(`${config.transcodeServiceUrl}/transcode/status?_id=${_id}`);
		console.log(`Transcode Progress: ${data}%`);
		res.send(`${data} %`);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

exports.uploadVideoFile = async (req, res) => {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    console.log("Uploading Video..");

    form.uploadDir = config.video_dir; 		// Setting upload dir for video files
    form.maxFileSize = 6000 * 1024 * 1024;	// 6GB
	
    // when the file uploads it sets a random temp name e.g upload_3083a46a8d6a94b4db5fbb49140db2b8, rename it to the orignal file name
    form.on('file', (field, file) => {
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

// For fastSelect HTML, which is used on video page
exports.searchVideos = async (req, res) => {
	try {
		const {query} = req.query;
		let vidsHtml = [];
		// GET: Video Service
		try{
			let {data} = await axios.get(`${config.apiBaseUrl}/search?term=${query ? query : ''}&limit=30&skip=0`);
			data.forEach(el => vidsHtml.push( {"text": el.title, "value": el._id} ));	// Creating key-value structure for fastselect dropdown
			res.send(vidsHtml);
		} catch (error) {
			console.log('error fetching search videos', error);
		}
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}

// For fastSelect HTML, which is used on video page
}

exports.linkVideos = async (req, res) => {
	try {
		const {query} = req.query;
		let vidsHtml = [];
		// GET: Video Service
		try{
			let {data} = await axios.get(`${config.apiBaseUrl}/search?term=${query ? query : ''}&limit=30&skip=0`);
			data.forEach(el => vidsHtml.push( {"text": el.title, "value": el._id} ));	// Creating key-value structure for fastselect dropdown
			res.send(vidsHtml);
		} catch (error) {
			console.log('error fetching search videos', error);
		}
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

exports.linkVideosScreen = async (req, res) => {
	try{
		let {data} = await axios.get(`${config.videoServiceUrl}/video?sub_category=${req.query.drama}&episode=false&sortOrder=asc`);
		let videos = await axios.get(`${config.videoServiceUrl}/video/episodes?sub_category=${req.query.drama}`);
		console.log('warning [VIDEOS]', videos)
		res.render('./video/linkVideos', {title: 'Link Dramas', data, episodes: videos.data, drama: {text: req.query.drama, value: req.query.drama}});
	} catch (err) {
		console.log(err);
		res.send(err);
	}
}