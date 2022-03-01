import React from "react";
import NotFound from "./notFound";
import Member from "./pages/Member";
import Paket from "./pages/Paket"
import User from "./pages/User"
import Transaksi from "./pages/Transaksi"
import Header from "./Navbar";
import Footer from "./Footer";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import FormTransaksi from "./pages/FormTransaksi";
import Login from "./pages/Login";
import Navbar from "./Navbar";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navbar><Dashboard /></Navbar>} />
        <Route path="/member" element={<Navbar><Member /></Navbar>} />
        <Route path="/paket" element={<Navbar><Paket /></Navbar>} />
        <Route path="/user" element={<Navbar><User /></Navbar>} />
        <Route path="/transaksi" element={<Navbar><Transaksi /></Navbar>} />
        <Route path="/FormTransaksi" element={<Navbar><FormTransaksi /></Navbar>} />

        <Route component={NotFound} />
      </Routes>
    </BrowserRouter>
  )
}
