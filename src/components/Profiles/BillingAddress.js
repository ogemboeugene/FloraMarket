import React from "react";
import axios from "axios";
import { API_PATH } from "../../backend_url";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { token: state.token };
};

class BillingAddress extends React.Component {
  state = {
    addresses: [
    ]
  };

  componentDidMount() {
    axios
      .get(`${API_PATH}addresses/billing_details/`)
      .then(res => this.setState({ addresses: res.data }))
      .catch(err => console.log(err));
  }

  render() {
    const { addresses } = this.state;
    return (
      <React.Fragment>
        <h3>My billing details</h3>
        <table className="table table-responsive">
          {addresses.map((item, index) => (
            <tr key={item.id}>
              <th scope="row">{index + 1}</th>
              <td>{item.address_name}</td>
              <td>
                <div className="d-flex flex-column">
                  <span>{item.address_line_1}</span>
                  <span>{item.address_line_2}</span>
                </div>
              </td>
              <td>{item.country}</td>
              <td>{item.city}</td>
              <td>{item.postcode}</td>
            </tr>
          ))}
        </table>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(BillingAddress);
