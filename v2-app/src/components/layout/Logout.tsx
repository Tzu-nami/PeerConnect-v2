import { useState } from "react";
import { useRouter } from "next/router";
import { logoutUser } from "@/utils/supabase/auth";

export default function Logout() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutUser();
            router.push('/');
        } catch (error) {
            setIsLoggingOut(false);
        }
    };

    return (
    <button
      onClick={handleLogout}
      className="border cursor-pointer"
    >
        Log Out
    </button>
  );
}