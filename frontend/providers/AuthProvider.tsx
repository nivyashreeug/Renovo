"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    Session,
    User,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

type Profile = {
    id: string;
    full_name?: string | null;
    email?: string | null;
    role?: string | null;
} & Record<string, unknown>;

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(
        null
    );

    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const initializedRef = useRef(false);

    const applySession = async (
        nextSession: Session | null,
        options?: { skipProfileFetch?: boolean }
    ) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);

        if (nextSession?.user) {
            if (options?.skipProfileFetch) {
                return;
            }

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", nextSession.user.id)
                .maybeSingle();

            setProfile((profileData as Profile | null) ?? null);
            return;
        }

        setProfile(null);
    };

    // LOGOUT FUNCTION
    const logout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    useEffect(() => {
        // GET CURRENT SESSION
        const getSession = async () => {
            try {
                setLoading(true);
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                await applySession(session);
            } finally {
                initializedRef.current = true;
                setLoading(false);
            }
        };

        getSession();

        // LISTEN FOR AUTH CHANGES
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const skipProfileFetch = event === "TOKEN_REFRESHED";

                try {
                    if (!initializedRef.current) {
                        setLoading(true);
                    }

                    await applySession(session, {
                        skipProfileFetch,
                    });
                } finally {
                    if (!initializedRef.current) {
                        initializedRef.current = true;
                        setLoading(false);
                    }
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                profile,
                loading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};
