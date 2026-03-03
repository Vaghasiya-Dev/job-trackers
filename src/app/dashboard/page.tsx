"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/job-journey/AppShell";
import { useAuthStore } from "@/store/auth-store";
import { setJobStoreStorageForUser, useJobStore } from "@/store/job-store";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setCurrentView = useJobStore((state) => state.setCurrentView);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        if (!data?.user?.id) {
          router.push("/login");
          return;
        }

        setUser(data.user);
        await setJobStoreStorageForUser(data.user.id);
        setCurrentView("dashboard");
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return <AppShell />;
}
