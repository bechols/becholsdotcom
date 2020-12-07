import React from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import { RiArrowRightSLine } from "react-icons/ri"

import Layout from "../components/layout"
import BlogListHome from "../components/blog-list-home"
import SEO from "../components/seo"

export const pageQuery = graphql`
  query HomeQuery($id: String!) {
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
        cta1 {
          ctaText
          ctaLink
          ctaTag
        }
        cta2 {
          ctaText
          ctaLink
          ctaTag
        }
        cta3 {
          ctaText
          ctaLink
          ctaTag
        }
      }
    }
  }
`

const HomePage = ({ data }) => {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter } = markdownRemark
  const Image = frontmatter.featuredImage
    ? frontmatter.featuredImage.childImageSharp.fluid
    : ""
  return (
    <Layout>
      <SEO />
      <div className="home-banner grids col-1 sm-2">
        <div>
          <h1 className="title">{frontmatter.title}</h1>
          <p className="tagline">{frontmatter.tagline}</p>

          <div className="ctaContainer row">
          <p className="col-8">{frontmatter.cta1.ctaTag}</p>
            <Link to={frontmatter.cta1.ctaLink} >
              {frontmatter.cta1.ctaText}
              <span className="icon -right">
                <RiArrowRightSLine />
              </span>
            </Link>
          </div>
          <div className="ctaContainer row">
          <p className="col-8">{frontmatter.cta2.ctaTag}</p>
            <Link to={frontmatter.cta2.ctaLink} >
              {frontmatter.cta2.ctaText}
              <span className="icon -right">
                <RiArrowRightSLine />
              </span>
            </Link>
          </div>
          <div className="ctaContainer row">
            <p className="col-8">{frontmatter.cta3.ctaTag}</p>
            <Link to={frontmatter.cta3.ctaLink} >
              {frontmatter.cta3.ctaText}
              <span className="icon -right">
                <RiArrowRightSLine />
              </span>
            </Link>
          </div>
        </div>
        <div>
          {Image ? (
            <Img
              fluid={Image}
              alt={frontmatter.title + " - Featured image"}
              className="featured-image"
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <BlogListHome />
    </Layout>
  )
}

export default HomePage
