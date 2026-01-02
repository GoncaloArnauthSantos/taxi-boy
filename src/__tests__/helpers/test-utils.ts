/**
 * Test Utilities
 * 
 * Shared utility functions for testing.
 */

import { NextRequest } from "next/server";
import { expect } from "vitest";
import { BASE_URL } from "./constants";

/**
 * Create a test NextRequest
 */
export const createTestRequest = (
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT",
  path: string,
  options?: {
    body?: unknown;
    searchParams?: Record<string, string>;
  }
): NextRequest => {
  const url = new URL(path, BASE_URL);
  
  if (options?.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const requestOptions: {
    method: string;
    body?: string;
    headers?: Record<string, string>;
  } = {
    method,
  };

  if (options?.body) {
    requestOptions.body = JSON.stringify(options.body);
    requestOptions.headers = {
      "Content-Type": "application/json",
    };
  }

  return new NextRequest(url.toString(), requestOptions);
};

/**
 * Assert that a response is an error response
 */
export const expectErrorResponse = async (
  response: Response,
  expectedStatus: number,
  expectedError?: string
) => {
  expect(response.status).toBe(expectedStatus);
  const data = await response.json();
  expect(data).toHaveProperty("error");
  if (expectedError) {
    expect(data.error).toBe(expectedError);
  }
};

/**
 * Assert that a response is a success response
 */
export const expectSuccessResponse = async (
  response: Response,
  expectedStatus: number
) => {
  expect(response.status).toBe(expectedStatus);
  const data = await response.json();
  return data;
};

/**
 * Assert that a response has validation errors
 */
export const expectValidationErrors = async (response: Response) => {
  expect(response.status).toBe(400);
  const data = await response.json();
  expect(data).toHaveProperty("error");
  expect(data.error).toBe("Validation failed");
  expect(data).toHaveProperty("details");
  expect(Array.isArray(data.details)).toBe(true);
  return data.details;
};

