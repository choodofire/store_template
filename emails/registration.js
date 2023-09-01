const registrationObj = function (email) {
    return {
        api_key: process.env.MAIL_API_KEY,
        email: email, // Address of the receiver of the message
        sender_name: 'store_choodofire', // Sender's name
        sender_email: process.env.EMAIL_FROM, // Sender's Email
        subject: 'Account created', // Post subject line
        body: `<h1>Welcome to our shop</h1>
             <p>You have successfully created an account with email - ${email}</p>
             <hr />
             <a href="${process.env.BASE_URL}">Start shopping</a>`,
        list_id: 1, // List code
    }
}

export default registrationObj