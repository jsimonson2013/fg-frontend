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
