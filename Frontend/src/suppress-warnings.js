const suppressedWarnings = [
    'Not implemented: navigation (except hash changes)',
  ];
  
  const originalConsoleError = console.error;
  
  console.error = function (...args) {
    const message = args[0];
    const shouldSuppress = suppressedWarnings.some((warning) =>
      message.includes(warning),
    );
  
    if (!shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };
  