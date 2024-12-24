const express = require("express");
const router = express.Router();
const { db, auth } = require("../config/firebase");

router.post("/register/mentor", async (req, res, next) => {
  try {
    const { email, password, name, phoneNumber, photoUrl, address } = req.body;

    const mentorDoc = await db.collection("mentors").doc(email).get();
    if (mentorDoc.exists) {
      return res
        .status(400)
        .json({ error: "A user with this email already exists" });
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db
      .collection("mentors")
      .doc(email)
      .set({
        id: userRecord.uid,
        name,
        email,
        phoneNumber,
        photoUrl: photoUrl || null,
        address: address || null,
        role: "mentor",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    res.status(201).json({
      message: "Mentor registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login/menotr", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const userRecord = await auth.getUserByEmail(email);
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.json({
      token: customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return res
        .status(401)
        .json({ error: "No account found with this email" });
    }
    next(error);
  }
});

module.exports = router;
