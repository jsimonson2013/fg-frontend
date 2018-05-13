let groups = []

window.onload = () => {
	fetch('https://fgapi.jacobsimonson.me/groups/?user_id='+getCookie('UID'), {method: 'GET'})
	.then(res => {return res.json()})
	.then(res => {
		for (group of res) groups.push(group)
	})
}

const app = new Vue({
	el: '#wrapper',
	data: {
		groups
	},
	methods: {
		switchGroup: gid => {
			document.cookie = 'GID='+gid+';path=/;max-age=31536000'
			window.open('https://friendgroup.jacobsimonson.me/html/feed-template.html', '_self')
		}
	}
})

