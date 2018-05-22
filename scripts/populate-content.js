let promises = []

const populateContents = (page, local, scores, comments) => {
	for (post of local) {
		const first = post.author.split(' ')[0]
		const last = post.author.split(' ')[1]

		const scorePromise = fetch('https://fgapi.jacobsimonson.me/score/?first='+first+'&last='+last, {method: 'GET'})
		.then(res => {return res.json()})
		.then(json => {
			const scr = {
				author: `${first} ${last}`,
				score: json.score
			}
			scores.push(scr)
		})
		promises.push(scorePromise)

		if (page != 'feed') continue

		const id = post.post_id

		const commentsPromise = fetch('https://fgapi.jacobsimonson.me/num-comments/?parent_id='+id, {method: 'GET'})
		.then(res => {return res.json()})
		.then(json => {
			const comms = {
				pid: id,
				num: json.length
			}
			comments.push(comms)
		})
		promises.push(commentsPromise)
	}
	Promise.all(promises).then(() => {app.ready = true})
}

