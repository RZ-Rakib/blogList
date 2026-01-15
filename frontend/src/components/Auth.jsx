import { useState, useImperativeHandle } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupFrom'

const Auth = ({ handleLogin, handleSignup, ref }) => {
  const [display, setDisplay] = useState(true)
  const authStyle = {
    paddingLeft: 30,
    marginTop: 5,
    height: 300,
    width: 250,
    border: 'solid',
    borderRadius: 10,
    borderWidth: 2
  }

  const handleAuthToggle = () => {
    setDisplay(d => !d)
  }

  useImperativeHandle(ref, () => ({
    handleAuthToggle
  }))

  return (
    <div>
      {display && (
        <div style={authStyle}>
          <LoginForm onLogin={handleLogin} />
          <br />
          <br />
          <div>
            <a >Don't have any account?'</a>
            <button onClick={handleAuthToggle}>Signup</button>
          </div>
        </div>
      )}
      {!display && (
        <div style={authStyle}>
          <SignupForm onSignup={handleSignup} />
          <br />
          <br />
          <div>
            <a>Already have an account?</a>
            <button onClick={handleAuthToggle}>Login</button>
          </div>

        </div>
      )}

    </div>

  )

}

export default Auth