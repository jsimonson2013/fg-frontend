let user = []

changePass = (newpass, user) => {
  const payload = `newpass=${newpass}&user=${user}`

  fetch('http://jacobsimonson.me:3000/pass/', {method: 'POST', body: payload})
  .then(res => {
    console.log(newpass, user)
  })
}

window.onload = () => {
  fetch('http://jacobsimonson.me:3000/profile/?user_id='+getCookie('UID'), {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {for (item of res) user.push(item)})
}

const app = new Vue({
  el: '#wrapper',
  data: {
    user
  },
  methods: {
    alertPassChange: () => {
      const fields = prompt('What would you like your new password to be?', '')

      if (fields) changePass(fields, user[0].user_id)
    }
  }
})
