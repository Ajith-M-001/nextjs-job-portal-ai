import { ReactNode, Suspense } from "react"
import {
    SignedOut as ClerkSignedOut,
    SignedIn as ClerkSignedIn,
} from "@clerk/nextjs"

export function SignedOut({ children }: { children: ReactNode }) {
    return (
        <ClerkSignedOut>{children}</ClerkSignedOut>
    )
}

export function SignedIn({ children }: { children: ReactNode }) {
    return (
        <ClerkSignedIn>{children}</ClerkSignedIn>
    )
}