const axios = require('axios');
const config = require('../config/config');

exports.get = async (req, res) => {
	
	let resp = await axios.get(`${config.videoServiceUrl}/feed`);
	let list = resp.data;

	res.render('./tags/list', {title: 'Video', list});
}

exports.post = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	let resp = await axios.post(`${config.videoServiceUrl}/tag`, postData);
	resp = resp.data;
	console.log(resp);
	
	res.redirect('/tag');
}



exports.delete = async (req, res) => {

	const { _id } = req.query;
	let resp = await axios.delete(`${config.videoServiceUrl}/tag?_id=${_id}`);
	res.send('Deleted!');
}

// API CALLS -----------------------------------
exports.html = async (req, res) => {

    // let resp = await axios.get(`${config.videoServiceUrl}/tag`);
	// resp = resp.data;
	// console.log(resp);
	
	let resp = [
		{name: 'home'},
		{name: 'cricket'},
		{name: 'comedy'}
	]
    
    let html = [];
    resp.forEach(el => html.push( {"text": el.name, "value": el.name} ));
    // console.log(catsHtml);
    res.send(html);
}

