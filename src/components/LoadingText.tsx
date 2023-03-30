import './loading-text.css'

interface LoadingTextProps {
  text: string
}

export default function LoadingText(props: LoadingTextProps) {
  if (props.text) {
    return <>{props.text}</>
  }
  return (
    <div className="loading-text">
      <div className="dot-1"></div>
      <div className="dot-2"></div>
      <div className="dot-3"></div>
    </div>
  )
}
