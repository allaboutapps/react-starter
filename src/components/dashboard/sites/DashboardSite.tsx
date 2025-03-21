import { Button, TextField } from "@mui/material";
import React from "react";
import { useConfirmationDialog } from "../../../hooks/useConfirmationDialog";
import { useHashParams } from "../../../hooks/useHashParams";
import { useInterval } from "../../../hooks/useInterval";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { setLocale, t, tHtml } from "../../../i18n/util";
import { useAuthStore } from "../../../stores/authStore";
import { useGeneralStore } from "../../../stores/generalStore";
import { sleep } from "../../../util/helpers";
import { BaseRoutes } from "../../app/router/BaseRoutes";
import { usePushRoute } from "../../app/router/history";
import { DialogVariant, getDialogConfiguration } from "../../util/Dialogs";
import { useShallow } from "zustand/react/shallow";
import { useQueryState } from "nuqs";

const Uptime = () => {
    const [uptime, setUptime] = React.useState(0);
    useInterval(() => {
        setUptime(uptime + 1);
    }, 1000);

    return <p>{t("common.uptime", { uptime })}</p>;
};

const QueryAndHash = () => {
    const query = useQueryParams<any>();
    const hash = useHashParams<any>();

    return (
        <>
            {query && <p>Query: {JSON.stringify(query)}</p>}
            {hash && <p>Hash: {JSON.stringify(hash)}</p>}
        </>
    );
};

export const DashboardSite = () => {
    const [action, setAction] = React.useState<DialogVariant>("add");
    const [count, setCount] = React.useState(1);

    const [search, setSearch] = useQueryState("search", {
        shallow: true,
    });

    const logout = useAuthStore((state) => state.logout);
    const [locale, setIsLoading, setError] = useGeneralStore(
        useShallow((state) => [state.locale, state.setIsLoading, state.setError]),
    );

    const pushRoute = usePushRoute();

    const handleSubmitAddDialog = () => {
        return;
    };

    const handleSubmitDeleteDialog = () => {
        return;
    };

    const confirmationDialogSubmitHandler: { [key in DialogVariant]: () => void } = {
        add: handleSubmitAddDialog,
        delete: handleSubmitDeleteDialog,
    };

    const confirmationDialog = useConfirmationDialog({
        ...getDialogConfiguration(action, {
            count: count,
        }),
        onSubmit: confirmationDialogSubmitHandler[action],
    });

    const handleClickUserAction = (action: DialogVariant, count: number) => {
        setCount(count);
        setAction(action);
        confirmationDialog.open();
    };

    const languages = (
        <div>
            <Button
                variant="outlined"
                onClick={() => {
                    setLocale("de");
                }}
                style={{ marginRight: 8 }}
                disabled={locale === "de"}
            >
                {t("language.german")}
            </Button>
            <Button
                variant="outlined"
                onClick={() => {
                    setLocale("en");
                }}
                disabled={locale === "en"}
            >
                {t("language.english")}
            </Button>
        </div>
    );

    const loading = (
        <>
            <Button
                variant="outlined"
                onClick={async () => {
                    setIsLoading(true);
                    await sleep(100);
                    setIsLoading(false);
                }}
            >
                {t("button.loadingShort")}
            </Button>
            <Button
                variant="outlined"
                onClick={async () => {
                    setIsLoading(true);
                    await sleep(1000);
                    setIsLoading(false);
                }}
            >
                {t("button.loadingLong")}
            </Button>
        </>
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 16,
                maxWidth: 400,
                margin: "0 auto",
                alignItems: "center",
            }}
        >
            <h1 style={{ margin: 24, textAlign: "center" }}>{t("screen.dashboard.hello")}</h1>
            <Uptime />
            {languages}
            {loading}
            <Button
                variant="outlined"
                onClick={() => {
                    setError(t("error.general"));
                }}
            >
                {t("button.showError")}
            </Button>
            <QueryAndHash />
            <TextField
                value={search ?? ""}
                onChange={(e) => setSearch(e.target.value || null)}
                placeholder={t("search.placeholder")}
            />
            <Button
                variant="outlined"
                onClick={() => {
                    logout();
                    pushRoute(BaseRoutes.ROOT);
                }}
            >
                {t("common.logout")}
            </Button>

            <Button
                variant="outlined"
                onClick={() => {
                    handleClickUserAction("add", 10);
                }}
            >
                {t("button.add.multi")}
            </Button>
            <Button
                variant="outlined"
                onClick={() => {
                    handleClickUserAction("add", 1);
                }}
            >
                {t("button.add")}
            </Button>
            {confirmationDialog.component}
            <div>{tHtml("screen.dashboard.html")}</div>
        </div>
    );
};
