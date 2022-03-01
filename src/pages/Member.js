import React from "react"
import { Modal } from "bootstrap"
import axios from "axios"
import { baseUrl, autorization } from "../config";


class Member extends React.Component {
    constructor() {
        super()
        this.state = {

            id_member: "",
            nama: "",
            alamat: "",
            telepon: "",
            jenis_kelamin: "",
            action: "", /* untuk menyimpan aksi dari tambah atau ubah data*/
            role: "",
            visible: true,
            members: [
                {
                    id_member: "111", nama: "rena",
                    alamat: "jl gatsu no 12 malang", jenis_kelamin: "wanita",
                    telepon: "081354423929"
                },
                {
                    id_member: "112", nama: "aya",
                    alamat: "jl ra kartini no 72 malang", jenis_kelamin: "wanita",
                    telepon: "08273927989"
                },
                {
                    id_member: "113", nama: "adi",
                    alamat: "jl basuki rahmat no 13 malang", jenis_kelamin: "pria",
                    telepon: "08716328172"
                },
            ],

        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }
    tambahData() {
        //memunculkan modal
        this.modalMember = new Modal(document.getElementById("modal-member"))
        this.modalMember.show()

        //mengosongkan imputan
        this.setState({
            nama: "",
            alamat: "",
            telepon: "",
            jenis_kelamin: "Wanita",
            id_member: Math.random(1, 1000000),
            action: "tambah"
        })
    }

    simpanData(ev) {
        ev.preventDefault()
        //mencegah berjalanya aksi default dari form submit
        //form submit

        //menghilangkan modal
        this.modalMember.hide()

        //cek aksi tambah atau ubah
        if (this.state.action == "tambah") {
            let endpoint = "http://localhost:8000/member"
            //menampung data dari pengguna
            let newMember = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                telepon: this.state.telepon,
                jenis_kelamin: this.state.jenis_kelamin
            }

            // let temp = this.state.members
            //temp.push(newMember)

            //this.setState({ members: temp })

            axios.post(endpoint, newMember,autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

        } else if (this.state.action === "ubah") {

            this.modalMember.hide()
            let endpoint = "http://localhost:8000/member/" + this.state.id_member
            let newMember = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                telepon: this.state.telepon,
                jenis_kelamin: this.state.jenis_kelamin
            }

            axios.put(endpoint, newMember, autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))


            //mengambil data member berdasarkan id member yang dipilih
            //mencari posisi index dari data member bersadarkan id membernya pada array 'members'
            // let index = this.state.members.findIndex(
            //     member => member.id_member === this.state.id_member
            // )

            // let temp = this.state.members
            // temp[index].nama = this.state.nama
            // temp[index].alamat = this.state.alamat
            // temp[index].telepon = this.state.telepon
            // temp[index].jenis_kelamin = this.state.jenis_kelamin

            //     this.setState({members: temp })
        }

    }

    ubahData(id_member) {
        this.modalMember = new Modal(document.getElementById("modal-member"))
        this.modalMember.show()

        //mengambil data member berdasarkan id member yang dipilih
        //mencari posisi index dari data member bersadarkan id membernya pada array 'members'
        let index = this.state.members.findIndex(
            (member) => member.id_member === id_member
        )

        this.setState({
            id_member: id_member,
            nama: this.state.members[index].nama,
            alamat: this.state.members[index].alamat,
            jenis_kelamin: this.state.members[index].jenis_kelamin,
            telepon: this.state.members[index].telepon,
            action: "ubah"
        })

    }

    hapusData(id_member) {
        if (window.confirm("Apakah anda yakin igin menghapus data ini")) {
            //mencari posisi index dari data yang akan dihapus
            let endpoint = "http://localhost:8000/member/" + id_member

            axios.delete(endpoint, autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.members
            // let index = temp.findIndex(
            //     member => member.id_member === id_member
            // )

            // //menghaps data pada array
            // temp.splice(index, 1)

            // this.setState({members: temp})
        }
    }

    getData() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint,autorization)
            .then(response => {
                this.setState({ members: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        //FUNGSI INI DIJALANKAN SETELAH FUNGSI RENDER DIJALANKAN
        this.getData();
        let user = JSON.parse(localStorage.getItem("user"))
        //cara pertama
        this.setState({
            role: user.role
        })
        //cara kedua
        if (user.role === 'admin' || user.role === 'kasir') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    showAddButton() {
        if (this.state.role === 'admin' || this.state.role === 'kasir') {
            return (
                <button
                    className="btn btn-sm btn-success my-3"
                    onClick={() => this.tambahData()}
                >
                    Tambah data Member
                </button>
            )
        }
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header bg-primary">
                        <h3 className="text-white">
                            Daftar Member
                        </h3>
                    </div>

                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.members.map(member => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/* Bagian untuk nama*/}
                                        <div className="col-lg-2">
                                            <small className="text-info"> Nama</small>
                                            <br></br>
                                            <h6>{member.nama}</h6>
                                        </div>

                                        {/* Bagian untuk gender*/}
                                        <div className="col-lg-2">
                                            <small className="text-info"> Gender</small>
                                            <br></br> <h6>{member.jenis_kelamin}</h6>
                                        </div>

                                        {/* Bagian untuk telepon*/}
                                        <div className="col-lg-2">
                                            <small className="text-info"> Telepon</small>
                                            <br></br> <h6>{member.telepon}</h6>
                                        </div>

                                        {/* Bagian untuk alamat*/}
                                        <div className="col-lg-4">
                                            <small className="text-info">ALAMAT</small>
                                            <br></br> <h6>{member.alamat}</h6>
                                        </div>

                                        {/*Untuk Button edit dan hapus */}
                                        <div className="col-lg-2">
                                            <div>
                                                <buttton
                                                    className={`btn btn-sm btn-warning mx-2" ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.ubahData(member.id_member)}
                                                >
                                                    Edit
                                                </buttton>
                                                <buttton className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.hapusData(member.id_member)}>
                                                    Hapus
                                                </buttton>
                                            </div>
                                        </div>
                                    </div>


                                </li>
                            ))}

                        </ul>
                        {this.showAddButton()}

                    </div>
                </div>

                {/*  form modal member*/}
                <div className="modal" id="modal-member">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-success">
                                <h4 className="text-white">
                                    Form Member
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Nama
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.nama}
                                        onChange={ev => this.setState({ nama: ev.target.value })}
                                        required></input>

                                    Alamat
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.alamat}
                                        onChange={ev => this.setState({ alamat: ev.target.value })}
                                        required></input>

                                    Telepon
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.telepon}
                                        onChange={ev => this.setState({ telepon: ev.target.value })}
                                        required></input>

                                    Jenis Kelamin
                                    <select className="form-control bm-2"
                                        value={this.state.jenis_kelamin}
                                        onChange={ev => this.setState({ jenis_kelamin: ev.target.value })}>
                                        <option value="Pria">Pria</option>
                                        <option value="Wanita">Wanita</option>
                                    </select>

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

export default Member