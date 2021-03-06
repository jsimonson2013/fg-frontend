let posts = []
let userPosts = []
let comments = []

let scores = []
let votes = []

let loaded = []
let members = ''

let oldestDate = ''
const ready = false

window.onload = () => {
	testLogin()

	fetch('https://fgapi.jacobsimonson.me/members/?gid='+getCookie('GROUP'), {method: 'GET'})
	.then( res => {
		setTimeout(() => {
			if (document.getElementById('empty-label')) document.getElementById('empty-label').innerHTML = "There are no posts here..."
		}, 2500)

		return res.json()
	})
	.then(json => {
		for (let user of json) {
			members = `${members}${user.firstname} ${user.lastname},\n`
		}
		app.members = members.replace(/,\s*$/, "")
	})	

	const currentDateTime = new Date()
	currentDateTime.setFullYear(new Date().getFullYear() + 1)

	let localeTime = currentDateTime.toLocaleTimeString().split(' ')[0]

	if (localeTime.split(':')[0].length != 2) localeTime = `0${localeTime}`
	oldestDate = `${currentDateTime.toISOString().slice(0,10)} ${localeTime}`

	fetch('https://fgapi.jacobsimonson.me/feed/?group_id='+getCookie('GROUP')+'&start_date='+oldestDate, {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		for(post of res) {
			posts.push(post)
		}

		oldestDate = posts[posts.length - 1].date
		const copy = posts

		populateContents('feed', copy, userPosts, scores, comments, votes, loaded, getCookie('UNIQ'))
		.then(() => {
			for(let post of userPosts[0]) {
				if(document.getElementById(`delete${post.p}`)) document.getElementById(`delete${post.p}`).style.visibility = 'visible'
			}

			for(vote of votes) {
				if (vote.num) document.getElementById(`${vote.pid}`).innerHTML = `<h5>${vote.num}</h5>`
			}
		})
	})
}

let doing = false
window.onscroll = () => {
	if(window.innerHeight + window.scrollY >= document.body.scrollTop*0.90 && !doing) {
		doing = true

		fetch('https://fgapi.jacobsimonson.me/feed/?group_id='+getCookie('GROUP')+'&start_date='+oldestDate, {method: 'GET'})
		.then( res => {return res.json()})
		.then( res => {
			if (res.length < 1) return

			for(post of res) {
				posts.push(post)
			}

			oldestDate = posts[posts.length - 1].date
			const copy = posts

			app.ready = false

			populateContents('feed', copy, userPosts, scores, comments, votes, loaded, getCookie('UNIQ'))
			.then(() => {
				for(let post of userPosts[0]) {
					if(document.getElementById(`delete${post.p}`)) document.getElementById(`delete${post.p}`).style.visibility = 'visible'
				}

				for(vote of votes) {
					if (vote.num) document.getElementById(`${vote.pid}`).innerHTML = `<h5>${vote.num}</h5>`
				}

				setTimeout(() => {doing = false; app.ready = true}, 1000)
			})
		})
	}
}

const app = new Vue({
	el: '#outside',
	data: {
		posts,
		groupname: getCookie('GNAME'),
		ready,
		members,
		loaded
	},
	methods: {
		deletePost: (id, el) => {
			if (confirm("Are you sure you would like to delete this post?")) {
				const payload = JSON.stringify({ 'post_id': id,
					'user_id': getCookie('UNIQ')
				})

				fetch('https://fgapi.jacobsimonson.me/delete-post/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
				.then(res => {
					if (res.status == 200) window.open('https://friendgroup.jacobsimonson.me/html/feed-template.html', '_self')
				})
			}
		},
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
		numVotes: post => {
			for (vote of votes) {
				if (vote.pid == post) return vote.num
			}
			return 0
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
		voteOnPost: (id, el) => {
			const payload = JSON.stringify({
				'post_id': id,
				'user_id': getCookie('UNIQ')
			})

			fetch('https://fgapi.jacobsimonson.me/vote/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
			.then(() => {

				fetch('https://fgapi.jacobsimonson.me/votes/?post_id='+id, {method: 'GET'})
				.then(res => {return res.json()})
				.then(json => {
					if (el.childNodes[0].tagName == 'IMG') el.innerHTML = `<b>${json.length}<b>`
				})

			})
		}, 
		viewComments: id => {
			document.cookie = 'PID='+id+';path=/'
		},
		body: content => {
			return decodeURIComponent(content)
		}
	}
})
