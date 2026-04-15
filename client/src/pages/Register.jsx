import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Register = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleRegister = async (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "user",
        title: "Team Member"
      };
      
      console.log("Sending data:", userData);
      const res = await registerUser(userData).unwrap();
      console.log("Response:", res);
      
      toast.success("Registration successful! Please login.");
      navigate("/log-in");
    } catch (err) {
      console.log("Error:", err);
      toast.error(err?.data?.message || err.error || "Registration failed");
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-1/3 p-4'>
        <form
          onSubmit={handleSubmit(handleRegister)}
          className='w-full md:w-[400px] flex flex-col gap-y-5 bg-white px-10 pt-14 pb-14 rounded-2xl shadow-lg'
        >
          <div>
            <p className='text-blue-600 text-3xl font-bold text-center'>
              Create Account!
            </p>
          </div>
          
          <Textbox
            placeholder='Your Name'
            type='text'
            name='name'
            label='Full Name'
            register={register("name", { required: "Name is required!" })}
            error={errors.name?.message}
          />
          
          <Textbox
            placeholder='you@example.com'
            type='email'
            name='email'
            label='Email Address'
            register={register("email", { required: "Email is required!" })}
            error={errors.email?.message}
          />
          
          <Textbox
            placeholder='password'
            type='password'
            name='password'
            label='Password'
            register={register("password", { 
              required: "Password is required!",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            error={errors.password?.message}
          />
          
          {isLoading ? (
            <Loading />
          ) : (
            <Button type='submit' label='Sign Up' className='w-full h-10 bg-blue-700 text-white rounded-full' />
          )}
          
          <p className='text-center text-sm'>
            Already have an account?{" "}
            <a href='/log-in' className='text-blue-600 hover:underline'>
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;