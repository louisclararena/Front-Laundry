import axios from "axios"
import React from "react";
import { baseUrl, autorization } from "../config";

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: [

            ]
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint,autorization)
            .then(response => {
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    //tambahkan key "total"
                    dataTransaksi[i].total = total
                }
                this.setState({ transaksi: dataTransaksi })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
    }

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-info">
                    Transaksi Baru
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 2)}
                        className="text-danger">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div className="badge bg-warning">
                    Sedang diproses
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 3)}
                        className="text-danger">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 3) {
            return (
                <div className="badge bg-secondary">
                    Siap diambil
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 4)}
                        className="text-danger">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 4) {
            return (
                <div className="badge badge-success">
                    Selesai
                </div>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm('Apakah anda ingin menganti status transaksi ini')) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }
            axios.post(endpoint, data,autorization)
                .then(response => {
                    window.alert(`Status transaksi telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }
    deleteTransaksi(id) {
        if (window.confirm(`Aapakah anda yakin ingi menghapus transkasi ini`)) {
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }
    render() {
        return (
            <div className="container">

                <div className="card">
                </div>
                <div className="card-header bg-info">
                    <h4 className="text-white">
                        List Transaksi
                    </h4>
                </div>

                <div className="card-body">
                    <ul className="list-group">
                        {this.state.transaksi.map(trans => (
                            <li className="list-group-item">
                                <div className="row">
                                    {/* this is member area*/}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Member
                                        </small> <br />
                                        {trans.member.nama}
                                    </div>

                                    {/* Tanggal transaksi area*/}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Tgl.Transaksi
                                        </small> <br />
                                        {trans.tgl.nama}
                                    </div>

                                    {/* Tanggal Batas Waktu area*/}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Batas Waktu
                                        </small> <br />
                                        {trans.batas_waktu}
                                    </div>

                                    {/* Tanggal tgl bayar area*/}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Tgl.Bayar
                                        </small> <br />
                                        {trans.tgl_bayar}
                                    </div>

                                    {/* Tanggal Status area*/}
                                    <div className="col-lg-5">
                                        <small className="text-info">
                                            Status
                                        </small> <br />
                                        {this.convertStatus(trans.id_transaksi, trans.status)}
                                    </div>

                                    {/* this is totoal*/}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Total
                                            
                                        </small> <br />
                                        Rp {trans.total}
                                    </div>

                                    {/*this is delete button */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Option
                                        </small> <br />
                                        <button className="btn btn-sm btn-danger"
                                            onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Area detail transaksi */}
                                <h5> Detail Transaksi</h5>
                                {trans.detail_transaksi.map(detail => (
                                    <div className="row">
                                        {/*  arena nama paket col-3*/}
                                        <div className="col -lg-3">
                                            {detail.paket.jenis_paket}
                                        </div>
                                        {/*  area qty col-2*/}
                                        <div className="col -lg-2">
                                            Qty: {detail.qty}
                                        </div>
                                        {/*  area harga paket col-3 */}
                                        <div className="col -lg-3">
                                            @ Rp {detail.paket.harga}
                                        </div>
                                        {/*  area harga total col-4 */}
                                        <div className="col -lg-4">
                                            Rp {detail.paket.harga * detail.qty}
                                        </div>
                                    </div>
                                ))}

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}