import styles from './Button.module.css'

export default function Button({ href, variant = 'primary', className = '', children, ...props }) {
  const classes = `${styles.button} ${styles[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
