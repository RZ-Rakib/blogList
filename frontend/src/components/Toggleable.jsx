import { useState } from "react"

const Toggleable = (props) => {
  const [visible, setVisible] = useState(false)

  const HideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const HandleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={HideWhenVisible}>
        <button onClick={HandleVisible}> {props.buttonLabel} </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={HandleVisible}>Cancel</button>
      </div>
    </div>
  )

}

export default Toggleable