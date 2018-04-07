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
      let url = 'http://jacobsimonson.me:3000/comments/'

      if (document.getElementById('link')) {
        etc = document.getElementById('link').value
        if (etc.substring(0,3) != 'http') etc = 'http://' + etc
        url = 'http://jacobsimonson.me:3000/submission/'
      }

      const payload = JSON.stringify({
        'content': document.getElementById('content').value,
        'link': etc,
        'parent_id': app.pid || '',
        'timestamp': app.timestamp,
        'user_id': app.uid
      })

      fetch(url, {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
      .then(() => window.open('http://friendgroup.jacobsimonson.me/html/feed-template.html', '_self'))
    }
  }
})
