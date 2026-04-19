import express from "express"

const router = express.Router()

const colleges = [
  { id: 1, name: "Indian Institute of Technology (IIT), Delhi", location: "Delhi", streams: ["Engineering"] },
  { id: 2, name: "National Institute of Technology (NIT), Trichy", location: "Tamil Nadu", streams: ["Engineering"] }
];

// GET all colleges
router.get("/", async (req, res) => {
  try {
    res.json(colleges)
  } catch (error) {
    res.status(500).json({ message: "Error fetching colleges" })
  }
})

// POST add a new college
router.post("/", async (req, res) => {
  try {
    const newCollege = { id: colleges.length + 1, ...req.body };
    colleges.push(newCollege);
    res.status(201).json(newCollege)
  } catch (error) {
    res.status(400).json({ message: "Error adding college" })
  }
})

export default router
