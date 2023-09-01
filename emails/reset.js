const resetPassword = function (email, token) {
    return {
        api_key: process.env.MAIL_API_KEY,
        email: email, // Address of the receiver of the message
        sender_name: 'store_choodofire', // Sender's name
        sender_email: process.env.EMAIL_FROM, // Sender's Email
        subject: 'Restoring access', // Post subject line
        body: `<h1>Have you forgotten your password?</h1>
             <p>If not, please ignore this letter</p>
             <p>Otherwise, click on the link below</p>
             <p><a href="${process.env.BASE_URL}/auth/password/${token}">Restore access</a></p>
             <hr />
             <a href="${process.env.BASE_URL}">Start shopping</a>`,
        list_id: 1, // List code
    }
}

export default resetPassword