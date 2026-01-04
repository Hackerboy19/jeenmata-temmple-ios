import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetStep, setResetStep] = useState<'email' | 'reset'>('email');

  // Get the page user was trying to access before being redirected to login
  const from = (location.state as any)?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.auth.login(loginEmail, loginPassword);
      
      // Check user role and redirect accordingly
      if (response.user?.role === 'admin') {
        toast({
          title: "Access Denied",
          description: "Admin users cannot login to user portal. Please use admin panel.",
          variant: "destructive",
        });
        // Clear the stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Login Successful! 🙏",
        description: "Welcome back, devotee!",
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.auth.signup(signupName, signupEmail, signupPassword);
      
      toast({
        title: "Registration Successful! 🙏",
        description: "Welcome to Jeen Mata Temple family!",
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.forgotPassword(forgotEmail);
      toast({
        title: "Reset Code Sent! 📧",
        description: "Please check your email for the password reset code.",
      });
      setResetStep('reset');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken || !newPassword || !confirmNewPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.resetPassword(forgotEmail, resetToken, newPassword);
      toast({
        title: "Password Reset Successful! 🙏",
        description: "You can now login with your new password.",
      });
      // Reset form and go back to login
      setShowForgotPassword(false);
      setResetStep('email');
      setForgotEmail("");
      setResetToken("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-5 bg-muted lotus-pattern">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto divine-shadow golden-border">
            <CardHeader className="text-center">
              <CardTitle className="font-decorative text-3xl mb-2">
                🙏 Devotee Portal
              </CardTitle>
              <CardDescription className="font-serif">
                {showForgotPassword 
                  ? "Reset your password" 
                  : "Login or register to access temple services"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showForgotPassword ? (
                // Forgot Password Form
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetStep('email');
                      setForgotEmail("");
                      setResetToken("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                    className="mb-4"
                  >
                    ← Back to Login
                  </Button>

                  {resetStep === 'email' ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="font-serif">Email Address</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="font-serif"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          We'll send you a reset code to your email
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-accent/90 font-serif" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Code"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-code" className="font-serif">Reset Code</Label>
                        <Input
                          id="reset-code"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          className="font-serif text-center text-2xl tracking-widest"
                          maxLength={6}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Check your email for the reset code
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="font-serif">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-new-password" className="font-serif">Confirm New Password</Label>
                        <Input
                          id="confirm-new-password"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-accent/90 font-serif" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Resetting..." : "Reset Password"}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setResetStep('email')}
                        className="w-full font-serif"
                      >
                        Didn't receive code? Try again
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                // Login/Signup Tabs
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="font-serif">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="font-serif">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="font-serif">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="font-serif">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setShowForgotPassword(true)}
                          className="font-serif text-sm p-0 h-auto"
                        >
                          Forgot Password?
                        </Button>
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 font-serif" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="font-serif">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Your name"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="font-serif">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="font-serif">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" className="font-serif">Confirm Password</Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          className="font-serif"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 font-serif" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
