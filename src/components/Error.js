import React from "react";

class Error extends React.Component {
  render() {
    return this.props.err && <p>ERROR 404: Unable to geocode</p>;
  }
}
export default Error;