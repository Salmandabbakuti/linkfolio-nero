import { createServerFn } from "@tanstack/react-start";
import { PinataSDK } from "pinata";
import { errorResponse } from "./utils";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY_URL || "https://ipfs.io"
});

export const uploadProfileSettingsToIpfs = createServerFn({
  method: "POST"
}).handler(async ({ data: settingsObj }) => {
  if (!settingsObj || typeof settingsObj !== "object") {
    return errorResponse("Invalid settings object provided", 400, true);
  }

  try {
    const uploadRes = await pinata.upload.public.json(settingsObj, {});
    console.log("uploadRes in action", uploadRes);
    return uploadRes;
  } catch (error) {
    console.error("Error uploading profile settings in action:", error);
    return errorResponse(error);
  }
});

export const uploadFileToIpfs = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected FormData");
    }

    return data.get("file");
  })
  .handler(async ({ data: file }) => {
    if (!file) return errorResponse("No file provided to upload", 400, true);

    try {
      const uploadRes = await pinata.upload.public.file(file, {});
      console.log("uploadRes in action", uploadRes);
      return uploadRes;
    } catch (error) {
      console.error("Error uploading file to Pinata in action:", error);
      return errorResponse(error);
    }
  });

export const getProfileSettingsFromIpfs = createServerFn({
  method: "GET"
}).handler(async ({ data: settingsHash }) => {
  if (!settingsHash)
    return errorResponse("Settings hash is required", 400, true);

  try {
    const res = await pinata.gateways.public.get(settingsHash);
    console.log("getProfileSettingsFromIpfs in action", res);
    return res?.data || res;
  } catch (error) {
    console.error("Error getting profile settings from IPFS in action:", error);
    return errorResponse(error);
  }
});
