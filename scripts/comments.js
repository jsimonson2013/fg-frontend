let comments = []
let scores = []

const ready = false

window.onload = () => {
	testLogin()
	fetch('https://fgapi.jacobsimonson.me/comments/?parent_id='+getCookie('PID'), {method: 'GET'})
	.then( res => {
		setTimeout(() => {
			document.getElementById('empty-label').innerHTML = "There are no posts here..."
		}, 2500)

		return res.json()
	})
	.then( res => {
		for(comment of res) {
			comments.push(comment)
		}

		const copy = comments
		populateContents('comments', copy, null, scores, null, null, null, getCookie('UNIQ'))
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
		},
		isLink: link => {
			if (!link) return false

			if (link.length < 1) return false

			else return true
		},
		openPost: loc => {
			if (loc.length < 1) return
			window.open(loc)
		} 
	}
})
