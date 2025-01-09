const express = require("express");
const router = express.Router();
const { db, auth } = require("../config/firebase");
const bcrypt = require("bcrypt");
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
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .collection("mentors")
      .doc(email)
      .set({
        id: userRecord.uid,
        name,
        email,
        hashedPassword,
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

router.post("/register/learner", async (req, res, next) => {
  try {
    const { email, password, name, phoneNumber, photoUrl, address } = req.body;

    const mentorDoc = await db.collection("learners").doc(email).get();
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
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .collection("learners")
      .doc(email)
      .set({
        id: userRecord.uid,
        name,
        email,
        hashedPassword,
        phoneNumber,
        photoUrl: photoUrl || null,
        address: address || null,
        role: "learners",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    res.status(201).json({
      message: "Learner registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login/mentor", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await db.collection("mentors").doc(userRecord.email).get();

    if (!userDoc.exists) {
      return res.status(401).json({ error: "User not found" });
    }

    const { hashedPassword } = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

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
router.post("/login/learner", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await db.collection("learners").doc(userRecord.email).get();

    if (!userDoc.exists) {
      return res.status(401).json({ error: "User not found" });
    }

    const { hashedPassword } = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

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
