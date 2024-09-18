[![forthebadge](https://forthebadge.com/images/badges/made-with-react.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-css.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

# Map Action Dashboard

Map Action Dashboard is a web application designed for administrators and organizations to manage various tasks and actions related to mapping projects.

## Description

The dashboard provides an intuitive interface for users to visualize data on interactive maps, manage users and access permissions, access the incident management section to report, track, and manage incidents related to mapping projects, view a detailed history of actions taken within the system, allowing users to track changes and updates over time, export data in csv form from the dashboard for further analysis or sharing purposes, facilitating seamless data management workflows, Customize and configure dashboard settings according to user preferences, including user profiles, find answers to frequently asked questions regarding the functionality and usage of the Map Action Dashboard, providing users with self-help resources for common queries, access online assistance and support resources, including tutorials, guides, and troubleshooting tips to help users navigate and utilize the dashboard effectively, and receive real-time updates and notifications.

**Documentation built by Developers**
[Developper doc](https://223mapaction.github.io/Dashboard/)

#### Special thanks

During the development of this dashboard, we have used many existing resources from awesome developers. We want to thank them for providing their tools open source:

- [Chakra UI](https://chakra-ui.com/?ref=creative-tim) - Modern Open source framework
- [ApexCharts.js](https://apexcharts.com?ref=creative-tim) - Modern & Interactive Open-source charts
- [Quill Editor](https://www.npmjs.com/package/react-quill?ref=creative-tim) - ReactJS Text Editor provided by Quill
- [React Table](https://react-table.tanstack.com/docs/overview?ref=creative-tim) - Collection of hooks for building powerful ReactJD tables
- [ReactJS](https://reactjs.org?ref=creative-tim) - A popular JavaScript library for building user interfaces

Let us know your thoughts below. And good luck with development!

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Requirements](#requirements)
- [Installation](#installation)
- [Runing the app](#runing-the-app)
- [Documentation](#documentation)
- [Features](#features)
- [Contibute to the project](#contibute-to-the-project)
- [Licensing](#licensing)
- [File Structure](#file-structure)
- [Authors](#authors)

## Requirements

1. Download and Install NodeJs LTS version from [NodeJs Official Page](https://nodejs.org/en/download/).

## Installation 

To install dependencies, run:

```bash
$ npm install

```
or
```bash
$ yarn install

```

## Runing the app

Navigate to the root / directory and run

```bash
$ npm start
```

## Documentation

The documentation for the Map Action is hosted at our [Developper doc](https://223mapaction.github.io/Dashboard/).

## Technologies
  - JS
  - CSS
  - React
  
  ![Selection_078](https://github.com/223MapAction/Dashboard/assets/64170643/cacccdd6-8586-403c-8acf-8a979dc081bd)

## Features

- Incident Management;
- User Management;
- Interactive maps for data visualization;
- Real-time updates and notifications;
- Data Export by day and month;
- collaboration on incident between organisation;

![Selection_074](https://github.com/223MapAction/Dashboard/assets/64170643/6b3c449d-5b8f-46ca-be3c-2894468e9373)
---

## Contibute to the project
Map Action is an open source project. Fell free to fork the source and contribute with your features. Please follow our [contribution guidelines](CONTRIBUTING.md).

## Authors
Our code squad : @A7640S, @223MapAction 

## Licensing

This project was built under the [GNU General Public Licence](LICENSE).

## File Structure

Within the download you'll find the following directories and files:

```
Dashboard/
├── .gitattributes
├── .gitigonore
├── CHANGELOG.md
├── commit.sh
├── gulpfile.js
├── ISSUE_TEMPLATE.md
├── jsconfig.json
├── package.json
├── README.md
├── public
│   ├── favicon.png
│   ├── index.html
│   ├── apple-icon.png
│   ├── logo.png
│   └── manifest.json
└── src
    ├── assets
    │   ├── img
    │   └── svg
    ├── components
    │   ├── Card
    │   │   ├── Card.js
    │   │   ├── CardBody.js
    │   │   └── CardHeader.js
    │   ├── Charts
    │   │   ├── BarChart.js
    │   │   ├── Chart_zone.js
    │   │   └── LineChart.js
    │   ├── Configurator
    │   │   └── Configurator.js
    │   ├── FixedPlugin
    │   │   └── FixedPlugin.js
    │   ├── Footer
    │   │   └── Footer.js
    │   ├── Icons
    │   │   ├── IconBox.js
    │   │   └── Icons.js
    │   ├── Layout
    │   │   ├── MainPanel.js
    │   │   ├── PanelContainer.js
    │   │   └── PanelContent.js
    │   ├── Menu
    │   │   └── ItemContent.js
    │   ├── Navbars
    │   │   ├── Searchbar
    │   │   │   └── SearchBar.js
    │   │   ├── AdminNavbar.js
    │   │   ├── AdminNavbarLinks.js
    │   │   └── AuthNavbar.js
    │   ├── RTLProvider
    │   │   └── RTLProvider.js
    │   ├── Separator
    │   │   └── Separator.js
    │   ├── Sidebar
    │   │   ├── Sidebar.js
    │   │   └── SidebarHelp.js
    │   └── Tables
    │       ├── BillingRow.js
    │       ├── DashboardTableRow.js
    │       ├── InvoicesRow.js
    │       ├── TablesProjectRow.js
    │       ├── TablesTableRow.js
    │       ├── TimelineRow.js
    │       └── TransactionRow.js
    ├── Fonctions
    │   ├── Dash_fonction.js
    │   ├── Incident_fonction.js
    │   ├── Month.js
    │   └── YearMonth.js
    ├── layouts
    │   ├── Admin.js
    │   ├── Auth.js
    │   └── RTL.js
    ├── theme
    │   ├── additions
    │   │   ├── card
    │   │   │   └── Card.js
    │   │   ├── layout
    │   │   │   ├── MainPanel.js
    │   │   │   ├── PanelContainer.js
    │   │   │   └── PanelContent.js
    │   ├── components
    │   │   ├── badge.js
    │   │   ├── button.js
    │   │   ├── input.js
    │   │   └── link.js
    │   ├── foundations
    │   │   └── breakpoints.js
    │   ├── styles.js
    │   └── theme.js
    ├── variables
    │   ├── charts.js
    │   ├── general.js
    │   ├── maps.js
    │   └── MapsCollabor.js
    ├── views
    │   ├── Dashboard
    │   │   ├── analyze.jsx
    │   │   ├── Billing.js
    │   │   ├── CitizenTable.js
    │   │   ├── Collaboration.jsx
    │   │   ├── Dashboard.js
    │   │   ├── DashboardElu.js
    │   │   ├── DataExport.js
    │   │   ├── globalView.js
    │   │   ├── globalViewCollaboration.jsx
    │   │   ├── Incident.js
    │   │   ├── LLM_Chat.jsx
    │   │   ├── Profile.js
    │   │   └── Tables.js
    │   ├── Pages
    │   │   ├── ComponentFaq.js
    │   │   ├── ComponentHelp.js
    │   │   ├── FAQ.js
    │   │   ├── Help.js
    │   │   ├── NotFound.js
    │   │   ├── SignIn.js
    │   │   └── SignUp.js
    │   └── RTL
    │       └── RTLPage.js
    ├── index.js
    └── routes.js
```