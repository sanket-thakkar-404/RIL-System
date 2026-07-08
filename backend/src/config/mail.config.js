import nodemailer from "nodemailer"
import config from "./dotenv.config.js"


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  }
})



// check mail connection

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mail connection failed:", error.message);
  } else {
    console.log("✅ Mail server is ready to send emails");
  }
});


export default transporter