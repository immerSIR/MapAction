# Contributing Guidelines

## Welcome!

Thank you for considering contributing to Map Action Dashboard! This document provides guidelines and steps for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

-   Be respectful and inclusive
-   Exercise consideration and empathy
-   Gracefully accept constructive criticism

## How to Contribute

### 1. Getting Started

1. Fork the repository
2. Clone your fork:
    ```bash
    git clone https://github.com/your-username/Dashboard.git
    ```
3. Add upstream remote:
    ```bash
    git remote add upstream https://github.com/223MapAction/Dashboard.git
    ```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Development Workflow

1. Make your changes
2. Write or update tests
3. Run tests locally:
    ```bash
    npm test
    ```
4. Format your code:
    ```bash
    npm run format
    ```
5. Run linting:
    ```bash
    npm run lint
    ```

### 4. Commit Guidelines

We follow conventional commits:

```bash
feat: add new feature
fix: resolve specific issue
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add/update tests
chore: maintenance tasks
```

### 5. Submit a Pull Request

1. Push your changes:
    ```bash
    git push origin feature/your-feature-name
    ```
2. Create a Pull Request on GitHub
3. Fill in the PR template
4. Wait for review

## Development Standards

### Code Style

-   Follow existing code formatting
-   Use meaningful variable names
-   Add comments for complex logic
-   Keep functions focused and small

### Testing Requirements

-   Write tests for new features
-   Maintain existing tests
-   Aim for good coverage
-   Test edge cases

### Documentation

Update documentation when you:

-   Add new features
-   Change existing functionality
-   Fix bugs with user-facing changes

### Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Changes requested must be addressed
4. Final approval needed to merge

## Project Structure

Follow the existing project structure:

```
src/
├── components/     # Reusable components
├── views/          # Page components
├── Fonctions/      # Business logic
└── __tests__/      # Test files
```

## Communication

-   GitHub Issues for bug reports
-   Pull Requests for code changes
-   Discussions for feature requests
-   Project board for roadmap

## Recognition

Contributors will be:

-   Listed in CONTRIBUTORS.md
-   Mentioned in release notes
-   Credited in documentation

## Questions?

-   Check existing documentation
-   Search closed issues
-   Open a new issue
-   Contact maintainers

Thank you for contributing to Map Action Dashboard!
