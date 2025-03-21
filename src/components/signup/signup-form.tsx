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
import { Dialog, DialogContent, DialogDescription } from "@radix-ui/react-dialog";
import { DialogTitle } from "../ui/dialog";
import { AlertCircle } from "lucide-react";
import {SignupFormData} from "@/types/SignUp";

export function SignUpForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [login, setLogin] = useState<SignupFormData>({
    "username": "",
    "email": "",
    "password": "",
  });
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

const mutationLogin = useMutation({
    mutationFn: async (data: FormData) => await api.post("/auth/login", data),
    onSuccess: (data) => {
      setAuth(data.data);
      navigate("/");
      mutationLogin.reset();
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", login);
      const formData = new FormData();
      formData.append("username", login.email);
      formData.append("password", login.password);
      await mutationLogin.mutateAsync(formData);
      setLogin({
        "username": "",
        "email": "",
        "password": "",
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6" {...props}>
        {mutationLogin.isError && (
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
                {mutationLogin.error.message}
              </DialogDescription>
              <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">SignUp</CardTitle>
            <CardDescription>
              Enter your username, email and password to signup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="email"
                    type="text"
                    required
                    value={login.username}
                    onChange={(e) => setLogin({ ...login, "username": e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="username"
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
                  SignUp
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}