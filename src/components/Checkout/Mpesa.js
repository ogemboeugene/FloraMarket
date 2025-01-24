import React from "react";
import { connect } from "react-redux";
import {
  setPayment,
  emptyCart,
  toggleCheckoutComplete
} from "../../store/actions/storeActions";
import { Field, reset } from "redux-form";
import RenderField from "./RenderField";
import { FormGroup, Row, Col, Button } from "reactstrap";
import axios from "axios";

const mapStateToProps = state => {
  return state.store;
};

const mapDispatchToProps = dispatch => {
  return {
    setPayment: value => dispatch(setPayment(value)),
    emptyCart: () => dispatch(emptyCart()),
    toggleCheckoutComplete: () => dispatch(toggleCheckoutComplete()),
    resetCheckoutForm: () => dispatch(reset("checkout"))
  };
};

class MpesaPayment extends React.Component {
    handleSubmit = async formValues => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/mpesa-payment",
          {
            phoneNumber: formValues.phoneNumber,
            amount: formValues.amount,
            transactionReference: formValues.transactionReference || null
          }
        );
  
        if (response.status === 200) {
          this.props.setPayment(response.data);
          this.props.emptyCart();
          this.props.toggleCheckoutComplete();
        } else {
          console.error("Payment failed:", response);
        }
      } catch (error) {
        console.error("Payment error:", error);
      }
    };
  
    render() {
      const { handleSubmit, submitting } = this.props;
  
      return (
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
            {/* Use handleSubmit to trigger form submission */}
            <Button
              type="submit"
              disabled={submitting}
              className="btn btn-dark ml-auto"
              onClick={handleSubmit(this.handleSubmit)} // This is the key change
            >
              Order & Pay
            </Button>
          </Col>
        </Row>
      );
    }
  }
  

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MpesaPayment);
