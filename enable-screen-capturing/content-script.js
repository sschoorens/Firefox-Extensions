// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Github        - github.com/muaz-khan/Firefox-Extensions
var addon_translations = {};
window.addEventListener("message", function(event) {
    var addonMessage = event.data;

    console.log(event.data);
    if (addonMessage.confirmMessageCurrent && addonMessage.confirmMessage) {
        addon_translations.confirmMessageCurrent = addonMessage.confirmMessageCurrent;
        addon_translations.confirmMessage = addonMessage.confirmMessage;
    }
    if(addonMessage && addonMessage.enableScreenCapturing && addonMessage.domains && addonMessage.domains.length) {
        console.log(addon_translations.confirmMessageCurrent, addon_translations.confirmMessage);
        var confirmMessage = addon_translations.confirmMessageCurrent + "\n";
        confirmMessage += addonMessage.domains.join(" ") + "\n\n";
        confirmMessage += addon_translations.confirmMessage;
        console.log(confirmMessage);
        if(window.confirm(confirmMessage)) {
            self.port.emit("installation-confirmed", addonMessage.domains);

            // tell webpage that user confirmed screen capturing & its enabled for his domains.
            window.postMessage({
                enabledScreenCapturing: true,
                domains: addonMessage.domains
            }, "*");
        }
        else {
            // tell webpage that user denied/rejected screen capturing for his domains.
            window.postMessage({
                enabledScreenCapturing: false,
                domains: addonMessage.domains,
                reason: "user-rejected"
            }, "*");
        }
    }

    if(addonMessage && addonMessage.checkIfScreenCapturingEnabled && addonMessage.domains && addonMessage.domains.length) {
        self.port.on("is-screen-capturing-enabled-response", function(response) {
            window.postMessage(response, "*");
        });

        self.port.emit("is-screen-capturing-enabled", addonMessage.domains);
    }
}, false);
