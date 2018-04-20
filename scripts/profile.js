let user = []
let score = 0

changePass = (newpass, user) => {
  const payload = JSON.stringify({
    'newpass': newpass,
    'user': user
  })

  fetch('http://jacobsimonson.me:3000/pass/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
  .then(res => {
    console.log(newpass, user)
  })
}

getScore = (first, last) => {
  fetch('http://jacobsimonson.me:3000/score/?first='+first+'&last='+last, {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {app.score = res.score})

  setTimeout(() => {app.ready = true}, 1500)
}

window.onload = () => {
  testLogin()

  fetch('http://jacobsimonson.me:3000/profile/?user_id='+getCookie('UID'), {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {
    for (item of res) user.push(item)
    getScore(user[0].firstname, user[0].lastname)
  })
}

const app = new Vue({
  el: '#wrapper',
  data: {
    user,
    score,
    ready: false
  },
  methods: {
    alertPassChange: () => {
      const fields = prompt('What would you like your new password to be?', '')

      if (fields) changePass(fields, user[0].user_id)
    }
  }
})
