// import axios from 'axios'
// import dayjs from 'dayjs'

axios.get('http://123.207.32.32:8000/home/multidata').then(res => {
  console.log(res)
})

// console.log(axios)

console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
