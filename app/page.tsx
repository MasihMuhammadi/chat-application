"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import SendedMessage from "./components/sendedMessage";
import SignUp from "./components/signUp";
import CheckFriend from "./components/checkFreind";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <>
      <SignUp />
    </>
  );
}
