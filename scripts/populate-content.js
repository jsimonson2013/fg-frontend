let promises = []

const populateContents = (page, local, userPosts, scores, comments, votes, loaded, user) => {
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

		const uniq = post.u

		const commentsPromise = fetch('https://fgapi.jacobsimonson.me/num-comments/?parent_id='+uniq, {method: 'GET'})
		.then(res => {return res.json()})
		.then(json => {
			const comms = {
				pid: uniq,
				num: json.length
			}
			comments.push(comms)
			loaded.push(uniq)
		})
		promises.push(commentsPromise)

		const votesPromise = fetch('https://fgapi.jacobsimonson.me/votes-by-user/?post_id='+uniq+'&user_id='+user, {method: 'GET'})
		.then(res => {return res.json()})
		.then(json => {
			const vote = {
				pid: uniq,
				num: json.length
			}
			votes.push(vote)
		})
		promises.push(votesPromise)
	}

	const postsPromise = fetch('https://fgapi.jacobsimonson.me/posts-by-user/?uid='+user, {method: 'GET'})
	.then(res => {return res.json()})
	.then(json => {
		userPosts.push(json)
	})
	promises.push(postsPromise)

	return Promise.all(promises).then(() => {app.ready = true})
}

