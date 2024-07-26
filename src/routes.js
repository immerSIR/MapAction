// import
import React, { Component }  from 'react';
import Dashboard from "views/Dashboard/Dashboard.js";
import Tables from "views/Dashboard/Tables.js";
import Billing from "views/Dashboard/Billing.js";
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";
import GlobalView from 'views/Dashboard/globalView';
import Analyze from 'views/Dashboard/analyze';
import Help from 'views/Pages/Help';
import FAQ from 'views/Pages/FAQ';
import NotFound from 'views/Pages/NotFound';
import Incident from 'views/Dashboard/Incident';

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Tableau de bord",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Utilisateurs",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
  },
  // {
  //   path: "/billing",
  //   name: "Billing",
  //   rtlName: "لوحة القيادة",
  //   icon: <CreditIcon color='inherit' />,
  //   component: Billing,
  //   layout: "/admin",
  // },
 
  {
    path: "/incident_view/:incidentId",
    name: "Vue d'ensemble",
    icon: <SupportIcon color='inherit' />,
    component: GlobalView,
    layout: "/admin",
  },
  {
    path: "/analyze/:incidentId/:userId",
    name: "Analyse avancé",
    icon: <SupportIcon color='inherit' />,
    component: Analyze,
    layout: "/admin",
  },
  {
    path: "/incident",
    name: "Incident",
    icon: <SupportIcon color='inherit' />,
    component: Incident,
    layout: "/admin",
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color='inherit' />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: SignUp,
        layout: "/auth",
      },
      {
        path: "/help",
        name: "Aide en Ligne",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: Help,
        layout: "/auth",
      },
      {
        path: "/NotFound",
        name: "Error",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: NotFound,
        layout: "/auth",
      },
      {
        path: "/FAQ",
        name: "FAQ",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: FAQ,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;
