const https = require('https')
const readline = require('readline'), rl = readline.createInterface(process.stdin, process.stdout);

rl.question('', (arg) => {
	
	rl.close()

	var urlBase = 'https://api.blockcypher.com/v1/btc/main/addrs/'
	var url = urlBase.concat(arg, '/full')

	https.get(url, (resp) => {
		content = ''

		resp.on('data', (chunk) => {
			content += chunk;
		});

	  	resp.on('end', () => {
			array = []
			
			if (resp.statusCode == 200) {
				result = JSON.parse(content)
				if (!result['txs']) {
					console.log('[]')
				} else {
						for (output of result['txs'][0]['outputs']) {
							if (output.addresses[0] !== arg ) {
								let data = []
								data.push(output['addresses'][0])
								data.push(output['value'])
								array.push(data)
							}
					}
					array.sort((a, b) => a[1] < b[1])
					array.splice(10)
					console.log(JSON.stringify(array))
				}
			} else {
				console.log('[]')
			}
	  	});

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	})
})