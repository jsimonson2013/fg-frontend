window.onload = () => {
  testLogin()
}

var app = new Vue({
  el: '#form',
  data: {
    pid: getCookie('PID'),
    uid: getCookie('UID')
  },
  computed: {
    timestamp: () => {
      return new Date().toISOString().slice(0,19).replace('T', ' ')
    }
  },
  methods: {
    comment: () => {
      let etc = ''
      let url = 'https://fgapi.jacobsimonson.me/comments/'
      let retaddr = 'https://friendgroup.jacobsimonson.me/html/feed-template.html'

      if (document.getElementById('content').value.length < 1) {
        alert('Text cannot be left empty.')
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
        'user_id': app.uid
      })

      fetch(url, {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
      .then(() => window.open(retaddr, '_self'))
    }
  }
})
