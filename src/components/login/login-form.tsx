import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription} from "@radix-ui/react-dialog";
import { DialogTitle } from "../ui/dialog";
import { AlertCircle } from "lucide-react";
import LoginFormData from "@/types/Login";

export function LoginForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [login, setLogin] = useState<LoginFormData>({
    "email": "",
    "password": "",
  });
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => await api.post("/auth/login", data),
    onSuccess: (data) => {
      setAuth(data.data);
      navigate("/");
      mutation.reset();
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", login.email);
    formData.append("password", login.password);
    await mutation.mutateAsync(formData);
    setLogin({
      "email": "",
      "password": "",
    });
    if (mutation.isError) {
      setOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6" {...props}>
        {mutation.isError && (
          <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-lg">
            <div className="flex items-center justify-between bg-red-50 dark:bg-red-950 p-4 border-b border-red-100 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle className="text-lg font-semibold text-red-800 dark:text-red-200">Error</DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-sm leading-6 text-gray-700 dark:text-gray-300 p-4 bg-white dark:bg-transparent">
              {mutation.error.message}
            </DialogDescription>
            <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
          </DialogContent>
        </Dialog>
        )}
      </div>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    required
                    value={login.email}
                    onChange={(e) => setLogin({ ...login, "email": e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, "password": e.target.value })}
                  />
                </div>
                <Button type="submit">
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  SignUp
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}