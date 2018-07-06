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
	userPromises = []

	const group = fetch('https://fgapi.jacobsimonson.me/default-group/?uid='+getCookie('UID'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		app.default_id = res.gid
	})

	userPromises.push(group)

	const score = fetch('https://fgapi.jacobsimonson.me/score/?first='+first+'&last='+last, {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		app.score = res.score
	})

	userPromises.push(score)

	Promise.all(userPromises).then(app.ready = true)
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
		default_id: -1,
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
			fetch('https://fgapi.jacobsimonson.me/leave-group/?uid='+getCookie('UID')+'&gid='+gid, {method: 'GET'})
			.then(res => {
				if (res.status == 200) {
					if (confirm('Are you sure you want to leave this group? The only way to rejoin is to be invited again.')){
						const el = document.getElementById('group-'+gid).parentNode
						el.parentNode.removeChild(el)
					}
					for (group of groups) {
						if (group.group_id == gid) {
							groups.splice(groups.indexOf(group), 1)
						}
					}
					document.cookie = 'GID='+groups[0].group_id+';path=/;max-Age=9000000;'
					document.cookie = 'GNAME='+groups[0].name+';path=/;max-age=9000000;'
				}
			})
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
			if (app.default_id == gid) return false
			else return true
		},
		newGroup: () => {
			const name = prompt('Enter a name for the new group.', '')

			if (name) {
				if (confirm(`Are you sure you would you would like to create the ${name} group?`)) {
					fetch('https://fgapi.jacobsimonson.me/create-group/?name='+name+'&uid='+getCookie('UID'), {method: 'GET'})
					.then(res => {return res.json()})
					.then(json => {
						document.cookie = 'GID='+json.gid+';path=/;max-Age=9000000;'
						document.cookie = 'GNAME='+json.gname+';path=/;max-age=9000000;'
						window.open('https://friendgroup.jacobsimonson.me/html/feed-template.html', '_self')
					})
				}
			}
		}
	}
})
