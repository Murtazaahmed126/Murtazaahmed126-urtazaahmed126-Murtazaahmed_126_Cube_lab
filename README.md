# Murtazaahmed_126_Cube_lab

# Secret Cube - Three.js Project

This project is an interactive 3D cube built using Three.js.  
It starts as a simple rotating cube, but when clicked, it reveals a hidden animated scene with a portal and particle text.

# Features
Rotating 3D cube
Click interaction using Raycaster
Cube splits into two parts
Portal appears after opening
Particle system forming text
Galaxy background (stars)
Mouse-based camera movement
Hint text ("Click Me") shown under cube and disappears after click

# Message Displayed
After clicking the cube, particles form the message:

تقبل اللہ منا ومنکم  
عِيد مُبَارَك  
Murtaza Ahmed  

# Technologies Used
HTML
CSS
JavaScript
Three.js (via CDN)

# Project Structure
project/
├── index.html
├── style.css
└── main.js

# How to Use
Move your mouse → camera slightly follows
Look at the cube → hint appears below it
Click on the cube → animation starts
Watch the cube open and reveal the hidden scene

# Notes
The hint text is dynamically positioned under the cube using projection
Particle text is generated using canvas and converted into 3D points
Scene includes multiple layers: cube (foreground), portal (mid), galaxy (background)

# Author

Murtaza Ahmed
