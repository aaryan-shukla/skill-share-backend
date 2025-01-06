const express = require("express");
const router = express.Router();
const { db, auth } = require("../config/firebase");

router.put("/update/mentor", async (req, res, next) => {
  try {
    const {
      email,
      name,
      phoneNumber,
      photoUrl,
      address,
      birthday,
      summary,
      website,
      github,
      linkedin,
      twitter,
    } = req.body;

    const mentorDoc = await db.collection("mentors").doc(email).get();
    if (!mentorDoc.exists) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (photoUrl) updateData.photoUrl = photoUrl;
    if (address) updateData.address = address;
    if (birthday) updateData.birthday = birthday;
    if (summary) updateData.summary = summary;
    if (website) updateData.website = website;
    if (github) updateData.github = github;
    if (linkedin) updateData.linkedin = linkedin;
    if (twitter) updateData.twitter = twitter;

    if (name) {
      const userRecord = await auth.getUserByEmail(email);
      await auth.updateUser(userRecord.uid, {
        displayName: name,
      });
    }

    await db.collection("mentors").doc(email).update(updateData);

    res.status(200).json({
      message: "Mentor details updated successfully",
      updatedFields: Object.keys(updateData),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user/:role/:email", async (req, res, next) => {
  try {
    const { role, email } = req.params;

    if (!["mentors", "learners"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const userDoc = await db.collection(role).doc(email).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
