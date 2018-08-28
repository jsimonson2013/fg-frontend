let comments = []
let scores = []

const ready = false

window.onload = () => {
	testLogin()

	fetch('https://fgapi.jacobsimonson.me/comments/?parent_id='+getCookie('PID'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		for(comment of res) {
			comments.push(comment)
		}
		const copy = comments
		populateContents('comments', copy, scores, null, null)
	})
}

const app = new Vue({
	el: '#outside',
	data: {
		ready,
		groupname: getCookie('GNAME'),
		comments
	},
	methods: {
		body: content => {
			return decodeURIComponent(content)
		},
		formattedDate: date => {
			const utcDate = new Date(date)

			return `${utcDate.toLocaleDateString()} at ${utcDate.toLocaleTimeString()}`
		},
		getScore: author => {
			for (score of scores) {
				if (score.author == author) return score.score
			}
			return 0
		}
	}
})
