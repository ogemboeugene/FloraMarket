import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import OrderFinalSuccess from "./OrderFinalSuccess";
import OrderFinalCancelled from "./OrderFinalCancelled";
import OrderFinalFailure from "./OrderFinalFailure";
import { Spinner } from "reactstrap"; // Optional: for showing loading state
import { setPayment } from "../../store/actions/storeActions"; // Import the setPayment action

class OrderFinal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: true, // Track if payment is still processing
    };
  }

  componentDidMount() {
    // Simulate a 5-second processing delay
    setTimeout(() => {
      this.setState({ isProcessing: false });
      // Here, we force the paymentStatus to success after 5 seconds
      this.props.setPayment({ status: "success" });
    }, 5000);
  }

  render() {
    const { paymentStatus } = this.props;
    const { isProcessing } = this.state;

    if (isProcessing) {
      // Show processing state until 5 seconds have passed
      return (
        <div>
          <Spinner color="primary" /> Processing...
        </div>
      );
    }

    // Once processing time has passed, render based on paymentStatus
    switch (paymentStatus) {
      case "success":
        return <OrderFinalSuccess />;
      case "cancelled":
        return <OrderFinalCancelled />;
      case "failure":
        return <OrderFinalFailure />;
      default:
        return <OrderFinalSuccess />;
        // return <div>Unexpected payment status. Please try again.</div>;
    }
  }
}

OrderFinal.propTypes = {
  paymentStatus: PropTypes.string,
  setPayment: PropTypes.func.isRequired, // Ensure setPayment is passed as a prop
};

OrderFinal.defaultProps = {
  paymentStatus: null,  // Default value for paymentStatus in case it's undefined
};

const mapStateToProps = (state) => ({
  paymentStatus: state.store.paymentStatus,
});

const mapDispatchToProps = (dispatch) => ({
  setPayment: (status) => dispatch(setPayment(status)), // Ensure setPayment is dispatched properly
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderFinal);
