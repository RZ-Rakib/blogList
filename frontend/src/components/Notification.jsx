const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const baseStyle = {
    width: '400px',
    fontsize: '16px',
    padding: '12px 16px',
    borderRadius: '6px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '12px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  }

  const types = {
    success: {
      ...baseStyle,
      color: '#058239ff',
      background: '#d0d0d0ff',
      border: '2px solid #05b12dff',
    },
    error: {
      ...baseStyle,
      color: '#da0707ff',
      background: '#d0d0d0ff',
      border: '1px solid #f60606ff'
    }
  }

  return (
    <div style={types[type]}>
      {message}
    </div>
  )
}

export default Notification