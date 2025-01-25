import React from "react";
import { connect } from "react-redux";
import {
  setPayment,
  emptyCart,
  toggleCheckoutComplete,
} from "../../store/actions/storeActions";
import { Field, reduxForm } from "redux-form";
import RenderField from "./RenderField";
import { FormGroup, Row, Col, Button } from "reactstrap";
import axios from "axios";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state) => {
  return state.store;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPayment: (value) => dispatch(setPayment(value)),
    emptyCart: () => dispatch(emptyCart()),
    toggleCheckoutComplete: () => dispatch(toggleCheckoutComplete()),
  };
};

class MpesaPayment extends React.Component {
  formatPhoneNumber(phoneNumber) {
    if (phoneNumber.startsWith("07")) {
      return "254" + phoneNumber.slice(1);
    }
    return phoneNumber;
  }

  handleSubmit = async (formValues) => {
    if (!formValues.phoneNumber || !formValues.amount) {
      console.error("Phone number and amount are required.");
      alert("Please provide a valid phone number and amount.");
      return;
    }

    const formattedPhoneNumber = this.formatPhoneNumber(formValues.phoneNumber);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/payments/mpesa-payment/",
        {
          phoneNumber: formattedPhoneNumber,
          amount: formValues.amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const paymentStatus = response.data.status;
        if (paymentStatus === "success") {
          this.props.setPayment({ status: "success" });
          this.props.emptyCart();
          this.props.toggleCheckoutComplete();
          this.props.history.push("/payment-success");
        } else if (paymentStatus === "cancelled") {
          this.props.setPayment({ status: "cancelled" });
          alert("Payment was cancelled.");
        } else {
          this.props.setPayment({ status: "failure" });
          // alert("Payment failed. Please try again.");
        }
      } else {
        console.error("Payment failed:", response.data);
        // alert("Payment failed. Please try again.");
        this.props.setPayment({ status: "failure" });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment. Please check your details and try again.");
      this.props.setPayment({ status: "failure" });
    }
  };

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <Row>
          <Col md="12">
            <FormGroup>
              <Field
                name="phoneNumber"
                type="text"
                component={RenderField}
                label="M-PESA Phone Number"
              />
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <Field
                name="amount"
                type="text"
                component={RenderField}
                label="Amount"
              />
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <Field
                name="transactionReference"
                type="text"
                component={RenderField}
                label="Transaction Reference (optional)"
              />
            </FormGroup>
          </Col>

          <Col md="12">
            <Button
              type="submit"
              disabled={submitting}
              className="btn btn-dark ml-auto"
            >
              Order & Pay
            </Button>
          </Col>
        </Row>
      </form>
    );
  }
}

MpesaPayment = reduxForm({
  form: "mpesaPayment",
})(MpesaPayment);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MpesaPayment));
