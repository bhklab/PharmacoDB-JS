/* eslint-disable import/no-extraneous-dependencies */
import { act } from '@testing-library/react';
// for async tests - DO NOT REMOVE
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';

/**
 * Taken from https://github.com/wesbos/waait/blob/master/index.js
 */
const wait = (amount = 0) => new Promise((resolve) => setTimeout(resolve, amount));

/**
 * Use this in your test after mounting if you want the query to finish and update the wrapper
 * THANK YOU TO https://github.com/enzymejs/enzyme/issues/2073#issuecomment-531488981
 */
const updateWrapper = async (wrapper, amount = 0) => {
  await act(async () => {
    await wait(amount);
    wrapper.update();
  });
};

export default updateWrapper;
