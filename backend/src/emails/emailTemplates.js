export const welcomeEmailTemplate = (name, clientURL) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Connectify</title>
  </head>

  <body style="
    margin:0;
    padding:40px 20px;
    background:#edf4f7;
    font-family: Arial, Helvetica, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <table width="620" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:28px;
            overflow:hidden;
            box-shadow:0 15px 40px rgba(0,0,0,0.08);
          ">

            <!-- Header -->
            <tr>
              <td style="
                background: linear-gradient(135deg, #0F172A, #134E4A, #06B6D4);
                padding:70px 40px;
                text-align:center;
              ">

                <h1 style="
                  margin:0;
                  color:#ffffff;
                  font-size:40px;
                  font-weight:700;
                  letter-spacing:-1px;
                ">
                  Connectify
                </h1>

                <p style="
                  margin-top:14px;
                  color:rgba(255,255,255,0.85);
                  font-size:16px;
                ">
                  Connect • Communicate • Stay Connected
                </p>

              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:55px 48px;">

                <h2 style="
                  margin:0 0 20px;
                  color:#0F172A;
                  font-size:30px;
                  font-weight:600;
                ">
                  Welcome, ${name}
                </h2>

                <p style="
                  color:#475569;
                  font-size:16px;
                  line-height:1.9;
                  margin:0 0 18px;
                ">
                  Thank you for joining Connectify.
                  Your account has been successfully created
                  and is now ready to use.
                </p>

                <p style="
                  color:#475569;
                  font-size:16px;
                  line-height:1.9;
                  margin:0 0 35px;
                ">
                  Connectify helps you stay connected through
                  real-time messaging, video calls, and seamless communication —
                  all in one secure platform.
                </p>

                <!-- Feature Section -->
                <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:40px;">
                  <tr>

                    <td style="
                      background:#F8FAFC;
                      border-radius:18px;
                      padding:24px;
                      text-align:center;
                      width:30%;
                    ">
                      <h3 style="
                        margin:0 0 8px;
                        color:#0F172A;
                        font-size:16px;
                      ">
                        Messaging
                      </h3>

                      <p style="
                        margin:0;
                        color:#64748B;
                        font-size:14px;
                        line-height:1.6;
                      ">
                        Stay in touch instantly.
                      </p>
                    </td>

                    <td width="5%"></td>

                    <td style="
                      background:#F8FAFC;
                      border-radius:18px;
                      padding:24px;
                      text-align:center;
                      width:30%;
                    ">
                      <h3 style="
                        margin:0 0 8px;
                        color:#0F172A;
                        font-size:16px;
                      ">
                        Video Calls
                      </h3>

                      <p style="
                        margin:0;
                        color:#64748B;
                        font-size:14px;
                        line-height:1.6;
                      ">
                        Communicate face-to-face.
                      </p>
                    </td>

                    <td width="5%"></td>

                    <td style="
                      background:#F8FAFC;
                      border-radius:18px;
                      padding:24px;
                      text-align:center;
                      width:30%;
                    ">
                      <h3 style="
                        margin:0 0 8px;
                        color:#0F172A;
                        font-size:16px;
                      ">
                        Stories
                      </h3>

                      <p style="
                        margin:0;
                        color:#64748B;
                        font-size:14px;
                        line-height:1.6;
                      ">
                        Share important moments.
                      </p>
                    </td>

                  </tr>
                </table>

                <!-- CTA -->
                <div style="text-align:center;">

                  <a href="${clientURL}" style="
                    display:inline-block;
                    background:linear-gradient(135deg,#0891B2,#06B6D4);
                    color:#ffffff;
                    text-decoration:none;
                    padding:16px 38px;
                    border-radius:14px;
                    font-size:15px;
                    font-weight:600;
                  ">
                    Open Connectify
                  </a>

                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                background:#F8FAFC;
                padding:32px;
                text-align:center;
                border-top:1px solid #E2E8F0;
              ">

                <p style="
                  margin:0;
                  color:#475569;
                  font-size:14px;
                  font-weight:600;
                ">
                  Connectify Team
                </p>

                <p style="
                  margin:10px 0 0;
                  color:#94A3B8;
                  font-size:13px;
                ">
                  © ${new Date().getFullYear()} Connectify.
                  All rights reserved.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};