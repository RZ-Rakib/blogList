import { useState } from 'react'

const SignupForm = ({ onSignup }) => {
  const [username, setUsername] = useState('')
  const [name, setname] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = (event) => {
    event.preventDefault()
    onSignup(username, name, password)
    setUsername('')
    setname('')
    setPassword('')
  }

  return (
    <div >
      <h2>Create a new account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
        </div>
        <div>
          <label >
            name:
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              autoComplete="name"
            />
          </label>
        </div>
        <div>
          <label >
            password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

    </div>

  )
}

export default SignupForm

