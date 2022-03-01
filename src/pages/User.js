import React from "react"
import { Modal } from "bootstrap"
import axios from "axios"
import { autorization } from "../config"

class User extends React.Component {
    constructor() {
        super()
        this.state = {
            users: [
                {
                    nama: "caca", username: "jl buring no 5",
                    password: "123", role: "kasir",
                },
                {
                    nama: "reni", username: "jl kalimantan no 15",
                    password: "123", role: "kasir",
                },
                {
                    nama: "udin", username: "jl manggis no 7",
                    password: "123", role: "kurir",
                }
            ],
            nama: "",
            username: "",
            password: "",
            role: "",
            action: ""
        }
    }

    tambahData() {
        //memunculkan modal
        this.modalUser = new Modal(document.getElementById("modal-user"))
        this.modalUser.show()

        //mengosongkan imputan
        this.setState({
            nama: "", username: "", password: "", role: "",
            id_user: Math.random(1, 1000000), action: "tambah"
        })
    }

    simpanData(ev) {
        ev.preventDefault()
        //mencegah berjalanya aksi default dari form submit
        //form submit

        //menghilangkan modal
        this.modalUser.hide()

        //cek aksi akn ditambah atau diubah
        if (this.state.action === "tambah") {
            let endpoint = "http://localhost:8000/users"
            //mmenampung data dari User/admin
            let newUser = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            //  let temp = this.state.users
            //  temp.push(newUser)

            axios.post(endpoint, newUser,autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))


            //this.setState({ users: temp })
        } else if (this.state.action === "ubah") {
            this.modalUser.hide()

            //mengambil data user berdasarkan id user yang dipilih
            //mencari posisi index dari data user bersadarkan id usernya pada array 'users'
            // let index = this.state.users.findIndex(
            //     user => user.id_user === this.state.id_user
            //)
            let endpoint = "http://localhost:8000/users/" + this.state.id_user
            let newUser = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
            }

            axios.put(endpoint, newUser,autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.users
            // temp[index].nama = this.state.nama
            // temp[index].username = this.state.username
            // temp[index].password = this.state.password
            // temp[index].role = this.state.role

            // this.setState({ users: temp })
        }

    }


    ubahData(id_user) {

        this.modalUser = new Modal(document.getElementById("modal-user"))
        this.modalUser.show()

        //mengambil data member berdasarkan id member yang dipilih
        //mencari posisi index dari data member bersadarkan id membernya pada array 'members'
        let index = this.state.users.findIndex(
            user => user.id_user === id_user
        )

        this.setState({
            id_user: this.state.users[index].id_user,
            nama: this.state.users[index].nama,
            username: this.state.users[index].username,
            password: this.state.users[index].password,
            role: this.state.users[index].role,
            action: "ubah"
        })

    }

    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin igin menghapus data ini")) {
            //mencari posisi index dari data yang akan dihapus
            let endpoint = "http://localhost:8000/users/" + id_user

            axios.delete(endpoint,autorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            //mencari posisi index dari data yang akan dihapus
            // let temp = this.state.users
            // let index = temp.findIndex(
            //     user => user.id_user === id_user
            // )

            // //menghaps data pada array
            // temp.splice(index, 1)

            // this.setState({ users: temp })
        }
    }


    getData() {
        let endpoint = "http://localhost:8000/users"
        axios.get(endpoint,autorization)
            .then(response => {
                this.setState({ users: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        //fungsi ini akan dijalankan setelah fungsi render selesai berjalan
        this.getData()

    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header bg-secondary">
                        <h4 className="text-white">
                            Daftar User
                        </h4>
                    </div>

                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.users.map(user => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/* Bagian untuk nama*/}
                                        <div className="col-lg-3">
                                            <small className="text-info"> Nama</small> <br />
                                            {user.nama}
                                        </div>

                                        {/* Bagian untuk gender*/}
                                        <div className="col-lg-3">
                                            <small className="text-info"> Username</small> <br />
                                            {user.username}
                                        </div>

                                        {/* Bagian untuk telepon*/}
                                        <div className="col-lg-2">
                                            <small className="text-info"> Password</small> <br />
                                            {user.password}
                                        </div>

                                        {/* Bagian untuk telepon*/}
                                        <div className="col-lg-2">
                                            <small className="text-info"> Role</small> <br />
                                            {user.role}
                                        </div>

                                        {/*Untuk Button edit dan hapus */}
                                        <div className="col-lg-2">
                                            <buttton className=" btn btn-md btn-warning mx-2"
                                                onClick={() => this.ubahData(user.id_user)}>
                                                Edit</buttton>
                                            <buttton className=" btn btn-md btn-danger mx-2"
                                                onClick={() => this.hapusData(user.id_user)}>
                                                Hapus</buttton>

                                        </div>



                                    </div>


                                </li>
                            ))}
                        </ul>
                        <div className="col-lg-2">
                            <div class=" btn btn-success "
                                onClick={() => this.tambahData()}> Tambah Data</div>

                        </div>
                    </div>

                    {/* Form Modal User */}
                    <div className="modal" id="modal-user">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-success">
                                    <h4 className="text-white">
                                        Form User
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        Nama
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.nama}
                                            onChange={ev => this.setState({ nama: ev.target.value })}
                                            required></input>

                                        Username
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.username}
                                            onChange={ev => this.setState({ username: ev.target.value })}
                                            required></input>

                                        Password
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.password}
                                            onChange={ev => this.setState({ password: ev.target.value })}
                                            required></input>

                                        Role
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.role}
                                            onChange={ev => this.setState({ role: ev.target.value })}
                                            required></input>

                                        <button className="btn btn-succes btn-sm"
                                            Type="submit">
                                            Simpan
                                        </button>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default User;