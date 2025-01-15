import useSWR from 'swr';
import { UAParser } from 'ua-parser-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Fetcher function for SWR
const fetchDeviceDetails = async () => {
  // Initialize UAParser and FingerprintJS
  const parser = new UAParser();
  const fpAgent = await FingerprintJS.load();
  const result = await fpAgent.get();

  return {
    device: parser.getDevice(),
    os: parser.getOS(),
    browser: parser.getBrowser(),
    engine: parser.getEngine(),
    cpu: parser.getCPU(),
    ua: parser.getUA(),
    result: parser.getResult(),
    fingerprint: result.visitorId
  };
};

// Custom hook to use device details with SWR
export const useDeviceDetails = () => {
  // Use SWR for data fetching
  const { data } = useSWR('deviceDetails', fetchDeviceDetails);

  return data;
};
