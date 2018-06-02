window.onload = () => {
	if (getCookie('UID')) {
		fetch('https://fgapi.jacobsimonson.me/bypass/?user=' + getCookie('UID'), {method: 'GET'})
		.then(res => {return res.json()})
		.then(res => {
			document.cookie = 'GID='+res.gid+';path=/;max-age=31536000'
			document.cookie = 'GNAME='+res.gname+';path=/;max-age=315360000'
			window.open(res.url, '_self')
		})
	}
}
const app = new Vue({
	el: "#form",
	data: {
		user: "",
		pass: ""
	},
	methods: {
		login: () => {
			const payload = `?user=${document.getElementById('user').value}&pass=${document.getElementById('pass').value}`
			fetch('https://fgapi.jacobsimonson.me/login/'+payload, {method: 'GET'})
			.then(res => {return res.json()})
			.then(res => {
				document.cookie = 'UID='+res.uid+';path=/;max-age=31536000'
				document.cookie = 'GID='+res.gid+';path=/;max-age=31536000'
				document.cookie = 'GNAME='+res.gname+';path=/;max-age=315360000'
				window.open(res.url, '_self')
			})
		}
	}
})
