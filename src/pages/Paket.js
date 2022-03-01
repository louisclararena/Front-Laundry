import React from "react"
import { Modal } from "bootstrap"
import axios from "axios"
import { autorization } from "../config"

class Paket extends React.Component {
    constructor() {
        super()
        this.state = {
            id_paket: "",
            jenis_paket: "",
            harga: 0,
            action: "",
            visible: true,
            pakets: [
                {
                    id_paket: "1", jenis_paket: "cuci kering",
                    harga: "5000",
                },
                {
                    id_paket: "2", jenis_paket: "cuci kering setrika",
                    harga: "7000",
                },
                {
                    id_paket: "3", jenis_paket: "cuci basah",
                    harga: "4000",
                }
            ],

        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }
    tambahData() {
        //memunculkan modal
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        //mengkosongkan inputan
        this.setState({
            jenis_paket: "",
            harga: 0,
            id_paket: Math.random(1, 1000000),
            action: "tambah"
        })
    }

    simpanData(ev) {
        ev.preventDefault()
        //mencegah berjalanya aksi default dari form submit
        //form submit

        //menghilangkan modal
        this.modalPaket.hide()

        //cek aksi akn ditambah atau diubah
        if (this.state.action === "tambah") {
            let endpoint = "http://localhost:8000/paket"
            //mmenampung data dari Paket
            let newPaket = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga,
            }

            //let temp = this.state.pakets
            //temp.push(newPaket)

            // this.setState({ pakets: temp })

            axios.post(endpoint, newPaket, autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))



        } else if (this.state.action == "ubah") {
            this.modalPaket.hide()
            let endpoint = "http://localhost:8000/paket/" + this.state.id_paket

            let newPaket = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga,
            }

            axios.put(endpoint, newPaket,autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            //mengambil data member berdasarkan id member yang dipilih
            //mencari posisi index dari data member bersadarkan id membernya pada array 'members'
            // let index = this.state.pakets.findIndex(
            //     paket => paket.id_paket === this.state.id_paket
            // );

            // let temp = this.state.pakets;
            // temp[index].jenis_paket = this.state.jenis_paket
            // temp[index].harga = this.state.harga

            //     this.setState({pakets: temp })

        }

    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        //mengambil data member berdasarkan id member yang dipilih
        //mencari posisi index dari data member bersadarkan id membernya pada array 'members'
        let index = this.state.pakets.findIndex(
            (paket) => paket.id_paket === id_paket
        )

        this.setState({
            id_paket: id_paket,
            jenis_paket: this.state.pakets[index].jenis_paket,
            harga: this.state.pakets[index].harga,
            action: "ubah"
        });

    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin igin menghapus data ini")) {
            //mencari posisi index dari data yang akan dihapus
            let endpoint = "http://localhost:8000/paket/" + id_paket

            axios.delete(endpoint, autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.pakets
            // let index = temp.findIndex(
            //     paket => paket.id_paket === id_paket
            // )

            // //menghaps data pada array
            // temp.splice(index, 1)

            // this.setState({pakets: temp})
        }
    }


    getData() {
        let endpoint = "http://localhost:8000/paket"
        axios.get(endpoint, autorization)
            .then(response => {
                this.setState({ pakets: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        //fungsi ini akan dijalankan setelah fungsi render selesai berjalan
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        if (user.role === 'admin') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }

    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header bg-primary">
                        <h3 className="text-white-center">
                            Daftar Harga Paket
                        </h3>
                    </div>

                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.pakets.map((paket) => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/* Bagian untuk jenis paket*/}
                                        <div className="col-lg-5">
                                            <small className="text-info">Jenis Paket</small>
                                            <br></br>
                                            <h6>{paket.jenis_paket}</h6>
                                        </div>

                                        {/* Bagian untuk telepon*/}
                                        <div className="col-lg-5">
                                            <small className="text-info"> Harga</small>
                                            <br></br>
                                            <h6>Rp {paket.harga}</h6>

                                        </div>
                                        <div className="col-lg-2 justify-content-center align-self-center">

                                            {/*Untuk Button edit dan hapus */}
                                            <div>
                                                <button
                                                    className={`btn btn-sm btn-warning mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.ubahData(paket.id_paket)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.hapusData(paket.id_paket)}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`btn btn-sm btn-info my-3 text-white ${this.state.visible ? `` : `d-none`}`}
                            onClick={() => this.tambahData()}
                        >
                            Tambah data Paket
                        </button>
                    </div>
                </div>

                {/*  form modal paket*/}
                <div className="modal" id="modal-paket">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-success">
                                <h4 className="text-white">
                                    Form Paket
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={ev => this.simpanData(ev)}>

                                    Jenis Paket
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.jenis_paket}
                                        onChange={ev => this.setState({ jenis_paket: ev.target.value })}
                                        required></input>

                                    Harga
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.harga}
                                        onChange={ev => this.setState({ harga: ev.target.value })}
                                        required></input>

                                    <button className="btn btn-success btn-sm"
                                        type="submit">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Paket