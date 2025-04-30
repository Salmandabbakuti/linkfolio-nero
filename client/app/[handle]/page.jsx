"use client";
import { use } from "react";

export default function Profile({ params }) {
  const { handle } = use(params);

  return <h1>Profile: {handle}</h1>;
}
