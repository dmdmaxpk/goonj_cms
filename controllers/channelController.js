const axios = require('axios');
const config = require('../config/config');

exports.get = async (req, res) => {
	
	let resp = await axios.get(`${config.videoServiceUrl}/channel`);
	let list = resp.data;

	res.render('channel', {title: 'Channel', list});
}

exports.add = async (req, res) => {

	let postData = req.body;

	if (postData.valid == 'on') postData.valid = true;
	else postData.valid = false;

	console.log(postData);
	let resp = await axios.post(`${config.videoServiceUrl}/channel`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.redirect('/channel');
}


exports.update = async (req, res) => {

	let { _id } = req.query;
	let postData = req.body;
	console.log(postData);

	let resp = await axios.put(`${config.videoServiceUrl}/channel?_id=${_id}`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.send("Updated!");
}

exports.editable = async (req, res) => {

	const postData = req.body;
	console.log('aaaaaaa',postData);

	const { name, value, pk } = postData;
	console.log(name, value, pk);

	let resp = await axios.put(`${config.videoServiceUrl}/channel?_id=${pk}`, {[name]: value});
	resp = resp.data;
	console.log(resp);
	
	res.send("Updated!");
}

exports.delete = async (req, res) => {

	const { _id } = req.query;
	let resp = await axios.delete(`${config.videoServiceUrl}/channel?_id=${_id}`);
	res.send('Deleted!');
}

// API CALLS -----------------------------------
exports.html = async (req, res) => {

    let resp = await axios.get(`${config.videoServiceUrl}/channel`);
	resp = resp.data;
    // console.log(resp);
    
    let html = [];
    resp.forEach(el => html.push( {"text": el.name, "value": el.name} ));
    // console.log(catsHtml);
    res.send(html);
}

