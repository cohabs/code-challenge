// Filters a list of customers by a specific country
function filterCustomersByCountry(customers, targetCountryName) {
    // Perform a case-insensitive comparison for country names to make the filter robust against variations in casing
    return customers.filter(customer =>
        customer.country && customer.country.toLowerCase() === targetCountryName.toLowerCase()
    );
}

// Converts country name to code
function getCountryCode(countryName, countryMapping) {
    // Iterate over the entries (key-value pairs) of the countryMapping object
    for (const [code, name] of Object.entries(countryMapping)) {
        if (name.toLowerCase() === countryName.toLowerCase()) {
            return code; // Return the code (key) if a match is found
        }
    }
    return null; // Return null if no matching country name is found
}

// Formats a customer into the structure required by Stripe API
function formatStripeCustomer(customer, countryCode) {
    return {
        email: customer.email,
        name: `${customer.first_name} ${customer.last_name}`, // Full name
        address: {
            country: countryCode, // Two-letter country code
            line1: customer.address_line_1
        },
    };
}

//creates a customer in Stripe
async function createStripeCustomer(stripe, customerData) {
    try {
        const stripeCustomer = await stripe.customers.create(customerData);
        // feedback during execution, helping to track progress
        console.log(`Successfully created Stripe customer: ${stripeCustomer.email} (ID: ${stripeCustomer.id})`);
        return stripeCustomer;
    } catch (error) {
        // Catching the error prevents the entire script from crashing and allows error handling 
        console.error(`Error creating Stripe customer for ${customerData.email}:`, error.message);
        throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
}

module.exports = {
    filterCustomersByCountry,
    getCountryCode,
    formatStripeCustomer,
    createStripeCustomer
};
