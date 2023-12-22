const sortByCountry = (customers, country) => {
    return customers.filter((customer) => customer.country === country);
}

const getCountryCode = (country, countries) => {
    const countryCode = Object.keys(countries).find((key) => countries[key] === country);
    return countryCode;
}

const addCountryCode = (customers, countries) => {
    return customers.map((customer) => {
        return {
            ...customer,
            country_code: getCountryCode(customer.country, countries),
        }
    });
}

const createStripeCustomers = async (customers, stripeInstance) => {
    const stripeCustomers = [];
    for (const customer of customers) {
        const stripeCustomer = await stripeInstance.customers.create({
            email: customer.email,
            name: `${customer.first_name} ${customer.last_name}`,
            country: {
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
    sortByCountry,
    addCountryCode,
    createStripeCustomers,
};