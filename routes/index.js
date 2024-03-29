
/*
 * GET home page.
 */

exports.index = function(req, res) {
	var http = require('http');
	var Client = require('node-rest-client').Client;
	var client = new Client();

	// direct way
	client.get("http://deepika-grails-gumball-v2.cfapps.io/gumballs.json", function(data,
			response) {

		var ar = {};

		ar = data;
		console.log(typeof ar);
		console.log(ar[0].id);

		var messagesToBePut = [];

		messagesToBePut.push(ar[0].modelNumber);
		messagesToBePut.push(ar[0].serialNumber);
		messagesToBePut.push("NoCoinState");
		messagesToBePut.push(ar[0].countGumballs);

		res.render('index', {
			message : messagesToBePut
		});

	});

};

exports.GumballAction = function(req, res) {

	var event = req.param('event');
	var state = req.param('state');
	var count = req.param('count');
	var modelNumber = req.param('modelNumber');
	var serialNumber = req.param('serialNumber');

	// var message=req.param('message');
	if (event === 'InsertQuater' && state === 'NoCoinState') {

		state = 'HasACoin';
		var messagesToBePut = [];

		messagesToBePut.push(modelNumber);
		messagesToBePut.push(serialNumber);
		messagesToBePut.push(state);
		messagesToBePut.push(count);
		res.render('index', {
			message : messagesToBePut
		});

	}
	
	//COde for turn the crank,only if the state is HasACoin
	if (event === 'TurnTheCrank' && state === 'HasACoin') {
		var messagesToBePutInPost = [];
		var Client = require('node-rest-client').Client;
		var client = new Client();
		client.get("http://deepika-grails-gumball-v2.cfapps.io/gumballs.json", function(data,
				response) {
			var ar = {};

			ar = data;

			var count = ar[0].countGumballs;

			if (count !== 0) {
				count = count - 1;
				var args = {
					data : {
						countGumballs : count
					},
					headers : {
						"Content-Type" : "application/json"
					}
				};
				client.put("http://deepika-grails-gumball-v2.cfapps.io/gumballs/1", args,
						function(data, response) {
							// parsed response body as js object
							console.log(data);
							// raw response
							console.log(response);
							var messageToBePut = [];
							messagesToBePutInPost.push(modelNumber);
							messagesToBePutInPost.push(serialNumber);
							messagesToBePutInPost.push("NoCoinState");
							messagesToBePutInPost.push(count);
							res.render('index', {
								message : messagesToBePutInPost
							});
						});

			}else{
				
				var messageToBePut = [];
				messagesToBePutInPost.push(modelNumber);
				messagesToBePutInPost.push(serialNumber);
				messagesToBePutInPost.push("OutOfStock");
				messagesToBePutInPost.push(0);
				res.render('index', {
					message : messagesToBePutInPost
				});
			}

		});

	}

};