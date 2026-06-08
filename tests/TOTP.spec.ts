import { test, expect } from '@playwright/test';
import * as OTPAuth from 'otpauth';

const totp = new OTPAuth.TOTP({
  issuer: 'Heroku',
  label:'MyOTP',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: process.env.HEROKU_SECRET
});
test('test', async ({ page }) => {

  await page.goto('https://www.heroku.com/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.HEROKU_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.HEROKU_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Verification Code' }).click();

  let token = totp.generate();
  console.log('Generated TOTP token:', token);
  await page.getByRole('textbox', { name: 'Verification Code' }).fill('token');;
  //await page.getByRole('button', { name: 'Cancel' }).press('Enter');
  await page.getByRole('button', { name: 'Verify' }).click();
});