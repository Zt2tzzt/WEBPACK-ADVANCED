const h1 = document.createElement('h1')
h1.textContent = "About Page"
document.body.append(h1)

function about() {
  console.log('about function exec~')
}

const name = 'ABOUT'

export {
  about
}

export default name
