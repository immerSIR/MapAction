# Installation Guide

## System Requirements

### Required Software

-   Node.js (version 12 or higher)
-   npm (comes with Node.js) or yarn
-   Git
-   Modern web browser (Chrome, Firefox, Safari, or Edge)

### Hardware Requirements

-   Minimum 4GB RAM
-   2GB free disk space
-   Modern processor (dual-core or better)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/223MapAction/Dashboard.git
cd Dashboard
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Environment Setup

1. Create a `.env` file in the root directory
2. Copy the contents from `.env.example`
3. Update the following variables:

```env
REACT_APP_API_URL=your_api_url
REACT_APP_MAP_KEY=your_map_key
NODE_ENV=development
```

### 4. Start Development Server

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Troubleshooting

### Common Issues

1. **Node Version Mismatch**

    ```bash
    nvm install 16
    nvm use 16
    ```

2. **Dependencies Installation Failed**

    ```bash
    # Clear npm cache
    npm cache clean --force
    # Remove node_modules
    rm -rf node_modules
    # Reinstall dependencies
    npm install
    ```

3. **Port Already in Use**
    ```bash
    # Kill process using port 3000
    lsof -i tcp:3000
    kill -9 <PID>
    ```

## Verification

### Run Tests

```bash
npm test
```

### Check Build

```bash
npm run build
serve -s build
```

## Additional Configuration

### IDE Setup

Recommended VS Code extensions:

-   ESLint
-   Prettier
-   React Developer Tools

### Development Tools

1. React Developer Tools (Browser Extension)
2. Redux DevTools (if using Redux)
3. Chrome/Firefox Developer Tools

## Updating

To update an existing installation:

```bash
git pull
npm install
```

## Support

If you encounter any issues:

1. Check our [FAQ](./faq.md)
2. Search [existing issues](https://github.com/223MapAction/Dashboard/issues)
3. Create a new issue if needed
