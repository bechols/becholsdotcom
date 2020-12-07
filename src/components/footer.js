import React from "react"
import { Link } from "gatsby"

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <p>
        ©{` `}
        <Link to="/">Ben Echols</Link>
        {` `}
        {new Date().getFullYear()}.
        {` `}
        <a
          href="https://www.github.com/bechols/becholsdotcom"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source.
        </a>
      </p>
    </div>
  </footer>
)

export default Footer
