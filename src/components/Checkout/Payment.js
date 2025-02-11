import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { toggleDifferentBillingAddress } from "../../store/actions/storeActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form } from "reactstrap";
import { Accordion } from "../Utilities/Accordion";
import { CardElement } from "react-stripe-elements";

// Import MpesaPayment component
import MpesaPayment from "../Checkout/Mpesa";

const mapStateToProps = state => {
  return {
    paymentStatus: state.store.paymentStatus,
    initialValues: {
      isDifferentBilling: state.store.isDifferentBillingAddress
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDifferentBillingAddress: () =>
      dispatch(toggleDifferentBillingAddress())
  };
};

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      // Set Mpesa accordion to always be open
      collapse: false,
      mpesaOpen: true
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    this.props.toggleDifferentBillingAddress();
  }

  render() {
    const { handleSubmit, previousPage, submitting } = this.props;

    return (
      <React.Fragment>
        <Form onSubmit={handleSubmit}>
          <Accordion open={this.state.mpesaOpen ? 1 : 0}>
            {/* Accordion for Pay by Card */}
            <Accordion.Item>
              <Accordion.Header>Pay by card</Accordion.Header>
              <Accordion.Body>
                <div className="p-2 mb-2 shadow border">
                  <CardElement hidePostalCode />
                </div>
                <div className="d-flex">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-dark ml-auto"
                  >
                    Order & Pay
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Accordion for Mpesa Payment */}
            <Accordion.Item>
              <Accordion.Header>Pay by Mpesa</Accordion.Header>
              <Accordion.Body>
                <MpesaPayment />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Button
            type="button"
            className="btn btn-link text-muted bg-white my-4"
            onClick={previousPage}
          >
            <FontAwesomeIcon icon="angle-left" />
            <span className="ml-2">Go back</span>
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

Payment.propTypes = {
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  toggleDifferentBillingAddress: PropTypes.func.isRequired
};

Payment = reduxForm({
  form: "checkout",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true,
  enableReinitialize: true
})(Payment);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Payment);
