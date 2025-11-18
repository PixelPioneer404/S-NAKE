# 🐍 S-NAKE

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=D71921&center=true&vCenter=true&width=435&lines=Classic+Snake+Game;Modern+Design;Pure+JavaScript" alt="Typing SVG" />
</div>

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🎮 About

A **classic Snake game** reimagined with modern design principles. Clean interface, smooth gameplay, and thoughtful UX details make this a delightful take on the timeless arcade classic.

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 **Gameplay**
- 🏁 **Arrow key controls** for smooth movement
- 🍎 **Food collection** system with scoring
- ⏱️ **Real-time timer** tracking
- 🏆 **High score persistence** across sessions
- 🎮 **Customizable snake speed** (4 levels)

</td>
<td width="50%">

### 🎨 **Interface**
- 🌙 **Dark theme** with clean aesthetics
- 📱 **Mobile-aware** with desktop focus notice
- ⚙️ **Settings panel** with game customization
- 📊 **Game history** tracking
- 🎛️ **Grid toggle** for visual preference

</td>
</tr>
</table>

## 🎯 Game Controls

| Key | Action |
|-----|--------|
| <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> | Move snake |
| <kbd>Esc</kbd> | Pause/Resume |
| <kbd>Enter</kbd> | Restart game |

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS 4.1.17
- **Icons**: RemixIcon
- **Storage**: localStorage for persistence
- **Build**: Tailwind CLI

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/PixelPioneer404/S-NAKE.git

# Navigate to project
cd S-NAKE

# Install dependencies
npm install

# Build styles (if needed)
npx tailwindcss -i input.css -o output.css --watch

# Open in browser
open index.html
```

## 🎲 How to Play

1. **Start**: Press any arrow key to begin
2. **Move**: Use arrow keys to control your snake
3. **Eat**: Collect red food to grow and score points
4. **Avoid**: Don't hit walls or your own tail
5. **Score**: Each food gives +10 points

## 🏗️ Project Structure

```
S-NAKE/
├── index.html          # Main game interface
├── script.js           # Game logic & interactions
├── input.css           # Custom styles & utilities  
├── output.css          # Compiled Tailwind styles
├── package.json        # Dependencies
└── assets/
    ├── logo.png        # Game logo
    └── circular-logo.png # Favicon
```

## 🌟 Key Features Deep Dive

### 🎮 **Game Logic**
- Dynamic board generation based on viewport
- Collision detection with walls and self
- Food generation avoiding snake body
- Smooth direction changes with prevention of reverse moves

### 💾 **Data Persistence**
- High scores saved locally
- Game history with timestamps
- Settings preferences retention
- First-visit welcome flow

### 🎨 **UI/UX Details**
- Responsive modals with backdrop blur
- Smooth transitions and animations
- Accessible keyboard navigation
- Mobile-first awareness messaging

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests. This project welcomes contributions that enhance gameplay or user experience.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Crafted with ❤️ by [Rajbeer Saha](https://github.com/PixelPioneer404)**

*Classic Snake • Modern Design • Pure JavaScript*

</div>