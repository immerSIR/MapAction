// import
import React, { Component }  from 'react';
import Dashboard from "views/Dashboard/Dashboard.js";
import Collaboration from "views/Dashboard/Collaboration";
import Tables from "views/Dashboard/Tables.js";
import Billing from "views/Dashboard/Billing.js";
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";
import GlobalView from 'views/Dashboard/globalView';
import GlobalViewCollaboration from 'views/Dashboard/globalViewCollaboration';
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
import EluDashboard from 'views/Dashboard/DashboardElu';
import Chat from 'views/Dashboard/LLM_Chat';
import CitizenTable from 'views/Dashboard/CitizenTable';
import DataExport from 'views/Dashboard/DataExport';

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Tableau de bord",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
    roles: ["admin"]
  },
  {
    path: "/elu-dashboard",
    name: "Tableau de bord",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: EluDashboard,
    layout: "/admin",
    roles: ["elu"]
  },
  {
    path: "/collaboration",
    name: "Collaboration",
    rtlName: "التعاون",
    icon: <CreditIcon color='inherit' />,
    component: Collaboration,
    layout: "/admin",
  },
  
  {
    path: "/export",
    name: "Exportation des données",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: DataExport,
    layout: "/admin",
    roles: ["admin", "elu"]
  },

  {
    path: "/tables",
    name: "Organisations",
    rtlName: "لوحة القيادة",
    icon: <PersonIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
    roles: ["admin"]
  },
  {
    path: "/citizen",
    name: "Utilisateurs de l'application Mobile",
    rtlName: "لوحة القيادة",
    icon: <PersonIcon color='inherit' />,
    component: CitizenTable,
    layout: "/admin",
    roles: ["admin"]
  },

 
  {
    path: "/incident_view/:incidentId",
    name: "Vue d'ensemble",
    icon: <SupportIcon color='inherit' />,
    component: GlobalView,
    layout: "/admin",
    roles: ["admin", "elu"],
  },

  {
    path: "/incident_view_collaboration/:incidentId",
    name: "Demande collaboration",
    icon: <SupportIcon color='inherit' />,
    component: GlobalViewCollaboration,
    layout: "/admin",
    roles: ["admin", "elu"],
  },

  {
    path: "/analyze/:incidentId/:userId",
    name: "Analyse avancé",
    icon: <SupportIcon color='inherit' />,
    component: Analyze,
    layout: "/admin",
    roles: ["admin", "elu"],
  },
  {
    path: "/incident",
    name: "Incident",
    icon: <SupportIcon color='inherit' />,
    component: Incident,
    layout: "/admin",
    roles: ["admin", "elu"],
  },
  {
    name: "Paramètres",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profil",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
        roles: ["admin", "elu"],
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color='inherit' />,
        component: SignIn,
        layout: "/auth",
        roles: ["admin", "elu"],
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: SignUp,
        layout: "/auth",
        roles: ["admin", "elu"],
      },
      {
        path: "/help",
        name: "Aide en Ligne",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: Help,
        layout: "/admin",
        roles: ["admin", "elu"],
      },
      {
        path: "/llm_chat/:incidentId/:userId",
        name: "Chat",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: Chat,
        layout: "/admin",
        roles: ["admin", "elu"],
      },
      {
        path: "/NotFound",
        name: "Error",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: NotFound,
        layout: "/auth",
        roles: ["admin", "elu"],
      },
      {
        path: "/FAQ",
        name: "FAQ",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: FAQ,
        layout: "/admin",
        roles: ["admin", "elu"],
      },
    ],
  },
];
export default dashRoutes;
