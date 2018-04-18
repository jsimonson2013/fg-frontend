let comments = []

window.onload = () => {
  testLogin()

  fetch('http://jacobsimonson.me:3000/comments/?parent_id='+getCookie('PID'), {method: 'GET'})
  .then( res => {return res.json()})
  .then( res => {for(comment of res) comments.push(comment)})
}

const app = new Vue({
  el: '#comment-list',
  data: {
    comments
  },
  methods: {
    body: content => {
      return decodeURIComponent(content)
    },
    formattedDate: date => {
      return date.substring(0, 10)
    }
  }
})
