import { createRoot } from "react-dom/client";
import { shouldPolyfill } from "@formatjs/intl-pluralrules/should-polyfill";
import App from "./App";
import { NuqsAdapter } from "nuqs/adapters/react";

// https://formatjs.io/docs/polyfills/intl-pluralrules/#dynamic-import--capability-detection
async function polyfill(locale: string) {
    if (shouldPolyfill()) {
        // Load the polyfill 1st BEFORE loading data
        await import("@formatjs/intl-pluralrules/polyfill");
    }

    if ((Intl.PluralRules as typeof Intl.PluralRules & { polyfilled: boolean }).polyfilled) {
        switch (locale) {
            default:
                await import("@formatjs/intl-pluralrules/locale-data/en");
                break;
            case "de":
                await import("@formatjs/intl-pluralrules/locale-data/de");
                break;
        }
    }
}

(async () => {
    await polyfill("en");
    await polyfill("de");

    import("./index.css");
    import("./TextStyles.css");
    import("./Styles.css");

    // Add commit hash as header comment for deployed versions
    const version = document.createComment(
        `Version ${import.meta.env.VITE_COMMIT_HASH} @ ${import.meta.env.VITE_BUILD_DATE}`,
    );
    document.head.prepend(version);

    const container = document.getElementById("root");
    // eslint-disable-next-line
    const root = createRoot(container!);

    root.render(
        <NuqsAdapter>
            <App />
        </NuqsAdapter>,
    );
})();
