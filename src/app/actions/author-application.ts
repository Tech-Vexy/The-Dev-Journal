"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const adminEmail = process.env.ADMIN_EMAIL || "your-email@example.com"

export async function submitAuthorApplication(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const expertise = formData.get("expertise") as string

    if (!email || !name) {
      return {
        success: false,
        message: "Email and name are required",
      }
    }

    // Send email to admin
    await resend.emails.send({
      from: "Blog Author Application <no-reply@yourdomain.com>",
      to: adminEmail,
      subject: "New Author Application",
      text: `
        New author application received:
        
        Name: ${name}
        Email: ${email}
        Expertise: ${expertise || "Not specified"}
        
        Please review and contact the applicant.
      `,
      html: `
        <h2>New Author Application</h2>
        <p>You've received a new application to become a collaborating author on your blog.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Expertise:</strong> ${expertise || "Not specified"}</li>
        </ul>
        <p>Please review and contact the applicant.</p>
      `,
    })

    return {
      success: true,
      message: "Your application has been submitted successfully!",
    }
  } catch (error) {
    console.error("Error submitting author application:", error)
    return {
      success: false,
      message: "Failed to submit application. Please try again later.",
    }
  }
}

