const _ = require('lodash')

module.exports = {
  theme: {
    extend: {
      margin: {
        '1/2': '50%',
        'full': '100%',
        '-1/2': '-50%',
        '-full': '-100%',
      },
    },
  },

  variants: {
    accessibility: ['responsive', 'focus'],
    alignContent: ['responsive'],
    alignItems: ['responsive'],
    alignSelf: ['responsive'],
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColor: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: ['responsive'],
    borderColor: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidth: ['responsive'],
    boxShadow: ['responsive', 'hover', 'focus'],
    boxSizing: ['responsive'],
    clear: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    fill: ['responsive'],
    flex: ['responsive'],
    flexDirection: ['responsive'],
    flexGrow: ['responsive'],
    flexShrink: ['responsive'],
    flexWrap: ['responsive'],
    float: ['responsive'],
    fontFamily: ['responsive'],
    fontSize: ['responsive'],
    fontSmoothing: ['responsive'],
    fontStyle: ['responsive'],
    fontWeight: ['responsive', 'hover', 'focus'],
    gap: ['responsive'],
    gridAutoFlow: ['responsive'],
    gridColumn: ['responsive'],
    gridColumnEnd: ['responsive'],
    gridColumnStart: ['responsive'],
    gridRow: ['responsive'],
    gridRowEnd: ['responsive'],
    gridRowStart: ['responsive'],
    gridTemplateColumns: ['responsive'],
    gridTemplateRows: ['responsive'],
    height: ['responsive'],
    inset: ['responsive'],
    justifyContent: ['responsive'],
    letterSpacing: ['responsive'],
    lineHeight: ['responsive'],
    listStylePosition: ['responsive'],
    listStyleType: ['responsive'],
    margin: ['responsive', 'hover'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    objectFit: ['responsive'],
    objectPosition: ['responsive'],
    opacity: ['responsive', 'hover', 'focus'],
    order: ['responsive'],
    outline: ['responsive', 'focus'],
    overflow: ['responsive'],
    padding: ['responsive'],
    placeholderColor: ['responsive', 'focus'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    rotate: ['responsive', 'hover', 'focus'],
    scale: ['responsive', 'hover', 'focus'],
    skew: ['responsive', 'hover', 'focus'],
    stroke: ['responsive'],
    strokeWidth: ['responsive'],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColor: ['responsive', 'hover', 'focus'],
    textDecoration: ['responsive', 'hover', 'focus'],
    textTransform: ['responsive'],
    transform: ['responsive'],
    transformOrigin: ['responsive'],
    transitionDuration: ['responsive'],
    transitionProperty: ['responsive'],
    transitionTimingFunction: ['responsive'],
    translate: ['responsive', 'hover', 'focus'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive', 'group-hover'],
    wordBreak: ['responsive'],
    zIndex: ['responsive'],
  },
  plugins: [
    /**
     * New transition speed utilities
     * 
     * transition-${speed}
     * speeds: ['fast', 'medium', 'slow']
     */
    function ({ addUtilities }) {

      const transitionUtility = {}
      _.map([
        { prefix: 'fast', speed: '0.1s' },
        { prefix: 'medium', speed: '0.25s' },
        { prefix: 'slow', speed: '0.50s' },
      ], ({ prefix, speed }) => {
        transitionUtility[`.transition-${prefix}`] = {
          'transition': `${speed}`
        }
      })

      addUtilities(transitionUtility)
    },

    /**
     * New scale utilities
     * 
     * scale-up-${size}
     * sizes: ['sm', 'md', 'lg', 'xl', '2xl', '3xl']
     */
    function ({ addUtilities }) {
      const scaleUtility = {}
      _.map([
        { prefix: 'sm', size: '1.03' },
        { prefix: 'md', size: '1.05' },
        { prefix: 'lg', size: '1.07' },
        { prefix: 'xl', size: '1.09' },
        { prefix: '2xl', size: '1.11' },
        { prefix: '3xl', size: '1.13' }
      ], ({ prefix, size }) => {
        scaleUtility[`.scale-up-${prefix}`] = {
          'transform': `scale(${size})`
        }
      })

      addUtilities(scaleUtility, {
        variants: ['hover']
      })
    },

    /**
     * Different naming convention for fontSize utility
     *  
     * fs-${size}
     * sizes: 1-64px
     */
    function ({ addUtilities }) {
      let fontSize = {}
      for (let size = 0; size <= 64; size += 1) {
        fontSize[`.fs-${size}`] = {
          'font-size': `${size}px`
        }
      }

      addUtilities(fontSize, {
        variants: ['responsive']
      })
    },

    /**
     * Different naming convention for fontWeight utility
     *  
     * fw-${size}
     * sizes: 100, 200, ..., 900
     */
    function ({ addUtilities }) {
      let fontWeight = {}
      for (let index = 100; index <= 900; index += 100) {
        fontWeight[`.fw-${index}`] = {
          'font-weight': `${index}`
        }
      }

      addUtilities(fontWeight, {
        variants: ['responsive', 'hover']
      })
    },

    /**
     * Max width utility
     *  
     * mw-${size}
     * sizes: [480, 600, 720, 768, 960, 1050, 1080, 1200, 1392, 1440, 1600]
     */
    function ({ addUtilities }) {
      let maxWidthUtility = {}
      _.map([480, 600, 720, 768, 960, 1050, 1080, 1200, 1392, 1440, 1600], (width) => {
        maxWidthUtility[`.mw-${width}`] = {
          'max-width': `${width}px`
        }
      })

      addUtilities(maxWidthUtility)
    },
  ],
}
