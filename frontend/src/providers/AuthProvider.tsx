import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const updateApiToken = (token: string | null) => {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  // Memoize functions to avoid unnecessary re-renders
  const memoizedCheckAdminStatus = useCallback(checkAdminStatus, [checkAdminStatus]);
  const memoizedInitSocket = useCallback(initSocket, [initSocket]);
  const memoizedDisconnectSocket = useCallback(disconnectSocket, [disconnectSocket]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await memoizedCheckAdminStatus(); // only run if there's a valid token
          if (userId) {
            memoizedInitSocket(userId); // only initialize socket if userId exists
          }
        }
      } catch (error: any) {
        updateApiToken(null);
        console.error("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup
    return () => {
      memoizedDisconnectSocket();
    };
  }, [getToken, userId, memoizedCheckAdminStatus, memoizedInitSocket, memoizedDisconnectSocket]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};

export default AuthProvider;
