// CodeBlock.jsx
import React from "react"
import toast from "react-hot-toast"

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const code = String(children).replace(/\n$/, '')

  // Inline code: no copy button
  if (inline) {
    return <code className={className} {...props}>{code}</code>
  }

  // Block code: always-show copy button
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied!")
  }

  return (
    <div className="relative">
      {/* add right padding so the button doesn't overlap the code */}
      <pre className={`${className || ''} pr-14 rounded-md overflow-auto`}>
        <code className={className || ''}>{code}</code>
      </pre>

      <button
        onClick={copyCode}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-700 text-white opacity-100 transition-all duration-200 hover:bg-gray-500 hover:shadow-md focus:outline-none"
        aria-label="Copy code"
        type="button"
      >
        Copy
      </button>
    </div>
  )
}

export default CodeBlock
