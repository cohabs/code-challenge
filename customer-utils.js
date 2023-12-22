/**
 * Filter customers by country using built-in Array.filter
 * @param {Array} customers - Array of customers
 * @param {string} country - Country to filter by
 * @returns {Array} - Filtered array of customers
 */
const filterByCountry = (customers, country) => {
    return customers.filter((customer) => customer.country === country);
}

/**
 * Get the country code from the country name
 * @param {string} country - Country name
 * @param {Object} countries - Object with country codes and names as key-value pairs
 * @returns {string} - Country code
 */
const getCountryCode = (country, countries) => {
    const countryCode = Object.keys(countries).find((key) => countries[key] === country);
    return countryCode;
}

/**
 * Add country code to each customer object
 * @param {Array} customers - Array of customers
 * @param {Object} countries - Object with country codes and names as key-value pairs
 * @returns {Array} - Array of customers with country code
 */
const addCountryCode = (customers, countries) => {
    return customers.map((customer) => {
        return {
            ...customer,
            country_code: getCountryCode(customer.country, countries),
        }
    });
}

/**
 * Create Stripe customers
 * @param {Array} customers - Array of customers
 * @param {Object} stripeInstance - Stripe instance
 * @returns {Array} - Array of customers added to Stripe
 */
const createStripeCustomers = async (customers, stripeInstance) => {
    const stripeCustomers = [];
    for (const customer of customers) {
        const stripeCustomer = await stripeInstance.customers.create({
            email: customer.email,
            name: `${customer.first_name} ${customer.last_name}`,
            address: {
                country: customer.country_code,
            },
        });
        stripeCustomers.push({
            email: customer.email,
            customerId: stripeCustomer.id,
            country: customer.country_code,
        });
    }
    return stripeCustomers;
}

module.exports = {
    filterByCountry,
    addCountryCode,
    createStripeCustomers,
};