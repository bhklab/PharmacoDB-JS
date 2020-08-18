/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Gene API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const experimentQueries = require('../queries/experiment_queries');