import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ShowBooks from "../components/ShowBooks"

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
          link
        }
      }
    }
    goodreadsRecent {
      reviews {
        book {
          author
          title
          link
        }
      }
    }
  }
`

const BooksPage = ({ data }) => {
  return (
    <Layout className="page">
      <SEO />
      <div className="wrapper">
        <ShowBooks
          header="Currently reading"
          books={data.goodreadsCurrent.reviews}
        />

        <ShowBooks
          header="Recently read"
          books={data.goodreadsRecent.reviews}
        />

        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
        />
      </div>
    </Layout>
  )
}

export default BooksPage
