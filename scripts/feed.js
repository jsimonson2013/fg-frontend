let posts = []
let comments = []
let promises = []
let scores = []

const populateComments = local => {
  for (post of local) {
    const id = post.post_id

    const commentsPromise = fetch('https://fgapi.jacobsimonson.me/comments/?parent_id='+id, {method: 'GET'})
    .then(res => {return res.json()})
    .then(json => {
      const comms = {
         pid: id,
         num: json.length
      }
      comments.push(comms)
    })
    promises.push(commentsPromise)

    const first = post.author.split(' ')[0]
    const last = post.author.split(' ')[1]

    const scorePromise = fetch('https://fgapi.jacobsimonson.me/score/?first='+first+'&last='+last, {method: 'GET'})
    .then(res => {return res.json()})
    .then(json => {
      const scr = {
        author: `${first} ${last}`,
        score: json.score
      }
      scores.push(scr)
    })
    promises.push(scorePromise)

    // update scores while we're at it
    fetch('https://fgapi.jacobsimonson.me/update-score/?first='+first+'&last='+last, {method: 'GET'})
  }
  Promise.all(promises).then(() => {app.ready = true})
}

window.onload = () => {
  testLogin()

  fetch('https://fgapi.jacobsimonson.me/feed', {method: 'GET'})
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
    getScore: author => {
      for (score of scores) {
        if (score.author == author) return score.score
      }
      return 0
    },
    voteOnPost: id => {
      const payload = JSON.stringify({
        'post_id': id,
        'user_id': getCookie('UID')
      })

      fetch('https://fgapi.jacobsimonson.me/vote/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
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
