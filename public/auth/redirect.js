// Entra ID returns here: MSAL's bridge hands the answer to the page or hidden iframe that asked.
// Without an answer to hand over, the page has no use, so it goes to the app.
msalRedirectBridge.broadcastResponseToMainFrame().catch(() => location.replace('/'));
