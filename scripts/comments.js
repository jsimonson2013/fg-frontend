let comments = []
let promises = []
let scores = []

const ready = false

const populateComments = local => {
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
	}
	Promise.all(promises).then(() => {app.ready = true})
}

window.onload = () => {
	testLogin()

	fetch('https://fgapi.jacobsimonson.me/comments/?parent_id='+getCookie('PID'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		for(comment of res) {
			comments.push(comment)
		}
		const copy = comments
		populateComments(copy)
	})
}

const app = new Vue({
	el: '#comment-list',
	data: {
		ready,
		comments
	},
	methods: {
		body: content => {
			return decodeURIComponent(content)
		},
		formattedDate: date => {
			const dateString = date.substring(0,10)
			let timeString = date.substring(11, 19)

			if (timeString == '00:00:00') timeString = ''
			else timeString = ` at ${timeString}`

			return `${dateString}${timeString}`
		},
		getScore: author => {
			for (score of scores) {
				if (score.author == author) return score.score
			}
			return 0
		}
	}
})
