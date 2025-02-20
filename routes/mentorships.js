const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

router.post("/mentorship/:mentorEmail", async (req, res, next) => {
  try {
    const { mentorEmail } = req.params;
    const {
      learnerId,
      learnerName,
      learnerEmail,
      description,
      proposedTimeSlot,
      status = "Pending",
    } = req.body;

    if (
      !mentorEmail ||
      !learnerId ||
      !learnerEmail ||
      !description ||
      !proposedTimeSlot
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "mentorEmail",
          "learnerId",
          "learnerName",
          "learnerEmail",
          "description",
          "proposedTimeSlot",
        ],
      });
    }

    const mentorDoc = await db.collection("mentors").doc(mentorEmail).get();
    if (!mentorDoc.exists) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const mentorshipRef = db
      .collection("mentors")
      .doc(mentorEmail)
      .collection("mentorship");

    const now = new Date().toISOString();

    const newMentorship = {
      learnerId,
      learnerName,
      learnerEmail,
      description,
      proposedTimeSlot,
      status,
      createdAt: now,
      updatedAt: now,
      mentorActionTime: null,
      mentorProposedTimeSlot: null,
    };

    const docRef = await mentorshipRef.add(newMentorship);

    res.status(201).json({
      message: "Mentorship request created successfully",
      mentorshipId: docRef.id,
      mentorship: {
        id: docRef.id,
        ...newMentorship,
      },
    });
  } catch (error) {
    console.error("Error creating mentorship request:", error);
    next(error);
  }
});

router.get("/mentorship/:mentorEmail", async (req, res, next) => {
  try {
    const { mentorEmail } = req.params;
    const { status } = req.query;

    if (!mentorEmail) {
      return res.status(400).json({ error: "Missing mentorEmail parameter" });
    }

    let mentorshipQuery = db
      .collection("mentors")
      .doc(mentorEmail)
      .collection("mentorship");

    if (status) {
      mentorshipQuery = mentorshipQuery.where("status", "==", status);
    }

    const snapshot = await mentorshipQuery.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      return res.status(200).json({ mentorships: [] });
    }

    const mentorships = [];
    snapshot.forEach((doc) => {
      mentorships.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({ mentorships });
  } catch (error) {
    console.error("Error retrieving mentorship requests:", error);
    next(error);
  }
});

module.exports = router;
