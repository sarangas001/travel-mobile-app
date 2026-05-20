/* eslint-disable import/no-named-as-default-member */
import axios from "axios";

const API_URL =     process.env.EXPO_PUBLIC_API_URL;

export const travelApi = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const isAxiosError = axios.isAxiosError;
