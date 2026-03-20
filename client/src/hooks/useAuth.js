import { useSelector } from "react-redux";

const useAuth = () => {

  const { user } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated: !!user
  };

};

export default useAuth;