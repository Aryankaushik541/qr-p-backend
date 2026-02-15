exports.createFeedback = async (req, res) => {
  try {
    const { name, email, contact, message, rating, feedbackType } = req.body;

    if (!name || !email || !contact || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 1️⃣ Save to DB
    const feedback = await Feedback.create({
      name,
      email,
      contact,
      message,
      rating: rating ?? 0,
      feedbackType: feedbackType ?? "neutral"
    });

    // 2️⃣ Send emails (non-blocking but awaited safely)
    Promise.allSettled([
      sendMail({
        to: email,
        subject: "Thank You for Your Feedback - Xpress Inn Marshall",
        text: `Hello ${name}, thank you for your feedback!`,
        html: `
          <h2>Hello ${name}!</h2>
          <p>We received your message:</p>
          <blockquote>${message}</blockquote>
          <p>We’ll review it shortly.</p>
        `
      }),
      sendMail({
        to: process.env.BUSINESS_EMAIL,
        subject: `New Feedback from ${name}`,
        text: `New feedback received`,
        html: `
          <h3>New Feedback</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Contact:</b> ${contact}</p>
          <p><b>Rating:</b> ${rating ?? "N/A"}</p>
          <p><b>Type:</b> ${feedbackType ?? "neutral"}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        `
      })
    ]).then(results => {
      results.forEach(r => {
        if (r.status === "rejected") {
          console.error("Email failed:", r.reason?.message);
        }
      });
    });

    // 3️⃣ Immediate response
    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });

  } catch (error) {

    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)[0].message;
      return res.status(400).json({
        success: false,
        message: msg
      });
    }

    console.error("Create Feedback Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
