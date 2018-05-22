let posts = []
let comments = []
let scores = []

const ready = false

window.onload = () => {
	testLogin()

	fetch('https://fgapi.jacobsimonson.me/feed/?group_id='+getCookie('GID'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		for(post of res) {
			posts.push(post)
		}
		const copy = posts
		populateContents('feed', copy, scores, comments)
	})
}

const app = new Vue({
	el: '#outside',
	data: {
		posts,
		groupname: 'Ex Roomies :\'( Still Besties :)',
		ready
	},
	methods: {
		isLink: len => {
			if (len > 1) return true
			else return false
		},
		openPost: loc => {
			if (loc.length < 1) return
			window.open(loc)
		}, 
		numComments: post => {
			for (comment of comments) {
				if (comment.pid == post) return comment.num
			}
		return 0
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
		},
		voteOnPost: id => {
			const payload = JSON.stringify({
				'post_id': id,
				'user_id': getCookie('UID')
			})

			fetch('https://fgapi.jacobsimonson.me/vote/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
		}, 
		darkimg: elem => {
			elem.target.setAttribute('src', '../imgs/votedown.png')
		},
		lightimg: elem => {
			elem.target.setAttribute('src', '../imgs/voteicon.png')
		},
		viewComments: id => {
			document.cookie = 'PID='+id+';path=/'
		},
		body: content => {
			return decodeURIComponent(content)
		}
	}
})
