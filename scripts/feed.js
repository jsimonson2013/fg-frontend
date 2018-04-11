let posts = []

window.onload = () => {
  fetch('http://jacobsimonson.me:3000/feed', {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {for(post of res) posts.push(post)})
}

const app = new Vue({
  el: '#feed-list',
  data: {
    posts
  },
  methods: {
    isLink: len => {
      if (len > 1) return true
      else return false
    },
    openPost: loc => {
      if (loc.length < 1) return
      window.open(loc)
    }, 
    formattedDate: date => {
      return date.substring(0,10)
    },
    voteOnPost: id => {
      const payload = JSON.stringify({
        'post_id': id,
        'user_id': getCookie('UID')
      })

      fetch('http://jacobsimonson.me:3000/vote/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
    }, 
    viewComments: id => {
      document.cookie = 'PID='+id+';path=/'
    },
    body: content => {
      return decodeURIComponent(content)
    }
  }
})
