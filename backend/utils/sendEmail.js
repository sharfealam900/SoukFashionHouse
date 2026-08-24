import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (
    email,
    subject,
    otp
) => {

    await transporter.sendMail({
        from: `"SOUK Fashion House" <${process.env.EMAIL_USER}>`,

        to: email,

        subject,

        html: `
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
    });
};

export default sendEmail;