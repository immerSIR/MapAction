
// import React from "react";
// import ReactDOM from "react-dom";
// import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// import AuthLayout from "layouts/Auth.js";
// import AdminLayout from "layouts/Admin.js";
// import RTLLayout from "layouts/RTL.js"; // Chakra imports
// import { ChakraProvider } from "@chakra-ui/react";
// // Custom Chakra theme
// import theme from "theme/theme.js";

// ReactDOM.render(
//   <ChakraProvider theme={theme} resetCss={false} position="relative">
//     <HashRouter>
//       <Switch>
//         <Route path={`/auth`} component={AuthLayout} />
//         <Route path={`/admin`} component={AdminLayout} />
//         <Route path={`/rtl`} component={RTLLayout} />
//         <Redirect from={`/`} to="/admin/dashboard" />
//       </Switch>
//     </HashRouter>
//   </ChakraProvider>,
//   document.getElementById("root")
// );


// src/index.js
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/ProtectedRoute";
import theme from "theme/theme.js";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";

ReactDOM.render(
  <ChakraProvider theme={theme} resetCss={false} position="relative">
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route path={`/auth`} component={AuthLayout} />
          <ProtectedRoute path={`/admin`} component={AdminLayout} />
          <Route path={`/rtl`} component={RTLLayout} />
          <Redirect from={`/`} to="/admin/dashboard" />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById("root")
);
