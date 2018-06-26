const app = new Vue({
	el: '#wrapper',
	data: {
		first: "",
		last: "",
		email: "",
		user: "",
		pass: ""
	},
	methods: {
		signUp: () => {
			const payload = `?first=${document.getElementById('first').value}&last=${document.getElementById('last').value}&email=${document.getElementById('email').value}&user=${document.getElementById('user').value}&pass=${document.getElementById('pass').value}`

			fetch('https://fgapi.jacobsimonson.me/signup/'+payload, {method: 'GET'})
			.then(res => {return res.json()})
			.then(res => {
				console.log(res)
				/*
				document.cookie = 'UID='+res.uid+';path=/;max-age=31536000'
				document.cookie = 'GID='+res.gid+';path=/;max-age=31536000'
				document.cookie = 'GNAME='+res.gname+';path=/;max-age=315360000'
				window.open(res.url, '_self')
				*/
			})
		}
	}
})
