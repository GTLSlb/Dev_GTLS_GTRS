const { Builder, By, until } = require('selenium-webdriver');
require('dotenv').config();

async function login(driver) {
  try {
    // Navigate to the login page
    await driver.get('https://gtrs.gtls.store/login');

    const userName  = process.env.USERNAME + '@gtls.com.au';
    const pass = process.env.USER_PASS;

    // Fill in the login form (update selectors and values as needed)
    await driver.findElement(By.name('email')).sendKeys(userName); // Replace with your username
    await driver.findElement(By.name('password')).sendKeys(pass); // Replace with your password

    // Wait for the user to complete the reCAPTCHA
    console.log('Please complete the reCAPTCHA manually');
    await driver.sleep(30000); // 30 seconds

    // Wait for the page to finish loading after submitting the login form
    // await driver.wait(until.urlContains('dashboard'));

    // Wait for a specific element to appear on the page after login
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@id="app"]/div/div/div/div/div[1]/div/div'))));
  } catch (error) {
    console.error('Error during login:', error);
  }
}

async function loginToApp(driver, url, mainUrl) {
    try {
      // Navigate to the login page
      await driver.get(`${url}/login`);

      const userName  = process.env.USERNAME + '@gtls.com.au';
      const pass = process.env.USER_PASS;

      // Fill in the login form (update selectors and values as needed)
      await driver.findElement(By.name('email')).sendKeys(userName); // Replace with your username
      await driver.findElement(By.name('password')).sendKeys(pass); // Replace with your password

      // Wait for the user to complete the reCAPTCHA
      console.log('Please complete the reCAPTCHA manually');
      await driver.sleep(30000); // 30 seconds

      // Wait for the page to finish loading after submitting the login form
      await driver.wait(until.urlContains(mainUrl));

    } catch (error) {
      console.error('Error during login:', error);
    }
  }

module.exports = { login, loginToApp };
