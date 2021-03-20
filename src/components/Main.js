import { CircularProgress } from '@material-ui/core';
import React, { Component } from 'react';


import { convert } from "./Parser";
class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filed: false,
            data: [],
            days: [],
            finale: [],
            keys: [],
            loading: false
        }
    }

    showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            var data = convert(text)
            // console.log(data);
            this.setState({ data: data, filed: true })

        };
        reader.readAsText(e.target.files[0])
    }
    async range() {
        await new Promise(r => setTimeout(r, 3000));
        var days = []
        var final = []
        this.state.data.forEach(element => {
            // console.log(element.date.split('T')[0]);
            var existed = days.indexOf(element.date.split('T')[0])

            if (existed === -1) {
                var dayTMP = element.date.split('T')[0]
                days.push(dayTMP)
            }
        });
        this.setState({
            days: days
        }, () => {
            days.forEach((element) => {
                var filteredHour = this.state.data.filter((el) => el.date.split('T')[0] === element)
                var tmp = {}
                tmp['date'] = element;
                tmp["values"] = filteredHour

                final.push(tmp);
            });
            // console.log(final[0].values[0].values);

            this.setState({ finale: final, keys: Object.keys(final[0].values[0].values), loading: false }, () => { })
        })
    }


    convertDate(date) {
        var tmp = new Date(date)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var final = tmp.toLocaleDateString('fr-FR', options)
        return (final.charAt(0).toUpperCase() + final.slice(1));
        // console.log(tmp);
    }
    render = () => {

        return (
            <div>
                <h2>Convertisseur Kml to JS</h2>

                <input type="file" onChange={(e) => this.showFile(e)} accept='.xml,.kml' />
                {/* <DataTable
                    title="Arnold Movies"
                    columns={columns}
                    data={this.state.data}
                /> */}
                <button title='Valider' onClick={() => {
                    if (this.state.filed) {
                        this.setState({ loading: true }, () => { this.range() })
                    } else {
                        alert('Veuillez choisir un fichier à convertir')
                    }
                }} >Valider</button>

                <div>
                    {
                        this.state.loading && <CircularProgress color="secondary" />
                    }
                </div>

                <div>
                    {
                        this.state.finale.map((_el, index) => (
                            <div key={index} >

                                {/* <h3>{_el.date}</h3> */}
                                <h3>{this.convertDate(_el.date)}</h3>

                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {
                                                this.state.keys.map((el, id) => (
                                                    <th key={id} >{el}</th>
                                                ))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {
                                            this.state.finale.map((el) => (
                                                <tr>
                                                    <td>{el}</td>
                                                </tr>
                                            ))
                                        } */}

                                        {
                                            this.state.finale[index].values.map((el, i) => {
                                                // var date = new Date(el.date);
                                                return (
                                                    <tr key={i} >
                                                        <td>{el.date.split('T')[1].slice(0, 2) + "h"}</td>
                                                        {
                                                            Object.values(el.values).map((__el, __id) => (
                                                                <td key={__id} >{__el}</td>
                                                            ))
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Main;