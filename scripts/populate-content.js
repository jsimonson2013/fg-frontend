let promises = []

const populateContents = (page, local, scores, comments, votes, loaded, user) => {
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
			loaded.push(id)
		})
		promises.push(commentsPromise)

		const votesPromise = fetch('https://fgapi.jacobsimonson.me/votes-by-user/?post_id='+id+'&user_id='+user, {method: 'GET'})
		.then(res => {return res.json()})
		.then(json => {
			const vote = {
				pid: id,
				num: json.length
			}
			votes.push(vote)
		})
		promises.push(votesPromise)
	}

	return Promise.all(promises).then(() => {app.ready = true})
}

