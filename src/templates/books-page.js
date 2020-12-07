import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export const pageQuery = graphql`
  query BooksQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        tagline
        featuredImage {
          childImageSharp {
            fluid(
              maxWidth: 480
              maxHeight: 380
              quality: 80
              srcSetBreakpoints: [960, 1440]
            ) {
              ...GatsbyImageSharpFluid
            }
            sizes {
              src
            }
          }
        }
        cta {
          ctaText
          ctaLink
        }
      }
    }
    goodreadsCurrent {
      reviews {
        book {
          author
          title
        }
      }
    }
    goodreadsRecent {
      reviews {
        book {
          author
          title
        }
      }
    }
  }
`

const BooksPage = ({ data }) => {
  const currentBooks = data.goodreadsCurrent.reviews
  const recentBooks = data.goodreadsRecent.reviews
  const staticBooks = data.markdownRemark.html
  return (
    <Layout className="page">
      <SEO />
      <div className="wrapper">
        <h2>Currently reading</h2>
        {currentBooks.map(({ book }) => {
          if (book.title) {
            return (
              <div
                className="Book"
                key={book.title + book.author}
                style={{ paddingBottom: "5px", textDecoration: "none" }}
              >
                <a
                  key={book.title + book.link}
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.title}
                </a>
                {" by "}
                {book.author}
              </div>
            )
          }
          return null
        })}
        <h2>Recently read</h2>
        {recentBooks.map(({ book }) => {
          return (
            <div
              className="Book"
              key={book.title + book.author}
              style={{ paddingBottom: "5px", textDecoration: "none" }}
            >
              <a
                key={book.title + book.link}
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {book.title}
              </a>
              {" by "}
              {book.author}
            </div>
          )
        })}
        <div className="description" dangerouslySetInnerHTML={{ __html: staticBooks }} />
      </div>
    </Layout>
  )
}

export default BooksPage
