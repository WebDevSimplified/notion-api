require("dotenv").config()
const express = require("express")
const {
  getTags,
  createSuggestion,
  getSuggestions,
  upVoteSuggestion,
} = require("./notion")

const app = express()
app.set("views", "./views")
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let tags = []
getTags().then(data => {
  tags = data
})
setInterval(async () => {
  tags = await getTags()
}, 1000 * 60 * 60)

app.get("/", async (req, res) => {
  const suggestions = await getSuggestions()
  res.render("index", { tags, suggestions })
})

app.post("/create-suggestion", async (req, res) => {
  const { title, description, isProject, tagIds = [] } = req.body

  await createSuggestion({
    title,
    description,
    isProject: isProject != null,
    tags: (Array.isArray(tagIds) ? tagIds : [tagIds]).map(tagId => {
      return { id: tagId }
    }),
  })

  res.redirect("/")
})

app.post("/up-vote-suggestion", async (req, res) => {
  const votes = await upVoteSuggestion(req.body.suggestionId)
  res.json({ votes })
})

app.listen(process.env.PORT)
