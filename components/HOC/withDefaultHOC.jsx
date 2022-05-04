import React from "react";

export default function withDefaultHOC (Component){
    return function withDefaultHOC(props) {
      return <Component {...props}/>;
    }
    
  };

