const info = (...params) => {
  if(process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if(process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

const warn = (...params) => {
  if(process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}


// If sever is running for test perpose with Environment variable NODE_ENV=test

// const info = (...params) => {
//   if(process.env.NODE_ENV === 'test') {
//     console.log(...params)
//   }
// }

// const error = (...params) => {
//   if(process.env.NODE_ENV === 'test') {
//     console.error(...params)
//   }
// }

// const warn = (...params) => {
//   if(process.env.NODE_ENV === 'test') {
//     console.log(...params)
//   }
// }

module.exports = { info, error, warn }
