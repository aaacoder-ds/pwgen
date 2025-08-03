# 🔐 Secure Password Generator

A modern, secure password generator with advanced features and beautiful UI. Generate cryptographically secure passwords and passphrases with breach checking against haveibeenpwned-API.

![Password Generator](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.12+-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## ✨ Features

### 🔒 **Security Features**
- **Cryptographically Secure**: Uses Python's `secrets` module for true randomness
- **Breach Checking**: All passwords checked against haveibeenpwned-API
- **Offline Mode**: Works without internet connection
- **No Storage**: Passwords never stored on server

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on all devices
- **Dark Mode Support**: Automatic dark/light theme detection
- **Accessibility**: WCAG compliant with keyboard navigation
- **Smooth Animations**: Beautiful transitions and feedback
- **Password Strength Indicator**: Real-time strength assessment

### ⚡ **Advanced Options**
- **Password Generation**: Customizable length (8-128 characters)
- **Character Sets**: Uppercase, digits, special characters, homoglyph exclusion
- **Passphrase Mode**: Word-based passwords with multiple languages
- **Multi-Generation**: Generate up to 5 passwords simultaneously
- **Settings Persistence**: Save preferences in browser

### 🌐 **SEO Optimized**
- **Structured Data**: Rich snippets for search engines
- **Open Graph**: Perfect social media sharing
- **Sitemap**: Comprehensive XML sitemap
- **Meta Tags**: Optimized for search visibility
- **Performance**: Fast loading with modern optimizations

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Pull the latest image
docker pull ghcr.io/aaacoder/pwgen:latest

# Run the container
docker run -d \
  --name pwgen \
  -p 5069:5069 \
  -e NO_API_CHECK=false \
  -e MULTI_GEN=true \
  ghcr.io/aaacoder/pwgen:latest
```

### Using Docker Compose

```yaml
version: "3.8"
services:
  pwgen:
    image: ghcr.io/aaacoder/pwgen:latest
    container_name: pwgen-app
    restart: unless-stopped
    ports:
      - "5069:5069"
    environment:
      - NO_API_CHECK=false
      - PW_LENGTH=12
      - MULTI_GEN=true
      - GENERATE_PP=true
      - ROBOTS_ALLOW=true
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/aaacoder/pwgen.git
cd pwgen

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

## 🛠️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NO_API_CHECK` | `false` | Disable haveibeenpwned-API checking |
| `PW_LENGTH` | `12` | Default password length |
| `PW_INCLUDE_UPPERCASE` | `true` | Include uppercase letters |
| `PW_INCLUDE_DIGITS` | `true` | Include digits |
| `PW_INCLUDE_SPECIAL` | `true` | Include special characters |
| `PW_EXCLUDE_HOMOGLYPHS` | `false` | Exclude similar-looking characters |
| `MULTI_GEN` | `false` | Enable multi-password generation |
| `GENERATE_PP` | `false` | Enable passphrase generation |
| `ROBOTS_ALLOW` | `false` | Allow search engine crawling |
| `GOOGLE_SITE_VERIFICATION` | `` | Google Search Console verification |

### Passphrase Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PP_WORD_COUNT` | `4` | Number of words in passphrase |
| `PP_CAPITALIZE` | `false` | Capitalize words |
| `PP_SEPARATOR_TYPE` | `dash` | Word separator type |
| `PP_MAX_WORD_LENGTH` | `7` | Maximum word length |
| `PP_INCLUDE_NUMBERS` | `false` | Include numbers in passphrase |
| `PP_INCLUDE_SPECIAL_CHARS` | `false` | Include special characters |
| `PP_LANGUAGE` | `en` | Word list language |

## 🎯 Modern Features

### 🔧 **Enhanced JavaScript**
- **Async/Await**: Modern async operations
- **Error Handling**: Comprehensive error management
- **Loading States**: Visual feedback during operations
- **Keyboard Shortcuts**: Ctrl+Enter to generate, Ctrl+C to copy
- **Password Strength**: Real-time strength calculation
- **Feedback System**: Toast notifications for user actions

### 🎨 **Modern CSS**
- **CSS Custom Properties**: Dynamic theming
- **Flexbox/Grid**: Modern layout systems
- **Responsive Design**: Mobile-first approach
- **Smooth Transitions**: 60fps animations
- **Accessibility**: High contrast and focus indicators
- **Dark Mode**: Automatic theme detection

### 📱 **PWA Features**
- **Service Worker**: Offline functionality
- **App Manifest**: Install as native app
- **Push Notifications**: Ready for future features
- **App Shortcuts**: Quick actions from home screen

## 🔍 SEO Improvements

### Meta Tags
- **Title**: Optimized for search visibility
- **Description**: Compelling 160-character summary
- **Keywords**: Relevant long-tail keywords
- **Open Graph**: Perfect social sharing
- **Twitter Cards**: Optimized Twitter previews

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Secure Password Generator",
  "description": "Generate secure passwords with breach checking",
  "applicationCategory": "SecurityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Technical SEO
- **Sitemap**: Comprehensive XML sitemap
- **Robots.txt**: Proper crawler guidance
- **Performance**: Optimized loading speed
- **Mobile-Friendly**: Responsive design
- **HTTPS**: Secure connections

## 🚀 Deployment

### Dokploy Deployment

1. **Push to GitHub**: The GitHub Actions workflow automatically builds and pushes the Docker image
2. **Deploy on Dokploy**: Use the provided `dokploy-compose.yml` file
3. **Configure Domain**: Update the domain in the compose file
4. **SSL Certificate**: Automatic SSL with Traefik

### Docker Build

```bash
# Build multi-architecture image
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/aaacoder/pwgen:latest \
  --push .
```

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimizations
- **Minified Assets**: Compressed CSS/JS
- **Image Optimization**: WebP format support
- **Caching**: Service worker caching
- **CDN Ready**: Static asset optimization

## 🔧 Development

### Project Structure
```
pwgen/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker configuration
├── docker-bake.hcl      # Multi-arch build config
├── .github/workflows/   # CI/CD pipelines
├── static/              # Static assets
│   ├── styles.css       # Modern CSS
│   ├── index.js         # Enhanced JavaScript
│   └── favicon.png      # App icon
├── templates/           # HTML templates
│   └── index.html       # Modern HTML structure
├── utils/               # Utility functions
├── handlers/            # Request handlers
├── sitemap.xml          # SEO sitemap
├── robots.txt           # Crawler guidance
└── manifest.json        # PWA manifest
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📈 Analytics

The application includes privacy-focused analytics:
- **Plausible Analytics**: Privacy-friendly web analytics
- **ACLib**: Performance monitoring
- **No Personal Data**: No user tracking or data collection

## 🔒 Security

### Privacy
- **No Data Storage**: Passwords never saved
- **Client-Side Processing**: Minimal server interaction
- **HTTPS Only**: Secure connections
- **CSP Headers**: Content Security Policy

### Security Features
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Prevention**: Input sanitization
- **Secure Headers**: Security-focused HTTP headers
- **Rate Limiting**: API abuse prevention

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original project by [jocxFIN](https://github.com/jocxfin/pwgen)
- Modernized and enhanced for production deployment
- Part of the [AAACoder Utility Tools](https://dash.aaacoder.xyz/) collection

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=aaacoder/pwgen&type=Date)](https://star-history.com/#aaacoder/pwgen&Date)

---

**Made with ❤️ for secure password generation**
