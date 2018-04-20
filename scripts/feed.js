let posts = []
let comments = []

const populateComments = local => {
  for (post of local) {
    const id = post.post_id
    fetch('http://jacobsimonson.me:3000/comments/?parent_id='+id, {method: 'GET'})
    .then(res => {return res.json()})
    .then(json => {
      const comms = {
         pid: id,
         num: json.length
      }
      app.comments.push(comms)
    })
    app.ready = true
  }
}

window.onload = () => {
  testLogin()

  fetch('http://jacobsimonson.me:3000/feed', {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {
    for(post of res) {
      posts.push(post)
    }
    const copy = posts
    populateComments(copy)
  })
}

const app = new Vue({
  el: '#feed-list',
  data: {
    posts,
    ready: false
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
    numComments: post => {
      for (comment of comments) {
        if (comment.pid == post) return comment.num
      }
      return 0
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
    darkimg: elem => {
      elem.target.setAttribute('src', '../imgs/votedown.png')
    },
    lightimg: elem => {
      elem.target.setAttribute('src', '../imgs/voteicon.png')
    },
    viewComments: id => {
      document.cookie = 'PID='+id+';path=/'
    },
    body: content => {
      return decodeURIComponent(content)
    }
  }
})
