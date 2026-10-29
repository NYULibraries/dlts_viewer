const defaultConfig = {
  id: null,
  selectedTheme: "dark",
  // For more info about adding and configuring languages in Mirador, see:
  // https://github.com/ProjectMirador/mirador/wiki/M3-Internationalization-(i18n)
  language: "en", // Set default language display here.
  windows: [],
  window: {
    // Global window defaults.
    allowClose: false, // Configure if windows can be closed or not.
    allowFullscreen: true, // Configure to show a 'fullscreen' button in the WindowTopBar.
    allowMaximize: false,
    allowTopMenuButton: true, // Configure if window view and thumbnail display menu are visible or not.
    panels: {
      // Configure which panels are visible in WindowSideBarButtons.
      info: true,
      attribution: true,
      canvas: false,
      annotations: false,
      search: false,
      layers: false,
    },
    sideBarOpen: true,
    allowWindowSideBar: true, // Configure if side bar menu is visible or not.
    authNewWindowCenter: "screen",
  },
  workspace: {
    draggingEnabled: false,
    allowNewWindows: false,
    isWorkspaceAddVisible: false, // Catalog/Workspace add window feature visible by default.
    exposeModeOn: false, // unused?
    height: 5000, // Height of the elastic mode's virtual canvas.
    showZoomControls: true, // Configure if zoom controls should be displayed by default.
    type: "mosaic", // Which workspace type to load by default. Other possible values are 'elastic'. If 'mosaic' or 'elastic' are not selected no worksapce type will be used.
  },
  workspaceControlPanel: {
    enabled: false, // Configure if the control panel should be rendered.  Useful if you want to lock the viewer down to only the configured manifests.
  },
  themes: {
    // Base theme, used when a resource type has no dedicated theme.
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "#57068c",
        },
        secondary: {
          main: "#8900e1",
        },
        // Shades used by Mirador to style the workspace/window chrome.
        shades: {
          dark: "#eeeeee",
          main: "#ffffff",
          light: "#f5f5f5",
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#84fef2",
        },
        secondary: {
          main: "#4db6ac",
        },
        background: {
          default: "#424242",
          paper: "#424242",
        },
        shades: {
          dark: "#000000",
          main: "#424242",
          light: "#616161",
        },
      },
    },
    // Books.
    book_light: {
      palette: {
        mode: "light",
        primary: {
          main: "#8d6e63",
        },
        secondary: {
          main: "#5d4037",
        },
        shades: {
          dark: "#eeeeee",
          main: "#ffffff",
          light: "#f5f5f5",
        },
      },
    },
    book_dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#84fef2",
        },
        secondary: {
          main: "#4db6ac",
        },
        background: {
          default: "#424242",
          paper: "#424242",
        },
        shades: {
          dark: "#000000",
          main: "#424242",
          light: "#616161",
        },
      },
    },
    // Maps.
    map_light: {
      palette: {
        mode: "light",
        primary: {
          main: "#2e7d32",
        },
        secondary: {
          main: "#43a047",
        },
        shades: {
          dark: "#eeeeee",
          main: "#ffffff",
          light: "#f5f5f5",
        },
      },
    },
    map_dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#a5d6a7",
        },
        secondary: {
          main: "#81c784",
        },
        background: {
          default: "#424242",
          paper: "#424242",
        },
        shades: {
          dark: "#000000",
          main: "#424242",
          light: "#616161",
        },
      },
    },
    // Photos.
    photo_light: {
      palette: {
        mode: "light",
        primary: {
          main: "#1565c0",
        },
        secondary: {
          main: "#1e88e5",
        },
        shades: {
          dark: "#eeeeee",
          main: "#ffffff",
          light: "#f5f5f5",
        },
      },
    },
    photo_dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#90caf9",
        },
        secondary: {
          main: "#64b5f6",
        },
        background: {
          default: "#424242",
          paper: "#424242",
        },
        shades: {
          dark: "#000000",
          main: "#424242",
          light: "#616161",
        },
      },
    },
    // Serials.
    serial_light: {
      palette: {
        mode: "light",
        primary: {
          main: "#6a1b9a",
        },
        secondary: {
          main: "#8e24aa",
        },
        shades: {
          dark: "#eeeeee",
          main: "#ffffff",
          light: "#f5f5f5",
        },
      },
    },
    serial_dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#ce93d8",
        },
        secondary: {
          main: "#ba68c8",
        },
        background: {
          default: "#424242",
          paper: "#424242",
        },
        shades: {
          dark: "#000000",
          main: "#424242",
          light: "#616161",
        },
      },
    },
  },
  theme: {
    typography: {
      body1: {
        fontSize: "1rem",
        letterSpacing: "0em",
        lineHeight: "1.5",
        fontWeight: 300,
      },
      body2: {
        fontSize: "0.878rem",
        letterSpacing: "0.015em",
        lineHeight: "1.6em",
      },
      button: {
        fontSize: "0.878rem",
        letterSpacing: "0.09em",
        lineHeight: "2.25rem",
        textTransform: "uppercase",
      },
      caption: {
        fontSize: "0.772rem",
        letterSpacing: "0.033em",
        lineHeight: "1.6rem",
      },
      body1Next: {
        fontSize: "1rem",
        letterSpacing: "0em",
        lineHeight: "1.6em",
      },
      body2Next: {
        fontSize: "0.878rem",
        letterSpacing: "0.015em",
        lineHeight: "1.6em",
      },
      buttonNext: {
        fontSize: "0.878rem",
        letterSpacing: "0.09em",
        lineHeight: "2.25rem",
      },
      captionNext: {
        fontSize: "0.772rem",
        letterSpacing: "0.33em",
        lineHeight: "1.6rem",
      },
      overline: {
        fontSize: "0.678rem",
        fontWeight: 500,
        letterSpacing: "0.166em",
        lineHeight: "2em",
        textTransform: "uppercase",
      },
      h1: {
        fontSize: "2.822rem",
        letterSpacing: "-0.015em",
        lineHeight: "1.2em",
      },
      h2: {
        fontSize: "1.575rem",
        letterSpacing: "0em",
        lineHeight: "1.33em",
      },
      h3: {
        fontSize: "1.383rem",
        fontWeight: 300,
        letterSpacing: "0em",
        lineHeight: "1.33em",
      },
      h4: {
        fontSize: "1.215rem",
        letterSpacing: "0.007em",
        lineHeight: "1.35em",
        fontWeight: 300,
      },
      h5: {
        fontSize: "1.138rem",
        letterSpacing: "0.005em",
        lineHeight: "1em",
      },
      h6: {
        fontSize: "1.067rem",
        fontWeight: 400,
        letterSpacing: "0.01em",
        lineHeight: "1.6em",
      },
      subtitle1: {
        fontSize: "0.937rem",
        letterSpacing: "0.015em",
        lineHeight: "1.6em",
        fontWeight: 300,
      },
      subtitle2: {
        fontSize: "0.678rem",
        fontWeight: 300,
        letterSpacing: "0.02em",
        lineHeight: "1.75em",
        textTransform: "uppercase",
        margin: "1rem 0 .2rem 0",
      },
      useNextVariants: true, // Set so that console deprecation warning is removed.
    },
  },
  osdConfig: {
    alwaysBlend: false,
    blendTime: 0.1,
    preserveImageSizeOnResize: true,
    preserveViewport: false,
    showNavigationControl: false,
    zoomPerClick: 1, // disable zoom-to-click
    zoomPerDoubleClick: 2.0,
    crossOriginPolicy: 'Anonymous',
  },
};

export { defaultConfig };
