window.onload = () => {
	testLogin()
}

var app = new Vue({
	el: '#form',
	data: {
		pid: getCookie('PID'),
		gid: getCookie('GID'),
		group: getCookie('GROUP'),
		uniq: getCookie('UNIQ'),
		uid: getCookie('UID')
	},
	methods: {
		comment: () => {
			let etc = ''
			let url = 'https://fgapi.jacobsimonson.me/submission/'
			let retaddr = 'https://friendgroup.jacobsimonson.me/html/feed-template.html'

			if (document.getElementById('content').value.length < 1 || document.getElementById('content').value.length > 1000) {
				alert('Text cannot be left empty and must be less than 1000 characters.')
				return
			}

			if (document.getElementById('link')) {
				etc = document.getElementById('link').value
				if (etc.substring(0,4) != 'http' && etc.length > 1) etc = 'http://' + etc
      }

			if (document.getElementById('comment-button')) {
				url = 'https://fgapi.jacobsimonson.me/comments/'
				retaddr = 'https://friendgroup.jacobsimonson.me/html/comments-template.html'
			}

			if (document.getElementById('notify')) {
				if (document.getElementById('notify-check').checked) {
					fetch('https://fgapi.jacobsimonson.me/notify-poster/?pid='+app.pid, {method: 'GET'})
				}
			}

			const payload = JSON.stringify({
				'content': document.getElementById('content').value,
				'link': etc,
				'parent_id': app.pid || '',
				'group': app.group,
				'uniq_id': app.uniq
			})

			fetch(url, {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
			.then(() => {
				fetch('https://fgapi.jacobsimonson.me/increment-score/?uid='+app.uniq, {method: 'GET'})
				.then(() => {window.open(retaddr, '_self')})
			})
		}
	}
})
