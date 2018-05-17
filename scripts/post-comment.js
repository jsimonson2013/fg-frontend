window.onload = () => {
	testLogin()
}

var app = new Vue({
	el: '#form',
	data: {
		pid: getCookie('PID'),
		gid: getCookie('GID'),
		uid: getCookie('UID')
	},
	computed: {
		timestamp: () => {
			const currentDateTime = new Date()
			let localeTime = currentDateTime.toLocaleTimeString().split(' ')[0]
			if (localeTime.split(':')[0].length != 2) localeTime = `0${localeTime}`
			return `${currentDateTime.toISOString().slice(0,10)} ${localeTime}`
		}
	},
	methods: {
		comment: () => {
			let etc = ''
			let url = 'https://fgapi.jacobsimonson.me/comments/'
			let retaddr = 'https://friendgroup.jacobsimonson.me/html/feed-template.html'

			if (document.getElementById('content').value.length < 1 || document.getElementById('content').value.length > 1000) {
				alert('Text cannot be left empty and must be less than 1000 characters.')
				return
			}

			if (document.getElementById('link')) {
				etc = document.getElementById('link').value
				if (etc.substring(0,4) != 'http' && etc.length > 1) etc = 'http://' + etc
				url = 'https://fgapi.jacobsimonson.me/submission/'
      }

			if (document.getElementById('comment-button')) {
				retaddr = 'https://friendgroup.jacobsimonson.me/html/comments-template.html'
			}

			const payload = JSON.stringify({
				'content': document.getElementById('content').value,
				'link': etc,
				'parent_id': app.pid || '',
				'timestamp': app.timestamp,
				'group_id': app.gid,
				'user_id': app.uid
			})

			fetch(url, {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
			.then(() => {
				fetch('https://fgapi.jacobsimonson.me/increment-score/?uid='+app.uid, {method: 'GET'})
				.then(() => {window.open(retaddr, '_self')})
			})
		}
	}
})
