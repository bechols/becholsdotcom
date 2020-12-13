import React from "react"

const ShowBooks = props => (
  <div>
    <h2>{props.header}</h2>
    {props.books.map(({ book }, index) => {
      if (book.title) {
        return (
          <div
            className="Book"
            key={index}
            style={{ paddingBottom: "10px", textDecoration: "none" }}
          >
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              {book.title}
            </a>
            {" by "}
            {book.author}
          </div>
        )
      }
      return null
    })}
  </div>
)

export default ShowBooks
