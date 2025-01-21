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
    const userData = userDoc.data();
    const { hashedPassword, name, photoUrl, phoneNumber, address, role } =
      userData;

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const getDirectDriveLink = (driveLink) => {
      const match = driveLink.match(/\/d\/(.+?)\//);
      return match
        ? `https://drive.google.com/thumbnail?id=${match[1]}`
        : driveLink;
    };
    const customToken = await auth.createCustomToken(userRecord.uid);
    res.json({
      token: customToken,
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        name: name || "",
        photoUrl: getDirectDriveLink(photoUrl),
        phoneNumber: phoneNumber || "",
        address: address || "",
        role: role || "",
        createdAt: userData.createdAt || "",
        updatedAt: userData.updatedAt || "",
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
router.put("/updateUser/:id", async (req, res, next) => {
  try {
    console.log("Update request received:", {
      id: req.params.id,
      body: req.body,
    });

    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      console.log("Missing ID parameter");
      return res.status(400).json({
        error: "Missing ID parameter",
        received: req.params,
      });
    }

    if (Object.keys(updateData).length === 0) {
      console.log("Empty update data");
      return res.status(400).json({
        error: "No update data provided",
        received: updateData,
      });
    }

    const mentorsRef = db.collection("mentors");
    const snapshot = await mentorsRef.get();
    console.log(
      "Available documents:",
      snapshot.docs.map((doc) => doc.id)
    );
    const userDoc = await mentorsRef.doc(id).get();

    if (!userDoc.exists) {
      const collections = await db.listCollections();
      const collectionNames = collections.map((col) => col.id);

      return res.status(404).json({
        error: "User not found",
        id: id,
        availableCollections: collectionNames,
      });
    }

    await mentorsRef.doc(id).update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    // Get updated document
    const updatedDoc = await mentorsRef.doc(id).get();
    const updatedData = updatedDoc.data();

    console.log("Update successful. New data:", updatedData);

    res.status(200).json({
      message: "User updated successfully",
      updatedUser: updatedData,
    });
  } catch (error) {
    console.error("Server error:", {
      message: error.message,
      stack: error.stack,
      code: error.code, // Firebase error code
    });

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      code: error.code,
    });
  }
});
module.exports = router;
