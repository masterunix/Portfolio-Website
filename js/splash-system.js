class SplashSystem {
    constructor() {
        this.headerElement = document.querySelector('#main-header h1');
        this.baseText = "Hi! I am Vatsal.";
        this.fullText = "Hi! I am Vatsal. See what I'm working on.";
        this.currentText = "";
        this.isTyping = false;
        this.currentIndex = 0;
        
        this.splashMessages = [
            "Check my Resume.",
            { text: "Follow me on Instagram", link: "https://www.instagram.com/vatsalgoyall/" },
            { text: "Check out what I'm listening to on Spotify", link: "https://open.spotify.com/user/31twba3l57mkztt7u25zmmczfpva?si=8d6ed1e2d97d492e" },
            "Do you play minecraft?",
            "As seen on TV",
            "This is a website",
            "Random Splash!",
            "It's 2025!?!",
            "Help! ChatGPT!",
            "Linus made git in 10 days!",
            "Computers are still magic.",
            "Harder, Better, Faster, Stronger"
        ];
        
        // Track which messages have been shown to prevent immediate repeats
        this.availableMessages = [...this.splashMessages];
        this.shuffleArray(this.availableMessages);
        
        this.init();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    init() {
        // Start with the full initial text
        this.headerElement.textContent = "";
        this.typeText(this.fullText, () => {
            // After initial text is typed, wait 3 seconds then start splash system
            setTimeout(() => {
                this.startSplashLoop();
            }, 3000);
        });
    }
    
    typeText(text, callback) {
        this.isTyping = true;
        this.headerElement.style.borderRight = "3px solid white";
        let i = 0;
        
        const typeChar = () => {
            if (i < text.length) {
                const currentText = text.substring(0, i + 1);
                this.headerElement.textContent = currentText;
                
                // Check if text wrapping is needed on mobile
                if (window.innerWidth <= 768) {
                    this.wrapTextIfNeeded();
                }
                
                i++;
                setTimeout(typeChar, 50); // 50ms per character
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };
        
        typeChar();
    }
    
    wrapTextIfNeeded() {
        const element = this.headerElement;
        const text = element.textContent;
        const maxWidth = window.innerWidth - 40; // 20px padding on each side
        
        // Create a temporary element to measure text width
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.fontSize = window.getComputedStyle(element).fontSize;
        temp.style.fontFamily = window.getComputedStyle(element).fontFamily;
        temp.style.fontWeight = window.getComputedStyle(element).fontWeight;
        temp.textContent = text;
        document.body.appendChild(temp);
        
        const textWidth = temp.offsetWidth;
        document.body.removeChild(temp);
        
        // If text is too wide, break it into lines
        if (textWidth > maxWidth) {
            const words = text.split(' ');
            let lines = [];
            let currentLine = '';
            
            for (let word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                
                // Test if this line would be too wide
                temp.textContent = testLine;
                document.body.appendChild(temp);
                const lineWidth = temp.offsetWidth;
                document.body.removeChild(temp);
                
                if (lineWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                lines.push(currentLine);
            }
            
            element.innerHTML = lines.join('<br>');
        }
    }
    
    backspaceText(fromText, toText, callback) {
        this.isTyping = true;
        const startLength = fromText.length;
        const endLength = toText.length;
        let currentLength = startLength;
        
        const backspaceChar = () => {
            if (currentLength > endLength) {
                this.headerElement.textContent = fromText.substring(0, currentLength - 1);
                currentLength--;
                setTimeout(backspaceChar, 30); // Faster backspace
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };
        
        backspaceChar();
    }
    
    startSplashLoop() {
        // First, backspace from full text to base text
        this.backspaceText(this.fullText, this.baseText, () => {
            // Wait a moment, then start the splash message cycle
            setTimeout(() => {
                this.showNextSplash();
            }, 500);
        });
    }
    
    showNextSplash() {
        // If no messages left in current cycle, reshuffle and start new cycle
        if (this.availableMessages.length === 0) {
            this.availableMessages = [...this.splashMessages];
            this.shuffleArray(this.availableMessages);
        }
        
        // Get next splash message from shuffled array
        const splash = this.availableMessages.pop();
        
        let splashText;
        let isClickable = false;
        let link = null;
        
        if (typeof splash === 'object') {
            splashText = splash.text;
            link = splash.link;
            isClickable = true;
        } else {
            splashText = splash;
        }
        
        // Type just the additional text after base text
        this.typeAdditionalText(splashText, () => {
            // Make clickable if needed
            if (isClickable) {
                this.makeClickable(link);
            }
            
            // Wait 3 seconds, then backspace only the additional text
            setTimeout(() => {
                if (isClickable) {
                    this.removeClickable();
                }
                
                this.backspaceAdditionalText(splashText, () => {
                    // Wait a moment before next splash
                    setTimeout(() => {
                        this.showNextSplash();
                    }, 500);
                });
            }, 3000);
        });
    }
    
    typeAdditionalText(additionalText, callback) {
        this.isTyping = true;
        this.headerElement.style.borderRight = "3px solid white";
        let i = 0;
        const fullText = this.baseText + " " + additionalText;
        
        const typeChar = () => {
            if (i < additionalText.length) {
                this.headerElement.textContent = this.baseText + " " + additionalText.substring(0, i + 1);
                
                // Check if text wrapping is needed on mobile
                if (window.innerWidth <= 768) {
                    this.wrapTextIfNeeded();
                }
                
                i++;
                setTimeout(typeChar, 50); // 50ms per character
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };
        
        typeChar();
    }
    
    backspaceAdditionalText(additionalText, callback) {
        this.isTyping = true;
        let currentLength = additionalText.length;
        
        const backspaceChar = () => {
            if (currentLength > 0) {
                this.headerElement.textContent = this.baseText + " " + additionalText.substring(0, currentLength - 1);
                currentLength--;
                setTimeout(backspaceChar, 30); // Faster backspace
            } else {
                // Set back to just base text
                this.headerElement.textContent = this.baseText;
                this.isTyping = false;
                if (callback) callback();
            }
        };
        
        backspaceChar();
    }
    
    makeClickable(link) {
        this.headerElement.style.cursor = 'pointer';
        this.headerElement.style.textDecoration = 'underline';
        this.headerElement.style.color = '#61dafb';
        
        this.clickHandler = () => {
            window.open(link, '_blank');
        };
        
        this.headerElement.addEventListener('click', this.clickHandler);
    }
    
    removeClickable() {
        this.headerElement.style.cursor = 'default';
        this.headerElement.style.textDecoration = 'none';
        this.headerElement.style.color = 'white';
        
        if (this.clickHandler) {
            this.headerElement.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
    }
}

// Initialize splash system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SplashSystem();
});
