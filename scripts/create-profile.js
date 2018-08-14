const app = new Vue({
	el: '#wrapper',
	data: {
		first: "",
		last: "",
		code: "",
		pass: ""
	},
	methods: {
		signUp: () => {
			const code = document.getElementById('code').value || false
			const first = document.getElementById('first').value || false
			const last = document.getElementById('last').value || false
			const pass = document.getElementById('pass').value || false

			if(!code || !first || !last || !pass) {
				alert('Please enter the security code from the email, your first name, your lastname, and a password for logging into FriendGroup.')
				return
			}

			const payload = `?code=${code}&first=${first}&last=${last}&pass=${pass}`

			fetch('https://fgapi.jacobsimonson.me/signup/'+payload, {method: 'GET'})
			.then(res => {
				if (res.status == 404) {
					alert('Please check your security code and try again.')
					return
				}
				return res.json()
			})
			.then(res => {
				document.cookie = 'UID='+res.uid+';path=/;max-age=31536000'
				document.cookie = 'UNIQ='+res.uniq+';path=/;max-age=31536000'
				document.cookie = 'GID='+res.gid+';path=/;max-age=31536000'
				document.cookie = 'GNAME='+res.gname+';path=/;max-age=315360000'
				window.open(res.url, '_self')
			})
		}
	}
})
