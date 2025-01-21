// skill-share-backend/routes/courses.js
const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

// GET courses by mentor email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Get mentor document reference
    const mentorRef = db.collection("mentors").doc(email);
    const mentorDoc = await mentorRef.get();

    if (!mentorDoc.exists) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Get courses subcollection
    const coursesRef = mentorRef.collection("courses");
    const snapshot = await coursesRef.get();

    const courses = [];
    snapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// POST new course
router.post("/add", async (req, res) => {
  try {
    const { email, title, author, price, originalPrice, rating, imageUrl } =
      req.body;

    // Validate image URL
    if (!imageUrl || !isValidUrl(imageUrl)) {
      return res.status(400).json({ error: "Valid image URL is required" });
    }

    // Add course to Firestore
    const courseData = {
      title,
      author,
      price: Number(price),
      originalPrice: Number(originalPrice),
      rating: Number(rating),
      imageUrl, // Drive or any other image URL
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const courseRef = await db
      .collection("mentors")
      .doc(email)
      .collection("courses")
      .add(courseData);

    res.status(201).json({
      id: courseRef.id,
      ...courseData,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
});

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = router;
