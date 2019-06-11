const axios = require('axios');
const config = require('../config/config');

// Main homepage
exports.get = async (req, res) => {
	
	try {
		// GET: Video Service
		let {data} = await axios.get(`${config.videoServiceUrl}/channel`);
		res.render('channel', {title: 'Channel', data});	// Rendering the channel view
	} 
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// POST function
exports.post = async (req, res) => {

	let postData = req.body;

	if (postData.active == 'on') postData.active = true;
	else postData.active = false;

	console.log(postData);
	
	try {
		// POST: Video Service
		let {data} = await axios.post(`${config.videoServiceUrl}/channel`, postData);
		console.log(data);
		res.redirect('/channel');	// Redirecting to main page
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// PUT function
exports.put = async (req, res) => {

	let { _id } = req.query;
	let postData = req.body;
	console.log(postData);

	try {
		// PUT: Video Service
		let {data} = await axios.put(`${config.videoServiceUrl}/channel?_id=${_id}`, postData);
		console.log(data);
		res.send(data);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// In-line edit
exports.editable = async (req, res) => {

	const postData = req.body;
	console.log(postData);

	const { name, value, pk } = postData;

	try {
		// PUT: Video Service
		let {data} = await axios.put(`${config.videoServiceUrl}/channel?_id=${pk}`, {[name]: value});
		console.log(data);
		res.send('Updated!');
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// DELETE function
exports.delete = async (req, res) => {

	const { _id } = req.query;

	try {
		// DELETE: Video Service
		let {data} = await axios.delete(`${config.videoServiceUrl}/channel?_id=${_id}`);
		res.send(data);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

// For fastSelect HTML, which is used on video page
exports.html = async (req, res) => {

	try {
		let html = [];
		// GET: Video Service
		let {data} = await axios.get(`${config.videoServiceUrl}/channel`);

		data.forEach(el => html.push( {"text": el.name, "value": el.name} ));	// Creating key-value structure for fastselect dropdown
		res.send(html);
	}
	catch (err) {
		console.error(err.code);
		res.send(err.code);
	}
}

