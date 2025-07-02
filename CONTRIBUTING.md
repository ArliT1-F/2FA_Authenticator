# Contributing to 2FA Authenticator

Thank you for your interest in contributing to the 2FA Authenticator project! We welcome contributions from the community and are excited to work with you.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Security Guidelines](#security-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- **Be respectful**: Treat all participants with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be collaborative**: Work together to find the best solutions
- **Be professional**: Keep discussions focused and constructive

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Mobile development environment (Android Studio/Xcode)
- Expo CLI (`npm install -g @expo/cli`)

### Setting up the Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/2FA_Authenticator.git
   cd 2FA_Authenticator
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names that follow this pattern:
- `feature/description` for new features
- `fix/description` for bug fixes
- `security/description` for security-related changes
- `docs/description` for documentation updates

Example: `feature/qr-code-scanner` or `fix/totp-timing-issue`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add biometric authentication support`
- `fix(totp): resolve time synchronization issue`
- `security(storage): implement AES-256 encryption`
- `docs(readme): update installation instructions`

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the test suite** and ensure all tests pass
6. **Submit a pull request** with a clear description

## Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable and function names**
- Add **JSDoc comments** for public APIs
- Maintain **90%+ test coverage**

### React Native

- Use **functional components** with hooks
- Follow **React Native best practices**
- Implement **proper error boundaries**
- Ensure **accessibility compliance**
- Test on both **iOS and Android**

### Security

- **Never commit sensitive data** (keys, secrets, passwords)
- Use **secure storage** for sensitive information
- Follow **OWASP mobile security guidelines**
- Implement **proper input validation**
- Use **established cryptographic libraries**

## Security Guidelines

### Cryptographic Standards

- Use **industry-standard algorithms** (AES-256, SHA-256, etc.)
- Implement **proper key derivation** (PBKDF2, Argon2)
- Follow **RFC specifications** for TOTP/HOTP
- Use **secure random number generation**

### Code Review

All security-related changes must be reviewed by at least two maintainers before merging.

### Vulnerability Reporting

For security vulnerabilities, please use [GitHub Security Advisories](https://github.com/ArliT1-F/2FA_Authenticator/security/advisories/new).

**Do not open public issues for security bugs.**

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run security tests
npm run test:security

# Generate coverage report
npm run test:coverage
```

### Test Requirements

- **Unit tests** for all utility functions
- **Integration tests** for critical workflows
- **Security tests** for cryptographic functions
- **E2E tests** for user workflows

### Writing Tests

- Use **Jest** for unit and integration tests
- Use **React Native Testing Library** for component tests
- Mock **external dependencies** appropriately
- Test **error conditions** and edge cases

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Type Checking

```bash
# Run TypeScript compiler
npx tsc --noEmit
```

### Security Scanning

```bash
# Run security audit
npm audit

# Run security-focused linting
npm run test:security
```

## Documentation

### Requirements

- Update **README.md** for user-facing changes
- Add **JSDoc comments** for new APIs
- Update **API documentation** if applicable
- Include **security considerations** for new features

### Documentation Style

- Use **clear, concise language**
- Include **code examples** where helpful
- Explain **security implications**
- Keep documentation **up to date**

## Submitting Changes

### Pull Request Template

When submitting a pull request, include:

- **Clear description** of the changes
- **Motivation** for the changes
- **Testing performed**
- **Security considerations**
- **Breaking changes** (if any)

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Security review** for sensitive changes
4. **Testing** on multiple platforms
5. **Documentation review**

## Issue Guidelines

### Bug Reports

Include the following information:
- **Device/platform** information
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Error messages** or logs
- **Screenshots** if helpful

### Feature Requests

Include:
- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if any)
- **Security considerations**
- **Alternatives considered**

### Security Issues

**Do not use public issues for security vulnerabilities.**

Email security@example.com with:
- **Detailed description** of the vulnerability
- **Steps to reproduce**
- **Potential impact**
- **Suggested fixes** (if any)

## Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributors** section

## Questions?

If you have questions about contributing:
- Check existing **GitHub Issues** and **Discussions**
- Join our **community forum** (if available)
- Contact maintainers via **GitHub**

Thank you for contributing to making 2FA authentication more secure and accessible!

---

**Note**: This project prioritizes security above all else. All contributions are subject to security review, and we reserve the right to reject changes that do not meet our security standards.