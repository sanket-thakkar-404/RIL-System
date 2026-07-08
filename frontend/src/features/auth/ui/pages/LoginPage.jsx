import { Link, Navigate } from "react-router";
import { Shield, User, ArrowLeft, LogIn } from "lucide-react";
import FormField from "../../../../components/FormField";
import { useAuth } from "../../hook/useAuth";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    errors,
    isAuthenticated,
    loading,
    onLoginSubmit,
  } = useAuth();

  if (loading) {
    return (
      <span className="skeleton skeleton-text">AI is thinking harder...</span>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Logo & Branding */}
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-blue-700 text-white p-3 rounded-lg shadow-md mb-3">
          <Shield size={32} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <User size={14} className="text-white fill-current" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-blue-900 tracking-wider">
          ADMIN PANEL
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-[90%] sm:w-110 bg-white rounded-sm shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-slate-200 p-8 mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">
            Secure Access
          </h2>
          <p className="text-slate-500 text-sm">
            Inventory & Issue Management Suite
          </p>
        </div>

        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
          {/* Email / Username Field */}
          <FormField
            name="email"
            type="email"
            placeholder="example@rotocastgroup.com"
            required
            label="Email"
            register={register}
            error={errors.email}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
          />
          {/* Password Field */}

          <FormField
            name="password"
            type="password"
            placeholder="******"
            required
            label="Password"
            register={register}
            error={errors.password}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-slate-600 cursor-pointer"
            >
              Remember this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[#2541B2] hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Login to Dashboard <LogIn size={16} />
          </button>
        </form>
      </div>

      {/* Return Link */}
      <Link
        to="/"
        className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={14} /> Return to Public Request History
      </Link>
    </div>
  );
};

export default LoginPage;
