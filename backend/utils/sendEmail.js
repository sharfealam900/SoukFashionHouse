const sendEmail = async (email, subject, otp) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",

            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },

            body: JSON.stringify({
                sender: {
                    name: process.env.BREVO_SENDER_NAME,
                    email: process.env.BREVO_SENDER_EMAIL,
                },

                to: [
                    {
                        email,
                    },
                ],

                subject,

                htmlContent: `
                    <div style="
                        max-width:600px;
                        margin:auto;
                        font-family:Arial,sans-serif;
                        background:#ffffff;
                        border:1px solid #eee;
                        padding:30px;
                    ">

                        <h2 style="
                            text-align:center;
                            color:#222;
                        ">
                            SOUK Fashion House
                        </h2>

                        <p>Hello,</p>

                        <p>
                            Your verification code is:
                        </p>

                        <div style="
                            font-size:34px;
                            font-weight:bold;
                            letter-spacing:8px;
                            text-align:center;
                            color:#111;
                            margin:25px 0;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This OTP is valid for
                            <strong>10 minutes</strong>.
                        </p>

                        <p>
                            Do not share this code with anyone.
                        </p>

                        <br>

                        <p>Regards,</p>

                        <strong>SOUK Fashion House</strong>

                    </div>
                `,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("BREVO EMAIL ERROR:", data);

            throw new Error(
                data?.message || "Brevo email sending failed"
            );
        }

        console.log("EMAIL SENT SUCCESSFULLY:", data.messageId);

        return data;
    } catch (error) {
        console.error("EMAIL SENDING ERROR:", error);
        throw error;
    }
};

export default sendEmail;