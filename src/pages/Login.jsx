import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { DynamicForm } from "../components/forms/DynamicForm.component";
import { authFormFields } from "../constants/forms/authForm";
import { authValidationSchema } from "../schemas/auth.schemas";
import { loginUser } from "../service/authApi";
import { setAccessToken, setRefreshToken } from "../service/tokenService";
import { showToast } from "./../helper/toastMessage";
import chairmansir from "../assets/images/chairman-sir.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsloading(true);
      const responseData = await loginUser(formData);
      setAccessToken(responseData.access_token);
      setRefreshToken(responseData.refresh_token);
      setUser(responseData.user);
      localStorage.setItem("info", JSON.stringify(responseData.user));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      showToast.error(error?.data?.error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 flex items-center justify-center gap-2'>
          <img
            src={chairmansir}
            alt='person'
            className='w-[40px] h-[40px] rounded-full border-2 border-gray-300 object-cover'
          />
          <small>My Accounts</small>
        </h2>

        <DynamicForm
          fields={authFormFields}
          onSubmit={handleSubmit}
          validationSchema={authValidationSchema}
          label='Login'
          fullWidth={true}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
