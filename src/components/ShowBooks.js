import React from 'react'

const ShowBooks = props => (
  <div>
    {props.books.map(function(book, index) {
      return (
        <div
          className="Book"
          key={index}
          style={{ paddingBottom: '5px', textDecoration: 'none' }}
        >
          <a key={index} href={book.link} target="_blank" rel="noopener noreferrer">
            {book.title}
          </a>
          {' by '}
          {book.author}
        </div>
      )
    })}
  </div>
)

export default ShowBooks
