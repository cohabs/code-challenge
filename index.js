const fs = require('fs')
const Stripe = require('stripe');
const STRIPE_TEST_SECRET_KEY = 'sk_test_51MEuPXA69JWLHl3Jxw3gKWTtXJCOkzmvjDs5oJ45DZEHFzo5HLz5JfWkNvzU03eCyo0ojkiW2ot6WXA8udWEkh0300nAnoJmcj'
const stripe = Stripe(STRIPE_TEST_SECRET_KEY);

const handler = async (country) => {

  try{
    let finalCustomers = []

    /* add code below this line */
    
    // filter the customers by country
    // transform customers to save into Stripe
    // for each customer create a Stripe customer
    // push into finalCustomers the stripe customers with email, country and id as properties.
    // write finalCustomers array into final-customers.json using fs
    /* 
      finalCustomers array should look like:
      finalCustomers = [{
          email: test@test.com
          customerId: 1d833d-12390sa-9asd0a2-asdas,
          country: 'ES'
        },
        {
          email: test@test.com
          customerId: 1d833d-12390sa-9asd0a2-asdas,
          country: 'ES'
        }
      }] 
    */

    /* add code above this line */

    console.log(finalCustomers)

}catch(e){
  throw e
}
 
} 