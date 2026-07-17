"use client"

import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4 text-success" />,
                info: <InfoIcon className="size-4 text-primary" />,
                warning: <TriangleAlertIcon className="size-4 text-warning" />,
                error: <OctagonXIcon className="size-4 text-danger" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            style={
                {
                    "--normal-bg": "var(--surface-main)",
                    "--normal-text": "var(--text-primary)",
                    "--normal-border": "var(--border-color)",
                    "--border-radius": "8px",
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: "cn-toast border shadow-sm",
                    success: "border-success/30 bg-success/5 text-success",
                    error: "border-danger/30 bg-danger/5 text-danger",
                    warning: "border-warning/30 bg-warning/5 text-warning",
                    info: "border-primary/30 bg-primary/5 text-primary",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
