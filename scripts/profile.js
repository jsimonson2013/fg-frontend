let user = []
let groups = []
let score = 0

changePass = (newpass, user) => {
	const payload = JSON.stringify({
		'newpass': newpass,
		'user': user
	})

	fetch('https://fgapi.jacobsimonson.me/pass/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
	.then(res => {
		console.log('Changed password...')
	})
}

getScore = (first, last) => {
	fetch('https://fgapi.jacobsimonson.me/score/?first='+first+'&last='+last, {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		app.score = res.score

		app.ready = true
	})
}

window.onload = () => {
	testLogin()

	fetch('https://fgapi.jacobsimonson.me/profile/?user_id='+getCookie('UID'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		for (item of res) user.push(item)

		getScore(user[0].firstname, user[0].lastname)
	})

	fetch('https://fgapi.jacobsimonson.me/groups/?user_id='+getCookie('UID'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		for (item of res) groups.push(item)
	})
}

const app = new Vue({
	el: '#wide',
	data: {
		user,
		score,
		groups,
		ready: false
	},
	methods: {
		alertPassChange: () => {
			const fields = prompt('What would you like your new password to be?', '')

			if (fields) {
				if(confirm("Are you sure you would like to change you password?"))
				changePass(fields, user[0].user_id)
			}
		},
		signOut: () => {
			document.cookie = 'UID=;path=/;Max-Age=-99999999;'
			window.open('https://friendgroup.jacobsimonson.me', '_self')
		},
		openGroup: (gid, gname) => {
			document.cookie = 'GID='+gid+';path=/;max-Age=9000000;'
			document.cookie = 'GNAME='+gname+';path=/;max-age=9000000;'
			window.open('https://friendgroup.jacobsimonson.me/html/feed-template.html', '_self')
		},
		inviteToGroup: (gid, gname) => {
			const email = prompt(`Enter the email of the person you would like to invite to ${gname}.`, '')

			if (email) {
				if(confirm(`Are you sure you would like us to email this person an invite to ${gname}?`))
					fetch('https://fgapi.jacobsimonson.me/invite/?email='+email+'&gid='+gid+'&uid='+getCookie('UID'), {method: 'GET'})
			}
		},
		leaveGroup: (gid) => {
			alert('Gimme another week to implement these...')
		},
		makeDefaultGroup: (gid, gname) => {
			fetch('https://fgapi.jacobsimonson.me/change-group/?gid='+gid+'&gname='+gname+'&uid='+getCookie('UID'), {method: 'GET'})
			.then(res => {
				document.cookie = 'GID='+gid+';path=/;max-Age=9000000;'
				document.cookie = 'GNAME='+gname+';path=/;max-age=9000000;'
				window.open('https://friendgroup.jacobsimonson.me/html/feed-template.html', '_self')
			})
		},
		notDefault: (gid) => {
			if (getCookie('GID') == gid) return false
			else return true
		},
		newGroup: () => {
			alert('Gimme another week to implement these...')
		}
	}
})
