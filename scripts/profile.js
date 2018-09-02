let user = []
let groups = []
let score = 0

let notifications = true

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

	const group = fetch('https://fgapi.jacobsimonson.me/default-group/?uid='+getCookie('UNIQ'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		app.default_id = res.group
	})

	userPromises.push(group)

	const score = fetch('https://fgapi.jacobsimonson.me/score/?first='+first+'&last='+last, {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		app.score = res.score
	})

	userPromises.push(score)

	const notifications = fetch('https://fgapi.jacobsimonson.me/notifications/?uid='+getCookie('UNIQ'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		res[0].notifications_on == 1 ? app.notifications = true : app.notifications = false
	})

	userPromises.push(notifications)

	Promise.all(userPromises).then(app.ready = true)
}

window.onload = () => {
	testLogin()

	fetch('https://fgapi.jacobsimonson.me/profile/?user_id='+getCookie('UNIQ'), {method: 'GET'})
	.then( res => {return res.json()})
	.then( res => {
		for (item of res) user.push(item)

		getScore(user[0].firstname, user[0].lastname)
	})

	fetch('https://fgapi.jacobsimonson.me/groups/?user_id='+getCookie('UNIQ'), {method: 'GET'})
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
		notifications,
		ready: false
	},
	methods: {
		alertPassChange: () => {
			const fields = prompt('What would you like your new password to be?', '')

			if (fields) {
				if(confirm("Are you sure you would like to change you password?"))
				changePass(fields, getCookie('UNIQ'))
			}
		},
		signOut: () => {
			document.cookie = 'UID=;path=/;Max-Age=-99999999;'
			document.cookie = 'UNIQ=;path=/;Max-Age=-99999999;'
			document.cookie = 'GROUP=;path=/;Max-Age=-99999999;'
			document.cookie = 'GID=;path=/;Max-Age=-99999999;'
			document.cookie = 'GNAME=;path=/;Max-Age=-99999999;'
			window.open('https://friendgroup.jacobsimonson.me', '_self')
		},
		openGroup: (gname, g) => {
			document.cookie = 'GNAME='+gname+';path=/;max-age=9000000;'
			document.cookie = 'GROUP='+g+';path=/;max-age=9000000;'
			window.open('https://friendgroup.jacobsimonson.me/html/feed-template.html', '_self')
		},
		inviteToGroup: (gname, g) => {
			const email = prompt(`Enter the email of the person you would like to invite to ${gname}.`, '')

			if (email) {
				if(confirm(`Are you sure you would like us to email this person an invite to ${gname}?`))
					fetch('https://fgapi.jacobsimonson.me/invite/?email='+email+'&uid='+getCookie('UNIQ')+'&g='+g, {method: 'GET'})
			}
		},
		leaveGroup: (g) => {
			fetch('https://fgapi.jacobsimonson.me/leave-group/?uid='+getCookie('UNIQ')+'&gid='+g, {method: 'GET'})
			.then(res => {
				if (res.status == 200) {
					if (confirm('Are you sure you want to leave this group? The only way to rejoin is to be invited again.')){
						const el = document.getElementById('group-'+g).parentNode
						el.parentNode.removeChild(el)
					}
					for (group of groups) {
						if (group.g == g) {
							groups.splice(groups.indexOf(group), 1)
						}
					}
					document.cookie = 'GROUP='+groups[0].g+';path=/;max-Age=9000000;'
					document.cookie = 'GNAME='+groups[0].name+';path=/;max-age=9000000;'
				}
			})
		},
		makeDefaultGroup: (gname, g) => {
			fetch('https://fgapi.jacobsimonson.me/change-group/?group='+g+'&gname='+gname+'&uid='+getCookie('UNIQ'), {method: 'GET'})
			.then(res => {
				document.cookie = 'GROUP='+g+';path=/;max-age=9000000;'
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
					fetch('https://fgapi.jacobsimonson.me/create-group/?name='+name+'&user='+getCookie('UNIQ'), {method: 'GET'})
					.then(res => {return res.json()})
					.then(json => {
						document.cookie = 'GROUP='+json.group+';path=/;max-Age=9000000;'
						document.cookie = 'GNAME='+json.gname+';path=/;max-age=9000000;'
						window.open('https://friendgroup.jacobsimonson.me/html/feed-template.html', '_self')
					})
				}
			}
		},
		toggleNotifications: () => {
			fetch('https://fgapi.jacobsimonson.me/set-notifications/?uid='+getCookie('UNIQ')+'&set='+document.getElementById('notifications-slider').checked, {method: 'GET'})
		}
	}
})
