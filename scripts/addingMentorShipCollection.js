const { db } = require("../config/firebase.js"); // Adjust path if needed

const sampleMentorshipData = {
  learnerName: "John Doe",
  learnerId: "L12345",
  learnerEmail: "johndoe@example.com",
  proposedTimeSlot: {
    date: "2025-01-25",
    start: "15:00",
    end: "17:00",
  },
  description: "Need help with project X",
  status: "Accepted",
  mentorProposedTimeSlot: {
    date: "2025-01-25",
    start: "15:00",
    end: "17:00",
  },
  mentorActionTime: "2025-01-24T15:00:00.000Z",
  createdAt: "2025-01-24T12:00:00.000Z",
  updatedAt: "2025-01-24T15:00:00.000Z",
};

async function addSampleDataToMentorshipSubcollections() {
  try {
    // Fetch all mentor documents
    const mentorsSnapshot = await db.collection("mentors").get();

    // Iterate over each mentor and add sample data to their mentorship subcollection
    mentorsSnapshot.forEach(async (mentorDoc) => {
      const mentorId = mentorDoc.id;

      // Reference to the mentorship subcollection
      const mentorshipSubcollection = db
        .collection("mentors")
        .doc(mentorId)
        .collection("mentorship");

      // Use learnerEmail as the document ID
      const documentId = sampleMentorshipData.learnerEmail;

      // Add the sample JSON with learnerEmail as the document ID
      await mentorshipSubcollection.doc(documentId).set(sampleMentorshipData);

      console.log(
        `Sample mentorship data added for mentor ID: ${mentorId}, document ID: ${documentId}`
      );
    });
  } catch (error) {
    console.error(
      "Error adding sample data to mentorship subcollections:",
      error
    );
  }
}

addSampleDataToMentorshipSubcollections();
