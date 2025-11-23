import './Button.css'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
