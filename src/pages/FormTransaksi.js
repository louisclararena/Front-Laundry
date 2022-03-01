import React from "react";
import axios from "axios";
import { Modal } from "bootstrap"
import { autorization } from "../config";

export default class FormTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            id_member: "",
            tgl: "",
            batas_waktu: "",
            tgl_bayar: "",
            dibayar: false,
            id_user: "",
            detail_transaksi: [],
            members: [],
            pakets: [],
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        };
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getMember() {
        let endpoint = "http://localhost:8000/member"
        axios.get(endpoint,autorization)
            .then(response => {
                this.setState({ members: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getMember()
        this.getPaket()

        let user = JSON.parse(localStorage.getItem("user"))
        if (user.role !== 'admin' && user.role !== 'kasir') {
            window.alert(`Maaf anda bukan admin atau kasir!`)
            window.location.href = "/"
        }
    }

    getPaket() {
        let endpoint = "http://localhost:8000/paket"
        axios.get(endpoint,autorization)
            .then(response => {
                this.setState({ pakets: response.data })
            })
            .catch(error => console.log(error))
    }

    tambahPaket(e) {
        e.preventDefault()
        
        //utk menyimpan data paket yang dipilih beserta jumlahnya
        //ke dalam array detail_transaksi
        let idPaket = this.state.id_paket
        let selectedPaket = this.state.pakets.find(
            paket => paket.id_paket == idPaket
        )
        let newPaket = {
            id_paket: this.state.id_paket,
            qty: this.state.qty,
            jenis_paket: selectedPaket.jenis_paket,
            harga: selectedPaket.harga
        }

        //ambil array detail_transakksi
        let temp = this.state.detail_transaksi
        temp.push(newPaket)
        this.setState({ detail_transaksi: temp });
        //tutup modal
        this.modal.hide()
    }

    addPaket() {
        //menampilkan form modal untuk memilih paket
        this.modal = new Modal(document.getElementById('modal-paket')
        )
        this.modal.show()

        //kosongkan form 
        this.setState({
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        })
    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            //mencari posisi index dari data yang akan dihapus
            let temp = this.state.detail_transaksi
            let index = temp.findIndex(detail => detail.id_paket === id_paket)

            //menghapus data pada array
            temp.splice(index, 1)

            this.setState({ details: temp })
        }
    }

    simpanTransaksi() {
        let endpoint = "http://localhost:8000/transaksi"
        let user = JSON.parse(localStorage.getItem("user"))
        let newData = {
            id_member: this.state.id_member,
            batas_waktu: this.state.batas_waktu,
            tgl: this.state.tgl,
            tgl_bayar: this.state.tgl_bayar,
            dibayar: this.state.dibayar,
            id_user: user.id_user,
            detail_transaksi: this.state.detail_transaksi
        }
        axios.post(endpoint, newData, autorization)
            .then(response => {
                window.alert(response.data.message)
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                </div>
                <div className="card-header bg-primary">
                    <h4 className="text-white">
                        Form Transaksi
                    </h4>
                </div>

                <div className="card-body">
                    Member
                    <select className="form-control mb-2" value={this.state.id_member} onChange={e => this.setState({ id_member: e.target.value })}>
                        {this.state.members.map(member => (
                            <option value={member.id_member}>
                                {member.nama}
                            </option>
                        ))}
                    </select>

                    Tanggal Transaksi
                    <input type="date" className="form-control mb-2"
                        value={this.state.tgl}
                        onChange={e => this.setState({ tgl: e.target.value })} />

                    Batas Waktu
                    <input type="date" className="form-control mb-2"
                        value={this.state.batas_waktu}
                        onChange={e => this.setState({ batas_waktu: e.target.value })} />

                    Tanggal Bayar
                    <input type="date" className="form-control mb-2"
                        value={this.state.tgl_bayar}
                        onChange={e => this.setState({ tgl_bayar: e.target.value })} />

                    Status Bayar
                    <select className="form-control mb-2"
                        value={this.state.dibayar}
                        onChange={e => this.setState({ dibayar: e.target.value })} >
                        <option value={true}> Sudah Dibayar</option>
                        <option value={false}> Belum Dibayar</option>
                    </select>

                    <button className="btn btn-success"
                        onClick={() => this.addPaket()}>
                        Tambah Paket
                    </button>

                    {/* Tampilakn isi detail */}
                    <h5> Detail Transaksi</h5>
                    {this.state.detail_transaksi.map(detail => (
                        <div className="row">
                            {/*  arena nama paket col-3*/}
                            <div className="col -lg-3">
                                {detail.jenis_paket}
                            </div>
                            {/*  area qty col-2*/}
                            <div className="col -lg-2">
                                Qty: {detail.qty}
                            </div>
                            {/*  area harga paket col-3 */}
                            <div className="col -lg-3">
                                @ Rp {detail.harga}
                            </div>
                            {/*  area harga total col-4 */}
                            <div className="col -lg-4">
                                Rp {detail.harga * detail.qty}
                            </div>
                            <div className="col-lg-1 mb-2">
                                <button className="btn btn-sm btn-danger" onClick={() => this.hapusData(detail.id_paket)}>Hapus</button>
                            </div>
                        </div>
                    ))}


                    <button className="btn btn-info"
                        onClick={() => this.simpanTransaksi()}>
                        Simpan Transaksi
                    </button>

                    {/*  Modal untuk pilihan paket*/}
                    <div className="modal" id="modal-paket">
                        <div className="modal-dialog modal-md">
                            < div className="modal-content">
                                <div className="modal-header bg-danger">
                                    <h4 className="text-white">
                                        Pilih paket
                                    </h4>

                                </div>
                                <div className="modal-body">
                                    <form onSubmit={(e) => this.tambahPaket(e)}>
                                        Pilih paket
                                        <select className="form-control mb-2"
                                            value={this.state.id_paket}
                                            onChange={e => this.setState({ id_paket: e.target.value })}>
                                            <option value="">Pilih Paket</option>
                                            {this.state.pakets.map(paket => (
                                                <option value={paket.id_paket}>
                                                    {paket.jenis_paket}
                                                </option>
                                            ))}
                                        </select>

                                        Jumlah (Qty)
                                        <input type="number" className="form-control mb-2"
                                            value={this.state.qty}
                                            onChange={e => this.setState({ qty: e.target.value })} />

                                        <button type="submit" className="btn btn-success">
                                            Tambah
                                        </button>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        )
    }
}
