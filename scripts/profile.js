let user = []
let score = 0

changePass = (newpass, user) => {
  const payload = JSON.stringify({
    'newpass': newpass,
    'user': user
  })

  fetch('https://fgapi.jacobsimonson.me/pass/', {headers: {'Content-Type': 'application/json'}, method: 'POST', body: payload})
  .then(res => {
    console.log(newpass, user)
  })
}

getScore = (first, last) => {
  fetch('https://fgapi.jacobsimonson.me/score/?first='+first+'&last='+last, {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {
    app.score = res.score

    app.ready = true
  })
}

window.onload = () => {
  testLogin()

  fetch('https://fgapi.jacobsimonson.me/profile/?user_id='+getCookie('UID'), {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {
    for (item of res) user.push(item)
    getScore(user[0].firstname, user[0].lastname)
  })
}

const app = new Vue({
  el: '#wide',
  data: {
    user,
    score,
    ready: false
  },
  methods: {
    alertPassChange: () => {
      const fields = prompt('What would you like your new password to be?', '')

      if (fields) {
        if(confirm("Are you sure you would like to change you password?"))
	  changePass(fields, user[0].user_id)
      }
    },
    signOut: () => {
      document.cookie = 'UID=;path=/;Max-Age=-99999999;'
      window.open('https://friendgroup.jacobsimonson.me', '_self')
    }
  }
})
