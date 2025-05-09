import React, { useState } from "react";
import { useAuthStore } from "../store/userAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePatten from "../components/AuthImagePatten";
import toast from "react-hot-toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signupApi, isSigningUp } = useAuthStore();
  const vaildateForm = () => {
    if (!formData.fullName.trim())return toast.error('FullName is required')
    if (!formData.email.trim())return toast.error('Email is required')
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
   return true  
  };
  const handleSubmit = (e) => {
    e.preventDefault();
 const success = vaildateForm();
if (success===true) {
  signupApi(formData)
}
  };
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* left Side */}
      <div className="flex justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12  rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2"> Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account{" "}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="" className="label">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40 " />
                </div>
                <input
                  type="text"
                  className={` input input-border rounded-xl w-full pl-10   border-2 focus:border-blue-400 focus:outline-none focus:ring-0`}
                  placeholder="enter Full Name  "
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>{" "}
            <div className="form-control">
              <label htmlFor="" className="label">
              Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={` input input-border rounded-xl w-full pl-10  border-2 focus:border-blue-400 focus:outline-none focus:ring-0`}
                  placeholder="xyz123@gmail.com..... "
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>{" "}
            <div className="form-control">
              <label htmlFor="" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword?"text":"password"}
                  className={` input input-border rounded-xl w-full pl-10  border-2 focus:border-blue-400 focus:outline-none focus:ring-0`}
                  placeholder="enter password  "
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center z-1"
                onClick={()=>setShowPassword(!showPassword)}
                >
                    {
                      showPassword? <EyeOff className="size-5 text-base-content/40"/>:<Eye className="size-5 text-base-content/40"/>
                    }
                </button>
              </div>
            </div>
            <button
            type="submit"
            className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp?
                    <>
                    <Loader2 className="size-5 animate-spin"/>
                    Loading ... 
                    </> :"Create Account" 
            }
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
            Already have an Account ? {" "} 
            <Link to={'/login'} className="link link-primary">
            Sign in 
            </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side  */}
            <AuthImagePatten
            title="Join are Community"
            subtitle="Connect With friends ,share moments ,and Stay in touch with your loved one"
            />
    </div>
  );
}
