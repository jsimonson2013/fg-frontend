window.onload = () => {
	document.getElementById('pass').addEventListener('keyup', e => {
		if (e.keyCode == 13) document.getElementById('submit').click()
	})

	if (getCookie('UNIQ')) {
		fetch('https://fgapi.jacobsimonson.me/bypass/?user=' + getCookie('UNIQ'), {method: 'GET'})
		.then(res => {return res.json()})
		.then(res => {
			document.cookie = 'GID='+res.gid+';path=/;max-age=31536000'
			document.cookie = 'GNAME='+res.gname+';path=/;max-age=315360000'
			document.cookie = 'UID='+res.uid+';path=/;max-age=315360000'
			window.open(res.url, '_self')
		})
	}
	else {
		document.querySelector('body').style.display = "block"
	}
}

const app = new Vue({
	el: "#wrapper",
	data: {
		user: "",
		pass: ""
	},
	methods: {
		login: () => {
			const payload = `?user=${document.getElementById('user').value}&pass=${document.getElementById('pass').value}`
			fetch('https://fgapi.jacobsimonson.me/login/'+payload, {method: 'GET'})
			.then(res => {
				if (res.status == 404) alert ('Please enter the email and password for your account. If you have forgotten your password, click that link below to reset.')

				else return res.json()
			})
			.then(res => {
				document.cookie = 'UID='+res.uid+';path=/;max-age=31536000'
				document.cookie = 'UNIQ='+res.uniq+';path=/;max-age=31536000'
				document.cookie = 'GID='+res.gid+';path=/;max-age=31536000'
				document.cookie = 'GNAME='+res.gname+';path=/;max-age=315360000'
				window.open(res.url, '_self')
			})
		},
		forgotPassword: () => {
			const email = prompt('Enter the email associated with your profile.', '')

			if (email) {
				fetch('https://fgapi.jacobsimonson.me/reset-pass/?email=' + email, {method: 'GET'})
				.then( res => {
					if(res.status == 200){
						alert("An email has been sent with a new password.")
					}
					else {
						alert("No account found with that email...")
					}
				})
			}
		}
	}
})
