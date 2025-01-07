const crypto = require('crypto');
const secret = process.env.SECRET_KEY;
const express = require('express');
const app = express();
app.use(express.json());
// Using Express
app.post("/my/webhook/url", function(req, res) {
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event
    switch (event.event) {
        case 'charge.success':
            // Handle successful payment
            console.log('Payment successful for:', event.data);
            // Update the order status, send confirmation email, etc.
            updateOrderStatus(event.data);
            sendConfirmationEmail(event.data);
            break;
        
        case 'charge.failed':
            // Handle failed payment
            console.log('Payment failed for:', event.data);
            // Notify the user or retry payment process
            alertCustomerAboutFailure(event.data);
            break;
        
        case 'subscription.create':
            // Handle subscription creation event
            console.log('New subscription created:', event.data);
            // Save subscription details in the database, etc.
            saveSubscription(event.data);
            break;
        
        case 'subscription.cancel':
            // Handle subscription cancellation event
            console.log('Subscription cancelled:', event.data);
            // Update the subscription status in the database
            updateSubscriptionStatus(event.data);
            break;
        
        default:
            // Handle other events
            console.log('Unhandled event:', event.event);
            break;
    }
    // Respond with status 200 to acknowledge receipt of the event
    res.send(200);
} else {
    // Invalid signature, unauthorized request
    console.log('Invalid signature');
    res.status(400).send('Invalid signature');
}
});
// Placeholder functions for actions you might take with events
function updateOrderStatus(data) {
    // Update order status in the database (example)
    console.log('Order status updated for:', data.reference);
}

function sendConfirmationEmail(data) {
    // Send a confirmation email (example)
    console.log('Confirmation email sent to:', data.customer.email);
}

function alertCustomerAboutFailure(data) {
    // Notify customer about the failed payment (example)
    console.log('Alert sent to customer:', data.customer.email);
}

function saveSubscription(data) {
    // Save new subscription data to the database (example)
    console.log('Subscription saved:', data.id);
}

function updateSubscriptionStatus(data) {
    // Update subscription status to "cancelled" in the database (example)
    console.log('Subscription cancelled for:', data.id);
}

// Start the Express app on a specified port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Webhook server is running on port ${port}`);
});
