// helpers.js

async function login(page) {
    // Navigate to the login page
    await page.goto('https://gtrs.gtls.store/login');

    const userName  = process.env.USERNAME + '@gtls.com.au';
    const pass = process.env.USER_PASS;

    // Fill in the login form (update selectors and values as needed)
    await page.fill('input[name="email"]', userName); // Replace with your username
    await page.fill('input[name="password"]', pass); // Replace with your password

    // Wait for the user to complete the reCAPTCHA
    console.log('Please complete the reCAPTCHA manually');
    await page.pause(); // This will pause the test until you resume it

  }

  module.exports = { login };
