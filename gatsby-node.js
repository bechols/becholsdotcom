const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

const axios = require(`axios`)
const crypto = require(`crypto`)
const parseString = require("xml2js").parseString

const goodReadsUserId = process.env.GOODREADS_USER
const goodReadsApiKey = process.env.GOODREADS_KEY

const currentlyReadingShelfString = "currently-reading"
const recentlyReadShelfString = "read"
const sortDateStarted = "date_started"
const sortDateRead = "date_read"

exports.sourceNodes = async ({ actions, reporter }) => {
  const { createNode } = actions

  activity = reporter.activityTimer(`fetching goodreads shelves`)
  activity.start()

  const recentOptions = {
    method: `get`,
    url: `https://www.goodreads.com/review/list`,
    params: {
      id: goodReadsUserId,
      shelf: recentlyReadShelfString,
      v: `2`,
      key: goodReadsApiKey,
      per_page: 5,
      page: 1,
      sort: sortDateRead,
    },
  }

  const recentShelfListXml = await axios(recentOptions)

  const currentOptions = {
    method: `get`,
    url: `https://www.goodreads.com/review/list`,
    params: {
      id: goodReadsUserId,
      shelf: currentlyReadingShelfString,
      v: `2`,
      key: goodReadsApiKey,
      per_page: 5,
      page: 1,
      sort: sortDateStarted,
    },
  }

  const currentShelfListXml = await axios(currentOptions)

  if (recentShelfListXml.status !== 200) {
    reporter.panic(
      `gatsby-source-goodreads: Failed API call -  ${recentShelfListXml}`
    )
  } else {
    parseString(recentShelfListXml.data, function (err, result) {
      if (err) {
        reporter.panic(
          `gatsby-source-goodreads: Failed to parse API call -  ${err}`
        )
      } else {
        if (
          Object.keys(result["GoodreadsResponse"]["reviews"][0]["review"] || {})
            .length === 0
        ) {
          return // TODO: handle empty response
        }
        const reviewListings = result["GoodreadsResponse"]["reviews"][0][
          "review"
        ].map(element => {
          var bookElement = element["book"][0]

          var isbnValue = bookElement["isbn"][0]
          var isbn13Value = bookElement["isbn13"][0]
          if (isNaN(isbnValue)) {
            isbnValue = null
          }
          if (isNaN(isbn13Value)) {
            isbn13Value = null
          }

          var authorsElement = bookElement["authors"][0]

          return {
            reviewID: element["id"][0],
            rating: element["rating"][0],
            dateStarted: element["started_at"][0],
            dateAdded: element["date_added"][0],
            dateUpdated: element["date_updated"][0],
            body: element["body"][0],
            book: {
              bookID: bookElement["id"][0]._,
              isbn: isbnValue,
              isbn13: isbn13Value,
              author: bookElement["authors"][0]["author"][0]["name"],
              textReviewsCount: bookElement["text_reviews_count"][0]._,
              uri: bookElement["uri"][0],
              link: bookElement["link"][0],
              title: bookElement["title"][0],
              titleWithoutSeries: bookElement["title_without_series"][0],
              imageUrl: bookElement["image_url"][0],
              smallImageUrl: bookElement["small_image_url"][0],
              largeImageUrl: bookElement["large_image_url"][0],
              description: bookElement["description"][0],
            },
          }
        })

        createNode({
          shelfName: recentlyReadShelfString,
          reviews: reviewListings,

          id: recentlyReadShelfString,
          parent: null,
          children: [],
          internal: {
            type: `GoodreadsRecent`,
            contentDigest: crypto
              .createHash(`md5`)
              .update(
                "shelf" + goodReadsUserId + JSON.stringify(reviewListings)
              )
              .digest(`hex`),
          },
        })
      }
    })
  }

  if (currentShelfListXml.status !== 200) {
    reporter.panic(
      `gatsby-source-goodreads: Failed API call -  ${currentShelfListXml}`
    )
  } else {
    parseString(currentShelfListXml.data, function (err, result) {
      if (err) {
        reporter.panic(
          `gatsby-source-goodreads: Failed to parse API call -  ${err}`
        )
      } else {
        if (
          Object.keys(result["GoodreadsResponse"]["reviews"][0]["review"] || {})
            .length === 0
        ) {
          return // TODO: handle empty response
        }
        const reviewListings = result["GoodreadsResponse"]["reviews"][0][
          "review"
        ].map(element => {
          var bookElement = element["book"][0]

          var isbnValue = bookElement["isbn"][0]
          var isbn13Value = bookElement["isbn13"][0]
          if (isNaN(isbnValue)) {
            isbnValue = null
          }
          if (isNaN(isbn13Value)) {
            isbn13Value = null
          }

          return {
            reviewID: element["id"][0],
            rating: element["rating"][0],
            dateStarted: element["started_at"][0],
            dateAdded: element["date_added"][0],
            dateUpdated: element["date_updated"][0],
            body: element["body"][0],
            book: {
              bookID: bookElement["id"][0]._,
              author: bookElement["authors"][0]["author"][0]["name"],
              isbn: isbnValue,
              isbn13: isbn13Value,
              textReviewsCount: bookElement["text_reviews_count"][0]._,
              uri: bookElement["uri"][0],
              link: bookElement["link"][0],
              title: bookElement["title"][0],
              titleWithoutSeries: bookElement["title_without_series"][0],
              imageUrl: bookElement["image_url"][0],
              smallImageUrl: bookElement["small_image_url"][0],
              largeImageUrl: bookElement["large_image_url"][0],
              description: bookElement["description"][0],
            },
          }
        })

        createNode({
          shelfName: currentlyReadingShelfString,
          reviews: reviewListings,

          id: currentlyReadingShelfString,
          parent: null,
          children: [],
          internal: {
            type: `GoodreadsCurrent`,
            contentDigest: crypto
              .createHash(`md5`)
              .update("currentlyReading" + JSON.stringify(reviewListings))
              .digest(`hex`),
          },
        })
      }
    })
  }
  activity.end()

  return
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  //const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogList = path.resolve(`./src/templates/blog-list.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Create markdown pages
  const posts = result.data.allMarkdownRemark.edges
  let blogPostsCount = 0

  posts.forEach((post, index) => {
    const id = post.node.id
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
    const title = post.node.frontmatter.title

    createPage({
      path: post.node.frontmatter.slug,
      component: path.resolve(
        `src/templates/${String(post.node.frontmatter.template)}.js`
      ),
      // additional data can be passed via context
      context: {
        id,
        previous,
        next,
        title,
      },
    })

    // Count blog posts.
    if (post.node.frontmatter.template === "blog-post") {
      blogPostsCount++
    }
  })

  // Create blog-list pages
  const postsPerPage = 12
  const numPages = Math.ceil(blogPostsCount / postsPerPage)

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/various` : `/various/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
